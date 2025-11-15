import React from 'react'
import { Upload, Video, FileText, Database, Wand2, Image as ImageIcon, Film } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    icon: Upload,
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
    icon: Wand2,
    title: 'AI Assistant',
    subtitle: 'Generate prompts and creative direction',
  },
  {
    type: 'image-gen' as NodePaletteType,
    icon: ImageIcon,
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
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Node Palette</h2>
        <p className="text-xs text-gray-500">Click to add nodes to canvas</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon
          return (
            <button
              key={nodeType.type}
              onClick={() => onAddNode(nodeType.type)}
              className={cn(
                'w-full text-left p-3 rounded-lg border border-gray-200',
                'transition-colors cursor-pointer',
                'group hover:border-[rgb(171,223,0)] hover:bg-[rgba(171,223,0,0.05)]'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[rgba(171,223,0,0.1)] flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-[rgb(171,223,0)] transition-colors" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-0.5">
                    {nodeType.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {nodeType.subtitle}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">Port Types:</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Input (left)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">Output (right)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

