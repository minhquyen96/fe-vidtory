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

  // Determine edge color and style based on state
  const edgeColor = selected ? '#2563eb' : isHovered ? '#3b82f6' : '#6366f1'
  const strokeWidth = selected ? 4 : isHovered ? 3 : 2
  const strokeDasharray = selected ? 'none' : isHovered ? '8 4' : '5 5'

  return (
    <>
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
        markerEnd={
          markerEnd
            ? typeof markerEnd === 'string'
              ? `url(#${markerEnd})`
              : `url(#react-flow__arrowclosed)`
            : undefined
        }
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

