package edu.cit.swiftthrift.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.swiftthrift.entity.ProductRating;

public interface ProductRatingRepository extends JpaRepository<ProductRating, Integer> {
   
}

