export interface Product {
  productId: number
  name: string
  description: string
  price: number
  imageUrls?: string[]
  condition?: number // 0 for new, 1 for used
  isSold?: boolean
  category?: Category
}

export interface Category {
  categoryID: number
  categoryName: string
}

export interface ProductRating {
  productRatingId: number
  name: string
  comment: string
  rating: number
  date: string
  user?: User
  product?: Product
}

export interface Order {
  orderId: number
  totalPrice: number
  status: string // PENDING, COMPLETED, CANCELLED
  createdAt: string
  user?: User
  orderItems?: OrderItem[]
}

export interface OrderItem {
  orderItemid: number
  subtotal: number
  order?: Order
  product?: Product
}

export interface User {
  userId: number
  username: string
  email: string
  password?: string
  fname?: string
  lname?: string
  phoneNumber?: string
  role?: string
}

export interface Cart {
  cartId: number
  totalPrice: number
  user?: User
  cartItems?: CartItem[]
}

export interface CartItem {
  cartItemId: number
  price: number
  cart?: Cart
  product?: Product
}

export interface Wishlist {
  wishlistId: number
  addedAt: string
  user?: User
  wishlistItems?: WishlistItem[]
}

export interface WishlistItem {
  wishlistid: number
  wishlist?: Wishlist
  product?: Product
}
