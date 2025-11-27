import React from 'react'
import { Position, NodeProps } from 'reactflow'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { FileText, Database } from 'lucide-react'
import { BaseNode } from './BaseNode'

export interface TextInputNodeData {
  text: string
  label?: string
  mode?: string
  isDataInput?: boolean
  fields?: Array<{
    id: string
    label: string
    type: string
    defaultValue: string
  }>
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

  const handleFieldValueChange = (fieldId: string, value: string) => {
    if (!data.fields) return
    
    const updatedFields = data.fields.map((field) =>
      field.id === fieldId ? { ...field, defaultValue: value } : field
    )
    
    if (onDataChange) {
      onDataChange(id, { fields: updatedFields })
    }
  }

  // Check if this is a data-input node
  const isDataInput = data.isDataInput
  const fields = data.fields || []

  // Define handles - only output port
  const getHandles = () => {
    return [
      {
        type: 'source' as const,
        position: Position.Right,
        id: 'output',
        className: 'w-3 h-3 bg-green-500',
        style: { top: '50%' },
        label: 'Output',
      },
    ]
  }

  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || (isDataInput ? 'Data Input' : 'Text / Link Input')}
      icon={isDataInput ? <Database className="w-4 h-4 text-gray-600" /> : <FileText className="w-4 h-4 text-gray-600" />}
      onRun={onRun}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onMarkDraggable={onMarkDraggable}
      handles={getHandles()}
    >
      <div className="p-4">
        {isDataInput ? (
          // Data Input: Show dynamic fields
          <div className="space-y-3">
            {fields.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                No fields defined. Configure fields in the Inspector panel.
              </div>
            ) : (
              fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    {field.label || 'Unnamed Field'}
                  </label>
                  <Input
                    type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'color' ? 'color' : 'text'}
                    value={field.defaultValue || ''}
                    onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                    placeholder={field.type === 'color' ? '#000000' : `Enter ${field.label.toLowerCase()}...`}
                    className="h-9 text-sm"
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          // Regular Text / Link Input
          <Textarea
            value={data.text || ''}
            onChange={handleChange}
            className="min-h-[120px] text-sm"
            placeholder="Paste your text here..."
          />
        )}
      </div>
    </BaseNode>
  )
}

