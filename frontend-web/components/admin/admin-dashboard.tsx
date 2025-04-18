"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: any[]
  topProducts: any[]
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard-stats")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to load dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total}</p>
                    <p className={`text-sm ${order.status === "Completed" ? "text-green-500" : "text-amber-500"}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toFixed(2)}</p>
                    <p className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      12%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
