package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Create
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    // Read All
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Read by ID
    @GetMapping("/{productId}")
    public Product getProductById(@PathVariable int productId) {
        return productService.getProductById(productId);
    }

    // Update
    @PutMapping("/{productId}")
    public Product updateProduct(@PathVariable int productId, @RequestBody Product product) {
        product.setProductId(productId);
        return productService.saveProduct(product);
    }

    // Delete
    @DeleteMapping("/{productId}")
    public String deleteProduct(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return "Product deleted successfully!";
    }
}
