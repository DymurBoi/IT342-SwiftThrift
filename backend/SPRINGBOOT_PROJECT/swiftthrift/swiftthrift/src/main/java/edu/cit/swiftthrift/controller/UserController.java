package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.dto.*;
import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.security.JwtTokenProvider;
import edu.cit.swiftthrift.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import org.springframework.security.crypto.password.PasswordEncoder;
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this. passwordEncoder= passwordEncoder;
    }

    // Create User
    @PostMapping("/create")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Get All Users
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get User by ID
    @GetMapping("/get/{userId}")
    public Optional<User> getUserById(@PathVariable int userId) {
        return userService.getUserById(userId);
    }

    // Update User
    @PutMapping("/update/{userId}")
    public User updateUser(@PathVariable int userId, @RequestBody User user) {
        return userService.updateUser(userId, user);
    }

    // Delete User
    @DeleteMapping("/delete/{userId}")
    public String deleteUser(@PathVariable int userId) {
        userService.deleteUser(userId);
        return "User deleted successfully!";
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            // Log the email and input password to verify what is being passed
            System.out.println("Attempting login for email: " + loginRequest.getEmail());
            System.out.println("Input password: " + loginRequest.getPassword());
            System.out.println("Input password: " + loginRequest.getPassword());

            // Authenticate the user
            User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

            // Log the user details for debugging
            System.out.println("Authenticated user: " + user.getEmail());
            System.out.println("DB password: " + user.getPassword());  // This should show the hashed password in DB

            // Generate the token if authentication succeeds
            String token = jwtTokenProvider.generateToken(user);

            // Prepare the response
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Catch any exceptions (e.g., invalid email or password) and log relevant details
            System.out.println("Error during authentication: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    // Update Password
    @PutMapping("/update-password/{userId}")
    public ResponseEntity<?> updatePassword(@PathVariable int userId, @RequestBody PasswordUpdateRequest request) {
        try {
            userService.updatePassword(userId, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Forgot Password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        userService.sendPasswordResetEmail(email);
        return ResponseEntity.ok("If an account exists with this email, a reset link will be sent");
    }

    // Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        userService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password has been reset successfully");
    }

}
