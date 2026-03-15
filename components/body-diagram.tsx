'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { BodyRegion } from '@/lib/types'
import { BODY_REGION_LABELS } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, RotateCcw } from 'lucide-react'

interface BodyDiagramProps {
  selectedRegions: BodyRegion[]
  onChange: (regions: BodyRegion[]) => void
  className?: string
}

type View = 'front' | 'back'

// SVG path data for body regions - simplified anatomical shapes
const frontBodyPaths: Record<string, { d: string; region: BodyRegion }> = {
  head: {
    d: 'M85,15 C85,5 115,5 115,15 L115,45 C115,60 85,60 85,45 Z',
    region: 'head',
  },
  neck: {
    d: 'M92,50 L108,50 L108,65 L92,65 Z',
    region: 'neck',
  },
  chest: {
    d: 'M70,70 L130,70 L130,120 L70,120 Z',
    region: 'chest',
  },
  abdomen: {
    d: 'M75,125 L125,125 L125,170 L75,170 Z',
    region: 'abdomen',
  },
  pelvis: {
    d: 'M75,175 L125,175 L130,200 L70,200 Z',
    region: 'pelvis',
  },
  leftShoulder: {
    d: 'M45,70 L70,70 L70,90 L50,90 Z',
    region: 'left-shoulder',
  },
  rightShoulder: {
    d: 'M130,70 L155,70 L150,90 L130,90 Z',
    region: 'right-shoulder',
  },
  leftUpperArm: {
    d: 'M40,95 L55,95 L55,140 L40,140 Z',
    region: 'left-upper-arm',
  },
  rightUpperArm: {
    d: 'M145,95 L160,95 L160,140 L145,140 Z',
    region: 'right-upper-arm',
  },
  leftForearm: {
    d: 'M35,145 L50,145 L48,195 L33,195 Z',
    region: 'left-forearm',
  },
  rightForearm: {
    d: 'M150,145 L165,145 L167,195 L152,195 Z',
    region: 'right-forearm',
  },
  leftHand: {
    d: 'M28,200 L53,200 L53,225 L28,225 Z',
    region: 'left-hand',
  },
  rightHand: {
    d: 'M147,200 L172,200 L172,225 L147,225 Z',
    region: 'right-hand',
  },
  leftThigh: {
    d: 'M72,205 L95,205 L92,275 L70,275 Z',
    region: 'left-thigh',
  },
  rightThigh: {
    d: 'M105,205 L128,205 L130,275 L108,275 Z',
    region: 'right-thigh',
  },
  leftKnee: {
    d: 'M70,280 L92,280 L92,305 L70,305 Z',
    region: 'left-knee',
  },
  rightKnee: {
    d: 'M108,280 L130,280 L130,305 L108,305 Z',
    region: 'right-knee',
  },
  leftShin: {
    d: 'M72,310 L90,310 L88,370 L70,370 Z',
    region: 'left-shin',
  },
  rightShin: {
    d: 'M110,310 L128,310 L130,370 L112,370 Z',
    region: 'right-shin',
  },
  leftFoot: {
    d: 'M65,375 L90,375 L90,395 L65,395 Z',
    region: 'left-foot',
  },
  rightFoot: {
    d: 'M110,375 L135,375 L135,395 L110,395 Z',
    region: 'right-foot',
  },
}

