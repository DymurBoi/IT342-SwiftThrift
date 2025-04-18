import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export function CategoryShowcase() {
  const categories = [
    {
      name: "Shirts",
      image: "/placeholder.svg?height=400&width=300",
      href: "/products?category=shirts",
    },
    {
      name: "Jackets",
      image: "/placeholder.svg?height=400&width=300",
      href: "/products?category=jackets",
    },
    {
      name: "Hoodies",
      image: "/placeholder.svg?height=400&width=300",
      href: "/products?category=hoodies",
    },
    {
      name: "Shoes",
      image: "/placeholder.svg?height=400&width=300",
      href: "/products?category=shoes",
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-square relative">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold text-center">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
