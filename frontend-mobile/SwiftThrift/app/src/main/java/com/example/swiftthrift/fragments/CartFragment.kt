package com.example.swiftthrift.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.swiftthrift.R
import com.example.swiftthrift.adapters.CartAdapter
import com.example.swiftthrift.models.Product

class CartFragment : Fragment() {

    private lateinit var cartRecyclerView: RecyclerView
    private lateinit var emptyCartText: TextView
    private lateinit var totalPriceText: TextView
    private lateinit var checkoutButton: Button
    private lateinit var cartAdapter: CartAdapter
    private val cartItems = ArrayList<Product>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_cart, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Initialize views
        cartRecyclerView = view.findViewById(R.id.cart_recycler_view)
        emptyCartText = view.findViewById(R.id.empty_cart_text)
        totalPriceText = view.findViewById(R.id.total_price)
        checkoutButton = view.findViewById(R.id.checkout_button)

        // Set up RecyclerView
        cartRecyclerView.layoutManager = LinearLayoutManager(context)

        // Load sample data
        loadSampleData()

        // Set up adapter
        cartAdapter = CartAdapter(cartItems) { updateTotalPrice() }
        cartRecyclerView.adapter = cartAdapter

        // Update total price
        updateTotalPrice()

        // Show empty text if cart is empty
        updateCartVisibility()

        // Set up checkout button
        checkoutButton.setOnClickListener {
            if (cartItems.isNotEmpty()) {
                Toast.makeText(context, "Proceeding to checkout...", Toast.LENGTH_SHORT).show()
                // Implement checkout logic here
            } else {
                Toast.makeText(context, "Your cart is empty", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun updateTotalPrice() {
        val total = cartItems.sumOf { it.price }
        totalPriceText.text = "$total PHP"
    }

    private fun updateCartVisibility() {
        if (cartItems.isEmpty()) {
            emptyCartText.visibility = View.VISIBLE
            cartRecyclerView.visibility = View.GONE
        } else {
            emptyCartText.visibility = View.GONE
            cartRecyclerView.visibility = View.VISIBLE
        }
    }

    private fun loadSampleData() {
        // Sample cart items (for demo purposes)
        cartItems.add(Product(1, "Navy Jacket Set", 200.0, R.drawable.placeholder_image))
        cartItems.add(Product(3, "Black T-Shirt", 200.0, R.drawable.placeholder_image))
    }
}

