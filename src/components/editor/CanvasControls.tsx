import React, { useState } from 'react'
import { useReactFlow } from 'reactflow'
import { Undo2, Redo2, ZoomOut, ZoomIn, Maximize2, MaximizeIcon, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CanvasControlsProps {
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  onToggleLock?: (locked: boolean) => void
  isLocked?: boolean
}

export function CanvasControls({
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onToggleLock,
  isLocked = false,
}: CanvasControlsProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  const handleZoomIn = () => {
    zoomIn()
  }

  const handleZoomOut = () => {
    zoomOut()
  }

  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 300 })
  }

  const handleToggleLock = () => {
    onToggleLock?.(!isLocked)
  }

  return (
    <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
      {/* Undo/Redo Group */}
      <div className="bg-white rounded-full border border-gray-200 shadow-sm flex items-center overflow-hidden">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            'p-2 transition-colors',
            canUndo
              ? 'text-gray-700 hover:bg-gray-50 cursor-pointer'
              : 'text-gray-300 cursor-not-allowed'
          )}
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-200" />
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            'p-2 transition-colors',
            canRedo
              ? 'text-gray-700 hover:bg-gray-50 cursor-pointer'
              : 'text-gray-300 cursor-not-allowed'
          )}
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom/Fit Group */}
      <div className="bg-white rounded-full border border-gray-200 shadow-sm flex items-center overflow-hidden">
        <button
          onClick={handleZoomOut}
          className="p-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-200" />
        <button
          onClick={handleZoomIn}
          className="p-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-200" />
        <button
          onClick={handleFitView}
          className="p-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          title="Fit to Screen"
        >
          <MaximizeIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-200" />
        <button
          onClick={handleToggleLock}
          className={cn(
            'p-2 transition-colors cursor-pointer',
            isLocked
              ? 'text-gray-700 hover:bg-gray-50'
              : 'text-gray-700 hover:bg-gray-50'
          )}
          title={isLocked ? 'Unlock Canvas' : 'Lock Canvas'}
        >
          {isLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Unlock className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}

