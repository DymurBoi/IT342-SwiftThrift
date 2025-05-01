package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Cart;
import edu.cit.swiftthrift.entity.CartItem;
import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.repository.CartRepository;
import edu.cit.swiftthrift.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public Cart createCart(Cart cart) {
        // Ensure cart items are properly linked
        if (cart.getCartItems() != null) {
            for (CartItem item : cart.getCartItems()) {
                item.setCart(cart);
            }
        }
        
        // Ensure user is linked if provided
        if (cart.getUser() != null) {
            User user = userRepository.findById(cart.getUser().getUserId()).orElse(null);
            if (user != null) {
                cart.setUser(user);
                user.setCart(cart); // Maintain bidirectional link
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
