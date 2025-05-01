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

class CartAdapter(
    private val cartItems: MutableList<Product>,
    private val onCartUpdated: () -> Unit
) : RecyclerView.Adapter<CartAdapter.CartViewHolder>() {

    class CartViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val productImage: ImageView = itemView.findViewById(R.id.product_image)
        val productName: TextView = itemView.findViewById(R.id.product_name)
        val productPrice: TextView = itemView.findViewById(R.id.product_price)
        val removeButton: ImageView = itemView.findViewById(R.id.add_to_cart_button)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CartViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_product, parent, false)
        return CartViewHolder(view)
    }

    override fun onBindViewHolder(holder: CartViewHolder, position: Int) {
        val product = cartItems[position]
        
        holder.productImage.setImageResource(product.imageResId)
        holder.productName.text = product.name
        holder.productPrice.text = "${product.price} PHP"
        
        // Change cart icon to remove icon
        holder.removeButton.setImageResource(android.R.drawable.ic_menu_delete)
        
        holder.removeButton.setOnClickListener {
            removeItem(position)
            Toast.makeText(holder.itemView.context, "${product.name} removed from cart", Toast.LENGTH_SHORT).show()
        }
    }

    private fun removeItem(position: Int) {
        cartItems.removeAt(position)
        notifyItemRemoved(position)
        notifyItemRangeChanged(position, cartItems.size)
        onCartUpdated()
    }

    override fun getItemCount(): Int = cartItems.size
}

