package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    // Read All
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Read by ID
    @GetMapping("/get/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable int productId) {
        Product product = productService.getProductById(productId);
        return product != null ? ResponseEntity.ok(product) : ResponseEntity.notFound().build();
    }

    // Update
    @PutMapping("/update/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable int productId, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(productId, product);
        return updatedProduct != null ? ResponseEntity.ok(updatedProduct) : ResponseEntity.notFound().build();
    }

    // Delete
    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product deleted successfully!");
    }
}
