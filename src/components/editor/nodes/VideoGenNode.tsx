import React from 'react'
import { Position, NodeProps } from 'reactflow'
import { Film } from 'lucide-react'
import { BaseNode } from './BaseNode'

export interface VideoGenNodeData {
  videoUrl?: string
  upscale: boolean
  scale: string
  resolution: string
  model: string
  aspectRatio: string
  duration: string
  label?: string
}

interface VideoGenNodeProps extends NodeProps<VideoGenNodeData> {
  onDataChange?: (nodeId: string, data: Partial<VideoGenNodeData>) => void
  onRun?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onMarkDraggable?: (nodeId: string) => void
}

export function VideoGenNode({
  data,
  selected,
  id,
  onDataChange,
  onRun,
  onDuplicate,
  onDelete,
  onMarkDraggable,
}: VideoGenNodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Video Generation'}
      icon={<Film className="w-4 h-4 text-gray-600" />}
      onRun={onRun}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onMarkDraggable={onMarkDraggable}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          className: 'w-3 h-3 bg-blue-500',
        },
        {
          type: 'source',
          position: Position.Right,
          className: 'w-3 h-3 bg-green-500',
        },
      ]}
    >
      <div className="p-4">
        <p className="text-sm text-gray-500">Configure in Inspector →</p>
      </div>
    </BaseNode>
  )
}

