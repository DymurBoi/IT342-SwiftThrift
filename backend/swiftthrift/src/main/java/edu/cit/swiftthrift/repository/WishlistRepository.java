package edu.cit.swiftthrift.repository;


import edu.cit.swiftthrift.entity.Wishlist;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    List<Wishlist> findByUserUserId(Integer userId);
}

