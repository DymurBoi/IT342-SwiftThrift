package edu.cit.swiftthrift.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.swiftthrift.entity.Wishlist;
import edu.cit.swiftthrift.entity.WishlistItem;
import edu.cit.swiftthrift.repository.WishlistItemRepository;

@Service
public class WishlistItemService {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    public WishlistItem addWishlistItem(WishlistItem item) {
        return wishlistItemRepository.save(item);
    }

    public List<WishlistItem> getAllWishlistItems() {
        return wishlistItemRepository.findAll();
    }

    public Optional<WishlistItem> getWishlistItemById(Integer id) {
        return wishlistItemRepository.findById(id);
    }

    public WishlistItem updateWishlistItem(WishlistItem item) {
        return wishlistItemRepository.save(item);
    }

    public void deleteWishlistItem(Integer id) {
        wishlistItemRepository.deleteById(id);
    }

    public List<WishlistItem> findWishlistItemsByWishlist(Wishlist wishlist) {
        return wishlistItemRepository.findByWishlist(wishlist);
    }
}
