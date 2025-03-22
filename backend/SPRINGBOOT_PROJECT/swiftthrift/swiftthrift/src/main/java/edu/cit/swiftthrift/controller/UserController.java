package edu.cit.swiftthrift.controller;

import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.service.FirebaseService;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/users")
public class UserController {

    private final FirebaseService firebaseService;

    public UserController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) throws ExecutionException, InterruptedException {
        return firebaseService.createUser(user);
    }

    @GetMapping("/{email}")
    public User getUser(@PathVariable String email) throws ExecutionException, InterruptedException {
        return firebaseService.getUser(email);
    }
}