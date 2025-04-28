package edu.cit.swiftthrift.repository;

import edu.cit.swiftthrift.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserUserId(Integer userId);

    Optional<Payment> findByStripeSessionId(String sessionId);

    Optional<Payment> findByOrderOrderId(Long orderId); // if you relate payments to orders
}
