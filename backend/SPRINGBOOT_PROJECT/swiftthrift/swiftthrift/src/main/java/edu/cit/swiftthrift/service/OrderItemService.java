package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Order;
import edu.cit.swiftthrift.entity.OrderItem;
import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.repository.OrderItemRepository;
import edu.cit.swiftthrift.repository.OrderRepository;
import edu.cit.swiftthrift.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    public OrderItem getOrderItemById(int id) {
        return orderItemRepository.findById(id).orElse(null);
    }

    public OrderItem createOrderItem(OrderItem orderItem) {
        // Ensure the associated order exists
        if (orderItem.getOrder() != null) {
            Order order = orderRepository.findById(orderItem.getOrder().getOrderId()).orElse(null);
            orderItem.setOrder(order);
        }

        // Ensure the associated product exists
        if (orderItem.getProduct() != null) {
            Product product = productRepository.findById(orderItem.getProduct().getProductId()).orElse(null);
            orderItem.setProduct(product);
        }

        return orderItemRepository.save(orderItem);
    }

    public OrderItem updateOrderItem(int id, OrderItem updatedOrderItem) {
        Optional<OrderItem> existingOrderItemOpt = orderItemRepository.findById(id);

        if (existingOrderItemOpt.isPresent()) {
            OrderItem existingOrderItem = existingOrderItemOpt.get();
            existingOrderItem.setSubtotal(updatedOrderItem.getSubtotal());

            // Update associated order if needed
            if (updatedOrderItem.getOrder() != null) {
                Order order = orderRepository.findById(updatedOrderItem.getOrder().getOrderId()).orElse(null);
                existingOrderItem.setOrder(order);
            }

            // Update associated product if needed
            if (updatedOrderItem.getProduct() != null) {
                Product product = productRepository.findById(updatedOrderItem.getProduct().getProductId()).orElse(null);
                existingOrderItem.setProduct(product);
            }

            return orderItemRepository.save(existingOrderItem);
        }
        return null;
    }

    public void deleteOrderItem(int id) {
        orderItemRepository.deleteById(id);
    }

    public List<OrderItem> getOrderItemsByOrderId(Integer orderId) {
        return orderItemRepository.findByOrderOrderId(orderId);
    }
}
