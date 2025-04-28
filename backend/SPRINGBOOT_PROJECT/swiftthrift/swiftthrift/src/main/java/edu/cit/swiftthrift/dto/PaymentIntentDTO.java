package edu.cit.swiftthrift.dto;

import lombok.Data;

@Data
public class PaymentIntentDTO {
    private String userId; // Frontend sends userId as string
    private Long amount;   // Amount in cents
    private String currency;
    private String clientSecret; // Stripe Session ID
}
