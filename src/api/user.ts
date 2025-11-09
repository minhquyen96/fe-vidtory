import {
  UserData,
  UserStatsResponse,
  PublicProfileStats,
  RankingHistoryResponse,
  RankingHistory,
  UserLessonProgressResponse,
  UserLessonProgress,
  UserCompletedSentences,
} from '@/types/user'
import { apiService } from '@/services/api'

interface UserInfoResponse {
  data: {
    user: UserData
  }
}

/**
 * Lấy thông tin user hiện tại
 */
export const getUserInfoApi = async (): Promise<UserInfoResponse | null> => {
  try {
    const response = await apiService.get<UserInfoResponse>('/user/info')
    return response
  } catch (error) {
    console.error('Error fetching user info:', error)
    return null
  }
}

/**
 * Cập nhật số lượng review tối đa mỗi ngày
 */
export const updateMaxDailyReviewsApi = async (maxDailyReviews: number): Promise<{ status: string; message: string } | null> => {
  try {
    const response = await apiService.put<{ status: string; message: string }>('/user/max-daily-reviews', {
      max_daily_reviews: maxDailyReviews
    })
    return response
  } catch (error) {
    console.error('Error updating max daily reviews:', error)
    return null
  }
}

/**
 * Lấy thông tin user theo ID
 */
export const getUserInfoByIdApi = async (
  userId: string
): Promise<{
  info: UserData
  stats: PublicProfileStats
  ranking_history: RankingHistory[]
} | null> => {
  try {
    const response = await apiService.get<{
      status: string
      message: string
      data: {
        info: UserData
        stats: PublicProfileStats
        ranking_history: RankingHistory[]
      }
    }>(`/user/info/${userId}`)
    return response?.data
  } catch (error: any) {
    if (error?.response?.status === 403) {
      throw new Error('PRIVATE_PROFILE')
    }
    console.error('Error fetching user info by ID:', error)
    return null
  }
}

export const getUserStatsApi = async (): Promise<UserStatsResponse | null> => {
  try {
    const response = await apiService.get<UserStatsResponse>('/user/stats')
    return response
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return null
  }
}

export const getRankingHistoryApi = async (): Promise<RankingHistory[]> => {
  try {
    const response = await apiService.get<RankingHistoryResponse>(
      '/user/ranking-history'
    )
    return response?.data
  } catch (error) {
    console.error('Error fetching ranking history:', error)
    return []
  }
}
export const getUserLessonProgress = async (
  lessonIds: string[]
): Promise<UserLessonProgress[]> => {
  try {
    const response = await apiService.post<UserLessonProgressResponse>(
      '/user/lesson-progress',
      {
        lessonIds,
      }
    )
    return response?.data?.lesson_progress
  } catch (error) {
    console.error('Error fetching user lesson progress:', error)
    return []
  }
}

interface SelectedItemResponse {
  status: string
  message: string
  data: {
    selected_item_type: string
    selected_item: {
      code: string
      count: number
      _id: string
      config: string
      name: string
      image_url: string
    }
  }
}

export const updateSelectedItemApi = async (data: {
  selected_item_id: string
  selected_item_type: string
}): Promise<SelectedItemResponse> => {
  try {
    const response = await apiService.put<SelectedItemResponse>('/user/selected-item', data)
    return response
  } catch (error) {
    console.error('Error updating selected item:', error)
    throw error
  }
}

export const updateUserInfoApi = async (data: {
  displayName: string
  description: string
  isPrivate?: boolean
  avatar?: File
  background?: File
  removeBackground?: boolean
}) => {
  const formData = new FormData()
  if (data.displayName) formData.append('displayName', data.displayName)
  formData.append('description', data.description)

  if (data.isPrivate !== undefined) {
    formData.append('isPrivate', data.isPrivate.toString())
  }

  if (data.avatar) {
    formData.append('avatar', data.avatar)
  }

  if (data.background) {
    formData.append('background', data.background)
  }

  if (data.removeBackground) {
    formData.append('removeBackground', 'true')
  }

  const response = await apiService.putWithFormData('/user/info', formData)
  return response
}

export async function getUserCompletedSentences(lessonId: string) {
  const response = await apiService.get<{ data: UserCompletedSentences[] }>(
    `/user/completed-sentences/${lessonId}`
  )
  return response?.data || []
}

export interface VocabularyReview {
  _id: string
  word: string
  created_at: string
  updated_at: string
}

export const addVocabularyReview = async (word: string) => {
  const { data } = await apiService.post<{ data: any }>('/user/vocabulary-review', { word })
  return data
}

export const getVocabularyReviews = async (): Promise<VocabularyReview[]> => {
  try {
    const { data } = await apiService.get<{ data: VocabularyReview[] }>('/user/vocabulary-review')
    return data || []
  } catch (error) {
    console.error('Error fetching vocabulary reviews:', error)
    return []
  }
}

export const deleteVocabularyReview = async (wordId: string) => {
  const { data } = await apiService.delete<{ data: any }>(`/user/vocabulary-review/${wordId}`)
  return data
}
