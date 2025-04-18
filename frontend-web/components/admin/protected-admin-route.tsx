"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ProtectedAdminRouteProps {
  children: React.ReactNode
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem("admin")

    if (storedAdmin) {
      try {
        // Validate the admin data
        const admin = JSON.parse(storedAdmin)
        if (admin && admin.username) {
          setIsAuthenticated(true)
        } else {
          // Invalid admin data
          localStorage.removeItem("admin")
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Failed to parse stored admin:", error)
        localStorage.removeItem("admin")
        router.push("/admin/login")
      }
    } else {
      router.push("/admin/login")
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
