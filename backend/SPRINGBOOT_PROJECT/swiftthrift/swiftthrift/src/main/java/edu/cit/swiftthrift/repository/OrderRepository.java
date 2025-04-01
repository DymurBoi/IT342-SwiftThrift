package edu.cit.swiftthrift.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.swiftthrift.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    //Optional<Order> findByOrderId(String username);
}