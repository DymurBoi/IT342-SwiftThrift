package edu.cit.swiftthrift.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.swiftthrift.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}
