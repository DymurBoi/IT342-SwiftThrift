package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.CartItem;
import edu.cit.swiftthrift.service.CartItemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cartItem")
public class CartItemController {
    @Autowired
    private CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    // Create
    @PostMapping("/create")
    public CartItem createOrder(@RequestBody CartItem cartItem) {
        return cartItemService.createCartItem(cartItem);
    }

    // Read All
    @GetMapping("/all")
    public List<CartItem> getAllCartItem() {
        return cartItemService.getAllCartItem();
    }

    // Read by ID
    @GetMapping("/get/{cartItemId}")
    public CartItem getCartItemById(@PathVariable int cartItemId) {
        return cartItemService.getCartItemById(cartItemId);
    }

    // Update
    @PutMapping("/put/{cartItemId}")
    public CartItem updateCartItem(@PathVariable int cartItemId, @RequestBody CartItem cartItem) {
        CartItem existingCartItem = cartItemService.getCartItemById(cartItemId);
        
        if (existingCartItem != null) {
            existingCartItem.setPrice(cartItem.getPrice());
            return cartItemService.createCartItem(existingCartItem);
        } else {
            throw new RuntimeException("Cart Item with ID " + cartItemId + " not found.");
        }
    }

    // Delete
    @DeleteMapping("/delete/{cartItemId}")
    public String deleteOrderItem(@PathVariable int cartItemId) {
        cartItemService.deleteCartItem(cartItemId);
        return "Cart Item deleted successfully!";
    }
}



