package edu.cit.swiftthrift.service;

import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.google.api.core.ApiFuture;
import edu.cit.swiftthrift.entity.Product;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ProductService {

    private final Firestore firestore;

    public ProductService() {
        this.firestore = FirestoreClient.getFirestore();
    }

    public String createProduct(Product product) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("products").document(String.valueOf(product.getProductId()));
        docRef.set(product);
        return "Product added successfully!";
    }

    public Product getProductById(String productId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("products").document(productId);
        DocumentSnapshot snapshot = docRef.get().get();
        if (snapshot.exists()) {
            return snapshot.toObject(Product.class);
        }
        return null;
    }

    public List<Product> getAllProducts() throws ExecutionException, InterruptedException {
        List<Product> products = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = firestore.collection("products").get();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            products.add(doc.toObject(Product.class));
        }
        return products;
    }

    public String updateProduct(String productId, Product product) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("products").document(productId);
        if (!docRef.get().get().exists()) {
            return "Product not found!";
        }
        docRef.set(product);
        return "Product updated successfully!";
    }

    public String deleteProduct(String productId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("products").document(productId);
        if (!docRef.get().get().exists()) {
            return "Product not found!";
        }
        docRef.delete();
        return "Product deleted successfully!";
    }
}