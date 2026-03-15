'use client'

import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import type { MoodLevel } from '@/lib/types'
import { MOOD_LABELS } from '@/lib/types'

interface MoodSliderProps {
  value: MoodLevel
  onChange: (value: MoodLevel) => void
  className?: string
}

const moodEmojis: Record<MoodLevel, string> = {
  1: 'Very Poor',
  2: 'Poor', 
  3: 'Bad',
  4: 'Below Avg',
  5: 'Average',
  6: 'Above Avg',
  7: 'Good',
  8: 'Very Good',
  9: 'Great',
  10: 'Excellent',
}

function getMoodColor(mood: MoodLevel): string {
  if (mood <= 2) return 'bg-[var(--mood-very-poor)]'
  if (mood <= 4) return 'bg-[var(--mood-poor)]'
  if (mood <= 6) return 'bg-[var(--mood-average)]'
  if (mood <= 8) return 'bg-[var(--mood-good)]'
  return 'bg-[var(--mood-excellent)]'
}

function getMoodTextColor(mood: MoodLevel): string {
  if (mood <= 2) return 'text-[var(--mood-very-poor)]'
  if (mood <= 4) return 'text-[var(--mood-poor)]'
  if (mood <= 6) return 'text-[var(--mood-average)]'
  if (mood <= 8) return 'text-[var(--mood-good)]'
  return 'text-[var(--mood-excellent)]'
}

export function MoodSlider({ value, onChange, className }: MoodSliderProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          How are you feeling?
        </label>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-2xl font-bold transition-colors',
              getMoodTextColor(value)
            )}
          >
            {value}
          </span>
          <span className="text-sm text-muted-foreground">/ 10</span>
        </div>
      </div>
      
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v as MoodLevel)}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        
        {/* Mood gradient background */}
        <div className="absolute -z-10 top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[var(--mood-very-poor)] via-[var(--mood-average)] to-[var(--mood-excellent)] opacity-30" />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Very Poor</span>
        <span>Average</span>
        <span>Excellent</span>
      </div>
      
      {/* Current mood indicator */}
      <div
        className={cn(
          'flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors',
          getMoodColor(value),
          'text-white'
        )}
      >
        <span className="text-sm font-medium">
          {MOOD_LABELS[value]}
        </span>
      </div>
    </div>
  )
}
