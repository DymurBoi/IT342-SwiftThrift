package edu.cit.swiftthrift.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.swiftthrift.entity.StoreRating;

public interface StoreRatingRepository extends JpaRepository<StoreRating, Integer> {
    Optional<StoreRating> findByProductRatingID(int productRatingId); 
}

