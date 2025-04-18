import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ProfileTabs } from "@/components/profile-tabs"
import { Suspense } from "react"
import { ProfileLoading } from "@/components/profile-loading"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          <Suspense fallback={<ProfileLoading />}>
            <ProfileTabs />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
