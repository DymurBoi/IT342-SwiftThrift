package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.ProductRating;
import edu.cit.swiftthrift.service.ProductRatingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product_ratings")
public class ProductRatingController {
    @Autowired
    private final ProductRatingService productRatingService;

    public ProductRatingController(ProductRatingService productRatingService) {
        this.productRatingService = productRatingService;
    }

    // Create
    @PostMapping("/create")
    public ProductRating createProductRating(@RequestBody ProductRating rating) {
        return productRatingService.createProductRating(rating);
    }

    // Read All
    @GetMapping("/all")
    public List<ProductRating> getAllProductRatings() {
        return productRatingService.getAllProductRatings();
    }

    // Read by ID
    @GetMapping("/get/{ratingId}")
    public ProductRating getRatingById(@PathVariable int ratingId) {
        return productRatingService.getProductRatingById(ratingId);
    }

    // Update
    @PutMapping("/put/{ratingId}")
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
    @DeleteMapping("/delete/{ratingId}")
    public String deleteRating(@PathVariable int ratingId) {
        productRatingService.deleteProductRating(ratingId);
        return "Rating deleted successfully!";
    }
}
