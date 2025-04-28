package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.dto.PaymentIntentDTO;
import edu.cit.swiftthrift.entity.Payment;
import edu.cit.swiftthrift.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    public PaymentIntentDTO createPaymentIntent(@RequestBody PaymentIntentDTO paymentIntentDTO) {
        return paymentService.createPaymentIntent(paymentIntentDTO);
    }

    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsByUserId(@PathVariable Integer userId) {
        return paymentService.getPaymentsByUserId(userId);
    }

    @PutMapping("/{paymentId}/status")
    public Payment updatePaymentStatus(@PathVariable Long paymentId, @RequestParam String status) {
        return paymentService.updatePaymentStatus(paymentId, status);
    }

    @PutMapping("/session/{sessionId}/status")
    public Payment updatePaymentStatusBySessionId(@PathVariable String sessionId, @RequestParam String status) {
        return paymentService.updatePaymentStatusBySessionId(sessionId, status);
    }
}
