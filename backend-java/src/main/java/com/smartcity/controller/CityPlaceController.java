package com.smartcity.controller;

import com.smartcity.model.CityPlace;
import com.smartcity.model.Review;
import com.smartcity.service.CityPlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/places")
@CrossOrigin(origins = "*")
public class CityPlaceController {

    @Autowired
    private CityPlaceService placeService;

    @GetMapping
    public ResponseEntity<List<CityPlace>> getPanIndiaPlaces(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String search) {
        
        return ResponseEntity.ok(placeService.searchPanIndia(state, city, categoryId, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlaceById(@PathVariable Long id) {
        return placeService.getPlaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CityPlace> createPlace(@RequestBody CityPlace place) {
        return ResponseEntity.ok(placeService.savePlace(place));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getPlaceReviews(@PathVariable Long id) {
        return ResponseEntity.ok(placeService.getReviewsForPlace(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long id, @RequestBody Review review) {
        try {
            return ResponseEntity.ok(placeService.addReview(id, review));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
