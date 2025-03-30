package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.StoreRating;
import edu.cit.swiftthrift.service.StoreRatingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class StoreRatingController {

    private final StoreRatingService storeRatingService;

    public StoreRatingController(StoreRatingService storeRatingService) {
        this.storeRatingService = storeRatingService;
    }

    // Create
    @PostMapping
    public StoreRating createProductRating(@RequestBody StoreRating rating) {
        return storeRatingService.createProductRating(rating);
    }

    // Read All
    @GetMapping
    public List<StoreRating> getAllProductRatings() {
        return storeRatingService.getAllProductRatings();
    }

    // Read by ID
    @GetMapping("/{ratingId}")
    public StoreRating getRatingById(@PathVariable int ratingId) {
        return storeRatingService.getProductRatingById(ratingId);
    }

    // Update
    @PutMapping("/{ratingId}")
    public StoreRating updateRating(@PathVariable int ratingId, @RequestBody StoreRating rating) {
        StoreRating existingRating = storeRatingService.getProductRatingById(ratingId);
        
        if (existingRating != null) {
            existingRating.setName(rating.getName());
            existingRating.setRating(rating.getRating());
            existingRating.setDate(rating.getDate());
            return storeRatingService.createProductRating(existingRating);
        } else {
            throw new RuntimeException("Rating with ID " + ratingId + " not found.");
        }
    }

    // Delete
    @DeleteMapping("/{ratingId}")
    public String deleteRating(@PathVariable int ratingId) {
        storeRatingService.deleteProductRating(ratingId);
        return "Rating deleted successfully!";
    }
}


