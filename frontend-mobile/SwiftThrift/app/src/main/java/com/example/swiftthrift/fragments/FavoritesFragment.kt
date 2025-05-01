package com.example.swiftthrift.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.swiftthrift.R
import com.example.swiftthrift.adapters.ProductAdapter
import com.example.swiftthrift.models.Product

class FavoritesFragment : Fragment() {

    private lateinit var favoritesRecyclerView: RecyclerView
    private lateinit var emptyFavoritesText: TextView
    private lateinit var productAdapter: ProductAdapter
    private val favoritesList = ArrayList<Product>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_favorites, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Initialize views
        favoritesRecyclerView = view.findViewById(R.id.favorites_recycler_view)
        emptyFavoritesText = view.findViewById(R.id.empty_favorites_text)

        // Set up RecyclerView
        favoritesRecyclerView.layoutManager = GridLayoutManager(context, 2)

        // Load sample data
        loadSampleData()

        // Set up adapter
        productAdapter = ProductAdapter(favoritesList)
        favoritesRecyclerView.adapter = productAdapter

        // Show empty text if no favorites
        if (favoritesList.isEmpty()) {
            emptyFavoritesText.visibility = View.VISIBLE
            favoritesRecyclerView.visibility = View.GONE
        } else {
            emptyFavoritesText.visibility = View.GONE
            favoritesRecyclerView.visibility = View.VISIBLE
        }
    }

    private fun loadSampleData() {
        // Sample favorites (for demo purposes)
        favoritesList.add(Product(2, "Gray Hoodie", 200.0, R.drawable.placeholder_image))
        favoritesList.add(Product(5, "White Sneakers", 300.0, R.drawable.placeholder_image))
    }
}

