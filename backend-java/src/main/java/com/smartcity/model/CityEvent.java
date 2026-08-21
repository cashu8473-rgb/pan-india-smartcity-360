package com.smartcity.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class CityEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @NotBlank
    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @NotBlank
    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @NotBlank
    @Column(name = "organizer", nullable = false, length = 100)
    private String organizer;

    @NotBlank
    @Column(name = "venue_name", nullable = false, length = 150)
    private String venueName;

    @NotBlank
    @Column(name = "zone", nullable = false, length = 50)
    private String zone;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "entry_fee", precision = 8, scale = 2)
    private BigDecimal entryFee = BigDecimal.ZERO;

    @Column(name = "total_seats")
    private Integer totalSeats = 100;

    @Column(name = "booked_seats")
    private Integer bookedSeats = 0;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "banner_image", length = 500)
    private String bannerImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EventStatus status = EventStatus.UPCOMING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum EventStatus {
        UPCOMING,
        ONGOING,
        COMPLETED,
        CANCELLED
    }

    public CityEvent() {}

    // Getters and Setters
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public BigDecimal getEntryFee() { return entryFee; }
    public void setEntryFee(BigDecimal entryFee) { this.entryFee = entryFee; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public Integer getBookedSeats() { return bookedSeats; }
    public void setBookedSeats(Integer bookedSeats) { this.bookedSeats = bookedSeats; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBannerImage() { return bannerImage; }
    public void setBannerImage(String bannerImage) { this.bannerImage = bannerImage; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
