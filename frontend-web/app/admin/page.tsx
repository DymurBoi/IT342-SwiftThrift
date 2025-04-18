"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Tag, Users, ShoppingCart, LogOut } from "lucide-react"

interface Admin {
  adminId: number
  username: string
  role: string
}

export default function AdminPage() {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem("admin")

    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin))
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

  const handleLogout = () => {
    localStorage.removeItem("admin")
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!admin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Admin Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Username:</strong> {admin.username}
          </p>
          <p>
            <strong>Role:</strong> {admin.role}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push("/admin/products")}
        >
          <CardContent className="p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Manage</p>
              <h3 className="text-xl font-bold">Products</h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push("/admin/categories")}
        >
          <CardContent className="p-6 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Manage</p>
              <h3 className="text-xl font-bold">Categories</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/admin/users")}>
          <CardContent className="p-6 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Manage</p>
              <h3 className="text-xl font-bold">Users</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/admin/orders")}>
          <CardContent className="p-6 flex items-center">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <ShoppingCart className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Manage</p>
              <h3 className="text-xl font-bold">Orders</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
