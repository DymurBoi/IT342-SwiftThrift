package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.Product;
import edu.cit.swiftthrift.entity.ProductRating;
import edu.cit.swiftthrift.repository.ProductRatingRepository;
import edu.cit.swiftthrift.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductRatingService {

    @Autowired
    private ProductRatingRepository productRatingRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<ProductRating> getAllProductRatings() {
        return productRatingRepository.findAll();
    }

    public ProductRating getProductRatingById(int id) {
        return productRatingRepository.findById(id).orElse(null);
    }

    public ProductRating createProductRating(ProductRating productRating) {
        // Ensure the associated product exists
        if (productRating.getProduct() != null) {
            Product product = productRepository.findById(productRating.getProduct().getProductId()).orElse(null);
            productRating.setProduct(product);
        }
        return productRatingRepository.save(productRating);
    }

    public ProductRating updateProductRating(int id, ProductRating updatedRating) {
        Optional<ProductRating> existingRatingOpt = productRatingRepository.findById(id);

        if (existingRatingOpt.isPresent()) {
            ProductRating existingRating = existingRatingOpt.get();
            existingRating.setName(updatedRating.getName());
            existingRating.setRating(updatedRating.getRating());
            existingRating.setDate(updatedRating.getDate());

            // Update associated product if provided
            if (updatedRating.getProduct() != null) {
                Product product = productRepository.findById(updatedRating.getProduct().getProductId()).orElse(null);
                existingRating.setProduct(product);
            }

            return productRatingRepository.save(existingRating);
        }
        return null;
    }

    public void deleteProductRating(int id) {
        productRatingRepository.deleteById(id);
    }

    public List<ProductRating> getProductRatingsByProductId(int productId) {
        return productRatingRepository.findByProductId(productId);
    }
}
