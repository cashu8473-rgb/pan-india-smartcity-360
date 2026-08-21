package com.smartcity.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "city_places")
public class CityPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "place_id")
    private Long placeId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotBlank(message = "State is required")
    @Column(name = "state", nullable = false, length = 60)
    private String state = "Delhi (NCR)";

    @NotBlank(message = "City is required")
    @Column(name = "city", nullable = false, length = 60)
    private String city = "New Delhi";

    @NotBlank(message = "Street name is required")
    @Column(name = "street_name", nullable = false, length = 150)
    private String streetName;

    @NotBlank(message = "Title is required")
    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "tagline", length = 255)
    private String tagline;

    @NotBlank(message = "Description is required")
    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @NotBlank(message = "City zone is required")
    @Column(name = "zone", nullable = false, length = 50)
    private String zone;

    @NotBlank(message = "Address is required")
    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "pincode", length = 10)
    private String pincode = "110001";

    @NotNull(message = "Latitude is required")
    @Column(name = "latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @NotNull(message = "Longitude is required")
    @Column(name = "longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "entry_fee", precision = 8, scale = 2)
    private BigDecimal entryFee = BigDecimal.ZERO;

    @Column(name = "opening_hours", length = 100)
    private String openingHours = "09:00 AM - 06:00 PM";

    @Column(name = "contact_phone", length = 25)
    private String contactPhone;

    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "rating_avg", precision = 3, scale = 2)
    private BigDecimal ratingAvg = BigDecimal.valueOf(4.5);

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_verified")
    private Boolean isVerified = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CityPlace() {}

    // Getters & Setters
    public Long getPlaceId() { return placeId; }
    public void setPlaceId(Long placeId) { this.placeId = placeId; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getStreetName() { return streetName; }
    public void setStreetName(String streetName) { this.streetName = streetName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public BigDecimal getEntryFee() { return entryFee; }
    public void setEntryFee(BigDecimal entryFee) { this.entryFee = entryFee; }

    public String getOpeningHours() { return openingHours; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(BigDecimal ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
