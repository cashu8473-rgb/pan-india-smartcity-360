package com.smartcity.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_facilities")
public class EmergencyFacility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "facility_id")
    private Long facilityId;

    @NotBlank
    @Column(name = "facility_name", nullable = false, length = 150)
    private String facilityName;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private FacilityType type;

    @NotBlank
    @Column(name = "zone", nullable = false, length = 50)
    private String zone;

    @NotBlank
    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @NotNull
    @Column(name = "latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @NotNull
    @Column(name = "longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @NotBlank
    @Column(name = "emergency_contact", nullable = false, length = 25)
    private String emergencyContact;

    @Column(name = "ambulance_contact", length = 25)
    private String ambulanceContact;

    @Column(name = "available_icu_beds")
    private Integer availableIcuBeds = 0;

    @Column(name = "is_24x7")
    private Boolean is24x7 = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private FacilityStatus status = FacilityStatus.OPERATIONAL;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    private Double distanceInKm;

    public enum FacilityType {
        HOSPITAL,
        POLICE_STATION,
        FIRE_STATION,
        BLOOD_BANK,
        DISASTER_MANAGEMENT
    }

    public enum FacilityStatus {
        OPERATIONAL,
        HIGH_DEMAND,
        MAINTENANCE
    }

    public EmergencyFacility() {}

    // Getters and Setters
    public Long getFacilityId() { return facilityId; }
    public void setFacilityId(Long facilityId) { this.facilityId = facilityId; }

    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public FacilityType getType() { return type; }
    public void setType(FacilityType type) { this.type = type; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getAmbulanceContact() { return ambulanceContact; }
    public void setAmbulanceContact(String ambulanceContact) { this.ambulanceContact = ambulanceContact; }

    public Integer getAvailableIcuBeds() { return availableIcuBeds; }
    public void setAvailableIcuBeds(Integer availableIcuBeds) { this.availableIcuBeds = availableIcuBeds; }

    public Boolean getIs24x7() { return is24x7; }
    public void setIs24x7(Boolean is24x7) { this.is24x7 = is24x7; }

    public FacilityStatus getStatus() { return status; }
    public void setStatus(FacilityStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Double getDistanceInKm() { return distanceInKm; }
    public void setDistanceInKm(Double distanceInKm) { this.distanceInKm = distanceInKm; }
}
