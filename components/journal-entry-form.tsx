'use client'

import { useState, useEffect } from 'react'
import { Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MoodSlider } from '@/components/mood-slider'
import { SymptomInput } from '@/components/symptom-input'
import { VoiceTextarea } from '@/components/voice-textarea'
import { BodyDiagram } from '@/components/body-diagram'
import { TimeSelector } from '@/components/time-selector'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { JournalEntry, MoodLevel, Symptom, BodyRegion } from '@/lib/types'
import { getTimeOfDay } from '@/lib/types'
import { format } from 'date-fns'

interface JournalEntryFormProps {
  onSave: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'archived'>) => void
  onCancel?: () => void
  initialData?: Partial<JournalEntry>
  className?: string
}

export function JournalEntryForm({
  onSave,
  onCancel,
  initialData,
  className,
}: JournalEntryFormProps) {
  const [timeOfDay, setTimeOfDay] = useState<JournalEntry['timeOfDay']>(
    initialData?.timeOfDay ?? getTimeOfDay()
  )
  const [mood, setMood] = useState<MoodLevel>(initialData?.mood ?? 5)
  const [overallFeeling, setOverallFeeling] = useState(initialData?.overallFeeling ?? '')
  const [symptoms, setSymptoms] = useState<Symptom[]>(initialData?.symptoms ?? [])
  const [bodyRegions, setBodyRegions] = useState<BodyRegion[]>(initialData?.bodyRegions ?? [])
  const [notes, setNotes] = useState(initialData?.notes ?? '')
  const [activeTab, setActiveTab] = useState('mood')

  // Auto-sync body regions to symptoms
  useEffect(() => {
    // When body regions change, update symptoms that don't have body regions
    if (bodyRegions.length > 0) {
      setSymptoms((prev) =>
        prev.map((s) =>
          s.bodyRegions.length === 0 ? { ...s, bodyRegions } : s
        )
      )
    }
  }, [bodyRegions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!overallFeeling.trim() && symptoms.length === 0 && !notes.trim()) {
      toast.error('Please add some content to your entry')
      return
    }

    onSave({
      timeOfDay,
      mood,
      overallFeeling,
      symptoms,
      bodyRegions,
      notes,
    })

    // Reset form
    setMood(5)
    setOverallFeeling('')
    setSymptoms([])
    setBodyRegions([])
    setNotes('')
    setTimeOfDay(getTimeOfDay())
    setActiveTab('mood')

    toast.success('Journal entry saved!')
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">New Journal Entry</CardTitle>
            <CardDescription>
              {format(new Date(), 'EEEE, MMMM d, yyyy • h:mm a')}
            </CardDescription>
          </div>
          {onCancel && (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="size-5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <TimeSelector value={timeOfDay} onChange={setTimeOfDay} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="mood">Mood</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="body">Body Map</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="mood" className="mt-4 flex flex-col gap-6">
              <MoodSlider value={mood} onChange={setMood} />
              <VoiceTextarea
                value={overallFeeling}
                onChange={setOverallFeeling}
                placeholder="How are you feeling overall? Describe your physical and emotional state..."
                label="Overall feeling"
                minHeight="min-h-32"
              />
            </TabsContent>

            <TabsContent value="symptoms" className="mt-4">
              <SymptomInput
                symptoms={symptoms}
                onChange={setSymptoms}
                selectedBodyRegions={bodyRegions}
              />
            </TabsContent>

            <TabsContent value="body" className="mt-4">
              <BodyDiagram
                selectedRegions={bodyRegions}
                onChange={setBodyRegions}
              />
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <VoiceTextarea
                value={notes}
                onChange={setNotes}
                placeholder="Any additional notes, observations, or details you want to record..."
                label="Additional notes"
                minHeight="min-h-40"
              />
            </TabsContent>
          </Tabs>

          {/* Summary of entry */}
          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/50 text-sm">
            <span className="text-muted-foreground">Entry includes:</span>
            <span className="font-medium">Mood {mood}/10</span>
            {symptoms.length > 0 && (
              <span className="font-medium">• {symptoms.length} symptom(s)</span>
            )}
            {bodyRegions.length > 0 && (
              <span className="font-medium">• {bodyRegions.length} body area(s)</span>
            )}
            {overallFeeling && <span className="font-medium">• Overall feeling</span>}
            {notes && <span className="font-medium">• Notes</span>}
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="gap-2">
              <Save className="size-4" />
              Save Entry
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
