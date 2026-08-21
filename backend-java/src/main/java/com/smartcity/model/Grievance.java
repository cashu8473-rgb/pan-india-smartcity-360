package com.smartcity.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "grievances")
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grievance_id")
    private Long grievanceId;

    @Column(name = "tracking_token", nullable = false, unique = true, length = 30)
    private String trackingToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank(message = "Citizen name is required")
    @Column(name = "citizen_name", nullable = false, length = 100)
    private String citizenName;

    @NotBlank(message = "Contact phone is required")
    @Column(name = "citizen_phone", nullable = false, length = 25)
    private String citizenPhone;

    @Column(name = "citizen_email", length = 100)
    private String citizenEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private GrievanceCategory category;

    @NotBlank(message = "Title is required")
    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @NotBlank(message = "Description is required")
    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @NotBlank(message = "City zone is required")
    @Column(name = "zone", nullable = false, length = 50)
    private String zone;

    @NotBlank(message = "Location address is required")
    @Column(name = "location_address", nullable = false, length = 255)
    private String locationAddress;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private GrievanceStatus status = GrievanceStatus.SUBMITTED;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority = Priority.MEDIUM;

    @Column(name = "assigned_department", length = 100)
    private String assignedDepartment = "Municipal Corporation";

    @Lob
    @Column(name = "officer_notes")
    private String officerNotes;

    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public enum GrievanceCategory {
        ROAD_POTHOLE,
        STREET_LIGHT,
        GARBAGE_COLLECTION,
        WATER_LEAKAGE,
        TRAFFIC_SIGNAL,
        PUBLIC_PARK,
        SEWAGE_DRAINAGE,
        OTHER
    }

    public enum GrievanceStatus {
        SUBMITTED,
        IN_REVIEW,
        DISPATCHED,
        RESOLVED,
        REJECTED
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public Grievance() {}

    // Getters and Setters
    public Long getGrievanceId() { return grievanceId; }
    public void setGrievanceId(Long grievanceId) { this.grievanceId = grievanceId; }

    public String getTrackingToken() { return trackingToken; }
    public void setTrackingToken(String trackingToken) { this.trackingToken = trackingToken; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }

    public String getCitizenPhone() { return citizenPhone; }
    public void setCitizenPhone(String citizenPhone) { this.citizenPhone = citizenPhone; }

    public String getCitizenEmail() { return citizenEmail; }
    public void setCitizenEmail(String citizenEmail) { this.citizenEmail = citizenEmail; }

    public GrievanceCategory getCategory() { return category; }
    public void setCategory(GrievanceCategory category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public GrievanceStatus getStatus() { return status; }
    public void setStatus(GrievanceStatus status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getAssignedDepartment() { return assignedDepartment; }
    public void setAssignedDepartment(String assignedDepartment) { this.assignedDepartment = assignedDepartment; }

    public String getOfficerNotes() { return officerNotes; }
    public void setOfficerNotes(String officerNotes) { this.officerNotes = officerNotes; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
