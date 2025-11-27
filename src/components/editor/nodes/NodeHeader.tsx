import React from 'react'
import { Play, Copy, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NodeHeaderProps {
  title: string
  icon?: React.ReactNode
  onRun?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  showActions?: boolean
  onMarkDraggable?: (nodeId: string) => void
  nodeId?: string
  onActionBarEnter?: () => void
  onActionBarLeave?: () => void
  canRun?: boolean
  isLoading?: boolean
}

export function NodeHeader({
  title,
  icon,
  onRun,
  onDuplicate,
  onDelete,
  showActions = false,
  onMarkDraggable,
  nodeId,
  onActionBarEnter,
  onActionBarLeave,
  canRun = true,
  isLoading = false,
}: NodeHeaderProps) {
  return (
    <div className="relative">
      {/* Action Bar - Show on hover with 16px spacing from node top */}
      <div
        data-action-bar
        className={cn(
          'absolute -top-14 left-0 right-0 flex items-center justify-center z-[100] transition-opacity duration-200',
          showActions
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        onMouseEnter={() => {
          onActionBarEnter?.()
        }}
        onMouseLeave={() => {
          onActionBarLeave?.()
        }}
      >
        {/* Container with background and shadow */}
        <div className="flex items-center gap-1 bg-gray-200 rounded-lg px-2 py-1.5 shadow-md">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 bg-white border-gray-300 text-gray-900 text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation()
              onRun?.()
            }}
            disabled={!canRun || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Play className="w-3 h-3 mr-1 fill-black" />
            )}
            {isLoading ? 'Running...' : 'Run'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0 bg-white border-gray-300"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate?.()
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0 bg-white border-gray-300"
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.()
            }}
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Node Header - Only this part is draggable */}
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2 border-b border-gray-200',
          'bg-gray-50 hover:bg-gray-100 transition-colors cursor-move rounded-t-md'
        )}
        data-handleid="drag-handle"
        onMouseDown={(e) => {
          // Mark this node as draggable when clicking on header
          if (nodeId && onMarkDraggable) {
            onMarkDraggable(nodeId)
          }
          e.stopPropagation()
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <span className="text-sm font-medium text-gray-900 truncate">
            {title}
          </span>
        </div>
        {/* Run button in header - only shows on hover */}
        {canRun && (
          <div className="w-8 flex-shrink-0 flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                'h-6 w-6 p-1.5 transition-opacity duration-200',
                showActions ? 'opacity-100' : 'opacity-0'
              )}
              onClick={(e) => {
                e.stopPropagation()
                onRun?.()
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" style={{ color: 'rgb(171, 223, 0)' }} />
              ) : (
                <Play className="w-3 h-3" style={{ color: 'rgb(171, 223, 0)' }} />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
