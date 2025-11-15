import React from 'react'
import { EdgeProps, getSmoothStepPath, useReactFlow } from 'reactflow'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const { deleteElements } = useReactFlow()
  const [isHovered, setIsHovered] = React.useState(false)

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const handleDelete = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      deleteElements({ edges: [{ id }] })
    },
    [id, deleteElements]
  )

  // Determine edge color and style based on state - using primary color
  const primaryColor = 'rgb(171, 223, 0)' // Primary color from globals.css
  const edgeColor = selected 
    ? primaryColor 
    : isHovered 
      ? `rgba(171, 223, 0, 0.7)` 
      : `rgba(171, 223, 0, 1)`
  const strokeWidth = selected ? 4 : isHovered ? 4.5 : 3.5
  const strokeDasharray = selected ? 'none' : isHovered ? '8 4' : '5 5'

  // Always show arrow at the end - use default ReactFlow arrow marker
  // ReactFlow automatically creates arrow markers, we just need to reference them
  const arrowMarkerId = 'react-flow__arrowclosed'

  return (
    <>
      {/* Define custom arrow marker with dynamic color */}
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          markerUnits="strokeWidth"
          orient="auto"
          refX="0"
          refY="0"
        >
          <polyline
            points="-5,-5 0,0 -5,5"
            fill="none"
            stroke={edgeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      <path
        id={id}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth,
          strokeDasharray,
          fill: 'none',
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#arrow-${id})`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {/* Invisible wider hit area for easier clicking */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {/* Delete button - only show when selected */}
      {selected && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <foreignObject x={-12} y={-12} width={24} height={24}>
            <Button
              size="sm"
              variant="destructive"
              className="h-6 w-6 p-0 rounded-full"
              onClick={handleDelete}
            >
              <X className="w-3 h-3" />
            </Button>
          </foreignObject>
        </g>
      )}
    </>
  )
}

