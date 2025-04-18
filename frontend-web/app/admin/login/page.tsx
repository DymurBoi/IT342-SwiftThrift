"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // For testing purposes, allow direct login with admin/admin
      if (username === "admin" && password === "admin") {
        // Mock successful login
        localStorage.setItem(
          "admin",
          JSON.stringify({
            adminId: 1,
            username: "admin",
            role: "ADMIN",
            token: "mock-token-for-testing",
          }),
        )

        // Redirect to admin dashboard
        router.push("/admin")
        return
      }

      // Real API login
      const response = await fetch("http://localhost:8080/api/admins/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Invalid username or password")
      }

      const data = await response.json()

      // Store admin data in localStorage
      localStorage.setItem(
        "admin",
        JSON.stringify({
          adminId: data.adminId || 1,
          username: data.username || username,
          role: data.role || "ADMIN",
          token: data.token || "token-from-backend",
        }),
      )

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (err) {
      console.error("Login failed:", err)
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">SwiftThrift Admin</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-xs text-center text-muted-foreground mt-4">
                <p>For testing: Use username "admin" and password "admin"</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
