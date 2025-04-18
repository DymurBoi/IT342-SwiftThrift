export function ProductDetailLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="aspect-square bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
        <div className="h-4 bg-muted animate-pulse rounded w-full mt-4" />
        <div className="h-4 bg-muted animate-pulse rounded w-full" />
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-10 bg-muted animate-pulse rounded w-full mt-6" />
        <div className="h-10 bg-muted animate-pulse rounded w-full mt-2" />
      </div>
    </div>
  )
}
