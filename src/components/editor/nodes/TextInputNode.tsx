import React from 'react'
import { Position, NodeProps } from 'reactflow'
import { Textarea } from '@/components/ui/textarea'
import { FileText } from 'lucide-react'
import { BaseNode } from './BaseNode'

export interface TextInputNodeData {
  text: string
  label?: string
  mode?: string
}

interface TextInputNodeProps extends NodeProps<TextInputNodeData> {
  onDataChange?: (nodeId: string, data: Partial<TextInputNodeData>) => void
  onRun?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onMarkDraggable?: (nodeId: string) => void
}

export function TextInputNode({
  data,
  selected,
  id,
  onDataChange,
  onRun,
  onDuplicate,
  onDelete,
  onMarkDraggable,
}: TextInputNodeProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    if (onDataChange) {
      onDataChange(id, { text: newText })
    } else {
      data.text = newText
    }
  }

  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Text / Link Input'}
      icon={<FileText className="w-4 h-4 text-gray-600" />}
      onRun={onRun}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onMarkDraggable={onMarkDraggable}
      handles={[
        {
          type: 'source',
          position: Position.Right,
          className: 'w-3 h-3 bg-green-500',
        },
      ]}
    >
      <div className="p-4">
        <Textarea
          value={data.text || ''}
          onChange={handleChange}
          className="min-h-[120px] text-sm"
          placeholder="Paste your text here..."
        />
      </div>
    </BaseNode>
  )
}