const backBodyPaths: Record<string, { d: string; region: BodyRegion }> = {
  head: {
    d: 'M85,15 C85,5 115,5 115,15 L115,45 C115,60 85,60 85,45 Z',
    region: 'head',
  },
  neck: {
    d: 'M92,50 L108,50 L108,65 L92,65 Z',
    region: 'neck',
  },
  upperBack: {
    d: 'M70,70 L130,70 L130,120 L70,120 Z',
    region: 'upper-back',
  },
  lowerBack: {
    d: 'M75,125 L125,125 L125,170 L75,170 Z',
    region: 'lower-back',
  },
  pelvis: {
    d: 'M75,175 L125,175 L130,200 L70,200 Z',
    region: 'pelvis',
  },
  leftShoulder: {
    d: 'M45,70 L70,70 L70,90 L50,90 Z',
    region: 'left-shoulder',
  },
  rightShoulder: {
    d: 'M130,70 L155,70 L150,90 L130,90 Z',
    region: 'right-shoulder',
  },
  leftUpperArm: {
    d: 'M40,95 L55,95 L55,140 L40,140 Z',
    region: 'left-upper-arm',
  },
  rightUpperArm: {
    d: 'M145,95 L160,95 L160,140 L145,140 Z',
    region: 'right-upper-arm',
  },
  leftForearm: {
    d: 'M35,145 L50,145 L48,195 L33,195 Z',
    region: 'left-forearm',
  },
  rightForearm: {
    d: 'M150,145 L165,145 L167,195 L152,195 Z',
    region: 'right-forearm',
  },
  leftHand: {
    d: 'M28,200 L53,200 L53,225 L28,225 Z',
    region: 'left-hand',
  },
  rightHand: {
    d: 'M147,200 L172,200 L172,225 L147,225 Z',
    region: 'right-hand',
  },
  leftThigh: {
    d: 'M72,205 L95,205 L92,275 L70,275 Z',
    region: 'left-thigh',
  },
  rightThigh: {
    d: 'M105,205 L128,205 L130,275 L108,275 Z',
    region: 'right-thigh',
  },
  leftKnee: {
    d: 'M70,280 L92,280 L92,305 L70,305 Z',
    region: 'left-knee',
  },
  rightKnee: {
    d: 'M108,280 L130,280 L130,305 L108,305 Z',
    region: 'right-knee',
  },
  leftShin: {
    d: 'M72,310 L90,310 L88,370 L70,370 Z',
    region: 'left-shin',
  },
  rightShin: {
    d: 'M110,310 L128,310 L130,370 L112,370 Z',
    region: 'right-shin',
  },
  leftFoot: {
    d: 'M65,375 L90,375 L90,395 L65,395 Z',
    region: 'left-foot',
  },
  rightFoot: {
    d: 'M110,375 L135,375 L135,395 L110,395 Z',
    region: 'right-foot',
  },
}

export function BodyDiagram({
  selectedRegions,
  onChange,
  className,
}: BodyDiagramProps) {
  const [view, setView] = useState<View>('front')
  const [hoveredRegion, setHoveredRegion] = useState<BodyRegion | null>(null)

  const paths = view === 'front' ? frontBodyPaths : backBodyPaths

  const toggleRegion = (region: BodyRegion) => {
    if (selectedRegions.includes(region)) {
      onChange(selectedRegions.filter((r) => r !== region))
    } else {
      onChange([...selectedRegions, region])
    }
  }

  const clearAll = () => {
    onChange([])
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Where do you feel the symptoms?
        </label>
        {selectedRegions.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground"
          >
            <RotateCcw className="size-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* View toggle */}
      <div className="flex justify-center gap-2">
        <Button
          type="button"
          variant={view === 'front' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('front')}
        >
          Front View
        </Button>
        <Button
          type="button"
          variant={view === 'back' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('back')}
        >
          Back View
        </Button>
      </div>

      {/* SVG Body diagram */}
      <div className="relative flex justify-center">
        <svg
          viewBox="0 0 200 410"
          className="w-full max-w-[250px] h-auto"
          aria-label={`Human body ${view} view diagram`}
        >
          {/* Body outline */}
          <path
            d="M100,10 
               C120,10 130,25 130,45 
               L130,50 
               C145,55 160,65 160,90 
               L170,200 L175,225 
               L145,225 L145,200 
               L130,200 L130,275 
               L135,395 L110,395 
               L105,275 L95,275 
               L90,395 L65,395 
               L70,275 L70,200 
               L55,200 L55,225 
               L25,225 L30,200 
               L40,90 
               C40,65 55,55 70,50 
               L70,45 
               C70,25 80,10 100,10 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
          />

          {/* Clickable regions */}
          {Object.entries(paths).map(([key, { d, region }]) => {
            const isSelected = selectedRegions.includes(region)
            const isHovered = hoveredRegion === region
            return (
              <path
                key={key}
                d={d}
                onClick={() => toggleRegion(region)}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                className={cn(
                  'cursor-pointer transition-all duration-200',
                  isSelected
                    ? 'fill-[var(--body-selected)] stroke-[var(--body-selected)]'
                    : isHovered
                      ? 'fill-[var(--body-highlight)]/50 stroke-[var(--body-highlight)]'
                      : 'fill-transparent stroke-muted-foreground/30'
                )}
                strokeWidth={isSelected || isHovered ? 2 : 1}
                role="button"
                aria-label={`Select ${BODY_REGION_LABELS[region]}`}
                aria-pressed={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleRegion(region)
                  }
                }}
              />
            )
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredRegion && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm px-2 py-1 rounded shadow-md border">
            {BODY_REGION_LABELS[hoveredRegion]}
          </div>
        )}
      </div>

      {/* Selected regions list */}
      {selectedRegions.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Selected areas ({selectedRegions.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedRegions.map((region) => (
              <Badge
                key={region}
                variant="default"
                className="cursor-pointer bg-accent text-accent-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => toggleRegion(region)}
              >
                {BODY_REGION_LABELS[region]}
                <X className="size-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
