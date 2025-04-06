package com.example.swiftthrift.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2
import com.example.swiftthrift.R
import com.example.swiftthrift.adapters.CarouselAdapter
import com.example.swiftthrift.adapters.ProductAdapter
import com.example.swiftthrift.models.Product

class HomeFragment : Fragment() {

    private lateinit var productsRecyclerView: RecyclerView
    private lateinit var productCarousel: ViewPager2
    private lateinit var productAdapter: ProductAdapter
    private lateinit var carouselAdapter: CarouselAdapter
    private val productList = ArrayList<Product>()
    private val featuredProducts = ArrayList<Product>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Initialize RecyclerView
        productsRecyclerView = view.findViewById(R.id.products_recycler_view)
        productsRecyclerView.layoutManager = GridLayoutManager(context, 2)

        // Initialize ViewPager2 for carousel
        productCarousel = view.findViewById(R.id.product_carousel)

        // Load sample data
        loadSampleData()

        // Set up adapters
        productAdapter = ProductAdapter(productList)
        productsRecyclerView.adapter = productAdapter

        carouselAdapter = CarouselAdapter(featuredProducts)
        productCarousel.adapter = carouselAdapter

        // Set page transformer for carousel effect
        val pageMargin = resources.getDimensionPixelOffset(R.dimen.page_margin).toFloat()
        val pageOffset = resources.getDimensionPixelOffset(R.dimen.page_offset).toFloat()

        productCarousel.setPageTransformer { page, position ->
            val myOffset = position * -(2 * pageOffset + pageMargin)
            if (position < -1) {
                page.translationX = -myOffset
            } else if (position <= 1) {
                val scaleFactor = 0.85f.coerceAtLeast(1 - Math.abs(position * 0.15f))
                page.translationX = myOffset
                page.scaleY = scaleFactor
                page.alpha = 0.5f + (scaleFactor - 0.85f) / 0.15f * 0.5f
            } else {
                page.alpha = 0f
                page.translationX = myOffset
            }
        }
    }

    private fun loadSampleData() {
        // Sample products
        productList.add(Product(1, "Navy Jacket Set", 200.0, R.drawable.placeholder_image))
        productList.add(Product(2, "Gray Hoodie", 200.0, R.drawable.placeholder_image))
        productList.add(Product(3, "Black T-Shirt", 200.0, R.drawable.placeholder_image))
        productList.add(Product(4, "Denim Jeans", 250.0, R.drawable.placeholder_image))
        productList.add(Product(5, "White Sneakers", 300.0, R.drawable.placeholder_image))
        productList.add(Product(6, "Beige Cap", 150.0, R.drawable.placeholder_image))

        // Featured products for carousel
        featuredProducts.add(Product(1, "Navy Jacket Set", 200.0, R.drawable.placeholder_image))
        featuredProducts.add(Product(2, "Gray Hoodie", 200.0, R.drawable.placeholder_image))
        featuredProducts.add(Product(3, "Black T-Shirt", 200.0, R.drawable.placeholder_image))
    }
}

