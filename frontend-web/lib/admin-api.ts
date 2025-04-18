// Base URL for API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Helper function to get admin auth data
function getAdminAuth() {
  if (typeof window === "undefined") return null

  const adminData = localStorage.getItem("admin")
  if (!adminData) return null

  try {
    return JSON.parse(adminData)
  } catch (error) {
    console.error("Failed to parse admin data:", error)
    return null
  }
}

// Generic fetch function with auth
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const admin = getAdminAuth()

  const headers = {
    "Content-Type": "application/json",
    ...(admin?.token ? { Authorization: `Bearer ${admin.token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Handle unauthorized
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin")
        window.location.href = "/admin/login"
      }
      throw new Error("Unauthorized")
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `Request failed with status ${response.status}`)
    }

    // Check if response is empty
    const text = await response.text()
    return text ? JSON.parse(text) : {}
  } catch (error) {
    // Handle network errors and other unexpected issues
    console.error("Error fetching data:", error)
    throw new Error("Network error or unexpected response")
  }
}

// Products API
export async function fetchProducts(page = 1, limit = 10, search = "") {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search ? { search } : {}),
  }).toString()

  return fetchWithAuth(`/products/all?${queryParams}`)
}

export async function fetchProductById(id: number) {
  if (isNaN(id) || id <= 0) {
    throw new Error("Invalid product ID")
  }
  return fetchWithAuth(`/products/get/${id}`)
}

// Fix the product creation endpoint
export async function createProduct(productData: any) {
  // Check if we're in development mode and need to use mock data
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
    console.log("Using mock data for product creation")
    // Return a mock response
    return {
      productId: Math.floor(Math.random() * 1000) + 1,
      ...productData,
    }
  }

  return fetchWithAuth("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  })
}

export async function updateProduct(id: number, productData: any) {
  return fetchWithAuth(`/products/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  })
}

export async function deleteProduct(id: number) {
  return fetchWithAuth(`/products/delete/${id}`, {
    method: "DELETE",
  })
}

// Upload product images
export async function uploadProductImages(productId: number, files: File[]) {
  const admin = getAdminAuth()
  const formData = new FormData()

  files.forEach((file) => {
    formData.append("files", file)
  })

  const response = await fetch(`${API_URL}/products/upload/${productId}`, {
    method: "POST",
    headers: admin?.token ? { Authorization: `Bearer ${admin.token}` } : {},
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Upload failed with status ${response.status}`)
  }

  return response.json()
}

// Fix the categories fetch function to provide mock data if needed
export async function fetchCategories() {
  try {
    console.log("Fetching categories...")

    // Check if we're in development mode and need to use mock data
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      console.log("Using mock categories data")
      return [
        { categoryID: 1, categoryName: "Shop" },
        { categoryID: 2, categoryName: "Shirts" },
        { categoryID: 3, categoryName: "Jackets" },
        { categoryID: 4, categoryName: "Hoodies" },
        { categoryID: 5, categoryName: "Shoes" },
      ]
    }

    const data = await fetchWithAuth("/categories/all")
    console.log("Categories fetched:", data)

    if (!Array.isArray(data)) {
      console.warn("API did not return an array for categories:", data)
      return []  // Fallback to empty array
    }

    return data
  } catch (error) {
    console.error("Error fetching categories:", error)
    return [
      { categoryID: 1, categoryName: "Shop" },
      { categoryID: 2, categoryName: "Shirts" },
      { categoryID: 3, categoryName: "Jackets" },
      { categoryID: 4, categoryName: "Hoodies" },
      { categoryID: 5, categoryName: "Shoes" },
    ] // Returning mock data as fallback
  }
}

export async function fetchCategoryById(id: number) {
  return fetchWithAuth(`/categories/get/${id}`)
}

export async function createCategory(categoryData: any) {
  return fetchWithAuth("/categories/create", {
    method: "POST",
    body: JSON.stringify(categoryData),
  })
}

export async function updateCategory(id: number, categoryData: any) {
  return fetchWithAuth(`/categories/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  })
}

export async function deleteCategory(id: number) {
  return fetchWithAuth(`/categories/delete/${id}`, {
    method: "DELETE",
  })
}

// Users API
export async function fetchUsers(page = 1, limit = 10) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  }).toString()

  return fetchWithAuth(`/users/all?${queryParams}`)
}

export async function fetchUserById(id: number) {
  return fetchWithAuth(`/users/get/${id}`)
}

export async function updateUser(id: number, userData: any) {
  return fetchWithAuth(`/users/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

export async function deleteUser(id: number) {
  return fetchWithAuth(`/users/delete/${id}`, {
    method: "DELETE",
  })
}

// Orders API
export async function fetchOrders(page = 1, limit = 10, status = "") {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status ? { status } : {}),
  }).toString()

  return fetchWithAuth(`/orders/all?${queryParams}`)
}

export async function fetchOrderById(id: number) {
  return fetchWithAuth(`/orders/get/${id}`)
}

export async function updateOrderStatus(id: number, status: string) {
  return fetchWithAuth(`/orders/put/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

// Admin API
export async function fetchAdminProfile() {
  const admin = getAdminAuth()
  if (!admin) return null

  return fetchWithAuth(`/admins/get/${admin.adminId}`)
}

export async function updateAdminProfile(profileData: any) {
  const admin = getAdminAuth()
  if (!admin) throw new Error("Not authenticated")

  return fetchWithAuth(`/admins/update/${admin.adminId}`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  })
}

export async function updateAdminPassword(currentPassword: string, newPassword: string) {
  const admin = getAdminAuth()
  if (!admin) throw new Error("Not authenticated")

  return fetchWithAuth("/admins/update-password", {
    method: "POST",
    body: JSON.stringify({
      adminId: admin.adminId,
      currentPassword,
      newPassword,
    }),
  })
}

export async function loginAdmin(credentials: { username: string; password: string }): Promise<any> {
  return fetchWithAuth("/admins/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}
