import { User as FirebaseUser } from 'firebase/auth'

export enum SubscriptionStatus {
  Trialing = 'trialing',
  Active = 'active',
  Canceled = 'canceled',
  PastDue = 'past_due',
  Cancelled = 'cancelled',
  Deleted = 'deleted',
}

export interface Subscription {
  plan_id?: string
  expires_date?: number
  status?: SubscriptionStatus
  cancel_url?: string
  update_url?: string
}

export interface Premium {
  status?: 'active' | 'inactive' | 'expired'
  expires_at?: number | null
  activated_at?: number | null
  price_id?: string | null
  total_months?: number | null
  credit?: number
}

export interface ActiveBadge {
  code: string
  count: number
  _id: string
  id: string
  name: string
  image_url: string
}

export interface ActiveAvatarFrame extends ActiveBadge {
  config: {
    x: number
    y: number
    scale: number
  }
}

export interface UserData {
  id: string
  email: string
  name?: string
  displayName?: string
  photoURL?: string
  description?: string
  background?: string
  backgroundURL?: string
  premium?: Premium
  is_premium?: boolean
  diamonds?: number
  used_credits?: number
  current_streak?: number
  max_streak?: number
  last_streak_date?: number
  active_badges?: ActiveBadge[]
  active_avatar_frames?: ActiveAvatarFrame[]
  selected_avatar_frame?: ActiveAvatarFrame
  isPrivate?: boolean
  max_daily_reviews?: number
}

export interface AuthContextType {
  user: FirebaseUser | null
  userData: UserData | null
  loading: boolean
  isOpenLoginModal: boolean
  isLoadingGoogleLogin: boolean
  isLoadingAppleLogin: boolean
  isLoadingEmailLogin: boolean
  isLoadingFacebookLogin: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => Promise<void>
  loginWithApple: () => Promise<void>
  loginWithFacebook: () => Promise<void>
  loginWithEmail: (email: string) => Promise<void>
  logout: () => Promise<void>
  closeLoginModal: () => void
  openLoginModal: (redirectUrl?: string) => void
}

export enum UserLevel {
  NoRank = 'NO_RANK',
  Beginner = 'BEGINNER',
  Elementary = 'ELEMENTARY',
  Intermediate = 'INTERMEDIATE',
  UpperIntermediate = 'UPPER_INTERMEDIATE',
  Advanced = 'ADVANCED',
  Proficient = 'PROFICIENT',
}

export interface LevelDefinition {
  level: UserLevel
  levelNumber: number
  key: string
  minScore: number
  maxScore: number
}

export interface UserOverallStats {
  _id: string
  user_id: string
  current_level: number
  user_score: number
  performance_score: number
  difficulty_score: number
  total_sentences: number
  total_active_time: number
  created_at: number
  updated_at: number
}

export interface UserStats {
  overall_stats: UserOverallStats
  shadowing_stats: UserOverallStats
  daily_stats: any[] // TODO: Add type when implemented
  badges: any[] // TODO: Add type when implemented
}

export interface UserStatsResponse {
  status: 'success' | 'error'
  message: string
  data: UserStats
  overall_stats: UserOverallStats
  shadowing_stats: UserOverallStats
}

export interface PublicProfileStats {
  overall_stats: UserOverallStats
  shadowing_stats: UserOverallStats
}

export interface RankingHistory {
  user_id: string
  level: number
  previous_level: number
  changed_at: Date
  total_sentences: number
  type: 'shadowing' | 'other'
}

export interface RankingHistoryResponse {
  status: 'success' | 'error'
  message: string
  data: RankingHistory[]
}

export interface Progress {
  average_score: number
  average_shadowing_score: number
  completed_types: {
    dictation: boolean
    shadowing: boolean
  }
  inprogress_types: {
    dictation: boolean
    shadowing: boolean
  }
  total_time: number
  total_time_shadowing: number
}

export interface UserLessonProgress {
  lesson_id: string
  progress: Progress | null
}

export interface UserLessonProgressResponse {
  data: {
    user_id: string
    lesson_progress: UserLessonProgress[]
  }
}

export interface UserCompletedSentences {
  sentenceId: string
  type: 'dictation' | 'shadowing'
}
