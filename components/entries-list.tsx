'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Archive, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EntryCard } from '@/components/entry-card'
import { cn } from '@/lib/utils'
import type { JournalEntry } from '@/lib/types'
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'

interface EntriesListProps {
  entries: JournalEntry[]
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  className?: string
}

type SortOption = 'newest' | 'oldest' | 'mood-high' | 'mood-low'
type DateFilter = 'all' | 'today' | 'week' | 'month'

export function EntriesList({
  entries,
  onArchive,
  onDelete,
  className,
}: EntriesListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [activeTab, setActiveTab] = useState('active')

  const activeEntries = useMemo(() => entries.filter((e) => !e.archived), [entries])
  const archivedEntries = useMemo(() => entries.filter((e) => e.archived), [entries])

  const filterAndSortEntries = (list: JournalEntry[]) => {
    let filtered = list

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.overallFeeling.toLowerCase().includes(query) ||
          entry.notes.toLowerCase().includes(query) ||
          entry.symptoms.some((s) => s.name.toLowerCase().includes(query))
      )
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      filtered = filtered.filter((entry) => {
        const date = new Date(entry.createdAt)
        switch (dateFilter) {
          case 'today':
            return isToday(date)
          case 'week':
            return isThisWeek(date)
          case 'month':
            return isThisMonth(date)
          default:
            return true
        }
      })
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'mood-high':
          return b.mood - a.mood
        case 'mood-low':
          return a.mood - b.mood
        default:
          return 0
      }
    })
  }

  const displayedActive = filterAndSortEntries(activeEntries)
  const displayedArchived = filterAndSortEntries(archivedEntries)

  const groupEntriesByDate = (list: JournalEntry[]) => {
    const groups: Record<string, JournalEntry[]> = {}
    
    list.forEach((entry) => {
      const date = new Date(entry.createdAt)
      let label: string
      
      if (isToday(date)) {
        label = 'Today'
      } else if (isYesterday(date)) {
        label = 'Yesterday'
      } else if (isThisWeek(date)) {
        label = 'This Week'
      } else if (isThisMonth(date)) {
        label = 'This Month'
      } else {
        label = format(date, 'MMMM yyyy')
      }
      
      if (!groups[label]) {
        groups[label] = []
      }
      groups[label].push(entry)
    })
    
    return groups
  }

  const renderEntryList = (list: JournalEntry[]) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="size-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No entries found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Start by creating your first journal entry'}
          </p>
        </div>
      )
    }

    const grouped = groupEntriesByDate(list)

    return (
      <div className="flex flex-col gap-6">
        {Object.entries(grouped).map(([label, groupEntries]) => (
          <div key={label}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-2">
              {label} ({groupEntries.length})
            </h3>
            <div className="flex flex-col gap-3">
              {groupEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onArchive={onArchive}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="mood-high">Highest mood</SelectItem>
              <SelectItem value="mood-low">Lowest mood</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs for active/archived */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Calendar className="size-4" />
            Active ({activeEntries.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="gap-2">
            <Archive className="size-4" />
            Archived ({archivedEntries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {renderEntryList(displayedActive)}
        </TabsContent>

        <TabsContent value="archived" className="mt-4">
          {renderEntryList(displayedArchived)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
