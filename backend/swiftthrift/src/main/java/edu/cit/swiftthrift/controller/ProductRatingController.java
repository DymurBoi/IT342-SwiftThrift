package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.ProductRating;
import edu.cit.swiftthrift.service.ProductRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/producRatings")
public class ProductRatingController {
    @Autowired
    private final ProductRatingService productRatingService;

    public ProductRatingController(ProductRatingService productRatingService) {
        this.productRatingService = productRatingService;
    }

    // Create
    @PostMapping("/create")
    public ResponseEntity<ProductRating> createProductRating(@RequestBody ProductRating rating) {
        ProductRating savedRating = productRatingService.createProductRating(rating);
        return ResponseEntity.ok(savedRating);
    }

    // Read All
    @GetMapping("/all")
    public ResponseEntity<List<ProductRating>> getAllProductRatings() {
        return ResponseEntity.ok(productRatingService.getAllProductRatings());
    }

    // Read by ID
    @GetMapping("/get/{ratingId}")
    public ResponseEntity<ProductRating> getRatingById(@PathVariable int ratingId) {
        ProductRating rating = productRatingService.getProductRatingById(ratingId);
        return rating != null ? ResponseEntity.ok(rating) : ResponseEntity.notFound().build();
    }

    // Update
    @PutMapping("/update/{ratingId}")
    public ResponseEntity<ProductRating> updateRating(@PathVariable int ratingId, @RequestBody ProductRating rating) {
        ProductRating updatedRating = productRatingService.updateProductRating(ratingId, rating);
        return updatedRating != null ? ResponseEntity.ok(updatedRating) : ResponseEntity.notFound().build();
    }

    // Delete
    @DeleteMapping("/delete/{ratingId}")
    public ResponseEntity<String> deleteRating(@PathVariable int ratingId) {
        productRatingService.deleteProductRating(ratingId);
        return ResponseEntity.ok("Rating deleted successfully!");
    }
    @GetMapping("/byProduct/{productId}")
    public ResponseEntity<List<ProductRating>> getProductRatingsByProductId(@PathVariable int productId) {
        List<ProductRating> ratings = productRatingService.getProductRatingsByProductId(productId);
        return ResponseEntity.ok(ratings);
    }
}
