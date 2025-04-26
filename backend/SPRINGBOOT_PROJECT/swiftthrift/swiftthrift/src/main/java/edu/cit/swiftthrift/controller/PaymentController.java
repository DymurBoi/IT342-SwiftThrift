package edu.cit.swiftthrift.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import edu.cit.swiftthrift.dto.PaymentRequest;
import edu.cit.swiftthrift.entity.Order;
import edu.cit.swiftthrift.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/create-payment-intent")
    public Map<String, String> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) throws StripeException {
        // 1. Fetch the Order from database
        Order order = orderRepository.findById(paymentRequest.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 2. Convert totalPrice to cents (Stripe needs cents)
        long amount = Math.round(order.getTotalPrice() * 100);

        // 3. Create PaymentIntent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency("usd") // or "php"
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        // 4. Return clientSecret to frontend
        Map<String, String> responseData = new HashMap<>();
        responseData.put("clientSecret", intent.getClientSecret());

        return responseData;
    }
}

