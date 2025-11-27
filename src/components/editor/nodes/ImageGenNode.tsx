import React, { useState } from 'react'
import { Position, NodeProps } from 'reactflow'
import { Wand2, Maximize2 } from 'lucide-react'
import { BaseNode } from './BaseNode'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface ImageGenNodeData {
  imageUrl?: string
  upscale: boolean
  scale: string
  resolution: string
  model: string
  aspectRatio: string
  variants?: number
  label?: string
  isLoading?: boolean
}

interface ImageGenNodeProps extends NodeProps<ImageGenNodeData> {
  onDataChange?: (nodeId: string, data: Partial<ImageGenNodeData>) => void
  onRun?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onMarkDraggable?: (nodeId: string) => void
}

export function ImageGenNode({
  data,
  selected,
  id,
  onDataChange,
  onRun,
  onDuplicate,
  onDelete,
  onMarkDraggable,
}: ImageGenNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const MAX_PREVIEW_HEIGHT = 200

  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Image Generation'}
      icon={<Wand2 className="w-4 h-4 text-gray-600" />}
      onRun={onRun}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onMarkDraggable={onMarkDraggable}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: 'input',
          className: 'w-3 h-3 bg-blue-500',
          style: { top: '50%' },
          label: 'Input',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'output',
          className: 'w-3 h-3 bg-green-500',
          style: { top: '50%' },
          label: 'Output',
        },
      ]}
      isLoading={data.isLoading}
    >
      <div className="p-4">
        {data.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-[rgb(171,223,0)] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Generating image...</p>
            </div>
          </div>
        ) : data.imageUrl ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-700">Generated Image:</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsModalOpen(true)
                }}
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                View Full
              </Button>
            </div>
            <div className="rounded-md overflow-hidden border border-gray-200" style={{ maxHeight: `${MAX_PREVIEW_HEIGHT}px` }}>
              <img
                src={data.imageUrl}
                alt="Generated"
                className="w-full h-auto object-contain"
                style={{ maxHeight: `${MAX_PREVIEW_HEIGHT}px` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Configure in Inspector →</p>
        )}
      </div>

      {/* Full Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated Image</DialogTitle>
          </DialogHeader>
          <div className="rounded-md overflow-hidden border border-gray-200 mt-4 flex items-center justify-center bg-gray-50">
            <img
              src={data.imageUrl}
              alt="Generated"
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </BaseNode>
  )
}

