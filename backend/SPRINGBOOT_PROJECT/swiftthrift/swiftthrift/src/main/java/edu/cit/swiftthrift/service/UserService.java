package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.entity.Cart;
import edu.cit.swiftthrift.entity.Wishlist;
import edu.cit.swiftthrift.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import edu.cit.swiftthrift.service.CartService;


import java.util.*;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder  passwordEncoder;
    private final CartService cartService;
    private final WishlistService wishlistService;

    // Simulated token storage (use Redis or DB in prod)
    private final Map<String, String> resetTokens = new HashMap<>();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       CartService cartService, WishlistService wishlistService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cartService = cartService;
        this.wishlistService = wishlistService;
    }

    public User createUser(User user) {
        System.out.println("Creating user: " + user.getEmail());
        System.out.println("Raw password (before encoding): " + user.getPassword());

        String encoded = passwordEncoder.encode(user.getPassword());
        user.setPassword(encoded);
        user.setRole("ROLE_USER");

        // Save user first
        User savedUser = userRepository.save(user);

        // Create Cart for user
        Cart cart = new Cart();
        cart.setUser(savedUser);  // Set bidirectional relationship if needed
        cart.setTotalPrice(0.0); // default
        cartService.createCart(cart);

        // Create Wishlist for user
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(savedUser);
        wishlist.setAddedAt(new Date());
        wishlistService.createWishlist(wishlist);

        return savedUser;
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(int userId) {
        return userRepository.findById(userId);
    }

    public User updateUser(int userId, User updatedUser) {
        return userRepository.findById(userId).map(existingUser -> {
            existingUser.setLName(updatedUser.getLName());
            existingUser.setFName(updatedUser.getFName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setUsername(updatedUser.getUsername());
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(int userId) {
        userRepository.deleteById(userId);
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public void updatePassword(int userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Simulate token (real app should email this token)
        String token = UUID.randomUUID().toString();
        resetTokens.put(token, email);

        System.out.println("Reset token (email simulation): " + token);
        // In real-world: Send this token via email to the user
    }

    public void resetPassword(String token, String newPassword) {
        String email = resetTokens.get(token);

        if (email == null) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetTokens.remove(token); // Clear used token
    }
}
