package edu.cit.swiftthrift.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.swiftthrift.entity.ProductRating;

public interface ProductRatingRepository extends JpaRepository<ProductRating, Integer> {
    Optional<ProductRating> findByProductRatingID(int productRatingId); 
}

