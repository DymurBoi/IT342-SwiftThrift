package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Category;
import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.repository.CategoryRepository;
import edu.cit.swiftthrift.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(int id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(Product product) {
        // Ensure the associated category exists
        if (product.getCategory() != null) {
            Category category = categoryRepository.findById(product.getCategory().getCategoryId()).orElse(null);
            product.setCategory(category);
        }
        return productRepository.save(product);
    }

    public Product updateProduct(int id, Product updatedProduct) {
        Optional<Product> existingProductOpt = productRepository.findById(id);

        if (existingProductOpt.isPresent()) {
            Product existingProduct = existingProductOpt.get();
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setImageUrl(updatedProduct.getImageUrl());

            // Update associated category if provided
            if (updatedProduct.getCategory() != null) {
                Category category = categoryRepository.findById(updatedProduct.getCategory().getCategoryId()).orElse(null);
                existingProduct.setCategory(category);
            }

            return productRepository.save(existingProduct);
        }
        return null;
    }

    public void deleteProduct(int id) {
        productRepository.deleteById(id);
    }
}
