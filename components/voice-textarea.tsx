'use client'

import { useEffect } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useVoiceInput } from '@/hooks/use-voice-input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface VoiceTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  minHeight?: string
}

export function VoiceTextarea({
  value,
  onChange,
  placeholder = 'Start typing or use voice input...',
  label,
  className,
  minHeight = 'min-h-24',
}: VoiceTextareaProps) {
  const { isListening, isSupported, startListening, stopListening } = useVoiceInput({
    onResult: (transcript) => {
      onChange(value + (value ? ' ' : '') + transcript)
    },
    onError: (error) => {
      toast.error(error)
    },
    continuous: true,
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening()
      }
    }
  }, [isListening, stopListening])

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
      toast.success('Voice input stopped')
    } else {
      startListening()
      toast.info('Listening... Speak now')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            minHeight,
            'pr-12 resize-none',
            isListening && 'ring-2 ring-primary ring-offset-2',
            className
          )}
        />
        {isSupported && (
          <Button
            type="button"
            variant={isListening ? 'default' : 'outline'}
            size="icon"
            className={cn(
              'absolute bottom-2 right-2 transition-all',
              isListening && 'animate-pulse bg-primary'
            )}
            onClick={handleVoiceToggle}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mic className="size-4" />
            )}
          </Button>
        )}
        {!isSupported && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 opacity-50 cursor-not-allowed"
            disabled
            aria-label="Voice input not supported"
          >
            <MicOff className="size-4" />
          </Button>
        )}
      </div>
      {isListening && (
        <p className="text-xs text-primary animate-pulse">
          Listening... Speak clearly into your microphone
        </p>
      )}
    </div>
  )
}
