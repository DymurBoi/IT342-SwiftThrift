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
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(int categoryID) {
        return categoryRepository.findById(categoryID);
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(int id, Category updatedCategory) {
        Optional<Category> existingCategoryOpt = categoryRepository.findById(id);
        
        if (existingCategoryOpt.isPresent()) {
            Category existingCategory = existingCategoryOpt.get();
            existingCategory.setCategoryName(updatedCategory.getCategoryName());
    
            // Update associated products
            List<Product> updatedProducts = updatedCategory.getProducts();
            if (updatedProducts != null) {
                for (Product product : updatedProducts) {
                    Product existingProduct = productRepository.findById(product.getProductId()).orElse(null);
                    if (existingProduct != null) {
                        existingProduct.setCategory(existingCategory);
                        productRepository.save(existingProduct); // Save the updated product
                    }
                }
                existingCategory.setProducts(updatedProducts);
            }
    
            return categoryRepository.save(existingCategory);
        }
        return null;
    }

    public boolean deleteCategory(int id) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();

            // Remove category reference from products
            for (Product product : category.getProducts()) {
                product.setCategory(null);
                productRepository.save(product);
            }

            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
