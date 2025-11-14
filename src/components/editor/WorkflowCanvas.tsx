'use client'

import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'

import {
  TextInputNode,
  ImageInputNode,
  VideoInputNode,
  AssistantNode,
  ImageGenNode,
  VideoGenNode,
  PreviewNode,
} from './nodes'
import { CustomEdge } from './CustomEdge'

// Define node types outside component to avoid recreation
const nodeTypes = {
  textInput: TextInputNode,
  imageInput: ImageInputNode,
  videoInput: VideoInputNode,
  assistant: AssistantNode,
  imageGen: ImageGenNode,
  videoGen: VideoGenNode,
  preview: PreviewNode,
}

interface WorkflowCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange?: (changes: any) => void
  onEdgesChange?: (changes: any) => void
  onConnect?: (connection: Connection) => void
  onNodeDataChange?: (nodeId: string, data: any) => void
  onNodeClick?: (event: React.MouseEvent, node: Node) => void
  onNodeRun?: (nodeId: string) => void
  onNodeDuplicate?: (nodeId: string) => void
  onNodeDelete?: (nodeId: string) => void
}

export function WorkflowCanvas({
  nodes: externalNodes,
  edges: externalEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDataChange,
  onNodeClick,
  onNodeRun,
  onNodeDuplicate,
  onNodeDelete,
}: WorkflowCanvasProps) {
  // Store callbacks in refs to avoid recreating nodeTypes
  const callbacksRef = useRef({
    onNodeDataChange,
    onNodeRun,
    onNodeDuplicate,
    onNodeDelete,
    markNodeDraggable: (nodeId: string) => {}, // Will be set in useEffect
  })

  // Update refs when callbacks change
  useEffect(() => {
    callbacksRef.current = {
      onNodeDataChange,
      onNodeRun,
      onNodeDuplicate,
      onNodeDelete,
      markNodeDraggable: callbacksRef.current.markNodeDraggable, // Keep existing
    }
  }, [onNodeDataChange, onNodeRun, onNodeDuplicate, onNodeDelete])

  // Define edge types
  const edgeTypes = useMemo(
    () => ({
      default: CustomEdge,
      smoothstep: CustomEdge,
    }),
    []
  )

  // Create wrapper node types that use refs - memoized stable components
  const nodeTypesWithCallbacks = useMemo(() => {
    // Create wrapper components that pass callbacks from refs
    const createWrapper = (Component: any) => {
      // Use React.memo with custom comparison to avoid re-renders
      return React.memo(
        (props: any) => {
          return (
            <Component
              {...props}
              onDataChange={callbacksRef.current.onNodeDataChange}
              onRun={callbacksRef.current.onNodeRun}
              onDuplicate={callbacksRef.current.onNodeDuplicate}
              onDelete={callbacksRef.current.onNodeDelete}
              onMarkDraggable={callbacksRef.current.markNodeDraggable}
            />
          )
        },
        (prevProps, nextProps) => {
          // Custom comparison - only re-render if these props change
          // Note: Return TRUE to SKIP re-render, FALSE to re-render
          return (
            prevProps.id === nextProps.id &&
            prevProps.selected === nextProps.selected &&
            // Use shallow comparison for data to allow controlled inputs
            JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
            prevProps.dragging === nextProps.dragging &&
            prevProps.xPos === nextProps.xPos &&
            prevProps.yPos === nextProps.yPos
          )
        }
      )
    }

    return {
      textInput: createWrapper(TextInputNode),
      imageInput: createWrapper(ImageInputNode),
      videoInput: createWrapper(VideoInputNode),
      assistant: createWrapper(AssistantNode),
      imageGen: createWrapper(ImageGenNode),
      videoGen: createWrapper(VideoGenNode),
      preview: createWrapper(PreviewNode),
    }
  }, []) // Empty deps - create only once

  // Use controlled mode - React Flow will use external nodes/edges directly
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange?.(changes)
    },
    [onNodesChange]
  )

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange?.(changes)
    },
    [onEdgesChange]
  )

  const handleConnect = useCallback(
    (params: Connection) => {
      onConnect?.(params)
    },
    [onConnect]
  )

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeClick?.(event, node)
    },
    [onNodeClick]
  )

  const handlePaneClick = useCallback(() => {
    // Deselect all nodes when clicking on canvas
    onNodesChange?.([
      {
        type: 'select',
        id: '',
        selected: false,
      },
    ])
  }, [onNodesChange])

  // Track which node can be dragged (only if clicked on header)
  const draggableNodeIdRef = useRef<string | null>(null)

  // Callback to mark node as draggable (called from header onMouseDown)
  const markNodeDraggable = useCallback((nodeId: string) => {
    draggableNodeIdRef.current = nodeId
  }, [])

  const onNodeDragStart = useCallback((event: React.MouseEvent, node: Node) => {
    // Only allow drag if we previously set this node as draggable (clicked on header)
    if (draggableNodeIdRef.current !== node.id) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }, [])

  const onNodeDragStop = useCallback(() => {
    draggableNodeIdRef.current = null
  }, [])

  // Update callbacks ref to include markNodeDraggable
  useEffect(() => {
    callbacksRef.current = {
      ...callbacksRef.current,
      markNodeDraggable,
    }
  }, [markNodeDraggable])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={externalNodes}
        edges={externalEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        nodesDraggable={true}
        nodeTypes={nodeTypesWithCallbacks}
        edgeTypes={edgeTypes}
        nodeDragThreshold={1}
        edgesUpdatable={true}
        edgesFocusable={true}
        fitView
        className="bg-gray-50"
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.selected) {
              return '#2563eb' // Blue for selected
            }
            return '#e5e7eb' // Gray for normal
          }}
          maskColor="rgba(0, 0, 0, 0.05)"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

