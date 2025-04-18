"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { fetchProductById, fetchProductRatings } from "@/lib/api"
import type { Product, ProductRating } from "@/types"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"

export function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [ratings, setRatings] = useState<ProductRating[]>([])
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await fetchProductById(Number.parseInt(id))
        setProduct(productData)
        setSelectedImage(productData.imageUrls?.[0] || "")

        const ratingsData = await fetchProductRatings(Number.parseInt(id))
        setRatings(ratingsData)
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, toast])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      })
    }
  }

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square bg-muted animate-pulse rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
          <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
          <div className="h-4 bg-muted animate-pulse rounded w-full mt-4" />
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          <div className="h-10 bg-muted animate-pulse rounded w-full mt-6" />
          <div className="h-10 bg-muted animate-pulse rounded w-full mt-2" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/products")}>Back to Products</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="aspect-square rounded-lg overflow-hidden border">
          <img
            src={selectedImage || product.imageUrls?.[0] || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {product.imageUrls?.map((image, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg overflow-hidden border cursor-pointer ${
                selectedImage === image ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${product.name} - view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-2xl font-bold mb-4">${product.price?.toFixed(2)}</p>

        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < (ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-muted-foreground">
            {ratings.length} {ratings.length === 1 ? "review" : "reviews"}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-muted-foreground">{product.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Condition:</span> {product.condition === 0 ? "New" : "Used"}
            </div>
            <div>
              <span className="font-medium">Category:</span> {product.category?.categoryName}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
          </Button>
          <Button variant="outline" className="w-full" size="lg" onClick={handleAddToWishlist}>
            <Heart className="mr-2 h-5 w-5" /> Add to Wishlist
          </Button>
        </div>

        <Tabs defaultValue="description" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({ratings.length})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-4">
            <div className="text-muted-foreground">
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            <div className="space-y-4">
              {ratings.length > 0 ? (
                ratings.map((rating, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-semibold">{rating.name}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{rating.comment}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(rating.date).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="pt-4">
            <div className="text-muted-foreground">
              <p>Standard shipping takes 3-5 business days.</p>
              <p>Express shipping is available for an additional fee.</p>
              <p>Free shipping on orders over $50.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
