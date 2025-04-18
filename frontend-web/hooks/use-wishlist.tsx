"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/types"

interface WishlistContextType {
  wishlist: {
    items: Product[]
  }
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<{ items: Product[] }>({
    items: [],
  })

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist))
      } catch (error) {
        console.error("Failed to parse stored wishlist:", error)
      }
    }
  }, [])

  // Update localStorage when wishlist changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      // Check if product already exists in wishlist
      const exists = prevWishlist.items.some((item) => item.productId === product.productId)

      if (exists) {
        return prevWishlist
      }

      return {
        items: [...prevWishlist.items, product],
      }
    })
  }

  const removeFromWishlist = (productId: number) => {
    setWishlist((prevWishlist) => ({
      items: prevWishlist.items.filter((item) => item.productId !== productId),
    }))
  }

  const isInWishlist = (productId: number) => {
    return wishlist.items.some((item) => item.productId === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
