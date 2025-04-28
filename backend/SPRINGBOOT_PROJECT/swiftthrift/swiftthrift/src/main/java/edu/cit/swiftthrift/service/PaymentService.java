package edu.cit.swiftthrift.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import edu.cit.swiftthrift.dto.PaymentIntentDTO;
import edu.cit.swiftthrift.entity.Payment;
import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.repository.PaymentRepository;
import edu.cit.swiftthrift.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = "sk_test_51RHvE5HX4UZcHBXUn0XzOoFaIxxJ566pvSbJvnZoMyeVpFHVf1yC6Sqzy0yO3pan1Ak7JusJelazVcoUHPZiTnfK00rG6uZX81";
    }

    @Transactional
    public PaymentIntentDTO createPaymentIntent(PaymentIntentDTO paymentIntentDTO) {
        try {
            Integer userId = Integer.parseInt(paymentIntentDTO.getUserId());

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("Received amount in cents: " + paymentIntentDTO.getAmount());

            BigDecimal amountInMainUnit = BigDecimal.valueOf(paymentIntentDTO.getAmount())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            System.out.println("Amount in main currency units: " + amountInMainUnit);

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl("http://localhost:3000/cart")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency(paymentIntentDTO.getCurrency())
                                                    .setUnitAmount(paymentIntentDTO.getAmount())
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("SwiftThrift Purchase")
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .setQuantity(1L)
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);

            Payment payment = Payment.builder()
                    .amount(amountInMainUnit)
                    .currency(paymentIntentDTO.getCurrency())
                    .stripeSessionId(session.getId())
                    .status("PENDING")
                    .user(user)
                    .build();

            paymentRepository.save(payment);

            PaymentIntentDTO response = new PaymentIntentDTO();
            response.setClientSecret(session.getId());

            return response;
        } catch (StripeException e) {
            throw new RuntimeException("Error creating checkout session", e);
        }
    }

    public List<Payment> getPaymentsByUserId(Integer userId) {
        return paymentRepository.findByUserUserId(userId);
    }

    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }

    public Optional<Payment> getPaymentBySessionId(String sessionId) {
        return paymentRepository.findByStripeSessionId(sessionId);
    }

    @Transactional
    public Payment updatePaymentStatus(Long paymentId, String status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment updatePaymentStatusBySessionId(String sessionId, String status) {
        Payment payment = paymentRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    public Payment findPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderOrderId(orderId).orElse(null);
    }
}
