import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderSummary } from "@/components/order-summary"
import { Suspense } from "react"
import { CheckoutLoading } from "@/components/checkout-loading"
import { ProtectedRoute } from "@/components/protected-route"

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <Suspense fallback={<CheckoutLoading />}>
                <CheckoutForm />
              </Suspense>
            </div>
            <div className="w-full lg:w-1/3">
              <OrderSummary />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
