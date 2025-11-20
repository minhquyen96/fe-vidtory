import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
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
import { getTemplateByIdApi } from '@/api/templates'
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

const generateEdgeId = (
  source: string,
  target: string,
  sourceHandle?: string | null,
  targetHandle?: string | null
): string => {
  const handlePart =
    sourceHandle && targetHandle ? `-${sourceHandle}-${targetHandle}` : ''
  return `edge-${source}-${target}${handlePart}-${nanoid()}`
}

export default function EditorPage() {
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [workflowTitle, setWorkflowTitle] = useState('Untitled Workflow')

  // Undo/Redo history
  const [history, setHistory] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([
    { nodes: [], edges: [] },
  ])
  const [historyIndex, setHistoryIndex] = useState(0)
  const historyIndexRef = React.useRef(0)
  const lastSavedStateRef = React.useRef<{ nodes: Node[]; edges: Edge[] } | null>(null)
  const lastLoadedTemplateIdRef = React.useRef<string | null>(null)

  const nodeIdCounter = React.useRef(0)

  // Update ref when state changes
  React.useEffect(() => {
    historyIndexRef.current = historyIndex
  }, [historyIndex])

  // Save state to history (only if different from last saved state)
  const saveToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    // Deep compare with last saved state to avoid duplicates
    const lastSaved = lastSavedStateRef.current
    if (lastSaved) {
      const nodesEqual = JSON.stringify(lastSaved.nodes) === JSON.stringify(newNodes)
      const edgesEqual = JSON.stringify(lastSaved.edges) === JSON.stringify(newEdges)
      if (nodesEqual && edgesEqual) {
        // No change, skip saving
        return
      }
    }

    // Save new state
    const stateToSave = {
      nodes: JSON.parse(JSON.stringify(newNodes)),
      edges: JSON.parse(JSON.stringify(newEdges))
    }
    lastSavedStateRef.current = stateToSave

    setHistory((prev) => {
      const currentIndex = historyIndexRef.current
      const newHistory = prev.slice(0, currentIndex + 1)
      newHistory.push(stateToSave)
      const finalHistory = newHistory.slice(-50) // Keep last 50 states
      const newIndex = Math.min(currentIndex + 1, finalHistory.length - 1)
      // Update ref immediately
      historyIndexRef.current = newIndex
      // Update state
      setHistoryIndex(newIndex)
      return finalHistory
    })
  }, [])

  // Undo handler
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      const restoredNodes = JSON.parse(JSON.stringify(prevState.nodes))
      const restoredEdges = JSON.parse(JSON.stringify(prevState.edges))
      setNodes(restoredNodes)
      setEdges(restoredEdges)
      setHistoryIndex((prev) => prev - 1)
      // Update last saved state ref
      lastSavedStateRef.current = { nodes: restoredNodes, edges: restoredEdges }
    }
  }, [history, historyIndex])

  // Redo handler
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      const restoredNodes = JSON.parse(JSON.stringify(nextState.nodes))
      const restoredEdges = JSON.parse(JSON.stringify(nextState.edges))
      setNodes(restoredNodes)
      setEdges(restoredEdges)
      setHistoryIndex((prev) => prev + 1)
      // Update last saved state ref
      lastSavedStateRef.current = { nodes: restoredNodes, edges: restoredEdges }
    }
  }, [history, historyIndex])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

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
        return { text: '', mode: 'text' } as TextInputNodeData
      case 'data-input':
        return { 
          text: '', 
          mode: 'text',
          isDataInput: true,
          fields: [] 
        } as TextInputNodeData & { isDataInput: boolean; fields: any[] }
      case 'upload-image':
        return { imageUrl: undefined } as ImageInputNodeData
      case 'upload-video':
        return { videoUrl: undefined } as VideoInputNodeData
      case 'assistant':
        return {
          text: '',
          model: 'gemini-1',
          preset: 'image-prompt',
          systemInstruction: 'You are a creative AI assistant helping to generate visual content.',
          brief: '',
        } as AssistantNodeData
      case 'image-gen':
        return {
          upscale: true,
          scale: '2x',
          resolution: '2k',
          model: 'flux-pro',
          aspectRatio: '1:1',
          variants: 1,
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

      setNodes((nds) => {
        const newNodes = [...nds, newNode]
        // Use functional update to get latest edges
        setEdges((eds) => {
          saveToHistory(newNodes, eds)
          return eds
        })
        return newNodes
      })
    },
    [nodes.length, saveToHistory]
  )

  const handleNodesChange = useCallback((changes: any) => {
    // Use ReactFlow's built-in helper to apply changes efficiently
    setNodes((nds) => {
      // Apply changes using ReactFlow helper (more efficient)
      const updatedNodes = applyNodeChanges(changes, nds)

      // Check if any position changes occurred (for drag operations)
      const hasPositionChange = changes.some((change: any) => change.type === 'position')

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
    setEdges((eds) => {
      const newEdges = [...eds, newEdge]
      // Use functional update to get latest nodes
      setNodes((nds) => {
        saveToHistory(nds, newEdges)
        return nds
      })
      return newEdges
    })
  }, [saveToHistory])

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
    const emptyNodes: Node[] = []
    const emptyEdges: Edge[] = []
    setNodes(emptyNodes)
    setEdges(emptyEdges)
    setSelectedNode(null)
    saveToHistory(emptyNodes, emptyEdges)
  }, [saveToHistory])

  const handleLoadExample = useCallback(() => {
    const primaryColor = 'rgb(171, 223, 0)'
    
    // Create sample nodes
    const sampleNodes: Node[] = [
      // Upload Image (top left)
      {
        id: generateNodeId(),
        type: 'imageInput',
        position: { x: 100, y: 100 },
        data: {
          label: 'Upload Image',
        },
      },
      // Brand Guide / Data Input (bottom left)
      {
        id: generateNodeId(),
        type: 'textInput',
        position: { x: 100, y: 400 },
        data: {
          label: 'Brand Guide',
          isDataInput: true,
          fields: [
            {
              id: nanoid(),
              label: 'Brand Name',
              type: 'text',
              defaultValue: '',
            },
            {
              id: nanoid(),
              label: 'Primary Color',
              type: 'color',
              defaultValue: '#2A66F4',
            },
          ],
        },
      },
      // AI Assistant (middle)
      {
        id: generateNodeId(),
        type: 'assistant',
        position: { x: 500, y: 200 },
        data: {
          label: 'AI Assistant',
          preset: 'image-prompt',
          systemInstruction: 'You are a creative AI assistant helping to generate visual content.',
          brief: '',
        },
      },
      // Image Generation (right)
      {
        id: generateNodeId(),
        type: 'imageGen',
        position: { x: 900, y: 200 },
        data: {
          label: 'Image Generation',
          model: 'flux-pro',
          aspectRatio: '1:1',
          variants: 1,
        },
      },
    ]

    // Create sample edges
    const sampleEdges: Edge[] = [
      // Upload Image -> AI Assistant (image port -> context port)
      {
        id: generateEdgeId(sampleNodes[0].id, sampleNodes[2].id, 'image', 'context'),
        source: sampleNodes[0].id,
        target: sampleNodes[2].id,
        sourceHandle: 'image',
        targetHandle: 'context',
        type: 'smoothstep',
        style: {
          stroke: primaryColor,
          strokeWidth: 2,
          strokeDasharray: '5 5',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: primaryColor,
        },
      },
      // Brand Guide -> AI Assistant (data port -> context port)
      {
        id: generateEdgeId(sampleNodes[1].id, sampleNodes[2].id, 'data', 'context'),
        source: sampleNodes[1].id,
        target: sampleNodes[2].id,
        sourceHandle: 'data',
        targetHandle: 'context',
        type: 'smoothstep',
        style: {
          stroke: primaryColor,
          strokeWidth: 2,
          strokeDasharray: '5 5',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: primaryColor,
        },
      },
      // AI Assistant -> Image Generation (prompt -> prompt)
      {
        id: generateEdgeId(sampleNodes[2].id, sampleNodes[3].id, 'prompt', 'prompt'),
        source: sampleNodes[2].id,
        target: sampleNodes[3].id,
        sourceHandle: 'prompt',
        targetHandle: 'prompt',
        type: 'smoothstep',
        style: {
          stroke: primaryColor,
          strokeWidth: 2,
          strokeDasharray: '5 5',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: primaryColor,
        },
      },
      // AI Assistant -> Image Generation (storyboard -> styleBrand)
      {
        id: generateEdgeId(sampleNodes[2].id, sampleNodes[3].id, 'storyboard', 'styleBrand'),
        source: sampleNodes[2].id,
        target: sampleNodes[3].id,
        sourceHandle: 'storyboard',
        targetHandle: 'styleBrand',
        type: 'smoothstep',
        style: {
          stroke: primaryColor,
          strokeWidth: 2,
          strokeDasharray: '5 5',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: primaryColor,
        },
      },
      // AI Assistant -> Image Generation (script -> reference)
      {
        id: generateEdgeId(sampleNodes[2].id, sampleNodes[3].id, 'script', 'reference'),
        source: sampleNodes[2].id,
        target: sampleNodes[3].id,
        sourceHandle: 'script',
        targetHandle: 'reference',
        type: 'smoothstep',
        style: {
          stroke: primaryColor,
          strokeWidth: 2,
          strokeDasharray: '5 5',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: primaryColor,
        },
      },
    ]

    // Load sample workflow
    setNodes(sampleNodes)
    setEdges(sampleEdges)
    setSelectedNode(null)
    saveToHistory(sampleNodes, sampleEdges)
  }, [saveToHistory])

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

  // Helper function to apply workflow data to canvas
  const applyWorkflowData = useCallback((workflowData: any) => {
    try {
      // Validate workflow data structure
      if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
        throw new Error('Invalid workflow format: missing nodes array')
      }
      if (!workflowData.edges || !Array.isArray(workflowData.edges)) {
        throw new Error('Invalid workflow format: missing edges array')
      }

      // Restore nodes
      const restoredNodes: Node[] = workflowData.nodes.map(
        (node: any) => ({
          id: node.id || generateNodeId(),
          type: node.type || 'textInput',
          position: node.position || { x: 0, y: 0 },
          data: node.data || {},
        })
      )

      // Restore edges - keep original IDs if they exist, otherwise generate new ones
      const restoredEdges: Edge[] = workflowData.edges.map(
        (edge: any) => {
          const primaryColor = 'rgb(171, 223, 0)'
          return {
            id:
              edge.id ||
              generateEdgeId(
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
        }
      )

      // Update state
      setNodes(restoredNodes)
      setEdges(restoredEdges)
      setSelectedNode(null)
      saveToHistory(restoredNodes, restoredEdges)

      // Update nodeIdCounter based on number of restored nodes
      nodeIdCounter.current = Math.max(
        nodeIdCounter.current,
        restoredNodes.length
      )
    } catch (error) {
      console.error('Error applying workflow data:', error)
      throw error
    }
  }, [saveToHistory])

  // Load template from API or import from localStorage
  useEffect(() => {
    const loadTemplate = async () => {
      const templateId = router.query.template as string
      const shouldImport = router.query.import === 'true'
      
      // Handle import from localStorage
      if (shouldImport && router.isReady) {
        try {
          const pendingWorkflow = localStorage.getItem('pending_import_workflow')
          if (pendingWorkflow) {
            const workflowData = JSON.parse(pendingWorkflow)
            applyWorkflowData(workflowData)
            // Clear localStorage
            localStorage.removeItem('pending_import_workflow')
            // Remove import query param from URL
            router.replace('/editor', undefined, { shallow: true })
          }
        } catch (error) {
          console.error('Error loading imported workflow:', error)
          alert('Failed to load imported workflow. Please check the file format.')
          localStorage.removeItem('pending_import_workflow')
          router.replace('/editor', undefined, { shallow: true })
        }
        return
      }

      // Handle template loading
      if (!templateId) {
        lastLoadedTemplateIdRef.current = null
        return
      }

      // Prevent loading the same template multiple times
      if (lastLoadedTemplateIdRef.current === templateId) {
        return
      }

      try {
        lastLoadedTemplateIdRef.current = templateId
        const response = await getTemplateByIdApi(templateId)
        
        if (response?.data?.template) {
          const template = response.data.template
          
          // Set workflow title
          setWorkflowTitle(template.title)
          
          // Parse and apply workflow
          const workflowData = JSON.parse(template.workflow)
          applyWorkflowData(workflowData)
          
          // Remove template query param from URL
          router.replace('/editor', undefined, { shallow: true })
        } else {
          console.error('Template not found')
          alert('Template not found')
          lastLoadedTemplateIdRef.current = null
        }
      } catch (error) {
        console.error('Error loading template:', error)
        alert('Failed to load template. Please try again.')
        lastLoadedTemplateIdRef.current = null
      }
    }

    if (router.isReady) {
      loadTemplate()
    }
  }, [router.isReady, router.query.template, router.query.import, applyWorkflowData, router])

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
            applyWorkflowData(workflowData)
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
  }, [applyWorkflowData])

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
        const newNodes = [...nds, newNode]
        // Use functional update to get latest edges
        setEdges((eds) => {
          saveToHistory(newNodes, eds)
          return eds
        })
        return newNodes
      }
      return nds
    })
  }, [saveToHistory])

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const newNodes = nds.filter((n) => n.id !== nodeId)
      setEdges((eds) => {
        const newEdges = eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
        saveToHistory(newNodes, newEdges)
        setSelectedNode((prev) => (prev?.id === nodeId ? null : prev))
        return newEdges
      })
      return newNodes
    })
  }, [saveToHistory])

  // Handle node drag stop - save to history when user finishes moving a node
  const handleNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    // Get current state and save to history
    setNodes((nds) => {
      setEdges((eds) => {
        saveToHistory(nds, eds)
        return eds
      })
      return nds
    })
  }, [saveToHistory])

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
          workflowTitle={workflowTitle}
          onTitleChange={setWorkflowTitle}
          onLoadExample={handleLoadExample}
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
          {/* Main Canvas Area */}
          <div className="flex-1 relative">
            {/* Floating Node Palette */}
            <NodePalette onAddNode={handleAddNode} />
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
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
              isLocked={isLocked}
              onToggleLock={setIsLocked}
              onNodeDragStop={handleNodeDragStop}
            />

            {/* Welcome Card - Show when canvas is empty */}
            {nodes.length === 0 && (
              <WelcomeCard
                onLoadExample={handleLoadExample}
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
