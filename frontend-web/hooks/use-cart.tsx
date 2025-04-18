"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/types"

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  cart: {
    items: CartItem[]
    totalItems: number
  }
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<{ items: CartItem[]; totalItems: number }>({
    items: [],
    totalItems: 0,
  })

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse stored cart:", error)
      }
    }
  }, [])

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex((item) => item.product.productId === product.productId)

      const newItems = [...prevCart.items]

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        }
      } else {
        // Add new item
        newItems.push({ product, quantity })
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: newItems,
        totalItems,
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.product.productId !== productId)

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: newItems,
        totalItems,
      }
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.product.productId === productId ? { ...item, quantity } : item,
      )

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: newItems,
        totalItems,
      }
    })
  }

  const clearCart = () => {
    setCart({ items: [], totalItems: 0 })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
