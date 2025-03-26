package edu.cit.swiftthrift.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.entity.User;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Optional<Product> findByProductID(int productId); 
}
