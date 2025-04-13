package edu.cit.swiftthrift.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;
import edu.cit.swiftthrift.service.PaymentService;
import edu.cit.swiftthrift.dto.OrderRequest;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody OrderRequest orderRequest) {
        try {
            BigDecimal totalAmount = orderRequest.getTotalAmount();
            if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
                // Process free order
                // Implement your logic to handle free orders
                return ResponseEntity.ok("Order processed successfully without payment.");
            } else {
                // Process paid order
                Map<String, Object> paymentIntent = paymentService.processPayment(
                    totalAmount, orderRequest.getCurrency(), orderRequest.getDescription());
                return ResponseEntity.ok(paymentIntent);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Payment processing failed: " + e.getMessage());
        }
    }
}
