    package edu.cit.swiftthrift.entity;
    
    import java.sql.Date;
    import java.util.ArrayList;
    import java.util.List;
    
    import jakarta.persistence.CascadeType;
    import jakarta.persistence.Entity;
    import jakarta.persistence.GeneratedValue;
    import jakarta.persistence.GenerationType;
    import jakarta.persistence.Id;
    import jakarta.persistence.JoinColumn;
    import jakarta.persistence.ManyToOne;
    import jakarta.persistence.OneToMany;
    import jakarta.persistence.Table;
    
    @Entity
    @Table(name = "orders")
    public class Order {
        
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer orderId;
      
        private double totalPrice;
        private String status; // PENDING, COMPLETED, CANCELLED
        private Date createdAt;
        private Date deliveryDate;


        // Getters and Setters
    
        public Integer getOrderId() {
            return orderId;
        }
        public double getTotalPrice() {
            return totalPrice;
        }
        public void setTotalPrice(double totalPrice) {
            this.totalPrice = totalPrice;
        }
        public String getStatus() {
            return status;
        }
        public void setStatus(String status) {
            this.status = status;
        }
        public Date getCreatedAt() {
            return createdAt;
        }
        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }
        public Date getDeliveryDate() {
            return deliveryDate;
        }

        public void setDeliveryDate(Date deliveryDate) {
            this.deliveryDate = deliveryDate;
        }


        //Relationships
        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user;
    
        @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
        private List<OrderItem> orderItems = new ArrayList<>();
    
        // Getters and Setters
        public User getUser() {
            return user;
        }
    
        public void setUser(User user) {
            this.user = user;
        }
    
        public List<OrderItem> getOrderItems() {
            return orderItems;
        }
    
        public void setOrderItems(List<OrderItem> orderItems) {
            this.orderItems = orderItems;
        }
    }