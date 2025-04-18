"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "./theme-toggle"
import { useToast } from "@/components/ui/use-toast"

export function MainNav() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const { toast } = useToast()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/products",
      label: "Shop",
      active: pathname === "/products",
    },
    {
      href: "/products?category=shirts",
      label: "Shirts",
      active: pathname === "/products" && pathname.includes("category=shirts"),
    },
    {
      href: "/products?category=jackets",
      label: "Jackets",
      active: pathname === "/products" && pathname.includes("category=jackets"),
    },
    {
      href: "/products?category=hoodies",
      label: "Hoodies",
      active: pathname === "/products" && pathname.includes("category=hoodies"),
    },
    {
      href: "/products?category=shoes",
      label: "Shoes",
      active: pathname === "/products" && pathname.includes("category=shoes"),
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">SwiftThrift</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`transition-colors hover:text-foreground/80 ${
                  route.active ? "text-foreground font-semibold" : "text-foreground/60"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <button className="flex items-center space-x-2 md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="font-bold">SwiftThrift</span>
        </button>

        {showMobileMenu && <MobileNav routes={routes} />}

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative hidden md:inline-block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="w-full md:w-[200px] lg:w-[300px] pl-8" />
            </div>
          </div>

          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/cart">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon" aria-label="Profile">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout()
                  toast({
                    title: "Logged out",
                    description: "You have been successfully logged out.",
                  })
                }}
              >
                Logout
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
