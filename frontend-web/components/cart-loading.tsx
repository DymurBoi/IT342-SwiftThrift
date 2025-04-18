import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function CartLoading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-4 border-b">
          <div className="w-20 h-20 bg-muted animate-pulse rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
          </div>
          <div className="w-24 h-10 bg-muted animate-pulse rounded" />
          <div className="w-24 h-6 bg-muted animate-pulse rounded" />
          <div className="w-10 h-10 bg-muted animate-pulse rounded" />
        </div>
      ))}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <div className="h-5 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-5 bg-muted animate-pulse rounded w-1/4" />
          </div>
        </CardContent>
        <CardFooter>
          <div className="h-10 bg-muted animate-pulse rounded w-full" />
        </CardFooter>
      </Card>
    </div>
  )
}
