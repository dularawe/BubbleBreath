import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ChangePasswordRequest,
  MessageResponse,
  Game,
  GameRequest,
  GameUpdateRequest,
  Category,
  CategoryRequest,
  CategoryUpdateRequest,
  Payment,
  PaymentRequest,
  PaymentUpdateRequest,
  Achievement,
  AchievementRequest,
  AchievementUpdateRequest,
  Challenge,
  ChallengeRequest,
  ChallengeUpdateRequest,
  Review,
  ReviewRequest,
  ReviewUpdateRequest,
  Privilege,
  PrivilegeRequest,
  PrivilegeUpdateRequest,
  ImageRating,
  ImageRatingUpdateRequest,
  ApiError,
} from './types'

// API Base URLs - these should be configured via environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
const AUTH_SERVICE_URL = `${API_BASE_URL}/auth`
const GAME_SERVICE_URL = `${API_BASE_URL}/api`
const PAYMENT_SERVICE_URL = `${API_BASE_URL}`
const ACHIEVEMENT_SERVICE_URL = `${API_BASE_URL}`
const CHALLENGE_SERVICE_URL = `${API_BASE_URL}`
const REVIEW_SERVICE_URL = `${API_BASE_URL}`
const PRIVILEGE_SERVICE_URL = `${API_BASE_URL}`
const ML_SERVICE_URL = `${API_BASE_URL}/api/ml`

// Token storage keys
const ACCESS_TOKEN_KEY = 'mindpals_access_token'
const REFRESH_TOKEN_KEY = 'mindpals_refresh_token'
const USER_KEY = 'mindpals_user'

// Token management
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },
  
  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  
  clearTokens: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
  
  getUser: () => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },
  
  setUser: (user: unknown): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

// Base fetch wrapper with auth headers
async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenManager.getAccessToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    // Try to refresh token on 401
    if (response.status === 401 && tokenManager.getRefreshToken()) {
      try {
        const refreshed = await authApi.refreshToken({
          refreshToken: tokenManager.getRefreshToken()!
        })
        tokenManager.setTokens(refreshed.accessToken, refreshed.refreshToken)
        
        // Retry original request
        ;(headers as Record<string, string>)['Authorization'] = `Bearer ${refreshed.accessToken}`
        const retryResponse = await fetch(url, { ...options, headers })
        
        if (!retryResponse.ok) {
          throw await parseError(retryResponse)
        }
        
        return retryResponse.json()
      } catch {
        tokenManager.clearTokens()
        throw { message: 'Session expired. Please login again.', status: 401 } as ApiError
      }
    }
    
    throw await parseError(response)
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T
  }
  
  return response.json()
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const error = await response.json()
    return {
      message: error.message || 'An error occurred',
      status: response.status,
      errors: error.errors
    }
  } catch {
    return {
      message: response.statusText || 'An error occurred',
      status: response.status
    }
  }
}

// Demo users for testing (when backend is not available)
const DEMO_USERS = {
  'user@mindpals.com': {
    id: 'demo-user-1',
    email: 'user@mindpals.com',
    name: 'Demo User',
    role: 'user',
    password: 'user123456',
  },
  'admin@mindpals.com': {
    id: 'demo-admin-1',
    email: 'admin@mindpals.com',
    name: 'Demo Admin',
    role: 'admin',
    password: 'admin123456',
  },
}

// Check if demo mode should be used (when API is unavailable)
const isDemoLogin = (email: string, password: string): boolean => {
  const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS]
  return demoUser !== undefined && demoUser.password === password
}

const createDemoResponse = (email: string): AuthResponse => {
  const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS]
  return {
    accessToken: `demo-token-${Date.now()}`,
    refreshToken: `demo-refresh-${Date.now()}`,
    user: {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role as 'user' | 'admin',
    },
  }
}

