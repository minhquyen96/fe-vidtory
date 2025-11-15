import React, { useState, useCallback, useMemo } from 'react'
import { nanoid } from 'nanoid'
import { Layout } from '@/components/layout/Layout'
import { WorkflowHeader } from '@/components/editor/WorkflowHeader'
import { NodePalette, NodePaletteType } from '@/components/editor/NodePalette'
import { WorkflowCanvas } from '@/components/editor/WorkflowCanvas'
import { Inspector } from '@/components/editor/Inspector'
import { WelcomeCard } from '@/components/editor/WelcomeCard'
import {
  Node,
  Edge,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow'
import {
  TextInputNodeData,
  ImageInputNodeData,
  VideoInputNodeData,
  AssistantNodeData,
  ImageGenNodeData,
  VideoGenNodeData,
  PreviewNodeData,
} from '@/components/editor/nodes'

// Helper function to generate unique IDs using nanoid
const generateNodeId = (): string => {
  return `node-${nanoid()}`
}

const generateEdgeId = (source: string, target: string, sourceHandle?: string | null, targetHandle?: string | null): string => {
  const handlePart = sourceHandle && targetHandle ? `-${sourceHandle}-${targetHandle}` : ''
  return `edge-${source}-${target}${handlePart}-${nanoid()}`
}

export default function EditorPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const nodeIdCounter = React.useRef(0)

  const getNodeType = (paletteType: NodePaletteType): string => {
    const typeMap: Record<NodePaletteType, string> = {
      'upload-image': 'imageInput',
      'upload-video': 'videoInput',
      'text-link': 'textInput',
      'data-input': 'textInput',
      assistant: 'assistant',
      'image-gen': 'imageGen',
      'video-gen': 'videoGen',
    }
    return typeMap[paletteType] || 'textInput'
  }

  const getDefaultData = (paletteType: NodePaletteType): any => {
    switch (paletteType) {
      case 'text-link':
      case 'data-input':
        return { text: '', mode: 'text' } as TextInputNodeData
      case 'upload-image':
        return { imageUrl: undefined } as ImageInputNodeData
      case 'upload-video':
        return { videoUrl: undefined } as VideoInputNodeData
      case 'assistant':
        return {
          text: '',
          model: 'gemini-1',
        } as AssistantNodeData
      case 'image-gen':
        return {
          upscale: true,
          scale: '2x',
          resolution: '2k',
          model: 'gemini-1',
          aspectRatio: '4:3',
        } as ImageGenNodeData
      case 'video-gen':
        return {
          upscale: true,
          scale: '2x',
          resolution: '1080p',
          model: 'veo-3',
          aspectRatio: '16:9',
          duration: '5s',
        } as VideoGenNodeData
      default:
        return {}
    }
  }

  const getNodeLabel = (paletteType: NodePaletteType): string => {
    const labelMap: Record<NodePaletteType, string> = {
      'upload-image': 'Upload Image',
      'upload-video': 'Upload Video',
      'text-link': 'Text / Link Input',
      'data-input': 'Data Input',
      assistant: 'AI Assistant',
      'image-gen': 'Image Generation',
      'video-gen': 'Video Generation',
    }
    return labelMap[paletteType] || 'Node'
  }

  const handleAddNode = useCallback(
    (type: NodePaletteType) => {
      nodeIdCounter.current += 1
      const newNodeId = generateNodeId()
      const nodeType = getNodeType(type)
      const defaultData = getDefaultData(type)
      const label = getNodeLabel(type)

      // Calculate position - spread nodes horizontally
      const x = nodes.length * 350 + 100
      const y = Math.floor(nodes.length / 3) * 300 + 100

      const newNode: Node = {
        id: newNodeId,
        type: nodeType,
        position: { x, y },
        data: {
          ...defaultData,
          label,
        },
      }

      setNodes((nds) => [...nds, newNode])
    },
    [nodes.length]
  )

  const handleNodesChange = useCallback((changes: any) => {
    // Use ReactFlow's built-in helper to apply changes efficiently
    setNodes((nds) => {
      // Apply changes using ReactFlow helper (more efficient)
      const updatedNodes = applyNodeChanges(changes, nds)

      // Handle selection and removal side effects
      changes.forEach((change: any) => {
        if (change.type === 'select') {
          if (change.id === '') {
            // Pane click - deselect all
            setSelectedNode(null)
          } else if (change.selected) {
            // Node selected
            const node = updatedNodes.find((n: Node) => n.id === change.id)
            if (node) {
              setSelectedNode(node)
            }
          } else {
            // Node deselected
            setSelectedNode(null)
          }
        } else if (change.type === 'remove') {
          // Remove connected edges
          setEdges((eds) =>
            eds.filter((e) => e.source !== change.id && e.target !== change.id)
          )
          // Clear selection if removed node was selected
          setSelectedNode((prev) => (prev?.id === change.id ? null : prev))
        }
      })

      return updatedNodes
    })
  }, [])

  const handleEdgesChange = useCallback((changes: any) => {
    // Use ReactFlow's built-in helper to apply changes efficiently
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  const handleConnect = useCallback((connection: Connection) => {
    const primaryColor = 'rgb(171, 223, 0)' // Primary color from globals.css
    const newEdge: Edge = {
      id: generateEdgeId(
        connection.source!,
        connection.target!,
        connection.sourceHandle,
        connection.targetHandle
      ),
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'smoothstep',
      style: {
        stroke: primaryColor,
        strokeWidth: 2,
        strokeDasharray: '5 5', // Dashed line
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: primaryColor,
      },
    }
    setEdges((eds) => [...eds, newEdge])
  }, [])

  const handleNodeDataChange = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } }
        }
        return node
      })
    )
    // Update selected node separately to avoid dependency
    setSelectedNode((prev) => {
      if (prev?.id === nodeId) {
        return { ...prev, data: { ...prev.data, ...newData } }
      }
      return prev
    })
  }, [])

  const handleClear = useCallback(() => {
    setNodes([])
    setEdges([])
    setSelectedNode(null)
  }, [])

  const handleSave = useCallback(() => {
    try {
      const workflowData = {
        version: '1.0.0',
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type,
          style: edge.style,
          markerEnd: edge.markerEnd,
        })),
      }

      const jsonString = JSON.stringify(workflowData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `workflow-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error saving workflow:', error)
      alert('Failed to save workflow. Please try again.')
    }
  }, [nodes, edges])

  const handleLoad = useCallback(() => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const jsonString = event.target?.result as string
            const workflowData = JSON.parse(jsonString)

            // Validate workflow data structure
            if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
              throw new Error('Invalid workflow format: missing nodes array')
            }
            if (!workflowData.edges || !Array.isArray(workflowData.edges)) {
              throw new Error('Invalid workflow format: missing edges array')
            }

            // Restore nodes
            const restoredNodes: Node[] = workflowData.nodes.map((node: any) => ({
              id: node.id,
              type: node.type || 'textInput',
              position: node.position || { x: 0, y: 0 },
              data: node.data || {},
            }))

            // Restore edges - keep original IDs if they exist, otherwise generate new ones
            const restoredEdges: Edge[] = workflowData.edges.map((edge: any) => {
              const primaryColor = 'rgb(171, 223, 0)'
              return {
                id: edge.id || generateEdgeId(
                  edge.source,
                  edge.target,
                  edge.sourceHandle,
                  edge.targetHandle
                ),
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
                type: edge.type || 'smoothstep',
                style: edge.style || {
                  stroke: primaryColor,
                  strokeWidth: 2,
                  strokeDasharray: '5 5',
                },
                markerEnd: edge.markerEnd || {
                  type: MarkerType.ArrowClosed,
                  color: primaryColor,
                },
              }
            })

            // Update state
            setNodes(restoredNodes)
            setEdges(restoredEdges)
            setSelectedNode(null)

            // Update nodeIdCounter based on number of restored nodes
            // Since we're using nanoid now, we just need to ensure counter is higher than node count
            nodeIdCounter.current = Math.max(nodeIdCounter.current, restoredNodes.length)
          } catch (error) {
            console.error('Error loading workflow:', error)
            alert('Failed to load workflow. Please check the file format.')
          }
        }
        reader.readAsText(file)
      }
      input.click()
    } catch (error) {
      console.error('Error opening file dialog:', error)
      alert('Failed to open file dialog. Please try again.')
    }
  }, [])

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const handleNodeRun = useCallback((nodeId: string) => {
    console.log('Run node', nodeId)
    // TODO: Implement run node
  }, [])

  const handleNodeDuplicate = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const nodeToDuplicate = nds.find((n) => n.id === nodeId)
      if (nodeToDuplicate) {
        nodeIdCounter.current += 1
        const newNodeId = generateNodeId()
        const newNode: Node = {
          ...nodeToDuplicate,
          id: newNodeId,
          position: {
            x: nodeToDuplicate.position.x + 50,
            y: nodeToDuplicate.position.y + 50,
          },
          selected: false,
        }
        return [...nds, newNode]
      }
      return nds
    })
  }, [])

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) =>
      eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
    )
    setSelectedNode((prev) => (prev?.id === nodeId ? null : prev))
  }, [])

  return (
    <Layout
      showHeader={false}
      showFooter={false}
      className="h-screen overflow-hidden"
      noIndex
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <WorkflowHeader
          onLoadExample={() => {
            // TODO: Implement load example
            console.log('Load example')
          }}
          onClear={handleClear}
          onLoad={handleLoad}
          onSave={handleSave}
          onRunWorkflow={() => {
            // TODO: Implement run workflow
            console.log('Run workflow')
          }}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Node Palette */}
          <NodePalette onAddNode={handleAddNode} />

          {/* Main Canvas Area */}
          <div className="flex-1 relative">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onConnect={handleConnect}
              onNodeDataChange={handleNodeDataChange}
              onNodeClick={handleNodeClick}
              onNodeRun={handleNodeRun}
              onNodeDuplicate={handleNodeDuplicate}
              onNodeDelete={handleNodeDelete}
            />

            {/* Welcome Card - Show when canvas is empty */}
            {nodes.length === 0 && (
              <WelcomeCard
                onLoadExample={() => {
                  // TODO: Implement load example functionality
                  console.log('Load example clicked')
                }}
              />
            )}
          </div>

          {/* Right Sidebar - Inspector */}
          {selectedNode && (
            <Inspector
              selectedNode={selectedNode}
              onClose={() => setSelectedNode(null)}
              onNodeDataChange={handleNodeDataChange}
              onRunNode={(nodeId) => {
                // TODO: Implement run node
                console.log('Run node', nodeId)
              }}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}
