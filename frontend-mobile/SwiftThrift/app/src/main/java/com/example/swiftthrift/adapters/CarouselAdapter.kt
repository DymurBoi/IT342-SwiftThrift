package com.example.swiftthrift.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.swiftthrift.R
import com.example.swiftthrift.models.Product

class CarouselAdapter(private val productList: List<Product>) :
    RecyclerView.Adapter<CarouselAdapter.CarouselViewHolder>() {

    class CarouselViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val productImage: ImageView = itemView.findViewById(R.id.carousel_product_image)
        val productName: TextView = itemView.findViewById(R.id.carousel_product_name)
        val productPrice: TextView = itemView.findViewById(R.id.carousel_product_price)
        val addToCartButton: ImageView = itemView.findViewById(R.id.carousel_add_to_cart)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CarouselViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_carousel_product, parent, false)
        return CarouselViewHolder(view)
    }

    override fun onBindViewHolder(holder: CarouselViewHolder, position: Int) {
        val product = productList[position]
        
        holder.productImage.setImageResource(product.imageResId)
        holder.productName.text = product.name
        holder.productPrice.text = "${product.price} PHP"
        
        holder.itemView.setOnClickListener {
            Toast.makeText(holder.itemView.context, "Featured: ${product.name}", Toast.LENGTH_SHORT).show()
            // Implement product detail view
        }
        
        holder.addToCartButton.setOnClickListener {
            Toast.makeText(holder.itemView.context, "${product.name} added to cart", Toast.LENGTH_SHORT).show()
            // Implement add to cart functionality
        }
    }

    override fun getItemCount(): Int = productList.size
}

