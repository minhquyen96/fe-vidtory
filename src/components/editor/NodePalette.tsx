import React from 'react'
import { Upload, Video, FileText, Database, Sparkles, Wand2, Film, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export type NodePaletteType =
  | 'upload-image'
  | 'upload-video'
  | 'text-link'
  | 'data-input'
  | 'assistant'
  | 'image-gen'
  | 'video-gen'

interface NodePaletteProps {
  onAddNode: (type: NodePaletteType) => void
}

const nodeTypes = [
  {
    type: 'upload-image' as NodePaletteType,
    icon: ImageIcon,
    title: 'Upload Image',
    subtitle: 'Upload and analyze an image',
  },
  {
    type: 'upload-video' as NodePaletteType,
    icon: Video,
    title: 'Upload Video',
    subtitle: 'Upload and analyze a video',
  },
  {
    type: 'text-link' as NodePaletteType,
    icon: FileText,
    title: 'Text / Link Input',
    subtitle: 'Paste text or URL for analysis',
  },
  {
    type: 'data-input' as NodePaletteType,
    icon: Database,
    title: 'Data Input',
    subtitle: 'Custom structured data input with flexible fields',
  },
  {
    type: 'assistant' as NodePaletteType,
    icon: Sparkles,
    title: 'AI Assistant',
    subtitle: 'Generate prompts and creative direction',
  },
  {
    type: 'image-gen' as NodePaletteType,
    icon: Wand2,
    title: 'Image Generation',
    subtitle: 'Generate images with AI',
  },
  {
    type: 'video-gen' as NodePaletteType,
    icon: Film,
    title: 'Video Generation',
    subtitle: 'Generate videos with AI',
  },
]

export function NodePalette({ onAddNode }: NodePaletteProps) {
  return (
    <div 
      className="absolute left-8 top-1/2 -translate-y-1/2 z-50"
      style={{ transform: 'translateY(-50%)' }}
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-2 space-y-1">
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon
          return (
            <Tooltip key={nodeType.type} delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onAddNode(nodeType.type)}
                  className={cn(
                    'w-12 h-12 rounded-lg border border-gray-200',
                    'transition-all cursor-pointer',
                    'group hover:border-[rgb(171,223,0)] hover:bg-[rgba(171,223,0,0.05)]',
                    'flex items-center justify-center',
                    'hover:scale-105 active:scale-95'
                  )}
                >
                  <Icon className="w-5 h-5 text-gray-600 group-hover:text-[rgb(171,223,0)] transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8} className="max-w-[200px]">
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm">{nodeType.title}</div>
                  <div className="text-xs text-gray-500">{nodeType.subtitle}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

