package com.smartcity.controller;

import com.smartcity.model.EmergencyFacility;
import com.smartcity.service.EmergencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emergency")
@CrossOrigin(origins = "*")
public class EmergencyController {

    @Autowired
    private EmergencyService emergencyService;

    @GetMapping("/facilities")
    public ResponseEntity<List<EmergencyFacility>> getFacilities(
            @RequestParam(required = false) EmergencyFacility.FacilityType type) {
        if (type != null) {
            return ResponseEntity.ok(emergencyService.getFacilitiesByType(type));
        }
        return ResponseEntity.ok(emergencyService.getAllFacilities());
    }

    @GetMapping("/nearest")
    public ResponseEntity<List<EmergencyFacility>> getNearestFacilities(
            @RequestParam(defaultValue = "28.6139") double lat,
            @RequestParam(defaultValue = "77.2090") double lng,
            @RequestParam(required = false, defaultValue = "ALL") String type,
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(emergencyService.findNearestFacilities(lat, lng, type, limit));
    }

    @PostMapping("/facilities")
    public ResponseEntity<EmergencyFacility> createFacility(@RequestBody EmergencyFacility facility) {
        return ResponseEntity.ok(emergencyService.saveFacility(facility));
    }
}
