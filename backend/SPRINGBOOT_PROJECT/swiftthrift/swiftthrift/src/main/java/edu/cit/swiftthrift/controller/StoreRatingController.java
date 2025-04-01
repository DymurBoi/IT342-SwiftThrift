package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.StoreRating;
import edu.cit.swiftthrift.service.StoreRatingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
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
    @PostMapping("/create")
    public ResponseEntity<StoreRating> createStoreRating(@RequestBody StoreRating rating) {
        StoreRating savedRating = storeRatingService.createStoreRating(rating);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRating);
    }

    // Read All
    @GetMapping("/all")
    public List<StoreRating> getAllStoreRatings() {
        return storeRatingService.getAllStoreRatings();
    }

    // Read by ID
    @GetMapping("/get/{ratingId}")
    public ResponseEntity<StoreRating> getStoreRatingById(@PathVariable int ratingId) {
        StoreRating rating = storeRatingService.getStoreRatingById(ratingId);
        return rating != null ? ResponseEntity.ok(rating) : ResponseEntity.notFound().build();
    }

    // Update
    @PutMapping("/update/{ratingId}")
    public ResponseEntity<StoreRating> updateStoreRating(@PathVariable int ratingId, @RequestBody StoreRating rating) {
        StoreRating updatedRating = storeRatingService.updateStoreRating(ratingId, rating);
        
        if (updatedRating != null) {
            return ResponseEntity.ok(updatedRating);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/delete/{ratingId}")
    public ResponseEntity<Void> deleteStoreRating(@PathVariable int ratingId) {
        boolean deleted = storeRatingService.deleteStoreRating(ratingId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
