import React from 'react'
import { Position, NodeProps } from 'reactflow'
import { Image as ImageIcon } from 'lucide-react'
import { BaseNode } from './BaseNode'

export interface ImageGenNodeData {
  imageUrl?: string
  upscale: boolean
  scale: string
  resolution: string
  model: string
  aspectRatio: string
  variants?: number
  label?: string
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
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Image Generation'}
      icon={<ImageIcon className="w-4 h-4 text-gray-600" />}
      onRun={onRun}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onMarkDraggable={onMarkDraggable}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: 'prompt',
          className: 'w-3 h-3 bg-blue-500',
          style: { top: '25%' },
          label: 'Prompt (text)',
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'styleBrand',
          className: 'w-3 h-3 bg-blue-500',
          style: { top: '50%' },
          label: 'Style/Brand (brand-guide)',
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'reference',
          className: 'w-3 h-3 bg-blue-500',
          style: { top: '75%' },
          label: 'Reference (image)',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'generatedImage',
          className: 'w-3 h-3 bg-green-500',
          style: { top: '30%' },
          label: 'Generated Image (image)',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'metadata',
          className: 'w-3 h-3 bg-green-500',
          style: { top: '70%' },
          label: 'Metadata (structured)',
        },
      ]}
    >
      <div className="p-4">
        <p className="text-sm text-gray-500">Configure in Inspector →</p>
      </div>
    </BaseNode>
  )
}

