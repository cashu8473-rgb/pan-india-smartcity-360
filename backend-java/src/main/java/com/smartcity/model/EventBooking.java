package com.smartcity.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_bookings")
public class EventBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "booking_ref", nullable = false, unique = true, length = 30)
    private String bookingRef;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private CityEvent event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    @Column(name = "attendee_name", nullable = false, length = 100)
    private String attendeeName;

    @NotBlank
    @Column(name = "attendee_email", nullable = false, length = 100)
    private String attendeeEmail;

    @NotBlank
    @Column(name = "attendee_phone", nullable = false, length = 25)
    private String attendeePhone;

    @Column(name = "num_tickets")
    private Integer numTickets = 1;

    @Column(name = "total_amount", precision = 8, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.FREE;

    @Column(name = "qr_code_hash", nullable = false)
    private String qrCodeHash;

    @Column(name = "booked_at", updatable = false)
    private LocalDateTime bookedAt = LocalDateTime.now();

    public enum PaymentStatus {
        PAID,
        PENDING,
        FREE
    }

    public EventBooking() {}

    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public CityEvent getEvent() { return event; }
    public void setEvent(CityEvent event) { this.event = event; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getAttendeeName() { return attendeeName; }
    public void setAttendeeName(String attendeeName) { this.attendeeName = attendeeName; }

    public String getAttendeeEmail() { return attendeeEmail; }
    public void setAttendeeEmail(String attendeeEmail) { this.attendeeEmail = attendeeEmail; }

    public String getAttendeePhone() { return attendeePhone; }
    public void setAttendeePhone(String attendeePhone) { this.attendeePhone = attendeePhone; }

    public Integer getNumTickets() { return numTickets; }
    public void setNumTickets(Integer numTickets) { this.numTickets = numTickets; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getQrCodeHash() { return qrCodeHash; }
    public void setQrCodeHash(String qrCodeHash) { this.qrCodeHash = qrCodeHash; }

    public LocalDateTime getBookedAt() { return bookedAt; }
    public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }
}
