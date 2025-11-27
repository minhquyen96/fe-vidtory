import React from 'react'
import { Position, NodeProps } from 'reactflow'
import { Eye } from 'lucide-react'
import { BaseNode } from './BaseNode'

export interface PreviewNodeData {
  previews?: string[]
  label?: string
}

interface PreviewNodeProps extends NodeProps<PreviewNodeData> {
  onDataChange?: (nodeId: string, data: Partial<PreviewNodeData>) => void
  onRun?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onMarkDraggable?: (nodeId: string) => void
}

export function PreviewNode({
  data,
  selected,
  id,
  onDataChange,
  onRun,
  onDuplicate,
  onDelete,
  onMarkDraggable,
}: PreviewNodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Preview'}
      icon={<Eye className="w-4 h-4 text-gray-600" />}
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
      ]}
    >
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {data.previews && data.previews.length > 0 ? (
            data.previews.map((url, index) => (
              <div
                key={index}
                className="aspect-video bg-gray-100 rounded-md overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <>
              <div className="aspect-video bg-gray-100 rounded-md" />
              <div className="aspect-video bg-gray-100 rounded-md" />
            </>
          )}
        </div>
      </div>
    </BaseNode>
  )
}

