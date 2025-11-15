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
    label?: string
  }[]
}

export function BaseNode({
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
  const [hoveredHandleId, setHoveredHandleId] = useState<string | null>(null)
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
        'bg-white rounded-lg border-2 shadow-sm w-[320px] transition-colors relative',
        selected ? 'shadow-md' : isHovered ? 'bg-gray-50' : ''
      )}
      style={{
        borderColor: selected
          ? 'rgb(171, 223, 0)' // Primary color for selected
          : isHovered
            ? 'rgba(171, 223, 0, 0.5)' // Primary color with opacity for hover
            : 'rgb(229, 231, 235)', // gray-200
        transition:
          'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
        overflow: 'visible', // Allow labels to overflow
      }}
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
        const handleColor =
          handle.type === 'target'
            ? '#3b82f6' // Blue for input (left)
            : '#22c55e' // Green for output (right)

        const handleId = handle.id || `${handle.type}-${index}`
        const isHandleHovered = hoveredHandleId === handleId
        const hasLabel = handle.label && handle.label.trim() !== ''

        // Get handle's custom position (if any)
        const handleTop = handle.style?.top
        const handleLeft = handle.style?.left

        // Calculate label position based on handle position
        const getLabelStyle = () => {
          if (handle.position === Position.Right) {
            // Right side - label to the right of handle, 16px away
            return {
              left: 'calc(100% + 16px)',
              top: handleTop || '50%',
              transform: 'translateY(-50%)',
            }
          } else if (handle.position === Position.Left) {
            // Left side - label to the left of handle, 16px away
            return {
              right: 'calc(100% + 16px)',
              top: handleTop || '50%',
              transform: 'translateY(-50%)',
            }
          } else if (handle.position === Position.Top) {
            // Top - label above handle, 16px away
            return {
              bottom: 'calc(100% + 16px)',
              left: handleLeft || '50%',
              transform: 'translateX(-50%)',
            }
          } else {
            // Bottom - label below handle, 16px away
            return {
              top: 'calc(100% + 16px)',
              left: handleLeft || '50%',
              transform: 'translateX(-50%)',
            }
          }
        }

        return (
          <Handle
            key={handleId}
            type={handle.type}
            position={handle.position}
            id={handle.id || handleId}
            className={cn(handle.className || 'w-3 h-3', 'cursor-crosshair')}
            style={{
              ...handle.style,
              backgroundColor: handleColor,
              border: `2px solid ${handleColor}`,
              transform: isHandleHovered ? 'scale(1.5)' : 'scale(1)',
              transition: 'transform 0.2s ease-in-out',
              zIndex: isHandleHovered ? 50 : 10,
              // Increase hit area with padding (invisible but clickable)
              padding: '4px',
              margin: '-4px',
            }}
            onMouseEnter={() => setHoveredHandleId(handleId)}
            onMouseLeave={() => setHoveredHandleId(null)}
          />
        )
      })}
      
      {/* Port Labels - Render separately to avoid interfering with Handle interaction */}
      {handles.map((handle, index) => {
        const handleColor =
          handle.type === 'target'
            ? '#3b82f6' // Blue for input (left)
            : '#22c55e' // Green for output (right)

        const handleId = handle.id || `${handle.type}-${index}`
        const isHandleHovered = hoveredHandleId === handleId
        const hasLabel = handle.label && handle.label.trim() !== ''
        const handleTop = handle.style?.top
        const handleLeft = handle.style?.left

        const getLabelStyle = () => {
          if (handle.position === Position.Right) {
            return {
              left: 'calc(100% + 16px)',
              top: handleTop || '50%',
              transform: 'translateY(-50%)',
            }
          } else if (handle.position === Position.Left) {
            return {
              right: 'calc(100% + 16px)',
              top: handleTop || '50%',
              transform: 'translateY(-50%)',
            }
          } else if (handle.position === Position.Top) {
            return {
              bottom: 'calc(100% + 16px)',
              left: handleLeft || '50%',
              transform: 'translateX(-50%)',
            }
          } else {
            return {
              top: 'calc(100% + 16px)',
              left: handleLeft || '50%',
              transform: 'translateX(-50%)',
            }
          }
        }

        // Show label when hovering the node
        if (!hasLabel || !isHovered) {
          return null
        }

        return (
          <div
            key={`label-${handleId}`}
            className="absolute pointer-events-none"
            style={{
              ...getLabelStyle(),
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <div
              className="px-2 py-1 rounded-md text-xs font-medium text-white whitespace-nowrap pointer-events-none"
              style={{
                backgroundColor: handleColor,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {handle.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
