import { AppMode, InputUnion } from '@/types/gemini-banana-pro'
import { apiService } from './api'

interface GenerateResponse {
  status: 'success' | 'error'
  message: string
  data?: {
    imageUrl: string
    remainingCredit: number
    historyId: string
  }
  error?: string
}

interface HistoryItem {
  id: string
  user_id: string
  mode: 'comic' | 'advertising' | 'infographic'
  inputs: any
  lang?: 'vi' | 'en'
  aspectRatio?: string
  image_url: string
  credit_used: number
  created_at: number
}

interface HistoryResponse {
  status: 'success' | 'error'
  message: string
  data?: {
    histories: HistoryItem[]
    pagination?: {
      current_page: number
      per_page: number
      total: number
      total_pages: number
    }
  }
}

interface SingleHistoryResponse {
  status: 'success' | 'error'
  message: string
  data?: {
    history: HistoryItem
  }
}

// Helper to convert File to Base64
const fileToBase64 = async (
  file: File
): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1]
      resolve({
        data: base64Data,
        mimeType: file.type,
      })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Convert AppMode enum to API mode string
const modeToApiMode = (
  mode: AppMode
): 'comic' | 'advertising' | 'infographic' => {
  switch (mode) {
    case AppMode.COMIC:
      return 'comic'
    case AppMode.ADVERTISING:
      return 'advertising'
    case AppMode.INFOGRAPHIC:
      return 'infographic'
    default:
      return 'comic'
  }
}

// Convert API mode string to AppMode enum
const apiModeToAppMode = (mode: string): AppMode => {
  switch (mode) {
    case 'comic':
      return AppMode.COMIC
    case 'advertising':
      return AppMode.ADVERTISING
    case 'infographic':
      return AppMode.INFOGRAPHIC
    default:
      return AppMode.COMIC
  }
}

/**
 * Generate creative content using Gemini API
 * @param mode - App mode (COMIC, ADVERTISING, INFOGRAPHIC)
 * @param inputs - Input data for generation
 * @param lang - Language code ('vi' or 'en')
 * @returns Image URL from GCS
 */
export const generateCreativeContent = async (
  mode: AppMode,
  inputs: InputUnion,
  lang?: 'vi' | 'en'
): Promise<{
  imageUrl: string
  remainingCredit: number
  historyId: string
}> => {
  try {
    // Prepare reference images as base64
    const referenceImages: Array<{ data: string; mimeType: string }> = []
    if (inputs.referenceImages && inputs.referenceImages.length > 0) {
      for (const file of inputs.referenceImages) {
        const imageData = await fileToBase64(file)
        referenceImages.push(imageData)
      }
    }

    // Create inputs object with referenceImages included (not File objects)
    const inputsToSend = {
      ...inputs,
      referenceImages: referenceImages, // Replace File[] with base64 array
    }

    // Call backend API endpoint
    const result = await apiService.post<GenerateResponse>('/gemini/generate', {
      mode: modeToApiMode(mode),
      inputs: inputsToSend, // Send inputs with referenceImages inside
      lang: lang || 'en', // Pass language to backend
    })

    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to generate image')
    }

    if (result.data?.imageUrl && result.data?.historyId) {
      return {
        imageUrl: result.data.imageUrl,
        remainingCredit: result.data.remainingCredit,
        historyId: result.data.historyId,
      }
    }

    throw new Error('No image generated in response.')
  } catch (error: any) {
    console.error('Gemini API Error:', error)

    // Handle axios errors
    if (error.response?.data) {
      const errorData = error.response.data as GenerateResponse

      // Handle insufficient credit error (402)
      if (error.response?.status === 402) {
        const errorMessage =
          errorData.message ||
          'Insufficient credit. Please purchase more credits to continue.'
        const customError = new Error(errorMessage)
        ;(customError as any).isInsufficientCredit = true
        throw customError
      }

      throw new Error(errorData.message || 'Failed to generate image')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while generating image.')
  }
}

/**
 * Get generation history from backend API
 * @param params - Query parameters for pagination and filtering
 * @returns History items with pagination info
 */
export const getGenerationHistory = async (params?: {
  page?: number
  limit?: number
  mode?: AppMode
  sort_by?: 'mode' | 'created_at'
  sort_order?: 'asc' | 'desc'
}): Promise<{ histories: HistoryItem[]; pagination?: any }> => {
  try {
    const queryParams: any = {}

    if (params?.page) queryParams.page = params.page
    if (params?.limit) queryParams.limit = params.limit
    if (params?.mode) queryParams.mode = modeToApiMode(params.mode)
    if (params?.sort_by) queryParams.sort_by = params.sort_by
    if (params?.sort_order) queryParams.sort_order = params.sort_order

    const result = await apiService.get<HistoryResponse>(
      '/gemini/history',
      queryParams
    )

    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to fetch history')
    }

    if (result.data?.histories) {
      return {
        histories: result.data.histories,
        pagination: result.data.pagination,
      }
    }

    return { histories: [] }
  } catch (error: any) {
    console.error('Get History Error:', error)

    if (error.response?.data) {
      const errorData = error.response.data as HistoryResponse
      throw new Error(errorData.message || 'Failed to fetch history')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while fetching history.')
  }
}

/**
 * Get single history item by ID
 * @param id - History item ID
 * @returns History item
 */
export const getHistoryById = async (id: string): Promise<HistoryItem> => {
  try {
    const result = await apiService.get<SingleHistoryResponse>(
      `/gemini/history/${id}`
    )

    if (result.status === 'error') {
      throw new Error(result.message || 'History not found')
    }

    if (result.data?.history) {
      return result.data.history
    }

    throw new Error('History not found')
  } catch (error: any) {
    console.error('Get History By ID Error:', error)

    if (error.response?.data) {
      const errorData = error.response.data as SingleHistoryResponse
      throw new Error(errorData.message || 'History not found')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while fetching history.')
  }
}

/**
 * Delete a history item by ID
 * @param id - History item ID
 */
export const deleteHistory = async (id: string): Promise<void> => {
  try {
    const result = await apiService.delete<{
      status: 'success' | 'error'
      message: string
    }>(`/gemini/history/${id}`)

    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to delete history')
    }
  } catch (error: any) {
    console.error('Delete History Error:', error)

    if (error.response?.data) {
      const errorData = error.response.data as {
        status: string
        message: string
      }
      throw new Error(errorData.message || 'Failed to delete history')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while deleting history.')
  }
}

// Export helper functions for type conversion
export { modeToApiMode, apiModeToAppMode }
export type { HistoryItem }
