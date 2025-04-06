package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.dto.LoginRequest;
import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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

    //Login
    @PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
    try {
        User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(user); // You can return a JWT or just the user info
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
}
}
