"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loginAdmin } from "@/lib/admin-api"

interface Admin {
  adminId: number
  username: string
  role: string
}

interface AdminAuthContextType {
  admin: Admin | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // This will ensure that the code is only run on the client side
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const storedAdmin = localStorage.getItem("admin")

      if (storedAdmin) {
        try {
          setAdmin(JSON.parse(storedAdmin))
        } catch (error) {
          console.error("Failed to parse stored admin:", error)
          localStorage.removeItem("admin")
        }
      }
      setIsLoading(false)
    }
  }, [mounted]) // Run only after mounted is true

  const login = async (username: string, password: string) => {
    try {
      const adminData = await loginAdmin({ username, password })

      // Store admin data in localStorage after successful login
      localStorage.setItem("admin", JSON.stringify(adminData))
      setAdmin(adminData)
    } catch (error) {
      console.error("Admin login failed:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("admin")
    setAdmin(null)
  }

  // If not mounted yet, avoid rendering children to prevent SSR issues
  if (!mounted) {
    return null
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
