import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { getCookie, setCookie } from '@/helpers/cookieUtils'
import { COOKIE_STORAGE } from '@/constants/env'
import { authentication } from '@/lib/firebase'
import { handleKInfo } from '@/helpers/verify'

class ApiService {
  private api: AxiosInstance
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: any) => void
    config: AxiosRequestConfig
  }> = []

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor để thêm token vào header
    this.api.interceptors.request.use(
      async (config) => {
        // @ts-ignore
        if (!!config?.generateKey) {
          const token = await handleKInfo(
            process.env.NEXT_PUBLIC_ENCRYPTION_KEY || ''
          )
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
          }
          return config
        }

        // Only add token if there's no Authorization header already set
        if (!config.headers?.Authorization) {
          const token = getCookie(COOKIE_STORAGE.ACCESS_TOKEN)
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor để xử lý lỗi
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean
        }

        // Handle 403 banned account errors
        if (error.response?.status === 403) {
          const errorData = error.response.data as any
          if (errorData?.code === 'ACCOUNT_BANNED') {
            // Dispatch event để global error handler xử lý
            window.dispatchEvent(new CustomEvent('error:account-banned', {
              detail: {
                message: errorData.message,
                data: errorData.data
              }
            }))
          }
          return Promise.reject(error)
        }

        // Kiểm tra lỗi token hết hạn do thời gian thiết bị không đúng
        if (
          error.response?.status === 401 &&
          // @ts-ignore
          error?.response?.data?.message === 'Token has expired' &&
          !originalRequest._retry
        ) {
          // Dispatch event để toast handler xử lý với i18n
          window.dispatchEvent(new CustomEvent('error:token-expired'))
          // return Promise.reject(error)
        }

        // Xử lý các lỗi 401 khác
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Nếu đang refresh token, thêm request vào queue
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve,
                reject,
                config: originalRequest,
              })
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            // Lấy token mới từ Firebase
            const currentUser = authentication.currentUser
            if (currentUser) {
              const newToken = await currentUser.getIdToken(true)
              setCookie(COOKIE_STORAGE.ACCESS_TOKEN, newToken, 30)

              // Cập nhật token cho request hiện tại
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
              }

              // Thực hiện lại các request trong queue
              this.processQueue(null, newToken)

              // Thực hiện lại request ban đầu
              return this.api(originalRequest)
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null)
            // Nếu refresh token thất bại, logout user
            window.dispatchEvent(new CustomEvent('auth:expired'))
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else if (token) {
        if (prom.config.headers) {
          prom.config.headers.Authorization = `Bearer ${token}`
        }
        prom.resolve(this.api(prom.config))
      }
    })
    this.failedQueue = []
  }

  // Generic request methods
  async get<T>(
    endpoint: string,
    params?: object,
    config?: any,
    generateKey?: boolean
  ) {
    try {
      if (generateKey) config.generateKey = true
      const response = await this.api.get<T>(endpoint, {
        params,
        ...config,
      })
      return response.data
    } catch (error) {
      console.error(`Error making GET request to ${endpoint}:`, error)
      throw error
    }
  }

  async post<T>(endpoint: string, data?: object) {
    try {
      const response = await this.api.post<T>(endpoint, data)
      return response.data
    } catch (error) {
      console.error(`Error making POST request to ${endpoint}:`, error)
      throw error
    }
  }

  async put<T>(endpoint: string, data?: object) {
    try {
      const response = await this.api.put<T>(endpoint, data)
      return response.data
    } catch (error) {
      console.error(`Error making PUT request to ${endpoint}:`, error)
      throw error
    }
  }

  async delete<T>(endpoint: string) {
    try {
      const response = await this.api.delete<T>(endpoint)
      return response.data
    } catch (error) {
      console.error(`Error making DELETE request to ${endpoint}:`, error)
      throw error
    }
  }

  async putWithFormData<T>(endpoint: string, formData: FormData) {
    try {
      const response = await this.api.put<T>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error(
        `Error making PUT request with FormData to ${endpoint}:`,
        error
      )
      throw error
    }
  }
}

export const apiService = new ApiService()
