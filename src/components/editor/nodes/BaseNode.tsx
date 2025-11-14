import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Handle, Position } from 'reactflow'
import { cn } from '@/lib/utils'
import { NodeHeader } from './NodeHeader'

interface BaseNodeProps {
  id: string
  selected: boolean
  title: string
  icon?: React.ReactNode
  onRun?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onMarkDraggable?: (nodeId: string) => void
  children: React.ReactNode
  handles?: {
    type: 'source' | 'target'
    position: Position
    id?: string
    className?: string
    style?: React.CSSProperties
  }[]
}

export const BaseNode = React.memo(
  function BaseNode({
    id,
    selected,
    title,
    icon,
    onRun,
    onDuplicate,
    onDelete,
    onMarkDraggable,
    children,
    handles = [],
  }: BaseNodeProps) {
    const [isHovered, setIsHovered] = useState(false)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = useCallback(() => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      setIsHovered(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false)
      }, 200) // 200ms delay to allow moving cursor to hover menu
    }, [])

    const handleActionBarEnter = useCallback(() => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      setIsHovered(true)
    }, [])

    const handleActionBarLeave = useCallback(() => {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false)
      }, 200)
    }, [])

    useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
      }
    }, [])

  return (
    <div
      className={cn(
        'bg-white rounded-lg border-2 shadow-sm w-[320px] transition-colors',
        selected
          ? 'border-blue-600 shadow-md'
          : isHovered
            ? 'border-blue-300 bg-gray-50'
            : 'border-gray-200'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
        {/* Header - Only this part is draggable */}
        <NodeHeader
          title={title}
          icon={icon}
          showActions={isHovered}
          onRun={() => onRun?.(id)}
          onDuplicate={() => onDuplicate?.(id)}
          onDelete={() => onDelete?.(id)}
          onMarkDraggable={onMarkDraggable}
          nodeId={id}
          onActionBarEnter={handleActionBarEnter}
          onActionBarLeave={handleActionBarLeave}
        />

      {/* Content - Not draggable, cursor default */}
      <div
        className="nodrag [&_*:not(input):not(textarea):not(button)]:cursor-default"
        style={{ cursor: 'default' }}
      >
        {children}
      </div>

      {/* Handles */}
      {handles.map((handle, index) => {
        // Determine color based on type
        const handleColor = handle.type === 'target' 
          ? '#3b82f6' // Blue for input (left)
          : '#22c55e' // Green for output (right)
        
        return (
          <Handle
            key={handle.id || index}
            type={handle.type}
            position={handle.position}
            id={handle.id}
            className={handle.className || 'w-3 h-3'}
            style={{
              ...handle.style,
              backgroundColor: handleColor,
              border: `2px solid ${handleColor}`,
            }}
          />
        )
      })}
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison function - return true if props are equal (skip re-render)
    return (
      prevProps.id === nextProps.id &&
      prevProps.selected === nextProps.selected &&
      prevProps.title === nextProps.title &&
      // Don't compare icon, children - they're always new JSX objects
      // Don't compare callbacks - they use refs internally
      JSON.stringify(prevProps.handles) === JSON.stringify(nextProps.handles)
    )
  }
)
