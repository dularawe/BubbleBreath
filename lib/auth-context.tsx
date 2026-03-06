"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi, tokenManager } from '@/lib/api/client'
import type { User, LoginRequest, RegisterRequest, ApiError } from '@/lib/api/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  refreshUser: () => void
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = useCallback(() => {
    const storedUser = tokenManager.getUser()
    const token = tokenManager.getAccessToken()
    
    if (storedUser && token) {
      setUser(storedUser)
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authApi.login(data)
      setUser(response.user)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authApi.register(data)
      setUser(response.user)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    
    try {
      await authApi.logout()
    } catch {
      // Even if logout fails on server, clear local state
    } finally {
      tokenManager.clearTokens()
      setUser(null)
      setIsLoading(false)
    }
  }

  const logoutAll = async () => {
    setIsLoading(true)
    
    try {
      await authApi.logoutAll()
    } catch {
      // Even if logout fails on server, clear local state
    } finally {
      tokenManager.clearTokens()
      setUser(null)
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        logoutAll,
        refreshUser,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
