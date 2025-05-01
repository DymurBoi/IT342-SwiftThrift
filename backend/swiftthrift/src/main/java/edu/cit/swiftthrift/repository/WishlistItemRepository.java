package edu.cit.swiftthrift.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.swiftthrift.entity.WishlistItem;
import edu.cit.swiftthrift.entity.Wishlist;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Integer> {
    List<WishlistItem> findByWishlist(Wishlist wishlist);
}
