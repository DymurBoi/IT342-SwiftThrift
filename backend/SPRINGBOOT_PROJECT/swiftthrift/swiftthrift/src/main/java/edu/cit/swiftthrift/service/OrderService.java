package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Order;
import edu.cit.swiftthrift.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(int id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(int id, Order order) {
        Order existingOrder = orderRepository.findById(id).orElse(null);
    
        if (existingOrder != null) {
            existingOrder.setTotalPrice(order.getTotalPrice());
            existingOrder.setStatus(order.getStatus());
            existingOrder.setCreatedAt(order.getCreatedAt());
            return orderRepository.save(existingOrder);
        }
        return null; 
    }

    public void deleteOrder(int id) {
        orderRepository.deleteById(id);
    }
}
