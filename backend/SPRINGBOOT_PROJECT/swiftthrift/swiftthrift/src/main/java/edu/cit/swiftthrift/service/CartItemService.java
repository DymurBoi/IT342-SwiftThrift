package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Cart;
import edu.cit.swiftthrift.entity.CartItem;
import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.repository.CartItemRepository;
import edu.cit.swiftthrift.repository.CartRepository;
import edu.cit.swiftthrift.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    public CartItem getCartItemById(int id) {
        return cartItemRepository.findById(id).orElse(null);
    }

    public CartItem createCartItem(CartItem cartItem) {
        // Ensure cart item is linked to an existing cart
        if (cartItem.getCart() != null) {
            Cart cart = cartRepository.findById(cartItem.getCart().getCartId()).orElse(null);
            if (cart != null) {
                cartItem.setCart(cart);
                // Avoid duplicate add if already present
                if (!cart.getCartItems().contains(cartItem)) {
                    cart.getCartItems().add(cartItem); // Maintain bidirectional link
                }
            }
        } else {
            throw new IllegalArgumentException("Cart is missing in CartItem.");
        }

        // Ensure cart item is linked to an existing product
        if (cartItem.getProduct() != null) {
            Product product = productRepository.findById(cartItem.getProduct().getProductId()).orElse(null);
            if (product != null) {
                cartItem.setProduct(product);
            }
        }

        return cartItemRepository.save(cartItem);
    }

    public CartItem updateCartItem(int id, CartItem updatedCartItem) {
        CartItem existingCartItem = cartItemRepository.findById(id).orElse(null);

        if (existingCartItem != null) {
            existingCartItem.setPrice(updatedCartItem.getPrice());

            // Update cart if provided
            if (updatedCartItem.getCart() != null) {
                Cart cart = cartRepository.findById(updatedCartItem.getCart().getCartId()).orElse(null);
                if (cart != null) {
                    existingCartItem.setCart(cart);
                }
            }

            // Update product if provided
            if (updatedCartItem.getProduct() != null) {
                Product product = productRepository.findById(updatedCartItem.getProduct().getProductId()).orElse(null);
                if (product != null) {
                    existingCartItem.setProduct(product);
                }
            }

            return cartItemRepository.save(existingCartItem);
        }
        return null;
    }

    public void deleteCartItem(int id) {
        cartItemRepository.deleteById(id);
    }
}
