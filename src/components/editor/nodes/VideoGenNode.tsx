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
  isLoading?: boolean
  jobId?: string
  statusUrl?: string
  downloadUrl?: string
  pollIntervalMs?: number
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
              <p className="text-sm text-gray-500">Creating video job...</p>
            </div>
          </div>
        ) : data.jobId ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">Video Generation Job:</p>
            <div className="bg-gray-50 rounded-md p-3 border border-gray-200 space-y-1">
              <p className="text-xs text-gray-600">Job ID: {data.jobId}</p>
              {data.downloadUrl && (
                <a
                  href={data.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[rgb(171,223,0)] hover:underline"
                >
                  Download Video
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Configure in Inspector →</p>
        )}
      </div>
    </BaseNode>
  )
}

