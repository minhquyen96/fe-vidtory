import React, { useState } from 'react'
import { Position, NodeProps } from 'reactflow'
import { Sparkles, Maximize2 } from 'lucide-react'
import { BaseNode } from './BaseNode'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface AssistantNodeData {
  text: string
  model: string
  systemPrompt?: string
  label?: string
  preset?: string
  systemInstruction?: string
  brief?: string
  isLoading?: boolean
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const MAX_PREVIEW_LINES = 5
  const previewText = data.text || ''
  const lines = previewText.split('\n')
  const shouldTruncate = lines.length > MAX_PREVIEW_LINES
  const previewLines = shouldTruncate ? lines.slice(0, MAX_PREVIEW_LINES) : lines
  const previewContent = shouldTruncate ? previewLines.join('\n') + '...' : previewText

  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'AI Assistant'}
      icon={<Sparkles className="w-4 h-4 text-gray-600" />}
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
              <p className="text-sm text-gray-500">Processing...</p>
            </div>
          </div>
        ) : data.text ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-700">Response:</p>
              {shouldTruncate && (
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
              )}
            </div>
            <div className="bg-gray-50 rounded-md p-3 border border-gray-200 max-h-[200px] overflow-hidden">
              <p className="text-sm text-gray-900 whitespace-pre-wrap line-clamp-5">
                {previewContent}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-3">Configure in Inspector →</p>
        )}
      </div>

      {/* Full Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Assistant Response</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200 mt-4">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{data.text}</p>
          </div>
        </DialogContent>
      </Dialog>
    </BaseNode>
  )
}

