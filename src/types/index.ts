export interface Pagination {
  total: number
  pages: number
  currentPage: number
  limit: number
}

export interface CommonListingResponse<T> {
  data: {
    data: T[]
    pagination?: Pagination
  }
  status?: string
  message?: string
}

export interface CommonListingObjectResponse<T> {
  data: {
    data?: T
    pagination?: Pagination
  }
  status?: string
  message?: string
}

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data: T
  message?: string
}

declare global {
  interface Window {
    segmentTimer: ReturnType<typeof setTimeout> | undefined
    segmentAnimationFrame?: number
  }
}
