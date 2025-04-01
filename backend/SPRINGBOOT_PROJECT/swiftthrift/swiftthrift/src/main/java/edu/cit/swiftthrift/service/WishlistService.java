package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Wishlist;
import edu.cit.swiftthrift.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
        Wishlist existingWishlist = wishlistRepository.findById(id).orElse(null);
    
        if (existingWishlist != null) {
            existingWishlist.setAddedAt(wishlist.getAddedAt());
            return wishlistRepository.save(existingWishlist);
        }
        return null; 
    }

    public void deleteWishlist(int id) {
        wishlistRepository.deleteById(id);
    }
}


