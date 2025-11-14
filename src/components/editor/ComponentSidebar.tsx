import React from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileImage, Video, FileText, Music, Image as ImageIcon, Film, Type, Bot, Settings, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ComponentType =
  | 'upload'
  | 'media'
  | 'text'
  | 'audio'
  | 'image-gen'
  | 'video-gen'
  | 'text-gen'
  | 'assistant'
  | 'input-parameter'
  | 'preview'

interface ComponentSidebarProps {
  onAddComponent: (type: ComponentType) => void
  selectedType?: ComponentType
}

const components = [
  { type: 'upload' as ComponentType, label: 'Upload', icon: Upload },
  { type: 'media' as ComponentType, label: 'Media', icon: FileImage },
  { type: 'text' as ComponentType, label: 'Text', icon: FileText },
  { type: 'audio' as ComponentType, label: 'Audio', icon: Music },
  { type: 'image-gen' as ComponentType, label: 'Image gen', icon: ImageIcon },
  { type: 'video-gen' as ComponentType, label: 'Video gen', icon: Film },
  { type: 'text-gen' as ComponentType, label: 'Text gen', icon: Type },
  { type: 'assistant' as ComponentType, label: 'Assistant', icon: Bot },
  { type: 'input-parameter' as ComponentType, label: 'Input parameter', icon: Settings },
  { type: 'preview' as ComponentType, label: 'Preview', icon: Eye },
]

export function ComponentSidebar({ onAddComponent, selectedType }: ComponentSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Button
          variant="default"
          className="w-full"
          onClick={() => onAddComponent('upload')}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {components.map((component) => {
          const Icon = component.icon
          const isSelected = selectedType === component.type
          return (
            <button
              key={component.type}
              onClick={() => onAddComponent(component.type)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors mb-1',
                isSelected
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-700'
              )}
            >
              <Icon className="w-4 h-4" />
              {component.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

