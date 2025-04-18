import { LoginForm } from "@/components/login-form"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <h1 className="text-3xl font-bold text-center mb-6">Login to SwiftThrift</h1>
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
