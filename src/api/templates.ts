import { apiService } from '@/services/api'

export interface Template {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  translations: {
    [languageCode: string]: {
      title: string
      description: string
    }
  }
  workflow: string // JSON string
  status: 'pending' | 'approved' | 'rejected'
  created_by: string
  approved_by?: string
  created_at: number
  approved_at?: number
  preview_image?: string
  preview_video?: string
  rejection_reason?: string
}

export interface TemplatesListResponse {
  status: string
  message: string
  data: {
    templates: Template[]
    pagination: {
      current_page: number
      per_page: number
      total: number
      total_pages: number
    }
  }
}

export interface TemplateDetailResponse {
  status: string
  message: string
  data: {
    template: Template
  }
}

export interface TemplatesListParams {
  page?: number
  limit?: number
  status?: 'pending' | 'approved' | 'rejected'
  category?: string
  tags?: string
  search?: string
  created_by?: string
  sort_by?: 'title' | 'category' | 'status' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

/**
 * Lấy danh sách templates
 */
export const getTemplatesApi = async (
  params?: TemplatesListParams
): Promise<TemplatesListResponse | null> => {
  try {
    const response = await apiService.get<TemplatesListResponse>(
      '/templates',
      params
    )
    return response
  } catch (error) {
    console.error('Error fetching templates:', error)
    return null
  }
}

/**
 * Lấy chi tiết template
 */
export const getTemplateByIdApi = async (
  id: string
): Promise<TemplateDetailResponse | null> => {
  try {
    const response = await apiService.get<TemplateDetailResponse>(
      `/templates/${id}`
    )
    return response
  } catch (error) {
    console.error('Error fetching template:', error)
    return null
  }
}

