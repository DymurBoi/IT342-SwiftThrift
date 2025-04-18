"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingCart } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export function WishlistItems() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (wishlist.items.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
        <p className="text-muted-foreground mb-6">You haven't added any products to your wishlist yet.</p>
        <Link href="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    )
  }

  const handleRemove = (productId: number, productName: string) => {
    removeFromWishlist(productId)
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your wishlist`,
    })
  }

  const handleAddToCart = (productId: number, productName: string) => {
    const product = wishlist.items.find((item) => item.productId === productId)
    if (product) {
      addToCart(product)
      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart`,
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.items.map((product) => (
        <Card key={product.productId} className="overflow-hidden">
          <div className="aspect-square relative">
            <img
              src={product.imageUrls?.[0] || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background"
              onClick={() => handleRemove(product.productId, product.name)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <Link href={`/products/${product.productId}`} className="font-semibold hover:underline">
                {product.name}
              </Link>
              <p className="text-lg font-bold">${product.price?.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Condition: {product.condition === 0 ? "New" : "Used"}</p>
              <Button className="w-full mt-2" onClick={() => handleAddToCart(product.productId, product.name)}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
