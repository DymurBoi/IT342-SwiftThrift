package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.ProductRating;
import edu.cit.swiftthrift.service.ProductRatingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class ProductRatingController {

    private final ProductRatingService productRatingService;

    public ProductRatingController(ProductRatingService productRatingService) {
        this.productRatingService = productRatingService;
    }

    // Create
    @PostMapping
    public ProductRating createProductRating(@RequestBody ProductRating rating) {
        return productRatingService.createProductRating(rating);
    }

    // Read All
    @GetMapping
    public List<ProductRating> getAllProductRatings() {
        return productRatingService.getAllProductRatings();
    }

    // Read by ID
    @GetMapping("/{ratingId}")
    public ProductRating getRatingById(@PathVariable int ratingId) {
        return productRatingService.getProductRatingById(ratingId);
    }

    // Update
    @PutMapping("/{ratingId}")
    public ProductRating updateRating(@PathVariable int ratingId, @RequestBody ProductRating rating) {
        ProductRating existingRating = productRatingService.getProductRatingById(ratingId);
        
        if (existingRating != null) {
            existingRating.setName(rating.getName());
            existingRating.setRating(rating.getRating());
            existingRating.setDate(rating.getDate());
            return productRatingService.createProductRating(existingRating);
        } else {
            throw new RuntimeException("Rating with ID " + ratingId + " not found.");
        }
    }

    // Delete
    @DeleteMapping("/{ratingId}")
    public String deleteRating(@PathVariable int ratingId) {
        productRatingService.deleteProductRating(ratingId);
        return "Rating deleted successfully!";
    }
}
