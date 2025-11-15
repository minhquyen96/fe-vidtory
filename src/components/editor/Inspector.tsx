import React from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play } from 'lucide-react'
import { Node } from 'reactflow'
import { nanoid } from 'nanoid'

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

  const getNodeTypeLabel = (type: string, data?: any): string => {
    // Check if this is a data-input node
    if (type === 'textInput' && data?.isDataInput) {
      return 'Data Input'
    }
    const typeMap: Record<string, string> = {
      textInput: 'Text / Link Input',
      imageInput: 'upload-image',
      videoInput: 'upload-video',
      assistant: 'AI Assistant',
      imageGen: 'Image Generation',
      videoGen: 'Video Generation',
      preview: 'Preview',
    }
    return typeMap[type] || type
  }

  const getNodeTypeDisplay = (type: string, data?: any): string => {
    // Check if this is a data-input node
    if (type === 'textInput' && data?.isDataInput) {
      return 'brand-guide'
    }
    const typeMap: Record<string, string> = {
      textInput: 'paste-link',
      imageInput: 'upload-image',
      videoInput: 'upload-video',
      assistant: 'assistant',
      imageGen: 'image-gen',
      videoGen: 'video-gen',
      preview: 'preview',
    }
    return typeMap[type] || type
  }

  const renderNodeParameters = () => {
    if (!selectedNode.data) return null

    const { data } = selectedNode

    switch (selectedNode.type) {
      case 'textInput':
        // Check if this is a data-input node
        if (data.isDataInput) {
          // Data Input with dynamic fields
          const fields = data.fields || []
          
          const handleAddField = () => {
            const newFields = [
              ...fields,
              {
                id: nanoid(),
                label: '',
                type: 'text',
                defaultValue: '',
              },
            ]
            handleDataChange('fields', newFields)
          }

          const handleRemoveField = (fieldId: string) => {
            const newFields = fields.filter((f: any) => f.id !== fieldId)
            handleDataChange('fields', newFields)
          }

          const handleFieldChange = (fieldId: string, field: string, value: any) => {
            const newFields = fields.map((f: any) =>
              f.id === fieldId ? { ...f, [field]: value } : f
            )
            handleDataChange('fields', newFields)
          }

          return (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-xs text-blue-800">
                  Define custom fields here. Users will see and fill these fields on the canvas node.
                </p>
              </div>
              {fields.map((field: any) => (
                <div
                  key={field.id}
                  className="border border-gray-200 rounded-md p-4 space-y-3 mb-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Field Configuration
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveField(field.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Field Label</label>
                    <Input
                      value={field.label || ''}
                      onChange={(e) =>
                        handleFieldChange(field.id, 'label', e.target.value)
                      }
                      placeholder="Brand Name"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Field Type</label>
                    <Select
                      value={field.type || 'text'}
                      onValueChange={(value) =>
                        handleFieldChange(field.id, 'type', value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="color">Color</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Default Value</label>
                    <Input
                      value={field.defaultValue || ''}
                      onChange={(e) =>
                        handleFieldChange(field.id, 'defaultValue', e.target.value)
                      }
                      placeholder="Default value..."
                      className="h-9"
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddField}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </>
          )
        }
        
        // Regular Text / Link Input
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
            <label className="text-sm font-medium text-gray-700">File Name</label>
            <Input
              value={data.fileName || ''}
              onChange={(e) => handleDataChange('fileName', e.target.value)}
              placeholder="image.jpg"
              className="h-9"
            />
          </div>
        )

      case 'videoInput':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">File Name</label>
            <Input
              value={data.fileName || ''}
              onChange={(e) => handleDataChange('fileName', e.target.value)}
              placeholder="video.mp4"
              className="h-9"
            />
          </div>
        )

      case 'assistant':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Preset</label>
              <Select
                value={data.preset || 'image-prompt'}
                onValueChange={(value) => handleDataChange('preset', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image-prompt">Image Prompt</SelectItem>
                  <SelectItem value="video-prompt">Video Prompt</SelectItem>
                  <SelectItem value="text-prompt">Text Prompt</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">System Instruction</label>
              <Textarea
                value={data.systemInstruction || ''}
                onChange={(e) => handleDataChange('systemInstruction', e.target.value)}
                placeholder="You are a creative AI assistant helping to generate visual content."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Brief</label>
              <Textarea
                value={data.brief || ''}
                onChange={(e) => handleDataChange('brief', e.target.value)}
                placeholder="Describe what you want to create..."
                className="min-h-[100px]"
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
                value={data.model || 'flux-pro'}
                onValueChange={(value) => handleDataChange('model', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flux-pro">Flux Pro</SelectItem>
                  <SelectItem value="flux-dev">Flux Dev</SelectItem>
                  <SelectItem value="dalle-3">DALL-E 3</SelectItem>
                  <SelectItem value="midjourney">Midjourney</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Aspect Ratio</label>
              <Select
                value={data.aspectRatio || '1:1'}
                onValueChange={(value) => handleDataChange('aspectRatio', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Variants</label>
              <Input
                type="number"
                value={data.variants || 1}
                onChange={(e) => handleDataChange('variants', parseInt(e.target.value) || 1)}
                min={1}
                max={10}
                className="h-9"
              />
            </div>
          </>
        )

      case 'videoGen':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Duration (seconds)</label>
              <Input
                type="number"
                value={
                  data.duration
                    ? typeof data.duration === 'string'
                      ? parseInt(data.duration.replace('s', '')) || 5
                      : data.duration
                    : 5
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 5
                  handleDataChange('duration', `${value}s`)
                }}
                min={1}
                max={60}
                className="h-9"
              />
            </div>
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
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      <Card className="h-full rounded-none border-0 shadow-none flex flex-col">
        <CardHeader className="pb-3 border-b border-gray-200 flex-shrink-0">
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
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {/* Node Type */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Node Type</label>
            <div className="px-3 py-2 bg-gray-100 rounded-md">
              <span className="text-sm font-medium text-gray-900">
                {getNodeTypeDisplay(selectedNode.type || '', selectedNode.data)}
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
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
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

