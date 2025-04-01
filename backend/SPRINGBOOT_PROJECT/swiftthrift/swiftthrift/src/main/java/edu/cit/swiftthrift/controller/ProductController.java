package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.entity.StoreRating;
import edu.cit.swiftthrift.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Create
    @PostMapping("/create")
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    // Read All
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Read by ID
    @GetMapping("/get/{productId}")
    public Product getProductById(@PathVariable int productId) {
        return productService.getProductById(productId);
    }

    // Update
  @PutMapping("/put/{productId}")
    public Product updateRating(@PathVariable int productId, @RequestBody Product product) {
        Product existingProduct = productService.getProductById(productId);
        
        if (existingProduct != null) {
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setImageUrl(product.getImageUrl());
            return productService.createProduct(existingProduct);
        } else {
            throw new RuntimeException("Product with ID " + productId + " not found.");
        }
    }
    // Delete
    @DeleteMapping("/delete/{productId}")
    public String deleteProduct(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return "Product deleted successfully!";
    }
}
