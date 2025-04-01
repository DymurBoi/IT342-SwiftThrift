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

        // Ensure order items exist
        if (order.getOrderItems() != null) {
            for (OrderItem orderItem : order.getOrderItems()) {
                orderItem.setOrder(order); // Set order reference
                orderItemRepository.save(orderItem); // Save order item
            }
        }

        return orderRepository.save(order);
    }

    public Order updateOrder(int id, Order order) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);

        if (existingOrderOpt.isPresent()) {
            Order existingOrder = existingOrderOpt.get();
            existingOrder.setTotalPrice(order.getTotalPrice());
            existingOrder.setStatus(order.getStatus());
            existingOrder.setCreatedAt(order.getCreatedAt());

            // Update User if needed
            if (order.getUser() != null) {
                User user = userRepository.findById(order.getUser().getUserId()).orElse(null);
                existingOrder.setUser(user);
            }

            // Update associated OrderItems
            if (order.getOrderItems() != null) {
                for (OrderItem orderItem : order.getOrderItems()) {
                    OrderItem existingOrderItem = orderItemRepository.findById(orderItem.getOrderItemid()).orElse(null);
                    if (existingOrderItem != null) {
                        existingOrderItem.setOrder(existingOrder);
                        orderItemRepository.save(existingOrderItem);
                    }
                }
                existingOrder.setOrderItems(order.getOrderItems());
            }

            return orderRepository.save(existingOrder);
        }
        return null;
    }

    public void deleteOrder(int id) {
        orderRepository.deleteById(id);
    }
}
