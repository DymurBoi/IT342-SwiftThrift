"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { fetchProducts } from "@/lib/api"
import type { Product } from "@/types"

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const category = searchParams.get("category")

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchProducts({ category })
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground mb-6">We couldn't find any products matching your criteria.</p>
        <Link href="/products">
          <Button variant="outline">View All Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.productId} className="overflow-hidden">
          <div className="aspect-square relative group">
            <img
              src={product.imageUrls?.[0] || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-2 right-2">
              <Button variant="ghost" size="icon" className="rounded-full bg-background/80 hover:bg-background">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-lg font-bold">${product.price?.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Condition: {product.condition === 0 ? "New" : "Used"}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href={`/products/${product.productId}`} className="w-full">
              <Button className="w-full">View Product</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
