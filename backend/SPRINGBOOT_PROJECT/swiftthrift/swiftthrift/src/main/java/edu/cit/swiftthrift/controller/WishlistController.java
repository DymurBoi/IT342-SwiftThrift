package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.Wishlist;
import edu.cit.swiftthrift.service.WishlistService;

import org.springframework.beans.factory.annotation.Autowired;
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
    public Wishlist createWishlist(@RequestBody Wishlist wishlist) {
        return wishlistService.createWishlist(wishlist);
    }

    // Read All
    @GetMapping("/all")
    public List<Wishlist> getAllWishlist() {
        return wishlistService.getAllWishlists();
    }

    // Read by ID
    @GetMapping("/get/{wishlistId}")
    public Wishlist getWishlistById(@PathVariable int wishlistId) {
        return wishlistService.getWishlistById(wishlistId);
    }

    // Update
    @PutMapping("/put/{wishlistId}")
    public Wishlist updateWishlist(@PathVariable int wishlistId, @RequestBody Wishlist wishlist) {
        Wishlist existingWishlist = wishlistService.getWishlistById(wishlistId);
        
        if (existingWishlist != null) {
            existingWishlist.setAddedAt(wishlist.getAddedAt());
            return wishlistService.createWishlist(existingWishlist);
        } else {
            throw new RuntimeException("Wishlist with ID " + wishlistId + " not found.");
        }
    }

    // Delete
    @DeleteMapping("/delete/{wishlistId}")
    public String deleteWishlist(@PathVariable int wishlistId) {
        wishlistService.deleteWishlist(wishlistId);
        return "Wishlist deleted successfully!";
    }
}



