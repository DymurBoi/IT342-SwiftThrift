package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.OrderItem;
import edu.cit.swiftthrift.service.OrderItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orderItem")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService ordeItemService) {
        this.orderItemService = ordeItemService;
    }

    // Create
    @PostMapping("/create")
    public OrderItem createOrder(@RequestBody OrderItem orderItem) {
        return orderItemService.createOrderItem(orderItem);
    }

    // Read All
    @GetMapping("/all")
    public List<OrderItem> getAllOrderItem() {
        return orderItemService.getAllOrderItem();
    }

    // Read by ID
    @GetMapping("/{orderItemId}")
    public OrderItem getOrderItemById(@PathVariable int orderItemId) {
        return orderItemService.getOrderItemById(orderItemId);
    }

    // Update
    @PutMapping("/{orderId}")
    public OrderItem updateOrderItem(@PathVariable int orderItemId, @RequestBody OrderItem orderItem) {
        OrderItem existingOrderItem = orderItemService.getOrderItemById(orderItemId);
        
        if (existingOrderItem != null) {
            existingOrderItem.setSubtotal(orderItem.getSubtotal());
            return orderItemService.createOrderItem(existingOrderItem);
        } else {
            throw new RuntimeException("Order Item with ID " + orderItemId + " not found.");
        }
    }

    // Delete
    @DeleteMapping("/{orderId}")
    public String deleteOrderItem(@PathVariable int orderItemId) {
        orderItemService.deleteOrderItem(orderItemId);
        return "Order deleted successfully!";
    }
}

