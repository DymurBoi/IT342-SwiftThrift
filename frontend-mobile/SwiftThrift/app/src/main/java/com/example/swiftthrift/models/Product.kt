package com.example.swiftthrift.models

data class Product(
    val id: Int,
    val name: String,
    val price: Double,
    val imageResId: Int,
    val description: String = ""
)

