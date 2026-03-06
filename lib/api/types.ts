// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword?: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface MessageResponse {
  message: string
}

// User Types
export interface User {
  id: string
  email: string
  name?: string
  role?: string
  createdAt?: string
}

// Game Types
export interface Game {
  id: string
  name: string
  description: string
  categoryId: string
  category?: Category
  imageUrl?: string
  level?: number
  stars?: number
  unlocked?: boolean
  createdAt?: string
}

export interface GameRequest {
  name: string
  description: string
  categoryId: string
  imageUrl?: string
  level?: number
}

export interface GameUpdateRequest extends Partial<GameRequest> {
  id: string
}

// Category Types
export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  createdAt?: string
}

export interface CategoryRequest {
  name: string
  description?: string
  icon?: string
  color?: string
}

export interface CategoryUpdateRequest extends Partial<CategoryRequest> {
  id: string
}

// Payment Types
export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  paymentMethod: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description?: string
  createdAt: string
}

export interface PaymentRequest {
  userId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  description?: string
}

export interface PaymentUpdateRequest {
  id: string
  amount?: number
  currency?: string
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod?: string
  description?: string
}

// Achievement Types
export interface Achievement {
  id: string
  title: string
  description: string
  conditionType: string
  value: number
  icon?: string
  color?: string
  unlocked?: boolean
  progress?: number
  maxProgress?: number
  createdAt?: string
}

export interface AchievementRequest {
  title: string
  description: string
  conditionType: string
  value: number
  icon?: string
  color?: string
}

export interface AchievementUpdateRequest extends Partial<AchievementRequest> {
  id: string
}

// Challenge Types
export interface Challenge {
  id: string
  name: string
  description: string
  reward: number
  gameId?: string
  startDate?: string
  endDate?: string
  active?: boolean
  completed?: boolean
  createdAt?: string
}

export interface ChallengeRequest {
  name: string
  description: string
  reward: number
  gameId?: string
  startDate?: string
  endDate?: string
}

export interface ChallengeUpdateRequest extends Partial<ChallengeRequest> {
  id: string
}

// Review Types
export interface Review {
  id: string
  gameId: string
  userId: string
  rating: number
  comment: string
  isApproved: boolean
  userName?: string
  gameName?: string
  createdAt: string
}

export interface ReviewRequest {
  gameId: string
  userId: string
  rating: number
  comment?: string
  isApproved?: boolean
}

export interface ReviewUpdateRequest extends Partial<ReviewRequest> {
  id: string
}

// Privileges Types
export interface Privilege {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
}

export interface PrivilegeRequest {
  name: string
  description?: string
  permissions: string[]
}

export interface PrivilegeUpdateRequest extends Partial<PrivilegeRequest> {
  id: string
}

// ML Image Rating Types
export interface ImageRating {
  id: number
  userId: number
  label: 'Good' | 'Bad' | 'Nice'
  score: number
  imageUrl: string
  createdAt?: string
}

export interface ImageRatingRequest {
  userId: number
  image: File
}

export interface ImageRatingUpdateRequest {
  label: string
  score: number
  imageUrl: string
}

// API Response Types
export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
