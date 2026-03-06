import useSWR from 'swr'
import { 
  gameApi, 
  categoryApi, 
  achievementApi, 
  challengeApi, 
  reviewApi, 
  paymentApi,
  privilegeApi,
  mlApi 
} from '@/lib/api/client'
import type { 
  Game, 
  Category, 
  Achievement, 
  Challenge, 
  Review, 
  Payment,
  Privilege,
  ImageRating 
} from '@/lib/api/types'

// Games
export function useGames() {
  return useSWR<Game[]>('games', () => gameApi.getAll())
}

export function useGame(id: string | undefined) {
  return useSWR<Game>(id ? `game-${id}` : null, () => id ? gameApi.getById(id) : null)
}

// Categories
export function useCategories() {
  return useSWR<Category[]>('categories', () => categoryApi.getAll())
}

export function useCategory(id: string | undefined) {
  return useSWR<Category>(id ? `category-${id}` : null, () => id ? categoryApi.getById(id) : null)
}

// Achievements
export function useAchievements() {
  return useSWR<Achievement[]>('achievements', () => achievementApi.getAll())
}

export function useAchievement(id: string | undefined) {
  return useSWR<Achievement>(id ? `achievement-${id}` : null, () => id ? achievementApi.getById(id) : null)
}

// Challenges
export function useChallenges() {
  return useSWR<Challenge[]>('challenges', () => challengeApi.getAll())
}

export function useChallenge(id: string | undefined) {
  return useSWR<Challenge>(id ? `challenge-${id}` : null, () => id ? challengeApi.getById(id) : null)
}

// Reviews
export function useReviews() {
  return useSWR<Review[]>('reviews', () => reviewApi.getAll())
}

export function useReview(id: string | undefined) {
  return useSWR<Review>(id ? `review-${id}` : null, () => id ? reviewApi.getById(id) : null)
}

export function useGameReviews(gameId: string | undefined) {
  return useSWR<Review[]>(gameId ? `reviews-game-${gameId}` : null, () => gameId ? reviewApi.getByGameId(gameId) : null)
}

export function useUserReviews(userId: string | undefined) {
  return useSWR<Review[]>(userId ? `reviews-user-${userId}` : null, () => userId ? reviewApi.getByUserId(userId) : null)
}

// Payments
export function usePayments() {
  return useSWR<Payment[]>('payments', () => paymentApi.getAll())
}

export function usePayment(id: string | undefined) {
  return useSWR<Payment>(id ? `payment-${id}` : null, () => id ? paymentApi.getById(id) : null)
}

// Privileges
export function usePrivileges() {
  return useSWR<Privilege[]>('privileges', () => privilegeApi.getAll())
}

export function usePrivilege(id: string | undefined) {
  return useSWR<Privilege>(id ? `privilege-${id}` : null, () => id ? privilegeApi.getById(id) : null)
}

// ML Image Ratings
export function useImageRatings() {
  return useSWR<ImageRating[]>('image-ratings', () => mlApi.getAll())
}

export function useImageRating(id: number | undefined) {
  return useSWR<ImageRating>(id ? `image-rating-${id}` : null, () => id ? mlApi.getById(id) : null)
}
