package edu.cit.swiftthrift.service;


import edu.cit.swiftthrift.entity.User;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    private final Firestore firestore;
    private final PasswordEncoder passwordEncoder;

    public UserService(PasswordEncoder passwordEncoder) {
        this.firestore = FirestoreClient.getFirestore();
        this.passwordEncoder = passwordEncoder;
    }

    public String createUser(User userInfo) throws ExecutionException, InterruptedException {
        // Check if user already exists
        DocumentReference docRef = firestore.collection("users").document(userInfo.getEmail());
        if (docRef.get().get().exists()) {
            return "User already exists!";
        }
        // Encode the password before saving
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        docRef.set(userInfo);
        return "User registered successfully!";
    }

    public User getUserByEmail(String email) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("users").document(email);
        DocumentSnapshot snapshot = docRef.get().get();
        if (snapshot.exists()) {
            return snapshot.toObject(User.class);
        }
        return null;
    }

    public String updateUser(String email, User userInfo) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("users").document(email);
        if (!docRef.get().get().exists()) {
            return "User not found!";
        }
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        docRef.set(userInfo);
        return "User updated successfully!";
    }

    public String deleteUser(String email) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("users").document(email);
        if (!docRef.get().get().exists()) {
            return "User not found!";
        }
        docRef.delete();
        return "User deleted successfully!";
    }
}

