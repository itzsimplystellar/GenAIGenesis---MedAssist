'use client'

import { Sun, Sunrise, Sunset, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { JournalEntry } from '@/lib/types'

interface TimeSelectorProps {
  value: JournalEntry['timeOfDay']
  onChange: (value: JournalEntry['timeOfDay']) => void
  className?: string
}

const timeOptions: {
  value: JournalEntry['timeOfDay']
  label: string
  icon: typeof Sun
  description: string
}[] = [
  { value: 'morning', label: 'Morning', icon: Sunrise, description: '5am - 12pm' },
  { value: 'afternoon', label: 'Afternoon', icon: Sun, description: '12pm - 5pm' },
  { value: 'evening', label: 'Evening', icon: Sunset, description: '5pm - 9pm' },
  { value: 'night', label: 'Night', icon: Moon, description: '9pm - 5am' },
]

export function TimeSelector({ value, onChange, className }: TimeSelectorProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-sm font-medium text-foreground">
        Time of day
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {timeOptions.map((option) => {
          const Icon = option.icon
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-lg border transition-all',
                'hover:border-primary hover:bg-primary/5',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground'
              )}
            >
              <Icon className={cn('size-5', isSelected && 'text-primary')} />
              <span className={cn('text-sm font-medium', isSelected && 'text-primary')}>
                {option.label}
              </span>
              <span className="text-xs opacity-70">{option.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
