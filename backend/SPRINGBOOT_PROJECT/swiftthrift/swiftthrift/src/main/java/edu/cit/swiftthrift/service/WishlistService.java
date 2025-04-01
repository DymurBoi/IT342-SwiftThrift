package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Wishlist;
import edu.cit.swiftthrift.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    public List<Wishlist> getAllWishlists() {
        return wishlistRepository.findAll();
    }

    public Wishlist getWishlistById(int id) {
        return wishlistRepository.findById(id).orElse(null);
    }

    public Wishlist createWishlist(Wishlist wishlist) {
        return wishlistRepository.save(wishlist);
    }

    public Wishlist updateWishlist(int id, Wishlist wishlist) {
        Optional<Wishlist> existingWishlistOpt = wishlistRepository.findById(id);
    
        if (existingWishlistOpt.isPresent()) {
            Wishlist existingWishlist = existingWishlistOpt.get();
            existingWishlist.setAddedAt(wishlist.getAddedAt());
            return wishlistRepository.save(existingWishlist);
        }
        return null; 
    }

    public boolean deleteWishlist(int id) {
        if (wishlistRepository.existsById(id)) {
            wishlistRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
