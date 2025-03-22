package edu.cit.swiftthrift.service;


import com.google.cloud.firestore.*;
import edu.cit.swiftthrift.entity.User;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import com.google.firebase.cloud.FirestoreClient;

@Service
public class FirebaseService {

    private final Firestore firestore;

    public FirebaseService() {
        this.firestore = FirestoreClient.getFirestore();
    }

    public String createUser(User user) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("users").document(user.getEmail());
        docRef.set(user);
        return "User registered successfully!";
    }

    public User getUser(String email) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("users").document(email);
        DocumentSnapshot snapshot = docRef.get().get();
        if (snapshot.exists()) {
            return snapshot.toObject(User.class);
        }
        return null;
    }
}

