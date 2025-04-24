package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.Order;
import edu.cit.swiftthrift.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Create
    @PostMapping("/create")
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    // Read All
    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Read by ID
    @GetMapping("/get/{orderId}")
    public Order getOrderById(@PathVariable int orderId) {
        return orderService.getOrderById(orderId);
    }

    // Update
    @PutMapping("/update/{orderId}")
    public Order updateOrder(@PathVariable int orderId, @RequestBody Order order) {
        return orderService.updateOrder(orderId, order);
    }

    // Delete
    @DeleteMapping("/delete/{orderId}")
    public String deleteOrder(@PathVariable int orderId) {
        orderService.deleteOrder(orderId);
        return "Order deleted successfully!";
    }

    @GetMapping("/byUser/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable int userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/admin/{orderId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> approveOrder(@PathVariable int orderId) {
        Order approvedOrder = orderService.approveOrder(orderId);
        if (approvedOrder != null) {
            return ResponseEntity.ok(approvedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
