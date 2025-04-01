package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Cart;
import edu.cit.swiftthrift.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    
    public List<Cart> getAllCart() {
        return cartRepository.findAll();
    }

    public Cart getCartById(int id) {
        return cartRepository.findById(id).orElse(null);
    }

    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart updateCart(int id, Cart cart) {
        Cart existingCart = cartRepository.findById(id).orElse(null);
    
        if (existingCart != null) {
            existingCart.setTotalPrice(cart.getTotalPrice());
            return cartRepository.save(existingCart);
        }
        return null; 
    }

    public void deleteCart(int id) {
        cartRepository.deleteById(id);
    }
}



