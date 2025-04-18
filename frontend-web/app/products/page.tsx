import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Suspense } from "react"
import { ProductsLoading } from "@/components/products-loading"

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Products</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <ProductFilters />
          </div>
          <div className="w-full md:w-3/4">
            <Suspense fallback={<ProductsLoading />}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
