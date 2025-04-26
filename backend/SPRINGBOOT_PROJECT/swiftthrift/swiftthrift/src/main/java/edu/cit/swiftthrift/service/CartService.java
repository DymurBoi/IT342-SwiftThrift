package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Cart;
import edu.cit.swiftthrift.entity.CartItem;
import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.repository.CartRepository;
import edu.cit.swiftthrift.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Cart> getAllCart() {
        return cartRepository.findAll();
    }

    public Cart getCartById(int id) {
        return cartRepository.findById(id).orElse(null);
    }

    public Cart getCartByUserId(int userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return user.getCart();
        }
        return null;
    }

    public Cart createCart(Cart cart) {
        if (cart.getUser() != null) {
            // Fetch user
            User user = userRepository.findById(cart.getUser().getUserId()).orElse(null);
            if (user != null) {
                // Check if user already has a cart
                if (user.getCart() != null) {
                    // Throw error if user already has a cart
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already has a cart.");
                }
                // Set the user to cart and cart to user
                cart.setUser(user);
                user.setCart(cart);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User information is missing.");
        }

        // Set cart items if there are any
        if (cart.getCartItems() != null) {
            for (CartItem item : cart.getCartItems()) {
                item.setCart(cart);
            }
        }

        return cartRepository.save(cart);
    }

    public Cart updateCart(int id, Cart updatedCart) {
        Cart existingCart = cartRepository.findById(id).orElse(null);

        if (existingCart != null) {
            existingCart.setTotalPrice(updatedCart.getTotalPrice());

            // Update cart items if provided
            if (updatedCart.getCartItems() != null) {
                existingCart.setCartItems(updatedCart.getCartItems());
                for (CartItem item : updatedCart.getCartItems()) {
                    item.setCart(existingCart);
                }
            }

            // Update user if provided
            if (updatedCart.getUser() != null) {
                User user = userRepository.findById(updatedCart.getUser().getUserId()).orElse(null);
                if (user != null) {
                    existingCart.setUser(user);
                    user.setCart(existingCart);
                }
            }

            return cartRepository.save(existingCart);
        }
        return null;
    }

    public void deleteCart(int id) {
        cartRepository.deleteById(id);
    }
}
