"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export function CartItems() {
  const { cart, updateQuantity, removeFromCart } = useCart()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-4 border-b">
            <div className="w-20 h-20 bg-muted animate-pulse rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
            </div>
            <div className="w-24 h-10 bg-muted animate-pulse rounded" />
            <div className="w-24 h-6 bg-muted animate-pulse rounded" />
            <div className="w-10 h-10 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link href="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    )
  }

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity < 1) return
    updateQuantity(productId, quantity)
  }

  const handleRemove = (productId: number, productName: string) => {
    removeFromCart(productId)
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:grid grid-cols-5 gap-4 py-2 font-medium border-b">
        <div className="col-span-2">Product</div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-right">Total</div>
      </div>

      {cart.items.map((item) => (
        <div key={item.product.productId} className="flex flex-col md:grid md:grid-cols-5 md:gap-4 py-4 border-b">
          <div className="flex items-center col-span-2 mb-4 md:mb-0">
            <div className="w-20 h-20 rounded overflow-hidden mr-4">
              <img
                src={item.product.imageUrls?.[0] || "/placeholder.svg?height=80&width=80"}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <Link href={`/products/${item.product.productId}`} className="font-medium hover:underline">
                {item.product.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                Condition: {item.product.condition === 0 ? "New" : "Used"}
              </p>
            </div>
          </div>

          <div className="flex justify-between md:block md:text-center mb-4 md:mb-0">
            <span className="md:hidden">Price:</span>
            <span>${item.product.price?.toFixed(2)}</span>
          </div>

          <div className="flex justify-between md:justify-center items-center mb-4 md:mb-0">
            <span className="md:hidden">Quantity:</span>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
              >
                -
              </Button>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.product.productId, Number.parseInt(e.target.value) || 1)}
                className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex justify-between md:text-right mb-4 md:mb-0">
            <span className="md:hidden">Total:</span>
            <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>

          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.product.productId, item.product.name)}
              aria-label={`Remove ${item.product.name} from cart`}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
