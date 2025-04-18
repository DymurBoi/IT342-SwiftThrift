import { ProductsTable } from "@/components/admin/products-table"

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>
      <ProductsTable />
    </div>
  )
}
