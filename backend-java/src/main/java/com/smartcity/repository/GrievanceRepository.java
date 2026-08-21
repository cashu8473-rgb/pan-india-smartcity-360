package com.smartcity.repository;

import com.smartcity.model.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    Optional<Grievance> findByTrackingToken(String trackingToken);
    List<Grievance> findByStatus(Grievance.GrievanceStatus status);
    List<Grievance> findByZone(String zone);
    List<Grievance> findByCategory(Grievance.GrievanceCategory category);
    long countByStatus(Grievance.GrievanceStatus status);
}
