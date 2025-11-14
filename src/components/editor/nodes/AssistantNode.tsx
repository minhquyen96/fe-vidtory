import React from 'react'
import { Position, NodeProps } from 'reactflow'
import { Wand2 } from 'lucide-react'
import { BaseNode } from './BaseNode'

export interface AssistantNodeData {
  text: string
  model: string
  systemPrompt?: string
  label?: string
}

interface AssistantNodeProps extends NodeProps<AssistantNodeData> {
  onDataChange?: (nodeId: string, data: Partial<AssistantNodeData>) => void
  onRun?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onMarkDraggable?: (nodeId: string) => void
}

export function AssistantNode({
  data,
  selected,
  id,
  onDataChange,
  onRun,
  onDuplicate,
  onDelete,
  onMarkDraggable,
}: AssistantNodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'AI Assistant'}
      icon={<Wand2 className="w-4 h-4 text-gray-600" />}
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
        <p className="text-sm text-gray-500 mb-3">Configure in Inspector →</p>
      </div>
    </BaseNode>
  )
}

