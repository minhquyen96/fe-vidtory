import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play } from 'lucide-react'
import { Node } from 'reactflow'

interface InspectorProps {
  selectedNode: Node | null
  onClose: () => void
  onNodeDataChange: (nodeId: string, data: any) => void
  onRunNode?: (nodeId: string) => void
}

export function Inspector({
  selectedNode,
  onClose,
  onNodeDataChange,
  onRunNode,
}: InspectorProps) {
  if (!selectedNode) {
    return null
  }

  const handleDataChange = (field: string, value: any) => {
    onNodeDataChange(selectedNode.id, {
      ...selectedNode.data,
      [field]: value,
    })
  }

  const getNodeTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      textInput: 'Text / Link Input',
      imageInput: 'Upload Image',
      videoInput: 'Upload Video',
      assistant: 'AI Assistant',
      imageGen: 'Image Generation',
      videoGen: 'Video Generation',
      preview: 'Preview',
    }
    return typeMap[type] || type
  }

  const renderNodeParameters = () => {
    if (!selectedNode.data) return null

    const { data } = selectedNode

    switch (selectedNode.type) {
      case 'textInput':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mode</label>
              <Select
                value={data.mode || 'text'}
                onValueChange={(value) => handleDataChange('mode', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Text Content</label>
              <Textarea
                value={data.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Paste your text here..."
                className="min-h-[120px]"
              />
            </div>
          </>
        )

      case 'imageInput':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Image URL</label>
            <Input
              value={data.imageUrl || ''}
              onChange={(e) => handleDataChange('imageUrl', e.target.value)}
              placeholder="Enter image URL..."
            />
          </div>
        )

      case 'videoInput':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Video URL</label>
            <Input
              value={data.videoUrl || ''}
              onChange={(e) => handleDataChange('videoUrl', e.target.value)}
              placeholder="Enter video URL..."
            />
          </div>
        )

      case 'assistant':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Model</label>
              <Select
                value={data.model || 'gemini-1'}
                onValueChange={(value) => handleDataChange('model', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1">Gemini 1</SelectItem>
                  <SelectItem value="gemini-2">Gemini 2</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prompt</label>
              <Textarea
                value={data.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Enter assistant prompt..."
                className="min-h-[120px]"
              />
            </div>
          </>
        )

      case 'imageGen':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Model</label>
              <Select
                value={data.model || 'gemini-1'}
                onValueChange={(value) => handleDataChange('model', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1">Gemini 1</SelectItem>
                  <SelectItem value="gemini-2">Gemini 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Aspect Ratio</label>
                <Select
                  value={data.aspectRatio || '4:3'}
                  onValueChange={(value) => handleDataChange('aspectRatio', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="1:1">1:1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Resolution</label>
                <Select
                  value={data.resolution || '2k'}
                  onValueChange={(value) => handleDataChange('resolution', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2k">2K</SelectItem>
                    <SelectItem value="4k">4K</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )

      case 'videoGen':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Model</label>
              <Select
                value={data.model || 'veo-3'}
                onValueChange={(value) => handleDataChange('model', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veo-3">Veo 3</SelectItem>
                  <SelectItem value="veo-2">Veo 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Aspect Ratio</label>
                <Select
                  value={data.aspectRatio || '16:9'}
                  onValueChange={(value) => handleDataChange('aspectRatio', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="1:1">1:1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Duration</label>
                <Select
                  value={data.duration || '5s'}
                  onValueChange={(value) => handleDataChange('duration', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5s">5s</SelectItem>
                    <SelectItem value="10s">10s</SelectItem>
                    <SelectItem value="15s">15s</SelectItem>
                    <SelectItem value="30s">30s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      <Card className="h-full rounded-none border-0 shadow-none">
        <CardHeader className="pb-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Inspector</CardTitle>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Node Type */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Node Type</label>
            <div className="px-3 py-2 bg-gray-100 rounded-md">
              <span className="text-sm font-medium text-gray-900">
                {selectedNode.type || 'unknown'}
              </span>
            </div>
          </div>

          {/* Node Name */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Node Name</label>
            <Input
              value={selectedNode.data?.label || getNodeTypeLabel(selectedNode.type || '')}
              onChange={(e) => handleDataChange('label', e.target.value)}
              placeholder={getNodeTypeLabel(selectedNode.type || '')}
              className="h-9"
            />
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Parameters</h3>
            {renderNodeParameters()}
          </div>
        </CardContent>
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={() => onRunNode?.(selectedNode.id)}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            Run This Node
          </Button>
        </div>
      </Card>
    </div>
  )
}

