package com.smartcity.service;

import com.smartcity.model.CityEvent;
import com.smartcity.model.EventBooking;
import com.smartcity.repository.CityEventRepository;
import com.smartcity.repository.EventBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventService {

    @Autowired
    private CityEventRepository eventRepository;

    @Autowired
    private EventBookingRepository bookingRepository;

    public List<CityEvent> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<CityEvent> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public List<CityEvent> getUpcomingEvents() {
        return eventRepository.findByStatus(CityEvent.EventStatus.UPCOMING);
    }

    @Transactional
    public EventBooking bookEventPass(EventBooking bookingRequest) {
        CityEvent event = eventRepository.findById(bookingRequest.getEvent().getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getBookedSeats() + bookingRequest.getNumTickets() > event.getTotalSeats()) {
            throw new RuntimeException("Sorry, requested seats are no longer available.");
        }

        // Update booked seats counter
        event.setBookedSeats(event.getBookedSeats() + bookingRequest.getNumTickets());
        eventRepository.save(event);

        // Generate Booking Reference and QR Hash
        String bookingRef = "EPASS-" + LocalDateTime.now().getYear() + "-" + 
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        bookingRequest.setBookingRef(bookingRef);
        
        // Calculate Total Amount
        BigDecimal total = event.getEntryFee().multiply(BigDecimal.valueOf(bookingRequest.getNumTickets()));
        bookingRequest.setTotalAmount(total);
        bookingRequest.setPaymentStatus(total.compareTo(BigDecimal.ZERO) > 0 ? EventBooking.PaymentStatus.PAID : EventBooking.PaymentStatus.FREE);
        bookingRequest.setQrCodeHash("VERIFIED-SMARTCITY-" + bookingRef + "-EVT" + event.getEventId());
        bookingRequest.setBookedAt(LocalDateTime.now());

        return bookingRepository.save(bookingRequest);
    }

    public Optional<EventBooking> getBookingByRef(String bookingRef) {
        return bookingRepository.findByBookingRef(bookingRef);
    }
}
