import { apiService } from '@/services/api'
import { Node, Edge } from 'reactflow'

export interface Workflow {
  id: string
  title: string
  description?: string
  workflow_data: {
    nodes: Node[]
    edges: Edge[]
  }
  created_by: string
  created_at: number
  updated_at: number
}

export interface GetWorkflowsParams {
  page?: number
  limit?: number
  search?: string
  sort_by?: 'title' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

interface GetWorkflowsResponse {
  status: string
  message: string
  data: {
    workflows: Workflow[]
    pagination: {
      current_page: number
      per_page: number
      total: number
      total_pages: number
    }
  }
}

interface GetWorkflowByIdResponse {
  status: string
  message: string
  data: {
    workflow: Workflow
  }
}

interface CreateWorkflowResponse {
  status: string
  message: string
  data: {
    workflow: Workflow
  }
}

interface UpdateWorkflowResponse {
  status: string
  message: string
  data: {
    workflow: Workflow
  }
}

interface DeleteWorkflowResponse {
  status: string
  message: string
  data: null
}

export const getWorkflowsApi = async (
  params?: GetWorkflowsParams
): Promise<GetWorkflowsResponse | null> => {
  try {
    const response = await apiService.get<GetWorkflowsResponse>('/workflow', params)
    return response
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return null
  }
}

export const getWorkflowByIdApi = async (
  id: string
): Promise<GetWorkflowByIdResponse | null> => {
  try {
    const response = await apiService.get<GetWorkflowByIdResponse>(`/workflow/${id}`)
    return response
  } catch (error) {
    console.error(`Error fetching workflow with ID ${id}:`, error)
    return null
  }
}

export const createWorkflowApi = async (
  title: string,
  workflowData: { nodes: Node[]; edges: Edge[] },
  description?: string
): Promise<CreateWorkflowResponse | null> => {
  try {
    const response = await apiService.post<CreateWorkflowResponse>('/workflow', {
      title,
      description,
      workflow_data: workflowData,
    })
    return response
  } catch (error) {
    console.error('Error creating workflow:', error)
    return null
  }
}

export const updateWorkflowApi = async (
  id: string,
  updates: {
    title?: string
    description?: string
    workflow_data?: { nodes: Node[]; edges: Edge[] }
  }
): Promise<UpdateWorkflowResponse | null> => {
  try {
    const response = await apiService.put<UpdateWorkflowResponse>(`/workflow/${id}`, updates)
    return response
  } catch (error) {
    console.error(`Error updating workflow with ID ${id}:`, error)
    return null
  }
}

export const deleteWorkflowApi = async (
  id: string
): Promise<DeleteWorkflowResponse | null> => {
  try {
    const response = await apiService.delete<DeleteWorkflowResponse>(`/workflow/${id}`)
    return response
  } catch (error) {
    console.error(`Error deleting workflow with ID ${id}:`, error)
    return null
  }
}

