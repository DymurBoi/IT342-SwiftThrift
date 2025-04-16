package edu.cit.swiftthrift.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.swiftthrift.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Optional<Product> getProductByProductId(Integer productId);
}
