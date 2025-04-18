"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/hooks/use-auth"
import { CartProvider } from "@/hooks/use-cart"
import { WishlistProvider } from "@/hooks/use-wishlist"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
