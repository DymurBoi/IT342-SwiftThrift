package edu.cit.swiftthrift.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.cit.swiftthrift.entity.Wishlist;
import edu.cit.swiftthrift.entity.WishlistItem;
import edu.cit.swiftthrift.service.WishlistItemService;

@RestController
@RequestMapping("/api/wishlistItems")
public class WishlistItemController {

    @Autowired
    private WishlistItemService wishlistItemService;

    @PostMapping("/create")
    public ResponseEntity<WishlistItem> create(@RequestBody WishlistItem item) {
        return ResponseEntity.ok(wishlistItemService.addWishlistItem(item));
    }

    @GetMapping("/all")
    public List<WishlistItem> getAll() {
        return wishlistItemService.getAllWishlistItems();
    }

    @GetMapping("/get/{wishlistItemId}")
    public ResponseEntity<WishlistItem> getById(@PathVariable Integer wishlistItemid) {
        Optional<WishlistItem> item = wishlistItemService.getWishlistItemById(wishlistItemid);
        return item.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{wishlistItemid}")
    public ResponseEntity<WishlistItem> update(@PathVariable Integer id, @RequestBody WishlistItem updatedItem) {
        Optional<WishlistItem> existing = wishlistItemService.getWishlistItemById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(wishlistItemService.updateWishlistItem(updatedItem));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        wishlistItemService.deleteWishlistItem(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/wishlist/{wishlistId}")
    public ResponseEntity<List<WishlistItem>> getByWishlist(@PathVariable Integer wishlistId) {
        Wishlist wishlist = new Wishlist();
        wishlistItemService.findWishlistItemsByWishlist(wishlist);
        return ResponseEntity.ok(wishlistItemService.findWishlistItemsByWishlist(wishlist));
    }
}
