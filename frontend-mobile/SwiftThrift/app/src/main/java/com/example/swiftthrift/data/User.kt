package com.example.swiftthrift.data

data class User (
    val userId: Int,
    val fname: String,
    val lname: String,
    val email: String,
    val phoneNumber: String,
    val role: String,
    val username: String,
    val password: String,
    val cart: Any?,
    val wishlist: Any?,
    val orders: List<Any>,
    val storeRatings: List<Any>,
    val productRatings: List<Any>
)

