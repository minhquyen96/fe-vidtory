import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
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
import { getWorkflowByIdApi, updateWorkflowApi, createWorkflowApi } from '@/api/workflows'
import {
  TextInputNodeData,
  ImageInputNodeData,
  VideoInputNodeData,
  AssistantNodeData,
  ImageGenNodeData,
  VideoGenNodeData,
  PreviewNodeData,
} from '@/components/editor/nodes'
import {
  runImageGenerationNodeWorkflow,
  runAssistantNode,
  runVideoGenerationNode,
} from '@/services/workflowService'
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  // Ref to store latest nodes for accessing in callbacks
  const nodesRef = useRef<Node[]>([])
  
  // Update ref whenever nodes change
  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])
  const [isLocked, setIsLocked] = useState(false)
  const [workflowTitle, setWorkflowTitle] = useState('Untitled Workflow')
  const [workflowId, setWorkflowId] = useState<string | null>(null)

  // Undo/Redo history
  const [history, setHistory] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([
    { nodes: [], edges: [] },
  ])
  const [historyIndex, setHistoryIndex] = useState(0)
  const historyIndexRef = React.useRef(0)
  const lastSavedStateRef = React.useRef<{ nodes: Node[]; edges: Edge[] } | null>(null)
  const lastLoadedTemplateIdRef = React.useRef<string | null>(null)
  const lastLoadedWorkflowIdRef = React.useRef<string | null>(null)

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
      // Upload Image -> AI Assistant (output -> input)
      {
        id: generateEdgeId(sampleNodes[0].id, sampleNodes[2].id, 'output', 'input'),
        source: sampleNodes[0].id,
        target: sampleNodes[2].id,
        sourceHandle: 'output',
        targetHandle: 'input',
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
      // Brand Guide -> AI Assistant (output -> input)
      {
        id: generateEdgeId(sampleNodes[1].id, sampleNodes[2].id, 'output', 'input'),
        source: sampleNodes[1].id,
        target: sampleNodes[2].id,
        sourceHandle: 'output',
        targetHandle: 'input',
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
      // AI Assistant -> Image Generation (output -> input)
      {
        id: generateEdgeId(sampleNodes[2].id, sampleNodes[3].id, 'output', 'input'),
        source: sampleNodes[2].id,
        target: sampleNodes[3].id,
        sourceHandle: 'output',
        targetHandle: 'input',
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

  const handleSave = useCallback(async () => {
    try {
      const workflowData = {
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

      if (workflowId) {
        // Update existing workflow
        const response = await updateWorkflowApi(workflowId, {
          title: workflowTitle,
          workflow_data: workflowData,
        })

        if (response?.data?.workflow) {
          toast({
            title: 'Success',
            description: 'Workflow saved successfully!',
            variant: 'success',
          })
        } else {
          throw new Error('Failed to update workflow')
        }
      } else {
        // Create new workflow
        const response = await createWorkflowApi(
          workflowTitle,
          workflowData
        )

        if (response?.data?.workflow) {
          const newWorkflowId = response.data.workflow.id
          setWorkflowId(newWorkflowId)
          // Update URL to include workflow ID
          router.replace(`/editor/${newWorkflowId}`, undefined, { shallow: true })
          toast({
            title: 'Success',
            description: 'Workflow saved successfully!',
            variant: 'success',
          })
        } else {
          throw new Error('Failed to create workflow')
        }
      }
    } catch (error: any) {
      console.error('Error saving workflow:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to save workflow. Please try again.',
        variant: 'destructive',
      })
    }
  }, [nodes, edges, workflowId, workflowTitle, router])

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

  // Load template, workflow, or import from localStorage
  useEffect(() => {
    const loadData = async () => {
      const workflowId = router.query.id as string
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

      // Handle workflow loading by ID
      if (workflowId && router.isReady) {
        // Prevent loading the same workflow multiple times
        if (lastLoadedWorkflowIdRef.current === workflowId) {
          return
        }

        try {
          lastLoadedWorkflowIdRef.current = workflowId
          const response = await getWorkflowByIdApi(workflowId)
          
          if (response?.data?.workflow) {
            const workflow = response.data.workflow
            
            // Set workflow ID and title
            setWorkflowId(workflow.id)
            setWorkflowTitle(workflow.title)
            
            // Apply workflow data
            applyWorkflowData(workflow.workflow_data)
          } else {
            console.error('Workflow not found')
            alert('Workflow not found')
            lastLoadedWorkflowIdRef.current = null
            router.push('/editor')
          }
        } catch (error) {
          console.error('Error loading workflow:', error)
          alert('Failed to load workflow. Please try again.')
          lastLoadedWorkflowIdRef.current = null
          router.push('/editor')
        }
        return
      }

      // Handle template loading
      if (templateId && router.isReady) {
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
        return
      }

      // Reset refs if no ID
      if (!workflowId && !templateId) {
        lastLoadedWorkflowIdRef.current = null
        lastLoadedTemplateIdRef.current = null
      }
    }

    if (router.isReady) {
      loadData()
    }
  }, [router.isReady, router.query.id, router.query.template, router.query.import, applyWorkflowData, router])

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

  // Helper function to check if a node type can be run (has input port)
  const canNodeRun = useCallback((nodeType: string): boolean => {
    return ['assistant', 'imageGen', 'videoGen'].includes(nodeType)
  }, [])

  // Helper function to get output data from a source node
  // For runnable nodes: get output from API response
  // For input nodes: get input values
  const getNodeOutput = useCallback((sourceNode: Node): any => {
    if (canNodeRun(sourceNode.type || '')) {
      // Node can run - get output from API response
      if (sourceNode.type === 'assistant') {
        const data = sourceNode.data as AssistantNodeData
        return { type: 'text', value: data.text || data.brief || '' }
      } else if (sourceNode.type === 'imageGen') {
        const data = sourceNode.data as ImageGenNodeData
        return { type: 'image', value: data.imageUrl || '' }
      } else if (sourceNode.type === 'videoGen') {
        const data = sourceNode.data as VideoGenNodeData
        return { type: 'video', value: data.downloadUrl || data.videoUrl || '' }
      }
    } else {
      // Node cannot run - get input values
      if (sourceNode.type === 'textInput') {
        const data = sourceNode.data as TextInputNodeData
        if (data.isDataInput) {
          return { type: 'data', value: data.fields || {} }
        } else {
          return { type: 'text', value: data.text || '' }
        }
      } else if (sourceNode.type === 'imageInput') {
        const data = sourceNode.data as ImageInputNodeData
        return { type: 'image', value: data.imageUrl || '' }
      } else if (sourceNode.type === 'videoInput') {
        const data = sourceNode.data as VideoInputNodeData
        return { type: 'video', value: data.videoUrl || '' }
      }
    }
    return null
  }, [canNodeRun])

  // Helper: Set node loading state
  const setNodeLoading = useCallback((nodeId: string, isLoading: boolean) => {
    setNodes((nds) => {
      const updated = nds.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              isLoading,
            },
          }
        }
        return n
      })
      // Update ref immediately
      nodesRef.current = updated
      return updated
    })
  }, [])

  // Helper: Update node data
  const updateNodeData = useCallback((nodeId: string, data: Partial<any>) => {
    setNodes((nds) => {
      const updated = nds.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              ...data,
              isLoading: false,
            },
          }
        }
        return n
      })
      // Update ref immediately so next node can access latest state
      nodesRef.current = updated
      return updated
    })
  }, [])

  // Helper: Collect inputs from connected nodes
  const collectNodeInputs = useCallback(async (
    nodeId: string,
    inputTypes: { [key: string]: any }
  ): Promise<any> => {
    const inputEdges = edges.filter((e) => e.target === nodeId)
    const inputs: any = {}

    // Ensure we have the latest nodes state
    // Use a small delay to ensure state updates from previous nodes are applied
    await new Promise((resolve) => setTimeout(resolve, 50))

    for (const edge of inputEdges) {
      const sourceNode = nodesRef.current.find((n: Node) => n.id === edge.source)
      if (!sourceNode) {
        console.warn(`Source node not found for edge: ${edge.source} -> ${edge.target}`)
        continue
      }

      const output = getNodeOutput(sourceNode)
      if (!output) {
        console.warn(`No output from source node: ${edge.source} (type: ${sourceNode.type})`)
        continue
      }

      console.log(`Collecting input from node ${edge.source} (${sourceNode.type}):`, {
        outputType: output.type,
        hasValue: !!output.value,
        valuePreview: typeof output.value === 'string' ? output.value.substring(0, 50) : output.value,
      })

      // Map output to input types
      if (output.type === 'text' && inputTypes.prompt !== undefined) {
        inputs.prompt = output.value
      } else if (output.type === 'data') {
        if (inputTypes.context !== undefined) {
          inputs.context = JSON.stringify(output.value)
        } else if (inputTypes.styleBrand !== undefined) {
          inputs.styleBrand = output.value
        }
      } else if (output.type === 'image') {
        if (inputTypes.reference !== undefined && output.value) {
          // Convert image URL to File for imageGen
          try {
            const response = await fetch(output.value)
            const blob = await response.blob()
            inputs.reference = new File([blob], 'image.jpg', { type: blob.type })
          } catch (error) {
            console.error('Error converting image to file:', error)
            inputs.reference = output.value
          }
        } else if (inputTypes.images !== undefined && output.value) {
          // Add to images array for assistant
          if (!inputs.images) inputs.images = []
          inputs.images.push(output.value)
        } else if (inputTypes.referenceImages !== undefined && output.value) {
          // Convert to File for videoGen
          try {
            const response = await fetch(output.value)
            const blob = await response.blob()
            const file = new File([blob], 'image.jpg', { type: blob.type })
            if (!inputs.referenceImages) inputs.referenceImages = []
            inputs.referenceImages.push(file)
          } catch (error) {
            console.error('Error converting image to file:', error)
          }
        }
      }
    }

    return inputs
  }, [edges, getNodeOutput])

  // Run Image Generation Node
  const runImageGenNode = useCallback(async (
    nodeId: string,
    nodeData: ImageGenNodeData
  ) => {
    const inputs = await collectNodeInputs(nodeId, {
      prompt: true,
      styleBrand: true,
      reference: true,
    })

    const result = await runImageGenerationNodeWorkflow({
      nodeId,
      nodeData,
      inputs,
    })

    // Update node data and ensure ref is updated immediately
    updateNodeData(nodeId, { imageUrl: result.imageUrl })
    
    // Small delay to ensure state is propagated
    await new Promise((resolve) => setTimeout(resolve, 100))
    toast({
      title: 'Success',
      description: 'Image generated successfully!',
      variant: 'success',
    })
  }, [collectNodeInputs, updateNodeData, toast])

  // Run Assistant Node
  const runAssistantNodeHandler = useCallback(async (
    nodeId: string,
    nodeData: AssistantNodeData
  ) => {
    const inputs = await collectNodeInputs(nodeId, {
      prompt: true,
      context: true,
      images: true,
    })

    // Use node's own data if no inputs from connected nodes
    // Priority: systemInstruction > preset > brief > text
    if (!inputs.prompt) {
      if (nodeData.systemInstruction) {
        inputs.prompt = nodeData.systemInstruction
      } else if (nodeData.preset) {
        inputs.prompt = nodeData.preset
      } else {
        inputs.prompt = nodeData.brief || nodeData.text || ''
      }
    }

    const result = await runAssistantNode({
      nodeId,
      nodeData,
      inputs,
    })

    updateNodeData(nodeId, { text: result.response })
    toast({
      title: 'Success',
      description: 'AI Assistant response generated successfully!',
      variant: 'success',
    })
  }, [collectNodeInputs, updateNodeData, toast, runAssistantNode])

  // Run Video Generation Node
  const runVideoGenNode = useCallback(async (
    nodeId: string,
    nodeData: VideoGenNodeData
  ) => {
    const inputs = await collectNodeInputs(nodeId, {
      prompt: true,
      styleBrand: true,
      referenceImages: true,
    })

    const result = await runVideoGenerationNode({
      nodeId,
      nodeData,
      inputs,
      workflowId: workflowId || undefined,
    })

    // Update node data and ensure ref is updated immediately
    updateNodeData(nodeId, {
      jobId: result.jobId,
      statusUrl: result.statusUrl,
      downloadUrl: result.downloadUrl,
      pollIntervalMs: result.pollIntervalMs,
    })
    
    // Small delay to ensure state is propagated
    await new Promise((resolve) => setTimeout(resolve, 100))

    toast({
      title: 'Success',
      description: 'Video generation job created! Check status to download when ready.',
      variant: 'success',
    })
  }, [collectNodeInputs, updateNodeData, toast, workflowId])

  const handleNodeRun = useCallback(
    async (nodeId: string) => {
      try {
        const node = nodes.find((n) => n.id === nodeId)
        if (!node) {
          console.error('Node not found:', nodeId)
          return
        }

        setNodeLoading(nodeId, true)

        // Handle different node types
        if (node.type === 'imageGen') {
          await runImageGenNode(nodeId, node.data as ImageGenNodeData)
        } else if (node.type === 'assistant') {
          await runAssistantNodeHandler(nodeId, node.data as AssistantNodeData)
        } else if (node.type === 'videoGen') {
          await runVideoGenNode(nodeId, node.data as VideoGenNodeData)
        } else {
          toast({
            title: 'Info',
            description: `Run node not implemented for type: ${node.type}`,
            variant: 'default',
          })
        }
      } catch (error: any) {
        console.error('Error running node:', error)
        setNodeLoading(nodeId, false)

        // Handle insufficient credit error
        if (error.isInsufficientCredit) {
          toast({
            title: 'Insufficient Credit',
            description: error.message || 'Please purchase more credits to continue.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Error',
            description: error.message || 'Failed to run node. Please try again.',
            variant: 'destructive',
          })
        }
      }
    },
    [nodes, setNodeLoading, runImageGenNode, runAssistantNodeHandler, runVideoGenNode, toast]
  )

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
