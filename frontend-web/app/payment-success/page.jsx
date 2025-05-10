"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function handleOrderAfterPayment() {
      // Get session_id from Stripe redirect
      const sessionId = searchParams.get("session_id")
      const userData = localStorage.getItem("user")
      const user = userData ? JSON.parse(userData) : null

      if (!sessionId || !user) {
        router.replace("/orders")
        return
      }

      try {
        // 1. Get payment info from backend using session_id
        const paymentRes = await axios.get(`http://localhost:8080/api/payments/session/${sessionId}`)
        const payment = paymentRes.data

        // 2. Get user's cart
        const cartRes = await axios.get(`http://localhost:8080/api/cart/byUser/${user.userId}`)
        const cart = cartRes.data

        // 3. Prepare order items from cart items
        const orderItems = (cart.cartItems || []).map(item => ({
          product: item.product,
          subtotal: item.price,
          quantity: 1 // If you have quantity, use item.quantity
        }))

        if (orderItems.length === 0) {
          // No items to order, just redirect
          router.replace("/orders")
          return
        }

        // 4. Create order in backend
        await axios.post("http://localhost:8080/api/orders/create", {
          user: { userId: user.userId },
          orderItems,
          totalPrice: payment.amount,
          status: "PAID"
        })

        // 5. Optionally, clear the cart (delete all cart items)
        for (const item of cart.cartItems || []) {
          await axios.delete(`http://localhost:8080/api/cartItem/delete/${item.cartItemId}`)
        }

        // 6. Redirect to orders page and highlight latest order
        router.replace("/orders?highlight=latest")
      } catch (err) {
        // Fallback: just go to orders page
        router.replace("/orders")
      }
    }

    handleOrderAfterPayment()
  }, [router, searchParams])

  return (
    <div className="container" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ color: "#38a169", marginBottom: 16 }}>Payment Successful!</h1>
      <p>Thank you for your purchase. Redirecting to your orders...</p>
    </div>
  )
}
