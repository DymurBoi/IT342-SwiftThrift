import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"
import { Suspense } from "react"
import { CartLoading } from "@/components/cart-loading"

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <Suspense fallback={<CartLoading />}>
              <CartItems />
            </Suspense>
          </div>
          <div className="w-full lg:w-1/3">
            <CartSummary />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
