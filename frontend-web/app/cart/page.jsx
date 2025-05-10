"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import "../styles.css"

const STRIPE_PUBLIC_KEY = "pk_test_51RHvE5HX4UZcHBXUnq2kaKVJP082SVqNxZqMrtVCVdUKCONHMMyFxGYPsMHGuBrvpP7iP1zXiovWAe7E4j7yTlTa00a3q6NzAy";

export default function CartPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cartItems, setCartItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    try {
      const userData = localStorage.getItem("user")
      const parsedUser = userData ? JSON.parse(userData) : null
      setUser(parsedUser)
    } catch (e) {
      setError("Failed to load user.")
    }
  }, [router])

  useEffect(() => {
    if (!user) return
    async function fetchCart() {
      try {
        setLoading(true)
        // Use the new endpoint to get the user's cart directly
        const res = await axios.get(`http://localhost:8080/api/cart/byUser/${user.userId}`)
        if (res.data) {
          setCart(res.data)
          setCartItems(res.data.cartItems || [])
        } else {
          setCart(null)
          setCartItems([])
        }
        setError("")
      } catch (e) {
        setCart(null)
        setCartItems([])
        setError("Failed to load cart.")
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
    // Listen for cart updates
    const handleCartUpdated = () => fetchCart()
    window.addEventListener("cartUpdated", handleCartUpdated)
    return () => window.removeEventListener("cartUpdated", handleCartUpdated)
  }, [user])

  const handleRemoveItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cartItem/delete/${cartItemId}`)
      window.dispatchEvent(new Event("cartUpdated"))
    } catch (e) {
      setError("Failed to remove item.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg";
    
    // If it's already an absolute URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative URL, prepend the API base URL
    return `http://localhost:8080${imageUrl}`;
  };

  // Checkbox handler
  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId]
    )
  }

  // Select all handler
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map((item) => item.cartItemId))
    }
  }

  // Calculate total price of selected items
  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(item.cartItemId))
    .reduce((sum, item) => sum + (item.price || 0), 0)

  // Checkout handler with Stripe integration
  const handleCheckout = async () => {
    if (selectedItems.length === 0) return;
    try {
      // Get selected cart items
      const items = cartItems.filter((item) => selectedItems.includes(item.cartItemId));
      const totalAmount = selectedTotal;

      // Stripe expects amount in cents
      const amountInCents = Math.round(totalAmount * 100);

      // Call backend to create Stripe session
      const res = await axios.post("http://localhost:8080/api/payments/create-intent", {
        userId: user.userId.toString(),
        amount: amountInCents,
        currency: "php" // Use PHP for Philippine Peso
      });

      // Stripe session id is in res.data.clientSecret
      const sessionId = res.data.clientSecret;

      // Load Stripe.js and redirect to checkout
      const stripeJs = await loadStripeJs();
      if (stripeJs && sessionId) {
        stripeJs.redirectToCheckout({ sessionId });
      } else {
        alert("Stripe initialization failed.");
      }
    } catch (err) {
      alert("Failed to initiate payment. Please try again.");
      console.error(err);
    }
  };

  // Helper to load Stripe.js
  async function loadStripeJs() {
    if (window.Stripe) return window.Stripe(STRIPE_PUBLIC_KEY);
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.onload = () => {
        resolve(window.Stripe(STRIPE_PUBLIC_KEY));
      };
      document.body.appendChild(script);
    });
  }

  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">Swiftthrift</div>
        <ul className="nav-links">
          
          <li>
            <a onClick={() => router.push("/products")}>Products</a>
          </li>
          <li>
            <a onClick={() => router.push("/wishlist")}>Wishlist</a>
          </li>
          <li>
            <a className="active">Cart</a>
          </li>
          <li>
            <a onClick={() => router.push("/orders")}>Orders</a>
          </li>
          
          <li>
            <a onClick={() => router.push("/about")}>About Us</a>
          </li>
        </ul>
        <div className="auth-links">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="page-header">
        <h1>Your Cart</h1>
        <p>Review your selected items and proceed to checkout</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="featured-products">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <label style={{ display: "flex", alignItems: "center", fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={selectedItems.length === cartItems.length && cartItems.length > 0}
              onChange={handleSelectAll}
              style={{ marginRight: 8 }}
            />
            Select All
          </label>
        </div>
        <div className="products-grid">
          {cartItems.length > 0 ? cartItems.map(item => (
            <div key={item.cartItemId} className="product-card" style={{ position: "relative" }}>
              {/* Checkbox top-left */}
              <input
                type="checkbox"
                checked={selectedItems.includes(item.cartItemId)}
                onChange={() => handleSelectItem(item.cartItemId)}
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  zIndex: 2,
                  width: 20,
                  height: 20,
                  accentColor: "#ff6b6b"
                }}
              />
              <div className="product-image">
                <img 
                  src={item.product?.imageUrls && item.product.imageUrls.length > 0
                    ? getImageUrl(item.product.imageUrls[0])
                    : "/placeholder.svg?height=200&width=200"}
                  alt={item.product?.name || "Product image"}
                />
              </div>
              <div className="product-info">
                <h3>{item.product?.name}</h3>
                <p className="product-description">{item.product?.description}</p>
                <p className="price">₱{item.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <button className="add-to-cart" onClick={() => handleRemoveItem(item.cartItemId)}>
                  Remove
                </button>
              </div>
            </div>
          )) : (
            <div className="no-products">
              <p>Your cart is empty.</p>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Box */}
      <div
        style={{
          maxWidth: 400,
          margin: "30px auto 0 auto",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: 24,
          textAlign: "center"
        }}
      >
        <h3 style={{ marginBottom: 16 }}>Checkout</h3>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontWeight: 500 }}>Selected Items:</span> {selectedItems.length}
        </div>
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontWeight: 500 }}>Total:</span> ₱{selectedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <button
          className="add-to-cart"
          style={{ width: "100%", fontSize: 18, padding: 12 }}
          disabled={selectedItems.length === 0}
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Swiftthrift. All rights reserved.</p>
      </footer>
    </div>
  )
}
