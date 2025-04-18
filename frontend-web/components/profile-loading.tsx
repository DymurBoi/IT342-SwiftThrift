import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfileLoading() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account information here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
