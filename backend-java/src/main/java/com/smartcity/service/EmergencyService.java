package com.smartcity.service;

import com.smartcity.model.EmergencyFacility;
import com.smartcity.repository.EmergencyFacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmergencyService {

    @Autowired
    private EmergencyFacilityRepository facilityRepository;

    public List<EmergencyFacility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Optional<EmergencyFacility> getFacilityById(Long id) {
        return facilityRepository.findById(id);
    }

    public List<EmergencyFacility> getFacilitiesByType(EmergencyFacility.FacilityType type) {
        return facilityRepository.findByType(type);
    }

    public List<EmergencyFacility> findNearestFacilities(double userLat, double userLng, String type, int limit) {
        List<EmergencyFacility> all = facilityRepository.findAll();
        
        return all.stream()
                .filter(f -> type == null || type.equalsIgnoreCase("ALL") || f.getType().name().equalsIgnoreCase(type))
                .peek(f -> {
                    double dist = calculateHaversineDistance(
                            userLat, userLng, 
                            f.getLatitude().doubleValue(), f.getLongitude().doubleValue()
                    );
                    f.setDistanceInKm(Math.round(dist * 100.0) / 100.0);
                })
                .sorted(Comparator.comparingDouble(EmergencyFacility::getDistanceInKm))
                .limit(limit > 0 ? limit : 10)
                .collect(Collectors.toList());
    }

    public EmergencyFacility saveFacility(EmergencyFacility facility) {
        return facilityRepository.save(facility);
    }

    public void deleteFacility(Long id) {
        facilityRepository.deleteById(id);
    }

    // Great circle Haversine formula
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
