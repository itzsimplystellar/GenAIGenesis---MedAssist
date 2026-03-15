'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Archive,
  ArchiveRestore,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sun,
  Sunrise,
  Sunset,
  Moon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import type { JournalEntry } from '@/lib/types'
import { MOOD_LABELS, BODY_REGION_LABELS, SYMPTOM_DURATION_LABELS, SYMPTOM_CHANGE_LABELS } from '@/lib/types'

interface EntryCardProps {
  entry: JournalEntry
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  className?: string
}

const timeIcons = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  night: Moon,
}

function getMoodColor(mood: number): string {
  if (mood <= 2) return 'bg-[var(--mood-very-poor)] text-white'
  if (mood <= 4) return 'bg-[var(--mood-poor)] text-white'
  if (mood <= 6) return 'bg-[var(--mood-average)] text-foreground'
  if (mood <= 8) return 'bg-[var(--mood-good)] text-white'
  return 'bg-[var(--mood-excellent)] text-white'
}

const severityColors = [
  '',
  'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
  'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
  'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  'bg-red-200 text-red-900 dark:bg-red-950/50 dark:text-red-100',
]

export function EntryCard({ entry, onArchive, onDelete, className }: EntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const TimeIcon = timeIcons[entry.timeOfDay]

  const entryDate = new Date(entry.createdAt)

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        entry.archived && 'opacity-60',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TimeIcon className="size-4" />
              <span>{format(entryDate, 'EEEE, MMM d, yyyy')}</span>
              <span className="text-xs">at {format(entryDate, 'h:mm a')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn('font-bold', getMoodColor(entry.mood))}>
                Mood: {entry.mood}/10
              </Badge>
              <span className="text-sm text-muted-foreground">
                {MOOD_LABELS[entry.mood]}
              </span>
              {entry.archived && (
                <Badge variant="outline" className="text-xs">
                  Archived
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onArchive(entry.id)}
              title={entry.archived ? 'Unarchive' : 'Archive'}
            >
              {entry.archived ? (
                <ArchiveRestore className="size-4" />
              ) : (
                <Archive className="size-4" />
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    journal entry from {format(entryDate, 'MMM d, yyyy')}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(entry.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall feeling preview */}
        {entry.overallFeeling && (
          <p className="text-sm text-foreground mb-3 line-clamp-2">
            {entry.overallFeeling}
          </p>
        )}

        {/* Symptoms summary */}
        {entry.symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {entry.symptoms.slice(0, isExpanded ? undefined : 3).map((symptom) => (
              <Badge
                key={symptom.id}
                variant="secondary"
                className={cn('text-xs', severityColors[symptom.severity])}
              >
                {symptom.name}
              </Badge>
            ))}
            {!isExpanded && entry.symptoms.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{entry.symptoms.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Body regions */}
        {entry.bodyRegions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {entry.bodyRegions.slice(0, isExpanded ? undefined : 3).map((region) => (
              <Badge key={region} variant="outline" className="text-xs">
                {BODY_REGION_LABELS[region]}
              </Badge>
            ))}
            {!isExpanded && entry.bodyRegions.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{entry.bodyRegions.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Expandable content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t flex flex-col gap-3">
            {entry.symptoms.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Symptoms Detail</h4>
                <div className="flex flex-col gap-3">
                  {entry.symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="p-2 rounded-md bg-muted/50"
                    >
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium">{symptom.name}</span>
                        <Badge className={severityColors[symptom.severity]}>
                          Severity: {symptom.severity}/5
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                        {symptom.duration && (
                          <span>Duration: {SYMPTOM_DURATION_LABELS[symptom.duration]}</span>
                        )}
                        {symptom.startDate && (
                          <span>Started: {new Date(symptom.startDate).toLocaleDateString()}</span>
                        )}
                        {symptom.changeStatus && (
                          <span className={cn(
                            symptom.changeStatus === 'improving' && 'text-green-600 dark:text-green-400',
                            symptom.changeStatus === 'worsening' && 'text-red-600 dark:text-red-400'
                          )}>
                            Status: {SYMPTOM_CHANGE_LABELS[symptom.changeStatus]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {entry.notes && (
              <div>
                <h4 className="text-sm font-medium mb-1">Notes</h4>
                <p className="text-sm text-muted-foreground">{entry.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Expand/collapse button */}
        {(entry.symptoms.length > 0 || entry.notes || entry.bodyRegions.length > 3) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-2 text-muted-foreground"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="size-4 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="size-4 mr-1" />
                Show more
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
