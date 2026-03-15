import { streamText, Output } from 'ai'
import { z } from 'zod'
import { getRelevantSpecialists } from '@/lib/specialists'

export const maxDuration = 60

const reportSchema = z.object({
  summary: z.string().describe('A comprehensive summary of the patient health data over the time period'),
  symptomPatterns: z.array(z.string()).describe('List of observed symptom patterns and their frequency'),
  symptomTimeline: z.string().describe('Analysis of symptom duration, onset dates, and how symptoms have changed over time'),
  moodTrends: z.string().describe('Analysis of mood patterns over time'),
  recommendations: z.array(z.string()).describe('General wellness recommendations (NOT medical diagnoses)'),
  suggestedSpecialtyTypes: z.array(z.string()).describe('Types of specialists that might be helpful to consult'),
})

export async function POST(req: Request) {
  try {
    const { entries, dateRange } = await req.json()

    if (!entries || entries.length === 0) {
      return Response.json(
        { error: 'No journal entries provided' },
        { status: 400 }
      )
    }

    // Extract symptoms and body regions for specialist matching
    const allSymptoms: string[] = []
    const allBodyRegions: string[] = []
    
    entries.forEach((entry: { symptoms: { name: string }[]; bodyRegions: string[] }) => {
      entry.symptoms?.forEach((s: { name: string }) => allSymptoms.push(s.name))
      entry.bodyRegions?.forEach((r: string) => allBodyRegions.push(r))
    })

    // Get relevant specialists based on symptoms and body regions
    const specialists = getRelevantSpecialists(allSymptoms, allBodyRegions)

    // Format entries for the AI
    const entriesText = entries.map((entry: {
      createdAt: string
      timeOfDay: string
      mood: number
      overallFeeling: string
      symptoms: { 
        name: string
        severity: number
        duration?: string
        startDate?: string
        changeStatus?: string
      }[]
      bodyRegions: string[]
      notes: string
    }, index: number) => {
      const symptomsText = entry.symptoms?.map((s) => {
        let text = `${s.name} (severity: ${s.severity}/5`
        if (s.duration) text += `, duration: ${s.duration}`
        if (s.startDate) text += `, started: ${new Date(s.startDate).toLocaleDateString()}`
        if (s.changeStatus) text += `, change: ${s.changeStatus}`
        text += ')'
        return text
      }).join('; ') || 'None reported'
      
      return `
Entry ${index + 1} - ${new Date(entry.createdAt).toLocaleDateString()} (${entry.timeOfDay}):
- Mood: ${entry.mood}/10
- Overall Feeling: ${entry.overallFeeling || 'Not specified'}
- Symptoms: ${symptomsText}
- Body Areas: ${entry.bodyRegions?.join(', ') || 'None specified'}
- Notes: ${entry.notes || 'None'}
`
    }).join('\n')

    const systemPrompt = `You are a medical documentation assistant helping patients prepare information for their healthcare providers. Your role is to:

1. Summarize health journal entries clearly and objectively
2. Identify patterns in symptoms, mood, and overall health
3. Suggest types of medical specialists who might be helpful to consult
4. Provide general wellness recommendations

IMPORTANT LEGAL DISCLAIMER: You must NEVER:
- Provide medical diagnoses
- Prescribe treatments or medications
- Make definitive statements about medical conditions
- Replace professional medical advice

Always encourage users to consult with qualified healthcare providers for proper diagnosis and treatment.

When analyzing the data:
- Focus on observable patterns and trends
- Use neutral, professional medical terminology
- Be thorough but concise
- Prioritize the most significant findings`

    const result = streamText({
      model: 'anthropic/claude-sonnet-4-20250514',
      system: systemPrompt,
      prompt: `Please analyze the following health journal entries from ${dateRange?.start || 'recent period'} to ${dateRange?.end || 'now'} and generate a comprehensive report.

${entriesText}

Generate a structured report that includes:
1. A summary of the overall health data
2. Patterns observed in symptoms (frequency, severity trends, timing)
3. Symptom timeline analysis: How long symptoms have persisted, when they started, and whether they're improving, worsening, or fluctuating
4. Mood trends and any correlations with symptoms
5. General wellness recommendations (NOT medical advice)
6. Types of specialists that might be worth consulting based on symptom duration and patterns

Remember: This report is to help the patient communicate with their healthcare providers, not to diagnose or treat any condition.`,
      output: Output.object({ schema: reportSchema }),
    })

    // Return a streaming response with specialists appended at the end
    const stream = result.toTextStream()
    
    // Create a transform stream to append specialists data
    const transformStream = new TransformStream({
      async flush(controller) {
        // Append specialists as a separate JSON object
        controller.enqueue(new TextEncoder().encode(`\n---SPECIALISTS---\n${JSON.stringify(specialists)}`))
      }
    })

    return new Response(stream.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return Response.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
