package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder  passwordEncoder;

    // Simulated token storage (use Redis or DB in prod)
    private final Map<String, String> resetTokens = new HashMap<>();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {
        System.out.println("Creating user: " + user.getEmail());
        System.out.println("Raw password (before encoding): " + user.getPassword());

        String encoded = passwordEncoder.encode(user.getPassword());
        System.out.println("Encoded password: " + encoded);

        user.setPassword(encoded);
        user.setRole("ROLE_USER");
        return userRepository.save(user);
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
