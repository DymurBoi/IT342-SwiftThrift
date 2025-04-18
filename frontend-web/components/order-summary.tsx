"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"

export function OrderSummary() {
  const { cart } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <div className="h-5 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-5 bg-muted animate-pulse rounded w-1/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate totals
  const subtotal = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item.product.productId} className="flex justify-between text-sm">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
