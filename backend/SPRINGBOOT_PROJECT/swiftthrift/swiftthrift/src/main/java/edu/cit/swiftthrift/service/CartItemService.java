package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.CartItem;
import edu.cit.swiftthrift.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getAllCartItem() {
        return cartItemRepository.findAll();
    }

    public CartItem getCartItemById(int id) {
        return cartItemRepository.findById(id).orElse(null);
    }

    public CartItem createCartItem(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateCartItem(int id, CartItem cartItem) {
        CartItem existingCartItem = cartItemRepository.findById(id).orElse(null);
    
        if (existingCartItem != null) {
            existingCartItem.setPrice(cartItem.getPrice());
            return cartItemRepository.save(existingCartItem);
        }
        return null; 
    }

    public void deleteCartItem(int id) {
        cartItemRepository.deleteById(id);
    }
}

