package com.smartcity.service;

import com.smartcity.model.CityPlace;
import com.smartcity.model.Review;
import com.smartcity.repository.CityPlaceRepository;
import com.smartcity.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class CityPlaceService {

    @Autowired
    private CityPlaceRepository placeRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<CityPlace> getAllPlaces() {
        return placeRepository.findAll();
    }

    public Optional<CityPlace> getPlaceById(Long id) {
        return placeRepository.findById(id);
    }

    public List<CityPlace> searchPanIndia(String state, String city, Integer categoryId, String keyword) {
        String stateParam = (state != null && !state.trim().equalsIgnoreCase("ALL")) ? state.trim() : null;
        String cityParam = (city != null && !city.trim().equalsIgnoreCase("ALL")) ? city.trim() : null;
        String keyParam = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        return placeRepository.searchPanIndiaPlaces(stateParam, cityParam, categoryId, keyParam);
    }

    public CityPlace savePlace(CityPlace place) {
        return placeRepository.save(place);
    }

    public void deletePlace(Long id) {
        placeRepository.deleteById(id);
    }

    public List<Review> getReviewsForPlace(Long placeId) {
        return reviewRepository.findByPlacePlaceIdOrderByCreatedAtDesc(placeId);
    }

    @Transactional
    public Review addReview(Long placeId, Review review) {
        CityPlace place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found with ID: " + placeId));
        
        review.setPlace(place);
        Review savedReview = reviewRepository.save(review);

        List<Review> allReviews = reviewRepository.findByPlacePlaceIdOrderByCreatedAtDesc(placeId);
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
        place.setRatingAvg(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
        place.setTotalReviews(allReviews.size());
        placeRepository.save(place);

        return savedReview;
    }
}
