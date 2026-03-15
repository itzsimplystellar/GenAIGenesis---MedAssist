'use client'

import { useState } from 'react'
import { Plus, BookOpen, Bot, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { JournalEntryForm } from '@/components/journal-entry-form'
import { EntriesList } from '@/components/entries-list'
import { AIAssistant } from '@/components/ai-assistant'
import { ReportViewer } from '@/components/report-viewer'
import { useJournalStorage } from '@/hooks/use-journal-storage'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const {
    entries,
    activeEntries,
    reports,
    isLoaded,
    addEntry,
    toggleArchive,
    deleteEntry,
    addReport,
    deleteReport,
  } = useJournalStorage()

  const [showNewEntry, setShowNewEntry] = useState(false)
  const [activeTab, setActiveTab] = useState('journal')

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading your journal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 max-w-7xl mx-auto">
        {/* Welcome section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground text-balance">
            Welcome to MedJournal
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your health, understand patterns, and communicate better with your healthcare providers.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-2xl font-bold text-primary">{activeEntries.length}</p>
            <p className="text-sm text-muted-foreground">Journal Entries</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-2xl font-bold text-accent">{reports.length}</p>
            <p className="text-sm text-muted-foreground">Reports Generated</p>
          </div>
          <div className="p-4 rounded-lg bg-muted border">
            <p className="text-2xl font-bold text-foreground">
              {activeEntries.length > 0
                ? Math.round(
                    activeEntries.reduce((sum, e) => sum + e.mood, 0) /
                      activeEntries.length
                  )
                : '-'}
            </p>
            <p className="text-sm text-muted-foreground">Avg. Mood</p>
          </div>
          <div className="p-4 rounded-lg bg-muted border">
            <p className="text-2xl font-bold text-foreground">
              {activeEntries.reduce((sum, e) => sum + e.symptoms.length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Symptoms Tracked</p>
          </div>
        </div>

        {/* Main content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="journal" className="gap-2">
                <BookOpen className="size-4" />
                <span className="hidden sm:inline">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="assistant" className="gap-2">
                <Bot className="size-4" />
                <span className="hidden sm:inline">AI Assistant</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <FileText className="size-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === 'journal' && !showNewEntry && (
              <Button onClick={() => setShowNewEntry(true)} className="gap-2">
                <Plus className="size-4" />
                New Entry
              </Button>
            )}
          </div>

          <TabsContent value="journal" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Entry form */}
              <div className={cn(!showNewEntry && 'hidden lg:block')}>
                {showNewEntry ? (
                  <JournalEntryForm
                    onSave={(entry) => {
                      addEntry(entry)
                      setShowNewEntry(false)
                    }}
                    onCancel={() => setShowNewEntry(false)}
                  />
                ) : (
                  <div className="hidden lg:flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-xl text-center p-6">
                    <BookOpen className="size-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground">
                      Create a New Entry
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-xs">
                      Record your mood, symptoms, and how you're feeling today.
                    </p>
                    <Button onClick={() => setShowNewEntry(true)} className="gap-2">
                      <Plus className="size-4" />
                      New Entry
                    </Button>
                  </div>
                )}
              </div>

              {/* Entries list */}
              <div className={cn(showNewEntry && 'hidden lg:block')}>
                <EntriesList
                  entries={entries}
                  onArchive={toggleArchive}
                  onDelete={deleteEntry}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assistant" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-6">
              <AIAssistant
                entries={entries}
                onReportGenerated={addReport}
                className="h-[calc(100vh-18rem)]"
              />
              <div className="hidden lg:block">
                <ReportViewer
                  reports={reports}
                  onDelete={deleteReport}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <ReportViewer
              reports={reports}
              onDelete={deleteReport}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            MedJournal is for informational purposes only and does not provide medical advice.
          </p>
          <p className="mt-1">
            Always consult with qualified healthcare providers for diagnosis and treatment.
          </p>
        </div>
      </footer>
    </div>
  )
}
