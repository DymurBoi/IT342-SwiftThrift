"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loginUser, updateUserProfile as updateUserProfileAPI } from "@/lib/api"
import type { User } from "@/types"

// Update the AuthContextType interface to include token management
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUserProfile: (userData: Partial<User>) => Promise<void>
  getAuthHeader: () => { Authorization: string } | {}
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Add token state to the provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser({ email, password })
      const userData = response.user
      const tokenValue = response.token

      // Store user data and token
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", tokenValue)

      setUser(userData)
      setToken(tokenValue)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
  }

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const updatedUser = await updateUserProfileAPI(user.userId, userData)

      // Update local storage and state
      const newUserData = { ...user, ...updatedUser }
      localStorage.setItem("user", JSON.stringify(newUserData))
      setUser(newUserData)
    } catch (error) {
      console.error("Failed to update profile:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        updateUserProfile,
        getAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
