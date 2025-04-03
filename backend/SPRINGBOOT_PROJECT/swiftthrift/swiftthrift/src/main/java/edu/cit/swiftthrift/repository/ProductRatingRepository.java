package edu.cit.swiftthrift.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.swiftthrift.entity.ProductRating;

public interface ProductRatingRepository extends JpaRepository<ProductRating, Integer> {
    List<ProductRating> findByProductId(int productId);
}

