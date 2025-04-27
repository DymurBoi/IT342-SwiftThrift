package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.Wishlist;
import edu.cit.swiftthrift.service.WishlistService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // Create
    @PostMapping("/create")
    public ResponseEntity<Wishlist> createWishlist(@RequestBody Wishlist wishlist) {
        Wishlist savedWishlist = wishlistService.createWishlist(wishlist);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedWishlist);
    }

    // Read All
    @GetMapping("/all")
    public List<Wishlist> getAllWishlists() {
        return wishlistService.getAllWishlists();
    }

    // Read by ID
    @GetMapping("/get/{wishlistId}")
    public ResponseEntity<Wishlist> getWishlistById(@PathVariable int wishlistId) {
        Wishlist wishlist = wishlistService.getWishlistById(wishlistId);
        return wishlist != null ? ResponseEntity.ok(wishlist) : ResponseEntity.notFound().build();
    }

    // Update
    @PutMapping("/update/{wishlistId}")
    public ResponseEntity<Wishlist> updateWishlist(@PathVariable int wishlistId, @RequestBody Wishlist wishlist) {
        Wishlist updatedWishlist = wishlistService.updateWishlist(wishlistId, wishlist);
        
        if (updatedWishlist != null) {
            return ResponseEntity.ok(updatedWishlist);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/delete/{wishlistId}")
    public ResponseEntity<Void> deleteWishlist(@PathVariable int wishlistId) {
        boolean deleted = wishlistService.deleteWishlist(wishlistId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/byUser/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlistByUserId(@PathVariable int userId) {
        List<Wishlist> wishlist = wishlistService.getWishlistByUserId(userId);
        return ResponseEntity.ok(wishlist);
    }
}
