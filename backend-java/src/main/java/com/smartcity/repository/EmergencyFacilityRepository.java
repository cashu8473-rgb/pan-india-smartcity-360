package com.smartcity.repository;

import com.smartcity.model.EmergencyFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyFacilityRepository extends JpaRepository<EmergencyFacility, Long> {
    List<EmergencyFacility> findByType(EmergencyFacility.FacilityType type);
    List<EmergencyFacility> findByZone(String zone);
    List<EmergencyFacility> findByStatus(EmergencyFacility.FacilityStatus status);

    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(latitude)))) AS distance_in_km " +
            "FROM emergency_facilities " +
            "WHERE (:type IS NULL OR type = :type) " +
            "ORDER BY distance_in_km ASC LIMIT :limitCount", 
            nativeQuery = true)
    List<EmergencyFacility> findNearestFacilities(
            @Param("lat") double lat, 
            @Param("lng") double lng, 
            @Param("type") String type, 
            @Param("limitCount") int limitCount);
}
