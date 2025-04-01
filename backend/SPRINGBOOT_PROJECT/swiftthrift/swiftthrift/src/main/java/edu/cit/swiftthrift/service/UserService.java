package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.*;
import edu.cit.swiftthrift.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User createUser(User user) {
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Initialize relationships if null
        if (user.getCart() == null) {
            user.setCart(new Cart());
            user.getCart().setUser(user);
        }

        if (user.getWishlist() == null) {
            user.setWishlist(new Wishlist());
            user.getWishlist().setUser(user);
        }

        if (user.getOrders() == null) {
            user.setOrders(List.of()); // Initialize empty list
        }

        if (user.getStoreRatings() == null) {
            user.setStoreRatings(List.of());
        }

        if (user.getProductRatings() == null) {
            user.setProductRatings(List.of());
        }

        return userRepository.save(user);
    }

    public User updateUser(int userId, User updatedUser) {
        User existingUser = userRepository.findById(userId).orElse(null);

        if (existingUser != null) {
            existingUser.setName(updatedUser.getName());
            existingUser.setUsername(updatedUser.getUsername());
            
            // Update password only if it's not null
            if (updatedUser.getPassword() != null) {
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }

            // Update relationships
            if (updatedUser.getCart() != null) {
                existingUser.setCart(updatedUser.getCart());
                existingUser.getCart().setUser(existingUser);
            }

            if (updatedUser.getWishlist() != null) {
                existingUser.setWishlist(updatedUser.getWishlist());
                existingUser.getWishlist().setUser(existingUser);
            }

            if (updatedUser.getOrders() != null) {
                existingUser.setOrders(updatedUser.getOrders());
                existingUser.getOrders().forEach(order -> order.setUser(existingUser));
            }

            if (updatedUser.getStoreRatings() != null) {
                existingUser.setStoreRatings(updatedUser.getStoreRatings());
                existingUser.getStoreRatings().forEach(rating -> rating.setUser(existingUser));
            }

            if (updatedUser.getProductRatings() != null) {
                existingUser.setProductRatings(updatedUser.getProductRatings());
                existingUser.getProductRatings().forEach(rating -> rating.setUser(existingUser));
            }

            return userRepository.save(existingUser);
        }
        return null;
    }

    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }
}
