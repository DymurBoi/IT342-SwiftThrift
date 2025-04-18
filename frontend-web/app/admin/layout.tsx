"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, Tag, Users, ShoppingCart, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false)
      return
    }

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
  }, [router, isLoginPage])

  const handleLogout = () => {
    localStorage.removeItem("admin")
    router.push("/admin/login")
  }

  // Routes for the sidebar
  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/admin",
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: <Package className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/products"),
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: <Tag className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/categories"),
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/users"),
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/orders"),
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/settings"),
    },
  ]

  // For login page, render without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Not authenticated, will redirect in useEffect
  if (!isAuthenticated) {
    return null
  }

  // Render admin layout with sidebar
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-slate-900 text-white p-6 flex flex-col h-screen">
        <div className="text-xl font-bold mb-8">SwiftThrift Admin</div>
        <nav className="space-y-1 flex-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                route.active ? "bg-slate-800 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              {route.icon}
              {route.label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          className="mt-auto w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
