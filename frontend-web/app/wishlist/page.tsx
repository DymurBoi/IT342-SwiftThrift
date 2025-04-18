import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { WishlistItems } from "@/components/wishlist-items"
import { Suspense } from "react"
import { WishlistLoading } from "@/components/wishlist-loading"
import { ProtectedRoute } from "@/components/protected-route"

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
          <Suspense fallback={<WishlistLoading />}>
            <WishlistItems />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
