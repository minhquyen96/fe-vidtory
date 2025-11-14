import React from 'react'
import { Position, NodeProps } from 'reactflow'
import { Upload, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BaseNode } from './BaseNode'

export interface VideoInputNodeData {
  videoUrl?: string
  fileName?: string
  label?: string
}

interface VideoInputNodeProps extends NodeProps<VideoInputNodeData> {
  onDataChange?: (nodeId: string, data: Partial<VideoInputNodeData>) => void
  onRun?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onMarkDraggable?: (nodeId: string) => void
}

export function VideoInputNode({
  data,
  selected,
  id,
  onDataChange,
  onRun,
  onDuplicate,
  onDelete,
  onMarkDraggable,
}: VideoInputNodeProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      // Create local URL for preview
      const videoUrl = URL.createObjectURL(file)
      onDataChange?.(id, { videoUrl, fileName: file.name })
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Upload Video'}
      icon={<Video className="w-4 h-4 text-gray-600" />}
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
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden border-2 border-dashed border-gray-300">
          {data.videoUrl ? (
            <>
              <video
                src={data.videoUrl}
                className="w-full h-full object-contain"
                controls
              />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
                <Button variant="outline" size="sm" onClick={handleUploadClick} className="bg-white shadow-md">
                  <Upload className="w-3 h-3 mr-1" />
                  Change
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <Button variant="outline" size="sm" onClick={handleUploadClick}>
                  Upload
                </Button>
              </div>
            </div>
          )}
        </div>
        {data.videoUrl && data.fileName && (
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <span className="mr-1">✓</span>
            {data.fileName}
          </div>
        )}
      </div>
    </BaseNode>
  )
}

