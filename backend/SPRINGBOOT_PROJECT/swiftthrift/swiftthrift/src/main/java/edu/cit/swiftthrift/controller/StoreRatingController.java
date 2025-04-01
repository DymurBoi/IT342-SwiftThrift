package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.StoreRating;
import edu.cit.swiftthrift.service.StoreRatingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store_ratings")
public class StoreRatingController {
    @Autowired
    private StoreRatingService storeRatingService;

    public StoreRatingController(StoreRatingService storeRatingService) {
        this.storeRatingService = storeRatingService;
    }

    // Create
    @PostMapping("/crete")
    public StoreRating createProductRating(@RequestBody StoreRating rating) {
        return storeRatingService.createProductRating(rating);
    }

    // Read All
    @GetMapping("/all")
    public List<StoreRating> getAllProductRatings() {
        return storeRatingService.getAllProductRatings();
    }

    // Read by ID
    @GetMapping("/get/{ratingId}")
    public StoreRating getRatingById(@PathVariable int ratingId) {
        return storeRatingService.getProductRatingById(ratingId);
    }

    // Update
    @PutMapping("/put/{ratingId}")
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
    @DeleteMapping("/delete/{ratingId}")
    public String deleteRating(@PathVariable int ratingId) {
        storeRatingService.deleteProductRating(ratingId);
        return "Rating deleted successfully!";
    }
}


