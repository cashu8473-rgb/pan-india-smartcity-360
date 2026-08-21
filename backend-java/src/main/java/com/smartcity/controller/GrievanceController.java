package com.smartcity.controller;

import com.smartcity.model.Grievance;
import com.smartcity.service.GrievanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/grievances")
@CrossOrigin(origins = "*")
public class GrievanceController {

    @Autowired
    private GrievanceService grievanceService;

    @GetMapping
    public ResponseEntity<List<Grievance>> getAllGrievances(
            @RequestParam(required = false) Grievance.GrievanceStatus status) {
        if (status != null) {
            return ResponseEntity.ok(grievanceService.getGrievancesByStatus(status));
        }
        return ResponseEntity.ok(grievanceService.getAllGrievances());
    }

    @GetMapping("/track/{token}")
    public ResponseEntity<?> trackGrievance(@PathVariable String token) {
        return grievanceService.getGrievanceByToken(token)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Grievance> submitGrievance(@RequestBody Grievance grievance) {
        return ResponseEntity.ok(grievanceService.submitGrievance(grievance));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload) {
        try {
            String statusStr = payload.get("status");
            String notes = payload.get("officerNotes");
            Grievance.GrievanceStatus status = Grievance.GrievanceStatus.valueOf(statusStr.toUpperCase());
            return ResponseEntity.ok(grievanceService.updateGrievanceStatus(id, status, notes));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
