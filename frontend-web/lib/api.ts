import type { Product, ProductRating, Order, User } from "@/types"

// Base URL for API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Helper function to get the auth token
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Helper function for API requests
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`

  // Get token from localStorage
  const token = getAuthToken()

  // Prepare headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 Unauthorized - could be expired token
  if (response.status === 401) {
    // Clear token and user if unauthorized
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Redirect to login page if we're in a browser context
      window.location.href = "/login"
    }
    throw new Error("Authentication failed. Please log in again.")
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "An error occurred while fetching data")
  }

  return response.json()
}

// Product APIs
export async function fetchProducts(params?: {
  category?: string | null
  minPrice?: number
  maxPrice?: number
  condition?: number
  limit?: number
}): Promise<Product[]> {
  try {
    const products = await fetchAPI<Product[]>("/products/all")

    let filteredProducts = [...products]

    if (params?.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category?.categoryName?.toLowerCase() === params.category,
      )
    }

    if (params?.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.price >= params.minPrice!)
    }

    if (params?.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.price <= params.maxPrice!)
    }

    if (params?.condition !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.condition === params.condition)
    }

    if (params?.limit) {
      filteredProducts = filteredProducts.slice(0, params.limit)
    }

    return filteredProducts
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function fetchProductById(id: number): Promise<Product> {
  return fetchAPI<Product>(`/products/get/${id}`)
}

export async function fetchProductRatings(productId: number): Promise<ProductRating[]> {
  try {
    return await fetchAPI<ProductRating[]>(`/productRatings/byProduct/${productId}`)
  } catch (error) {
    console.error("Error fetching product ratings:", error)
    return []
  }
}

// Order APIs
export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  return fetchAPI<Order>("/orders/create", {
    method: "POST",
    body: JSON.stringify(orderData),
  })
}

export async function fetchOrdersByUserId(userId: number): Promise<Order[]> {
  try {
    return await fetchAPI<Order[]>(`/orders/byUser/${userId}`)
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return []
  }
}

// User APIs
export async function loginUser(credentials: { email: string; password: string }): Promise<any> {
  return fetchAPI<any>("/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export async function registerUser(userData: Partial<User>): Promise<User> {
  return fetchAPI<User>("/users/create", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export async function updateUserProfile(userId: number, userData: Partial<User>): Promise<User> {
  return fetchAPI<User>(`/users/update/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

// Wishlist APIs
export async function fetchWishlistByUserId(userId: number): Promise<any> {
  try {
    return await fetchAPI<any>(`/wishlist/byUser/${userId}`)
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return { items: [] }
  }
}

// New APIs Added

// Fetch all users
export async function fetchUsers(): Promise<User[]> {
  return fetchAPI<User[]>("/users/all")
}

// Create a new product
export async function createProduct(productData: Partial<Product>): Promise<Product> {
  return fetchAPI<Product>("/products/create", {
    method: "POST",
    body: JSON.stringify(productData),
  })
}

// Update a product
export async function updateProduct(productId: number, productData: Partial<Product>): Promise<Product> {
  return fetchAPI<Product>(`/products/update/${productId}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  })
}

// Delete a product
export async function deleteProduct(productId: number): Promise<void> {
  return fetchAPI<void>(`/products/delete/${productId}`, {
    method: "DELETE",
  })
}

