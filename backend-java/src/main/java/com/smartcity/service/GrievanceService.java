package com.smartcity.service;

import com.smartcity.model.Grievance;
import com.smartcity.repository.GrievanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class GrievanceService {

    @Autowired
    private GrievanceRepository grievanceRepository;

    public List<Grievance> getAllGrievances() {
        return grievanceRepository.findAll();
    }

    public Optional<Grievance> getGrievanceByToken(String token) {
        return grievanceRepository.findByTrackingToken(token);
    }

    public List<Grievance> getGrievancesByStatus(Grievance.GrievanceStatus status) {
        return grievanceRepository.findByStatus(status);
    }

    public Grievance submitGrievance(Grievance grievance) {
        // Generate memorable unique tracking token
        String token = "GRV-" + LocalDateTime.now().getYear() + "-" + 
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        grievance.setTrackingToken(token);
        grievance.setStatus(Grievance.GrievanceStatus.SUBMITTED);
        grievance.setSubmittedAt(LocalDateTime.now());
        
        // Auto-assign department based on issue category
        if (grievance.getCategory() != null) {
            switch (grievance.getCategory()) {
                case ROAD_POTHOLE:
                    grievance.setAssignedDepartment("Public Works Department (PWD)");
                    break;
                case STREET_LIGHT:
                    grievance.setAssignedDepartment("City Electricity & Energy Board");
                    break;
                case GARBAGE_COLLECTION:
                    grievance.setAssignedDepartment("Smart Waste & Sanitation Board");
                    break;
                case WATER_LEAKAGE:
                case SEWAGE_DRAINAGE:
                    grievance.setAssignedDepartment("Municipal Water & Sewerage Board");
                    break;
                case TRAFFIC_SIGNAL:
                    grievance.setAssignedDepartment("Traffic Police & Smart Mobility");
                    break;
                default:
                    grievance.setAssignedDepartment("Municipal Corporation Central Cell");
            }
        }
        
        return grievanceRepository.save(grievance);
    }

    public Grievance updateGrievanceStatus(Long grievanceId, Grievance.GrievanceStatus newStatus, String notes) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found with ID: " + grievanceId));

        grievance.setStatus(newStatus);
        if (notes != null && !notes.trim().isEmpty()) {
            grievance.setOfficerNotes(notes);
        }

        if (newStatus == Grievance.GrievanceStatus.RESOLVED) {
            grievance.setResolvedAt(LocalDateTime.now());
        }

        return grievanceRepository.save(grievance);
    }
}
