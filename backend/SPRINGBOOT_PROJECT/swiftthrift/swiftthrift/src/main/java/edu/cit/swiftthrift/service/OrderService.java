package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Order;
import edu.cit.swiftthrift.entity.OrderItem;
import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.repository.OrderRepository;
import edu.cit.swiftthrift.repository.OrderItemRepository;
import edu.cit.swiftthrift.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository; // Repository for OrderItem

    @Autowired
    private UserRepository userRepository; // Repository for User
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(int id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order createOrder(Order order) {
        // Ensure the user exists
        if (order.getUser() != null) {
            User user = userRepository.findById(order.getUser().getUserId()).orElse(null);
            order.setUser(user);
        }

        double total = 0.0;

        // Handle OrderItems
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                item.setOrder(order);
                total += item.getSubtotal(); // Assuming subtotal is already calculated as quantity * price
            }
        }

        order.setTotalPrice(total);
        order.setStatus("PENDING"); // default status
        order.setCreatedAt(new java.sql.Date(System.currentTimeMillis()));

        // 🆕 Set delivery date (5 days after createdAt)
        long fiveDaysInMillis = 5L * 24 * 60 * 60 * 1000;
        java.sql.Date deliveryDate = new java.sql.Date(order.getCreatedAt().getTime() + fiveDaysInMillis);
        order.setDeliveryDate(deliveryDate);

        // Save the order first (to generate ID for cascade)
        Order savedOrder = orderRepository.save(order);

        // Now save the order items with the generated order ID
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                item.setOrder(savedOrder);
                orderItemRepository.save(item);
            }
        }

        return savedOrder;
    }

    public Order updateOrder(int id, Order order) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);

        if (existingOrderOpt.isPresent()) {
            Order existingOrder = existingOrderOpt.get();

            if (order.getOrderItems() != null) {
                // Remove old items
                orderItemRepository.deleteAll(existingOrder.getOrderItems());
                existingOrder.getOrderItems().clear();

                // Add new items
                List<OrderItem> updatedItems = order.getOrderItems();
                double newTotal = 0.0;
                for (OrderItem item : updatedItems) {
                    item.setOrder(existingOrder);
                    newTotal += item.getSubtotal();
                    orderItemRepository.save(item);
                }
                existingOrder.setOrderItems(updatedItems);
                existingOrder.setTotalPrice(newTotal);
            }

            if (order.getUser() != null) {
                User user = userRepository.findById(order.getUser().getUserId()).orElse(null);
                existingOrder.setUser(user);
            }

            if (order.getStatus() != null) {
                existingOrder.setStatus(order.getStatus());
            }

            if (order.getCreatedAt() != null) {
                existingOrder.setCreatedAt(order.getCreatedAt());
            }

            if (order.getDeliveryDate() != null) {
                existingOrder.setDeliveryDate(order.getDeliveryDate());
            }

            return orderRepository.save(existingOrder);
        }

        return null;
    }


    public void deleteOrder(int id) {
        orderRepository.deleteById(id);
    }

    public List<Order> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserUserId(userId);
    }

    public Order approveOrder(int orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);

        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            if ("PENDING".equalsIgnoreCase(order.getStatus())) {
                order.setStatus("ACCEPTED"); // or "COMPLETED" depending on your flow
                return orderRepository.save(order);
            }
        }
        return null;
    }
}
