package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.OrderItem;
import edu.cit.swiftthrift.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    
    public List<OrderItem> getAllOrderItem() {
        return orderItemRepository.findAll();
    }

    public OrderItem getOrderItemById(int id) {
        return orderItemRepository.findById(id).orElse(null);
    }

    public OrderItem createOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public OrderItem updateOrderItem(int id, OrderItem orderItem) {
        OrderItem existingOrderItem = orderItemRepository.findById(id).orElse(null);
    
        if (existingOrderItem != null) {
            existingOrderItem.setSubtotal(orderItem.getSubtotal());
            return orderItemRepository.save(existingOrderItem);
        }
        return null; 
    }

    public void deleteOrderItem(int id) {
        orderItemRepository.deleteById(id);
    }
}

