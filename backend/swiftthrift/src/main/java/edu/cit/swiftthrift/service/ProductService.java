package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Category;
import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.repository.CategoryRepository;
import edu.cit.swiftthrift.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FileStorageService fileStorageService;

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
        // Check if the category and category ID are valid
        if (product.getCategory() != null && product.getCategory().getCategoryId() != 0) {
            Integer categoryId = product.getCategory().getCategoryId();
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category with ID " + categoryId + " not found"));
            product.setCategory(category);
        } else {
            throw new RuntimeException("Category ID must not be null or zero");
        }

        // Handle file uploads with unique filenames
        if (files != null && !files.isEmpty()) {
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    // Generate a unique filename using UUID
                    String originalFilename = file.getOriginalFilename();
                    String fileExtension = "";

                    if (originalFilename != null && originalFilename.contains(".")) {
                        fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }

                    String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

                    // Save the file and construct the file URL
                    Path filePath = Paths.get("uploads", uniqueFilename);
                    Files.createDirectories(filePath.getParent());
                    Files.write(filePath, file.getBytes());

                    imageUrls.add("/uploads/" + uniqueFilename); // Adjust URL path if needed
                }
            }
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

            // Check and set category if valid
            if (updatedProduct.getCategory() != null && updatedProduct.getCategory().getCategoryId() != 0) {
                Integer categoryId = updatedProduct.getCategory().getCategoryId();
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Category with ID " + categoryId + " not found"));
                existingProduct.setCategory(category);
            }

            // Handle file uploads
            if (files != null && !files.isEmpty()) {
                List<String> imageUrls = fileStorageService.saveFiles(files);
                existingProduct.getImageUrls().addAll(imageUrls); // Appends new images to existing list
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
