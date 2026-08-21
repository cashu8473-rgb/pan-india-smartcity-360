package com.smartcity.repository;

import com.smartcity.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPlacePlaceIdOrderByCreatedAtDesc(Long placeId);
}
