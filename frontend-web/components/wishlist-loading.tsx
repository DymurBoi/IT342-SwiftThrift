import { Card, CardContent } from "@/components/ui/card"

export function WishlistLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-square bg-muted animate-pulse" />
          <CardContent className="p-4">
            <div className="h-4 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2 mb-2" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/4 mb-4" />
            <div className="h-10 bg-muted animate-pulse rounded w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
