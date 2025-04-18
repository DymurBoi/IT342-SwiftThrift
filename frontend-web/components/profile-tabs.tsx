"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { fetchOrdersByUserId } from "@/lib/api"
import type { Order } from "@/types"
import Link from "next/link"

export function ProfileTabs() {
  const { user, updateUserProfile } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    firstName: user?.fname || "",
    lastName: user?.lname || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        try {
          const data = await fetchOrdersByUserId(user.userId)
          setOrders(data)
        } catch (error) {
          console.error("Failed to fetch orders:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadOrders()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateUserProfile({
        fname: formData.firstName,
        lname: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
      })

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      })
      return
    }

    try {
      // Call API to update password
      // This would typically be a separate endpoint
      await updateUserProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      console.error("Failed to update password:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your password. Please check your current password and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account information here.</CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="orders" className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View your past orders and their status.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <div className="h-5 bg-muted animate-pulse rounded w-1/4" />
                      <div className="h-5 bg-muted animate-pulse rounded w-1/4" />
                    </div>
                    <Separator />
                    <div className="h-4 bg-muted animate-pulse rounded w-full" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.orderId}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-medium">Order #{order.orderId}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="text-sm">
                        <p className="font-medium">Total: ${order.totalPrice.toFixed(2)}</p>
                        <p className="text-muted-foreground">Items: {order.orderItems?.length || 0}</p>
                      </div>
                      <div className="mt-4">
                        <Link href={`/orders/${order.orderId}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Link href="/products">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordUpdate}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Update Password</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
