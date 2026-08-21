package com.smartcity.service;

import com.smartcity.model.Grievance;
import com.smartcity.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private CityPlaceRepository placeRepository;

    @Autowired
    private EmergencyFacilityRepository facilityRepository;

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private CityEventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventBookingRepository bookingRepository;

    public Map<String, Object> getCityAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalPlaces = placeRepository.count();
        long totalEmergency = facilityRepository.count();
        long totalGrievances = grievanceRepository.count();
        long resolvedGrievances = grievanceRepository.countByStatus(Grievance.GrievanceStatus.RESOLVED);
        long activeGrievances = totalGrievances - resolvedGrievances;
        long totalEvents = eventRepository.count();
        long totalUsers = userRepository.count();
        long totalPasses = bookingRepository.count();

        stats.put("totalPlaces", totalPlaces);
        stats.put("totalEmergencyUnits", totalEmergency);
        stats.put("totalGrievances", totalGrievances);
        stats.put("resolvedGrievances", resolvedGrievances);
        stats.put("activeGrievances", activeGrievances);
        stats.put("resolutionRatePercent", totalGrievances > 0 ? (resolvedGrievances * 100 / totalGrievances) : 100);
        stats.put("totalEvents", totalEvents);
        stats.put("totalUsers", totalUsers);
        stats.put("totalPassesIssued", totalPasses);

        return stats;
    }
}
