'use client'

import { useState } from 'react'
import { format, subDays, subWeeks, subMonths } from 'date-fns'
import {
  Bot,
  FileText,
  Loader2,
  Calendar,
  AlertCircle,
  MapPin,
  Phone,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type { JournalEntry, MedicalReport, Specialist } from '@/lib/types'

interface AIAssistantProps {
  entries: JournalEntry[]
  onReportGenerated: (report: Omit<MedicalReport, 'id' | 'createdAt'>) => MedicalReport
  className?: string
}

type DateRangeOption = '7days' | '14days' | '30days' | '90days' | 'all'

const dateRangeOptions: { value: DateRangeOption; label: string }[] = [
  { value: '7days', label: 'Last 7 days' },
  { value: '14days', label: 'Last 14 days' },
  { value: '30days', label: 'Last 30 days' },
  { value: '90days', label: 'Last 90 days' },
  { value: 'all', label: 'All entries' },
]

interface GeneratedReport {
  summary: string
  symptomPatterns: string[]
  symptomTimeline?: string
  moodTrends: string
  recommendations: string[]
  specialists: Specialist[]
}

export function AIAssistant({
  entries,
  onReportGenerated,
  className,
}: AIAssistantProps) {
  const [dateRange, setDateRange] = useState<DateRangeOption>('30days')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getDateRange = (): { start: Date; end: Date } => {
    const end = new Date()
    let start: Date

    switch (dateRange) {
      case '7days':
        start = subDays(end, 7)
        break
      case '14days':
        start = subDays(end, 14)
        break
      case '30days':
        start = subMonths(end, 1)
        break
      case '90days':
        start = subMonths(end, 3)
        break
      case 'all':
      default:
        // Get earliest entry date or 1 year ago
        const earliest = entries.length > 0
          ? new Date(Math.min(...entries.map(e => new Date(e.createdAt).getTime())))
          : subMonths(end, 12)
        start = earliest
    }

    return { start, end }
  }

  const getFilteredEntries = () => {
    const { start, end } = getDateRange()
    return entries.filter(entry => {
      const date = new Date(entry.createdAt)
      return date >= start && date <= end
    })
  }

  const filteredEntries = getFilteredEntries()

  const handleGenerateReport = async () => {
    if (filteredEntries.length === 0) {
      setError('No entries found in the selected date range')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedReport(null)

    try {
      const { start, end } = getDateRange()
      
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: filteredEntries,
          dateRange: {
            start: format(start, 'yyyy-MM-dd'),
            end: format(end, 'yyyy-MM-dd'),
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      const text = await response.text()
      
      // Parse the response - split by specialists marker
      const parts = text.split('---SPECIALISTS---')
      const reportJson = parts[0].trim()
      const specialistsJson = parts[1]?.trim()

      // Parse the structured output
      let reportData
      try {
        reportData = JSON.parse(reportJson)
      } catch {
        // If JSON parsing fails, create a basic report from the text
        reportData = {
          summary: reportJson,
          symptomPatterns: [],
          moodTrends: 'Unable to analyze mood trends',
          recommendations: ['Please consult with your healthcare provider'],
        }
      }

      let specialists: Specialist[] = []
      if (specialistsJson) {
        try {
          specialists = JSON.parse(specialistsJson)
        } catch {
          specialists = []
        }
      }

      const report: GeneratedReport = {
        ...reportData,
        specialists,
      }

      setGeneratedReport(report)

      // Save the report
      const { start: rangeStart, end: rangeEnd } = getDateRange()
      onReportGenerated({
        dateRange: {
          start: format(rangeStart, 'yyyy-MM-dd'),
          end: format(rangeEnd, 'yyyy-MM-dd'),
        },
        summary: report.summary,
        symptomPatterns: report.symptomPatterns,
        symptomTimeline: report.symptomTimeline,
        moodTrends: report.moodTrends,
        suggestedSpecialists: report.specialists,
        recommendations: report.recommendations,
        disclaimer: 'This report is generated by AI for informational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.',
      })
    } catch (err) {
      console.error('Report generation error:', err)
      setError('Failed to generate report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
            <Bot className="size-5" />
          </div>
          <div>
            <CardTitle>AI Health Assistant</CardTitle>
            <CardDescription>Generate reports from your journal entries</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Date range selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRangeOption)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Calendar className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating || filteredEntries.length === 0}
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileText className="size-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>

        {/* Entry count */}
        <p className="text-sm text-muted-foreground">
          {filteredEntries.length} entries in selected period
        </p>

        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading state */}
        {isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <Loader2 className="size-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Analyzing your health data...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        )}

        {/* Generated report */}
        {generatedReport && !isGenerating && (
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="flex flex-col gap-6">
              {/* Disclaimer */}
              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription className="text-xs">
                  This report is AI-generated for informational purposes only. It does not
                  constitute medical advice. Always consult healthcare providers for diagnosis
                  and treatment.
                </AlertDescription>
              </Alert>

              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <FileText className="size-4" />
                  Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {generatedReport.summary}
                </p>
              </div>

              <Separator />

              {/* Symptom Patterns */}
              {generatedReport.symptomPatterns.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Observed Patterns</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {generatedReport.symptomPatterns.map((pattern, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Symptom Timeline */}
              {generatedReport.symptomTimeline && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Clock className="size-4" />
                    Symptom Timeline
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {generatedReport.symptomTimeline}
                  </p>
                </div>
              )}

              {/* Mood Trends */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Mood Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  {generatedReport.moodTrends}
                </p>
              </div>

              <Separator />

              {/* Recommendations */}
              {generatedReport.recommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Wellness Suggestions</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {generatedReport.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />

              {/* Suggested Specialists */}
              {generatedReport.specialists.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Suggested Specialists</h3>
                  <div className="flex flex-col gap-3">
                    {generatedReport.specialists.map((specialist) => (
                      <Card key={specialist.id} className="p-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {specialist.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {specialist.specialty}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3" />
                            {specialist.address}
                            {specialist.distance && (
                              <span className="ml-1">({specialist.distance})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="size-3" />
                              {specialist.phone}
                            </span>
                            {specialist.availableHours && (
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {specialist.availableHours}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Empty state */}
        {!generatedReport && !isGenerating && !error && (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
            <Bot className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">Ready to Help</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Select a date range and generate a report to analyze your health patterns
              and get personalized suggestions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
