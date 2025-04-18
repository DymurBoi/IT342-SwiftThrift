import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { Suspense } from "react"
import { ProductDetailLoading } from "@/components/product-detail-loading"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <Suspense fallback={<ProductDetailLoading />}>
          <ProductDetail id={params.id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
