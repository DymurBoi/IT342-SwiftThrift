package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Read All
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Read by ID
    @GetMapping("/{userId}")
    public Optional<User> getUserById(@PathVariable int userId) {
        return userService.getUserById(userId);
    }

    // Update
    @PutMapping("/{userId}")
    public User updateUser(@PathVariable int userId, @RequestBody User user) {
        return userService.updateUser(userId, user);
    }

    // Delete
    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable int userId) {
        userService.deleteUser(userId);
        return "User deleted successfully!";
    }
}
