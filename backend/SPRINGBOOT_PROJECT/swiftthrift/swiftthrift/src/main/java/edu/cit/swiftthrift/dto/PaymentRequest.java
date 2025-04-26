package edu.cit.swiftthrift.dto;


public class PaymentRequest {
    private Integer orderId; // Not amount anymore!

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }
}
