"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import "../styles.css" // <-- Fix: use correct relative path

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [product, setProduct] = useState({ name: "", description: "", price: "" })
  const [category, setCategory] = useState({ categoryName: "" })
  const [files, setFiles] = useState(null)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("product")

  const handleSignIn = async () => {
    try {
      setError("")
      const response = await axios.post("http://localhost:8080/api/admins/login")
      if (response.status === 200) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    }
  }

  const handleAddProduct = async () => {
    try {
      setError("")
      if (!product.name || !product.description || !product.price) {
        setError("Please fill in all product fields.")
        return
      }

      const formData = new FormData()
      formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }))
      if (files) {
        Array.from(files).forEach((file) => formData.append("files", file))
      }

      await axios.post("http://localhost:8080/api/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert("Product added successfully!")
      setProduct({ name: "", description: "", price: "" })
      setFiles(null)

      // Trigger re-fetch of products on the ProductsPage
      window.dispatchEvent(new Event("productsUpdated"))
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message)
      setError("Error adding product: " + (error.response?.data || error.message))
    }
  }

  const handleAddCategory = async () => {
    try {
      setError("")
      if (!category.categoryName) {
        setError("Please enter a category name")
        return
      }

      await axios.post("http://localhost:8080/api/categories/create", category)
      alert("Category added successfully!")
      setCategory({ categoryName: "" })
    } catch (error) {
      setError("Error adding category: " + (error.response?.data?.message || error.message))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <nav className="navbar">
          <div className="logo">Swiftthrift</div>
          <ul className="nav-links">
            <li>
              <a onClick={() => router.push("/")}>Dashboard</a>
            </li>
            <li>
              <a onClick={() => router.push("/products")}>Products</a>
            </li>
            <li>
              <a onClick={() => router.push("/about")}>About Us</a>
            </li>
          </ul>
        </nav>

        <div className="auth-container">
          <div className="auth-forms">
            {error && <div className="error-message">{error}</div>}
            <form
              className="login-form"
              onSubmit={(e) => {
                e.preventDefault()
                handleSignIn()
              }}
            >
              <h2>Admin Login</h2>
              <p className="form-description">Sign in to access the admin dashboard</p>
              <button type="submit" className="submit-btn">
                Login (Demo Mode)
              </button>
              <p className="form-note">
                Note: NEED PA LOG IN AND PASSWORD FOR DEMO RANII
              </p>
            </form>
          </div>
        </div>

        <footer className="footer">
          <p>&copy; 2025 Swiftthrift. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">Swiftthrift Admin</div>
        <ul className="nav-links">
          <li>
            <a onClick={() => router.push("/")}>Dashboard</a>
          </li>
          <li>
            <a onClick={() => router.push("/products")}>Products</a>
          </li>
          <li>
            <a onClick={() => router.push("/orders")}>Orders</a>
          </li>
          <li>
            <a onClick={() => router.push("/users")}>Users</a>
          </li>
        </ul>
        <div className="auth-links">
          <button onClick={() => setIsAuthenticated(false)} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Manage your products, categories, and more</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "product" ? "active" : ""}`}
            onClick={() => setActiveTab("product")}
          >
            Add Product
          </button>
          <button
            className={`admin-tab ${activeTab === "category" ? "active" : ""}`}
            onClick={() => setActiveTab("category")}
          >
            Add Category
          </button>
        </div>

        <div className="admin-content">
          {activeTab === "product" && (
            <div className="admin-form">
              <h2>Add New Product</h2>
              <div className="form-group">
                <label htmlFor="product-name">Product Name</label>
                <input
                  type="text"
                  id="product-name"
                  placeholder="Enter product name"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  placeholder="Enter product description"
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  rows="4"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="product-price">Price</label>
                <input
                  type="number"
                  id="product-price"
                  placeholder="Enter price"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="product-images">Product Images</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="product-images"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="file-input"
                  />
                  <div className="file-input-label">{files ? `${files.length} file(s) selected` : "Choose files"}</div>
                </div>
              </div>
              <button onClick={handleAddProduct} className="submit-btn">
                Add Product
              </button>
            </div>
          )}

          {activeTab === "category" && (
            <div className="admin-form">
              <h2>Add New Category</h2>
              <div className="form-group">
                <label htmlFor="category-name">Category Name</label>
                <input
                  type="text"
                  id="category-name"
                  placeholder="Enter category name"
                  value={category.categoryName}
                  onChange={(e) => setCategory({ ...category, categoryName: e.target.value })}
                />
              </div>
              <button onClick={handleAddCategory} className="submit-btn">
                Add Category
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Swiftthrift. All rights reserved.</p>
      </footer>
    </div>
  )
}