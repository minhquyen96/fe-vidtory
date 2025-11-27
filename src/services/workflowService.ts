import { apiService } from './api'
import { ImageGenNodeData } from '@/components/editor/nodes/ImageGenNode'
import { AssistantNodeData } from '@/components/editor/nodes/AssistantNode'
import { VideoGenNodeData } from '@/components/editor/nodes/VideoGenNode'

interface RunImageGenerationResponse {
  status: 'success' | 'error'
  message: string
  data?: {
    imageUrl: string
    remainingCredit: number
    nodeId: string
  }
  error?: string
}

interface RunImageGenerationRequest {
  nodeId: string
  nodeData: ImageGenNodeData
  inputs: {
    prompt?: string
    styleBrand?: any
    reference?: string | File
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

// Helper to convert image URL to Base64 (supports blob URLs, data URLs, and regular URLs)
const urlToBase64 = async (
  url: string
): Promise<{ data: string; mimeType: string }> => {
  try {
    // Handle data URLs (already base64)
    if (url.startsWith('data:')) {
      const matches = url.match(/^data:([^;]+);base64,(.+)$/)
      if (matches) {
        return {
          data: matches[2],
          mimeType: matches[1],
        }
      }
    }
    
    // Handle blob URLs and regular URLs
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    
    const blob = await response.blob()
    // Use blob type or default to jpeg if type is not detected
    const mimeType = blob.type || 'image/jpeg'
    
    const file = new File([blob], 'image.jpg', { type: mimeType })
    return await fileToBase64(file)
  } catch (error) {
    console.error('Error converting URL to base64:', url, error)
    throw new Error(`Failed to convert image URL to base64: ${error}`)
  }
}

/**
 * Run image generation node
 * @param request - Request data including nodeId, nodeData, and inputs
 * @returns Generated image URL and remaining credit
 */
export const runImageGenerationNode = async (
  request: RunImageGenerationRequest
): Promise<{
  imageUrl: string
  remainingCredit: number
  nodeId: string
}> => {
  try {
    // Prepare reference image if provided
    let referenceImage: { data: string; mimeType: string } | undefined
    if (request.inputs.reference) {
      if (request.inputs.reference instanceof File) {
        referenceImage = await fileToBase64(request.inputs.reference)
      } else if (typeof request.inputs.reference === 'string') {
        // If it's a URL, we might need to fetch it first or send as-is
        // For now, assume it's already a base64 string or URL
        // Backend should handle URL conversion
      }
    }

    // Prepare request payload
    const payload: any = {
      nodeId: request.nodeId,
      nodeData: {
        model: request.nodeData.model,
        aspectRatio: request.nodeData.aspectRatio,
        variants: request.nodeData.variants || 1,
        upscale: request.nodeData.upscale || false,
        scale: request.nodeData.scale,
        resolution: request.nodeData.resolution,
      },
      inputs: {
        prompt: request.inputs.prompt,
        styleBrand: request.inputs.styleBrand,
      },
    }

    // Add reference image if available
    if (referenceImage) {
      payload.inputs.reference = referenceImage
    } else if (typeof request.inputs.reference === 'string') {
      payload.inputs.reference = request.inputs.reference
    }

    // Call backend API endpoint
    const result = await apiService.post<RunImageGenerationResponse>(
      '/workflow/nodes/image-generation/run',
      payload
    )

    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to generate image')
    }

    if (result.data?.imageUrl && result.data?.nodeId) {
      return {
        imageUrl: result.data.imageUrl,
        remainingCredit: result.data.remainingCredit,
        nodeId: result.data.nodeId,
      }
    }

    throw new Error('No image generated in response.')
  } catch (error: any) {
    console.error('Workflow API Error:', error)

    // Handle axios errors
    if (error.response?.data) {
      const errorData = error.response.data as RunImageGenerationResponse

      // Handle insufficient credit error (402)
      if (error.response?.status === 402) {
        const errorMessage =
          errorData.message ||
          'Insufficient credit. Please purchase more credits to continue.'
        const customError = new Error(errorMessage)
        ;(customError as any).isInsufficientCredit = true
        ;(customError as any).code =
          (errorData as any).code || 'INSUFFICIENT_CREDIT'
        ;(customError as any).response = error.response
        throw customError
      }

      const apiError = new Error(
        errorData.message || 'Failed to generate image'
      )
      ;(apiError as any).code = (errorData as any).code
      ;(apiError as any).response = error.response
      throw apiError
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while generating image.')
  }
}

// AI Assistant Interfaces
interface RunAssistantResponse {
  status: 'success' | 'error'
  message: string
  data?: {
    response: string
  }
  error?: string
}

interface RunAssistantRequest {
  nodeId: string
  nodeData: AssistantNodeData
  inputs: {
    context?: string
    prompt?: string
    images?: (string | { data: string; mimeType: string })[]
  }
}

// Video Generation Interfaces
interface RunVideoGenerationResponse {
  status: 'success' | 'error'
  message: string
  data?: {
    jobId: string
    statusUrl: string
    downloadUrl: string
    pollIntervalMs: number
  }
  error?: string
}

interface RunVideoGenerationRequest {
  nodeId: string
  nodeData: VideoGenNodeData
  inputs: {
    prompt?: string
    storyboard?: any
    referenceImages?: (string | File)[]
    styleBrand?: any
  }
  workflowId?: string
}

/**
 * Run AI Assistant node
 * @param request - Request data including nodeId, nodeData, and inputs
 * @returns AI assistant response
 */
export const runAssistantNode = async (
  request: RunAssistantRequest
): Promise<{
  response: string
}> => {
  try {
    // Prepare context - combine text context
    const context = request.inputs.context || request.nodeData.systemInstruction || ''
    const prompt = request.inputs.prompt || request.nodeData.brief || ''
    
    // Prepare images array - convert all images to base64
    const images: Array<{ data: string; mime_type: string }> = []
    
    if (request.inputs.images && request.inputs.images.length > 0) {
      for (const imageInput of request.inputs.images) {
        try {
          let imageBase64: { data: string; mimeType: string }
          
          if (typeof imageInput === 'string') {
            // It's a URL, convert to base64
            imageBase64 = await urlToBase64(imageInput)
          } else {
            // It's already a base64 object
            imageBase64 = imageInput
          }
          
          images.push({
            data: imageBase64.data,
            mime_type: imageBase64.mimeType,
          })
        } catch (error) {
          console.error('Error converting image to base64:', error)
          // Skip this image if conversion fails
        }
      }
    }
    
    // Prepare payload
    const payload: any = {
      prompt: prompt,
      context: context,
    }
    
    // Add images if available
    if (images.length > 0) {
      payload.images = images
    }

    const result = await apiService.post<RunAssistantResponse>(
      '/workflow/assistant',
      payload
    )

    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to get AI assistant response')
    }

    if (result.data?.response) {
      return {
        response: result.data.response,
      }
    }

    throw new Error('No response from AI assistant.')
  } catch (error: any) {
    console.error('AI Assistant API Error:', error)

    if (error.response?.data) {
      const errorData = error.response.data as RunAssistantResponse
      const apiError = new Error(
        errorData.message || 'Failed to get AI assistant response'
      )
      ;(apiError as any).code = (errorData as any).code
      ;(apiError as any).response = error.response
      throw apiError
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while calling AI assistant.')
  }
}

/**
 * Run image generation node using workflow API
 * @param request - Request data including nodeId, nodeData, and inputs
 * @returns Generated image URL
 */
export const runImageGenerationNodeWorkflow = async (
  request: RunImageGenerationRequest
): Promise<{
  imageUrl: string
}> => {
  try {
    // Prepare parts array for nano format
    const parts: any[] = []

    // Add prompt as text part
    if (request.inputs.prompt) {
      parts.push({ text: request.inputs.prompt })
    }

    // Add reference image as inline_data if provided
    if (request.inputs.reference) {
      if (request.inputs.reference instanceof File) {
        // Convert File to base64
        const base64Image = await fileToBase64(request.inputs.reference)
        parts.push({
          inline_data: {
            mime_type: base64Image.mimeType,
            data: base64Image.data,
          },
        })
      } else if (typeof request.inputs.reference === 'string') {
        // If it's a URL, convert to base64
        try {
          const base64Image = await urlToBase64(request.inputs.reference)
          parts.push({
            inline_data: {
              mime_type: base64Image.mimeType,
              data: base64Image.data,
            },
          })
        } catch (error) {
          console.error('Error converting URL to base64:', error)
          throw new Error('Failed to convert image URL to base64')
        }
      }
    }

    // Build contents array for nano format
    const contents: any[] = [
      {
        parts: parts,
      },
    ]

    // Build payload
    const payload: any = {
      contents,
      generationConfig: {
        imageConfig: {
          aspectRatio: request.nodeData.aspectRatio || '16:9',
        },
      },
      cleanup: true,
    }

    if (request.nodeId) {
      payload.workflowId = request.nodeId
    }

    // Always call nano API endpoint
    const result = await apiService.post<{
      status: 'success' | 'error'
      message: string
      data?: {
        imageUrl: string
      }
    }>('/workflow/image/nano', payload)

    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to generate image')
    }

    if (result.data?.imageUrl) {
      return {
        imageUrl: result.data.imageUrl,
      }
    }

    throw new Error('No image generated in response.')
  } catch (error: any) {
    console.error('Workflow Image API Error:', error)

    // Handle axios errors
    if (error.response?.data) {
      const errorData = error.response.data
      // Handle insufficient credit error (402)
      if (error.response?.status === 402) {
        const errorMessage =
          errorData.message ||
          'Insufficient credit. Please purchase more credits to continue.'
        const customError = new Error(errorMessage)
        ;(customError as any).isInsufficientCredit = true
        ;(customError as any).code = errorData.code || 'INSUFFICIENT_CREDIT'
        ;(customError as any).response = error.response
        throw customError
      }

      const apiError = new Error(errorData.message || 'Failed to generate image')
      ;(apiError as any).code = errorData.code
      ;(apiError as any).response = error.response
      throw apiError
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while generating image.')
  }
}

/**
 * Run video generation node
 * @param request - Request data including nodeId, nodeData, and inputs
 * @returns Video generation job info
 */
export const runVideoGenerationNode = async (
  request: RunVideoGenerationRequest
): Promise<{
  jobId: string
  statusUrl: string
  downloadUrl: string
  pollIntervalMs: number
}> => {
  try {
    // Convert aspect ratio format
    const aspectRatioMap: { [key: string]: string } = {
      '16:9': 'VIDEO_ASPECT_RATIO_LANDSCAPE',
      '9:16': 'VIDEO_ASPECT_RATIO_PORTRAIT',
      '1:1': 'VIDEO_ASPECT_RATIO_SQUARE',
      '4:3': 'VIDEO_ASPECT_RATIO_LANDSCAPE',
    }

    const videoAspectRatio =
      aspectRatioMap[request.nodeData.aspectRatio] ||
      'VIDEO_ASPECT_RATIO_LANDSCAPE'

    const payload: any = {
      prompt: request.inputs.prompt || '',
      aspectRatio: videoAspectRatio,
    }

    if (request.workflowId) {
      payload.workflowId = request.workflowId
    }

    const result = await apiService.post<RunVideoGenerationResponse>(
      '/workflow/video',
      payload
    )

    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to create video generation job')
    }

    if (result.data?.jobId) {
      return {
        jobId: result.data.jobId,
        statusUrl: result.data.statusUrl,
        downloadUrl: result.data.downloadUrl,
        pollIntervalMs: result.data.pollIntervalMs,
      }
    }

    throw new Error('No job ID in response.')
  } catch (error: any) {
    console.error('Video Generation API Error:', error)

    if (error.response?.data) {
      const errorData = error.response.data as RunVideoGenerationResponse
      // Handle insufficient credit error (402)
      if (error.response?.status === 402) {
        const errorMessage =
          errorData.message ||
          'Insufficient credit. Please purchase more credits to continue.'
        const customError = new Error(errorMessage)
        ;(customError as any).isInsufficientCredit = true
        ;(customError as any).code = (errorData as any).code || 'INSUFFICIENT_CREDIT'
        ;(customError as any).response = error.response
        throw customError
      }

      const apiError = new Error(
        errorData.message || 'Failed to create video generation job'
      )
      ;(apiError as any).code = (errorData as any).code
      ;(apiError as any).response = error.response
      throw apiError
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while creating video generation job.')
  }
}

// Export types
export type {
  RunImageGenerationRequest,
  RunImageGenerationResponse,
  RunAssistantRequest,
  RunAssistantResponse,
  RunVideoGenerationRequest,
  RunVideoGenerationResponse,
}

