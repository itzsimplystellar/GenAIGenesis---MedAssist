'use client'

import { useState, useEffect, useCallback } from 'react'
import type { JournalEntry, MedicalReport, AppState } from '@/lib/types'

const STORAGE_KEY = 'medjournal-data'

const defaultState: AppState = {
  entries: [],
  reports: [],
}

export function useJournalStorage() {
  const [state, setState] = useState<AppState>(defaultState)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AppState
        setState(parsed)
      }
    } catch (error) {
      console.error('Failed to load journal data:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch (error) {
        console.error('Failed to save journal data:', error)
      }
    }
  }, [state, isLoaded])

  // Add a new journal entry
  const addEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'createdAt' | 'archived'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      archived: false,
    }
    setState(prev => ({
      ...prev,
      entries: [newEntry, ...prev.entries],
    }))
    return newEntry
  }, [])

  // Update an existing entry
  const updateEntry = useCallback((id: string, updates: Partial<JournalEntry>) => {
    setState(prev => ({
      ...prev,
      entries: prev.entries.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    }))
  }, [])

  // Archive/unarchive an entry
  const toggleArchive = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      entries: prev.entries.map(entry =>
        entry.id === id ? { ...entry, archived: !entry.archived } : entry
      ),
    }))
  }, [])

  // Delete an entry
  const deleteEntry = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.id !== id),
    }))
  }, [])

  // Add a new report
  const addReport = useCallback((report: Omit<MedicalReport, 'id' | 'createdAt'>) => {
    const newReport: MedicalReport = {
      ...report,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setState(prev => ({
      ...prev,
      reports: [newReport, ...prev.reports],
    }))
    return newReport
  }, [])

  // Delete a report
  const deleteReport = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      reports: prev.reports.filter(report => report.id !== id),
    }))
  }, [])

  // Get entries by date range
  const getEntriesByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return state.entries.filter(entry => {
      const entryDate = new Date(entry.createdAt)
      return entryDate >= startDate && entryDate <= endDate
    })
  }, [state.entries])

  // Get active (non-archived) entries
  const activeEntries = state.entries.filter(e => !e.archived)
  
  // Get archived entries
  const archivedEntries = state.entries.filter(e => e.archived)

  return {
    entries: state.entries,
    activeEntries,
    archivedEntries,
    reports: state.reports,
    isLoaded,
    addEntry,
    updateEntry,
    toggleArchive,
    deleteEntry,
    addReport,
    deleteReport,
    getEntriesByDateRange,
  }
}
