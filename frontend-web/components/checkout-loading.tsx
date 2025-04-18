import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CheckoutLoading() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
            <div className="h-10 bg-muted animate-pulse rounded w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-10 bg-muted animate-pulse rounded w-full" />
            <div className="h-10 bg-muted animate-pulse rounded w-full" />
          </div>
        </CardContent>
      </Card>

      <div className="h-12 bg-muted animate-pulse rounded w-full" />
    </div>
  )
}
