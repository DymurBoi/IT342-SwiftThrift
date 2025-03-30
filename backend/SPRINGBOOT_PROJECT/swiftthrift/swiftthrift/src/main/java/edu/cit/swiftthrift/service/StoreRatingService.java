package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.StoreRating;
import edu.cit.swiftthrift.repository.StoreRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreRatingService {

    @Autowired
    private StoreRatingRepository storeRatingRepository;

    
    public List<StoreRating> getAllProductRatings() {
        return storeRatingRepository.findAll();
    }

    public StoreRating getProductRatingById(int id) {
        return storeRatingRepository.findById(id).orElse(null);
    }

    public StoreRating createProductRating(StoreRating productRating) {
        return storeRatingRepository.save(productRating);
    }

    public StoreRating updateProductRating(int id, StoreRating productRating) {
        StoreRating existingRating = storeRatingRepository.findById(id).orElse(null);
    
        if (existingRating != null) {
            existingRating.setName(productRating.getName());
            existingRating.setRating(productRating.getRating());
            existingRating.setDate(productRating.getDate());
            return storeRatingRepository.save(existingRating);
        }
        return null; 
    }

    public void deleteProductRating(int id) {
        storeRatingRepository.deleteById(id);
    }
}
