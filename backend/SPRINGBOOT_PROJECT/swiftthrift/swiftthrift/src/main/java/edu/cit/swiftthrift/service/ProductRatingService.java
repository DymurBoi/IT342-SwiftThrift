package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.ProductRating;
import edu.cit.swiftthrift.repository.ProductRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductRatingService {

    @Autowired
    private ProductRatingRepository productRatingRepository;

    
    public List<ProductRating> getAllProductRatings() {
        return productRatingRepository.findAll();
    }

    public ProductRating getProductRatingById(int id) {
        return productRatingRepository.findById(id).orElse(null);
    }

    public ProductRating createProductRating(ProductRating productRating) {
        return productRatingRepository.save(productRating);
    }

    public ProductRating updateProductRating(int id, ProductRating productRating) {
        ProductRating existingRating = productRatingRepository.findById(id).orElse(null);
    
        if (existingRating != null) {
            existingRating.setName(productRating.getName());
            existingRating.setRating(productRating.getRating());
            existingRating.setDate(productRating.getDate());
            return productRatingRepository.save(existingRating);
        }
        return null; 
    }

    public void deleteProductRating(int id) {
        productRatingRepository.deleteById(id);
    }
}
