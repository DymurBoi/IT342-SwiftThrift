package edu.cit.swiftthrift.service;

import edu.cit.swiftthrift.entity.StoreRating;
import edu.cit.swiftthrift.repository.StoreRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoreRatingService {

    @Autowired
    private StoreRatingRepository storeRatingRepository;

    public List<StoreRating> getAllStoreRatings() {
        return storeRatingRepository.findAll();
    }

    public StoreRating getStoreRatingById(int id) {
        return storeRatingRepository.findById(id).orElse(null);
    }

    public StoreRating createStoreRating(StoreRating storeRating) {
        return storeRatingRepository.save(storeRating);
    }

    public StoreRating updateStoreRating(int id, StoreRating storeRating) {
        Optional<StoreRating> existingRatingOpt = storeRatingRepository.findById(id);
    
        if (existingRatingOpt.isPresent()) {
            StoreRating existingRating = existingRatingOpt.get();
            existingRating.setName(storeRating.getName());
            existingRating.setRating(storeRating.getRating());
            existingRating.setDate(storeRating.getDate());
            return storeRatingRepository.save(existingRating);
        }
        return null; 
    }

    public boolean deleteStoreRating(int id) {
        if (storeRatingRepository.existsById(id)) {
            storeRatingRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
