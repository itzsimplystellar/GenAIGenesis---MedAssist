'use client'

import { useState } from 'react'
import { Plus, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { Symptom, BodyRegion, SymptomDuration, SymptomChange } from '@/lib/types'
import { 
  COMMON_SYMPTOMS, 
  BODY_REGION_LABELS, 
  SYMPTOM_DURATION_LABELS, 
  SYMPTOM_CHANGE_LABELS 
} from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from 'lucide-react'

interface SymptomInputProps {
  symptoms: Symptom[]
  onChange: (symptoms: Symptom[]) => void
  selectedBodyRegions?: BodyRegion[]
  className?: string
}

const severityLabels = ['', 'Mild', 'Moderate', 'Notable', 'Severe', 'Extreme']
const severityColors = [
  '',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-100',
]

export function SymptomInput({
  symptoms,
  onChange,
  selectedBodyRegions = [],
  className,
}: SymptomInputProps) {
  const [newSymptom, setNewSymptom] = useState('')
  const [isCommonOpen, setIsCommonOpen] = useState(false)

  const addSymptom = (name: string) => {
    if (!name.trim()) return
    
    // Check if symptom already exists
    if (symptoms.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      return
    }

    const symptom: Symptom = {
      id: crypto.randomUUID(),
      name: name.trim(),
      severity: 3,
      bodyRegions: selectedBodyRegions,
      duration: 'today',
      changeStatus: 'new',
    }
    onChange([...symptoms, symptom])
    setNewSymptom('')
  }

  const removeSymptom = (id: string) => {
    onChange(symptoms.filter(s => s.id !== id))
  }

  const updateSeverity = (id: string, severity: 1 | 2 | 3 | 4 | 5) => {
    onChange(symptoms.map(s => (s.id === id ? { ...s, severity } : s)))
  }

  const updateBodyRegions = (id: string, regions: BodyRegion[]) => {
    onChange(symptoms.map(s => (s.id === id ? { ...s, bodyRegions: regions } : s)))
  }

  const updateDuration = (id: string, duration: SymptomDuration) => {
    onChange(symptoms.map(s => (s.id === id ? { ...s, duration } : s)))
  }

  const updateStartDate = (id: string, startDate: string) => {
    onChange(symptoms.map(s => (s.id === id ? { ...s, startDate } : s)))
  }

  const updateChangeStatus = (id: string, changeStatus: SymptomChange) => {
    onChange(symptoms.map(s => (s.id === id ? { ...s, changeStatus } : s)))
  }

  const filteredCommonSymptoms = COMMON_SYMPTOMS.filter(
    s => !symptoms.some(existing => existing.name.toLowerCase() === s.toLowerCase())
  )

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <label className="text-sm font-medium text-foreground">
        What symptoms are you experiencing?
      </label>

      {/* Add custom symptom */}
      <div className="flex gap-2">
        <Input
          value={newSymptom}
          onChange={(e) => setNewSymptom(e.target.value)}
          placeholder="Enter a symptom..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addSymptom(newSymptom)
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => addSymptom(newSymptom)}
          disabled={!newSymptom.trim()}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Common symptoms */}
      <Collapsible open={isCommonOpen} onOpenChange={setIsCommonOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            <span className="text-muted-foreground">Common symptoms</span>
            <ChevronDown
              className={cn(
                'size-4 transition-transform',
                isCommonOpen && 'rotate-180'
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {filteredCommonSymptoms.slice(0, 15).map((symptom) => (
              <Badge
                key={symptom}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => addSymptom(symptom)}
              >
                <Plus className="size-3 mr-1" />
                {symptom}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Added symptoms */}
      {symptoms.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <p className="text-sm text-muted-foreground">
            Added symptoms ({symptoms.length})
          </p>
          {symptoms.map((symptom) => (
            <div
              key={symptom.id}
              className="flex flex-col gap-2 p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{symptom.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeSymptom(symptom.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-4" />
                </Button>
              </div>
              
              {/* Severity slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">Severity:</span>
                <Slider
                  value={[symptom.severity]}
                  onValueChange={([v]) => updateSeverity(symptom.id, v as 1 | 2 | 3 | 4 | 5)}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <Badge className={cn('w-20 justify-center', severityColors[symptom.severity])}>
                  {severityLabels[symptom.severity]}
                </Badge>
              </div>

              {/* Duration - How long has this persisted? */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">Duration:</span>
                <Select
                  value={symptom.duration}
                  onValueChange={(v) => updateDuration(symptom.id, v as SymptomDuration)}
                >
                  <SelectTrigger className="flex-1 h-8 text-xs">
                    <SelectValue placeholder="How long?" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SYMPTOM_DURATION_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-xs">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start date - When did it start? */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">Started:</span>
                <div className="flex-1 relative">
                  <input
                    type="date"
                    value={symptom.startDate || ''}
                    onChange={(e) => updateStartDate(symptom.id, e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full h-8 text-xs px-3 pr-8 rounded-md border bg-background"
                  />
                  <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Change status - How has it changed? */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">Change:</span>
                <Select
                  value={symptom.changeStatus}
                  onValueChange={(v) => updateChangeStatus(symptom.id, v as SymptomChange)}
                >
                  <SelectTrigger className="flex-1 h-8 text-xs">
                    <SelectValue placeholder="How has it changed?" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SYMPTOM_CHANGE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-xs">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Body regions */}
              {symptom.bodyRegions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {symptom.bodyRegions.map((region) => (
                    <Badge
                      key={region}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() =>
                        updateBodyRegions(
                          symptom.id,
                          symptom.bodyRegions.filter(r => r !== region)
                        )
                      }
                    >
                      {BODY_REGION_LABELS[region]}
                      <X className="size-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
