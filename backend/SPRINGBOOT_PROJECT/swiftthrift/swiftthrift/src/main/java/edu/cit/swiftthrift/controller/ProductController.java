package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<?> createProduct(
            @RequestPart("product") Product product,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        try {
            System.out.println("Received product: " + product);

            Product createdProduct = productService.createProduct(product, files);
            return ResponseEntity.ok(createdProduct);
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("File upload error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed: " + e.getMessage());
        }
    }



    // Read All
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            System.out.println("Fetched " + products.size() + " products");

            // Ensure we're returning a proper list/array
            if (products.isEmpty()) {
                return ResponseEntity.ok(products); // Return empty list
            }

            // Log details for debugging
            for (Product product : products) {
                System.out.println("Product: " + product.getProductId() + ", " + product.getName());
            }

            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.err.println("Error fetching products: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Read by ID
    @GetMapping("/get/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable int productId) {
        Product product = productService.getProductById(productId);
        return product != null ? ResponseEntity.ok(product) : ResponseEntity.notFound().build();
    }

    // Update
    @PutMapping("/update/{productId}")
    public ResponseEntity<?> updateProduct(
            @PathVariable int productId,
            @RequestPart("product") Product product,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        try {
            Product updated = productService.updateProduct(productId, product, files);
            return updated != null
                    ? ResponseEntity.ok(updated)
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating product: " + e.getMessage());
        }
    }

    // Delete
    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product deleted successfully!");
    }
}
