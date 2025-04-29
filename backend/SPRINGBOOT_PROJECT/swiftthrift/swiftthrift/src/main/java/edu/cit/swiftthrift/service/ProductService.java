package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Category;
import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.repository.CategoryRepository;
import edu.cit.swiftthrift.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private GCSFileStorageService fileStorageService;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Integer id) {
        return productRepository.findById(id);
    }

    public Product getProductById(int id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(Product product, List<MultipartFile> files) throws IOException {
        if (product.getCategory() != null && product.getCategory().getCategoryId() != 0) {
            Integer categoryId = product.getCategory().getCategoryId();
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category with ID " + categoryId + " not found"));
            product.setCategory(category);
        } else {
            throw new RuntimeException("Category ID must not be null or zero");
        }

        if (files != null && !files.isEmpty()) {
            List<String> imageUrls = fileStorageService.uploadFiles(files);
            product.setImageUrls(imageUrls);
        }

        return productRepository.save(product);
    }

    public Product updateProduct(int id, Product updatedProduct, List<MultipartFile> files) throws IOException {
        Optional<Product> existingProductOpt = productRepository.findById(id);

        if (existingProductOpt.isPresent()) {
            Product existingProduct = existingProductOpt.get();

            existingProduct.setName(updatedProduct.getName());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setCondition(updatedProduct.getCondition());
            existingProduct.setIsSold(updatedProduct.getIsSold());

            if (updatedProduct.getCategory() != null && updatedProduct.getCategory().getCategoryId() != 0) {
                Integer categoryId = updatedProduct.getCategory().getCategoryId();
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Category with ID " + categoryId + " not found"));
                existingProduct.setCategory(category);
            }

            if (files != null && !files.isEmpty()) {
                List<String> imageUrls = fileStorageService.uploadFiles(files);
                existingProduct.getImageUrls().addAll(imageUrls);
            }

            return productRepository.save(existingProduct);
        } else {
            throw new RuntimeException("Product with ID " + id + " not found");
        }
    }

    public void deleteProduct(int id) {
        productRepository.deleteById(id);
    }
}