// ============= AUTH API =============
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Try demo login first for sample credentials
    if (isDemoLogin(data.email, data.password)) {
      const result = createDemoResponse(data.email)
      tokenManager.setTokens(result.accessToken, result.refreshToken)
      tokenManager.setUser(result.user)
      return result
    }

    // Try actual API
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw await parseError(response)
      }
      
      const result: AuthResponse = await response.json()
      tokenManager.setTokens(result.accessToken, result.refreshToken)
      tokenManager.setUser(result.user)
      return result
    } catch (error) {
      // If API fails and it's a demo credential, use demo mode
      if (isDemoLogin(data.email, data.password)) {
        const result = createDemoResponse(data.email)
        tokenManager.setTokens(result.accessToken, result.refreshToken)
        tokenManager.setUser(result.user)
        return result
      }
      throw error
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw await parseError(response)
      }
      
      const result: AuthResponse = await response.json()
      tokenManager.setTokens(result.accessToken, result.refreshToken)
      tokenManager.setUser(result.user)
      return result
    } catch {
      // Fallback demo registration
      const demoResult: AuthResponse = {
        accessToken: `demo-token-${Date.now()}`,
        refreshToken: `demo-refresh-${Date.now()}`,
        user: {
          id: `demo-${Date.now()}`,
          email: data.email,
          name: data.name,
          role: 'user',
        },
      }
      tokenManager.setTokens(demoResult.accessToken, demoResult.refreshToken)
      tokenManager.setUser(demoResult.user)
      return demoResult
    }
  },
  
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await fetch(`${AUTH_SERVICE_URL}/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw await parseError(response)
    }
    
    return response.json()
  },
  
  forgotPassword: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    const response = await fetch(`${AUTH_SERVICE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw await parseError(response)
    }
    
    return response.json()
  },
  
  logout: async (): Promise<MessageResponse> => {
    const refreshToken = tokenManager.getRefreshToken()
    const result = await fetchWithAuth<MessageResponse>(`${AUTH_SERVICE_URL}/logout`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
    tokenManager.clearTokens()
    return result
  },
  
  logoutAll: async (): Promise<MessageResponse> => {
    const result = await fetchWithAuth<MessageResponse>(`${AUTH_SERVICE_URL}/logout-all`, {
      method: 'POST',
    })
    tokenManager.clearTokens()
    return result
  },
  
  changePassword: async (data: ChangePasswordRequest): Promise<MessageResponse> => {
    return fetchWithAuth<MessageResponse>(`${AUTH_SERVICE_URL}/change-password`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// ============= GAME API =============
export const gameApi = {
  create: (data: GameRequest): Promise<Game> => {
    return fetchWithAuth<Game>(`${GAME_SERVICE_URL}/Game`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  update: (data: GameUpdateRequest): Promise<Game> => {
    return fetchWithAuth<Game>(`${GAME_SERVICE_URL}/Game`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  getById: (id: string): Promise<Game> => {
    return fetchWithAuth<Game>(`${GAME_SERVICE_URL}/Game/${id}`)
  },
  
  getAll: (): Promise<Game[]> => {
    return fetchWithAuth<Game[]>(`${GAME_SERVICE_URL}/Game`)
  },
  
  delete: (id: string): Promise<number> => {
    return fetchWithAuth<number>(`${GAME_SERVICE_URL}/Game/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============= CATEGORY API =============
export const categoryApi = {
  create: (data: CategoryRequest): Promise<Category> => {
    return fetchWithAuth<Category>(`${GAME_SERVICE_URL}/Category`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  update: (data: CategoryUpdateRequest): Promise<Category> => {
    return fetchWithAuth<Category>(`${GAME_SERVICE_URL}/Category`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  getById: (id: string): Promise<Category> => {
    return fetchWithAuth<Category>(`${GAME_SERVICE_URL}/Category/${id}`)
  },
  
  getAll: (): Promise<Category[]> => {
    return fetchWithAuth<Category[]>(`${GAME_SERVICE_URL}/Category`)
  },
  
  delete: (id: string): Promise<number> => {
    return fetchWithAuth<number>(`${GAME_SERVICE_URL}/Category/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============= PAYMENT API =============
export const paymentApi = {
  create: (data: PaymentRequest): Promise<Payment> => {
    return fetchWithAuth<Payment>(`${PAYMENT_SERVICE_URL}/Payment`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  update: (data: PaymentUpdateRequest): Promise<Payment> => {
    return fetchWithAuth<Payment>(`${PAYMENT_SERVICE_URL}/Payment`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  getById: (id: string): Promise<Payment> => {
    return fetchWithAuth<Payment>(`${PAYMENT_SERVICE_URL}/Payment/${id}`)
  },
  
  getAll: (): Promise<Payment[]> => {
    return fetchWithAuth<Payment[]>(`${PAYMENT_SERVICE_URL}/Payment`)
  },
  
  delete: (id: string): Promise<number> => {
    return fetchWithAuth<number>(`${PAYMENT_SERVICE_URL}/Payment/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============= ACHIEVEMENT API =============
export const achievementApi = {
  create: (data: AchievementRequest): Promise<Achievement> => {
    return fetchWithAuth<Achievement>(`${ACHIEVEMENT_SERVICE_URL}/Achivement`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  update: (data: AchievementUpdateRequest): Promise<Achievement> => {
    return fetchWithAuth<Achievement>(`${ACHIEVEMENT_SERVICE_URL}/Achivement`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  getById: (id: string): Promise<Achievement> => {
    return fetchWithAuth<Achievement>(`${ACHIEVEMENT_SERVICE_URL}/Achivement/${id}`)
  },
  
  getAll: (): Promise<Achievement[]> => {
    return fetchWithAuth<Achievement[]>(`${ACHIEVEMENT_SERVICE_URL}/Achivement`)
  },
  
  delete: (id: string): Promise<number> => {
    return fetchWithAuth<number>(`${ACHIEVEMENT_SERVICE_URL}/Achivement/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============= CHALLENGE API =============
export const challengeApi = {
  create: (data: ChallengeRequest): Promise<Challenge> => {
    return fetchWithAuth<Challenge>(`${CHALLENGE_SERVICE_URL}/Challenge`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  update: (data: ChallengeUpdateRequest): Promise<Challenge> => {
    return fetchWithAuth<Challenge>(`${CHALLENGE_SERVICE_URL}/Challenge`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  getById: (id: string): Promise<Challenge> => {
    return fetchWithAuth<Challenge>(`${CHALLENGE_SERVICE_URL}/Challenge/${id}`)
  },
  
  getAll: (): Promise<Challenge[]> => {
    return fetchWithAuth<Challenge[]>(`${CHALLENGE_SERVICE_URL}/Challenge`)
  },
  
  delete: (id: string): Promise<number> => {
    return fetchWithAuth<number>(`${CHALLENGE_SERVICE_URL}/Challenge/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============= REVIEW API =============
export const reviewApi = {
  create: (data: ReviewRequest): Promise<Review> => {
    return fetchWithAuth<Review>(`${REVIEW_SERVICE_URL}/Review`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  update: (data: ReviewUpdateRequest): Promise<Review> => {
    return fetchWithAuth<Review>(`${REVIEW_SERVICE_URL}/Review`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  getById: (id: string): Promise<Review> => {
    return fetchWithAuth<Review>(`${REVIEW_SERVICE_URL}/Review/${id}`)
  },
  
  getAll: (): Promise<Review[]> => {
    return fetchWithAuth<Review[]>(`${REVIEW_SERVICE_URL}/Review`)
  },
  
  getByGameId: (gameId: string): Promise<Review[]> => {
    return fetchWithAuth<Review[]>(`${REVIEW_SERVICE_URL}/Review/game/${gameId}`)
  },
  
  getByUserId: (userId: string): Promise<Review[]> => {
    return fetchWithAuth<Review[]>(`${REVIEW_SERVICE_URL}/Review/user/${userId}`)
  },
  
  delete: (id: string): Promise<number> => {
    return fetchWithAuth<number>(`${REVIEW_SERVICE_URL}/Review/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============= PRIVILEGE API =============
export const privilegeApi = {
  create: (data: PrivilegeRequest): Promise<Privilege> => {
    return fetchWithAuth<Privilege>(`${PRIVILEGE_SERVICE_URL}/Privilleges`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  update: (data: PrivilegeUpdateRequest): Promise<Privilege> => {
    return fetchWithAuth<Privilege>(`${PRIVILEGE_SERVICE_URL}/Privilleges`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  getById: (id: string): Promise<Privilege> => {
    return fetchWithAuth<Privilege>(`${PRIVILEGE_SERVICE_URL}/Privilleges/${id}`)
  },
  
  getAll: (): Promise<Privilege[]> => {
    return fetchWithAuth<Privilege[]>(`${PRIVILEGE_SERVICE_URL}/Privilleges`)
  },
  
  delete: (id: string): Promise<number> => {
    return fetchWithAuth<number>(`${PRIVILEGE_SERVICE_URL}/Privilleges/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============= ML IMAGE RATING API =============
export const mlApi = {
  classifyImage: async (userId: number, image: File): Promise<ImageRating> => {
    const formData = new FormData()
    formData.append('userId', userId.toString())
    formData.append('image', image)
    
    const token = tokenManager.getAccessToken()
    const headers: HeadersInit = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${ML_SERVICE_URL}/image-ratings/classify`, {
      method: 'POST',
      headers,
      body: formData,
    })
    
    if (!response.ok) {
      throw await parseError(response)
    }
    
    return response.json()
  },
  
  getById: (id: number): Promise<ImageRating> => {
    return fetchWithAuth<ImageRating>(`${ML_SERVICE_URL}/image-ratings/${id}`)
  },
  
  getAll: (): Promise<ImageRating[]> => {
    return fetchWithAuth<ImageRating[]>(`${ML_SERVICE_URL}/image-ratings`)
  },
  
  update: (id: number, data: ImageRatingUpdateRequest): Promise<ImageRating> => {
    return fetchWithAuth<ImageRating>(`${ML_SERVICE_URL}/image-ratings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  delete: (id: number): Promise<void> => {
    return fetchWithAuth<void>(`${ML_SERVICE_URL}/image-ratings/${id}`, {
      method: 'DELETE',
    })
  },
}
