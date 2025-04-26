package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.Cart;
import edu.cit.swiftthrift.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Create
    @PostMapping("/create")
    public Cart createCart(@RequestBody Cart cart) {
        return cartService.createCart(cart);
    }

    // Read All
    @GetMapping("/all")
    public List<Cart> getAllCart() {
        return cartService.getAllCart();
    }

    // Read by ID
    @GetMapping("/get/{cartId}")
    public Cart getCartById(@PathVariable int cartId) {
        return cartService.getCartById(cartId);
    }

    // Read by userId
    @GetMapping("/byUser/{userId}")
    public Cart getCartByUserId(@PathVariable int userId) {
        return cartService.getCartByUserId(userId);
    }

    // Update
    @PutMapping("/update/{cartId}")
    public Cart updateCart(@PathVariable int cartId, @RequestBody Cart cart) {
        return cartService.updateCart(cartId, cart);
    }

    // Delete
    @DeleteMapping("/delete/{cartId}")
    public String deleteCart(@PathVariable int cartId) {
        cartService.deleteCart(cartId);
        return "Cart deleted successfully!";
    }
}
