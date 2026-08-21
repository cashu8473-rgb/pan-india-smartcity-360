package com.smartcity.controller;

import com.smartcity.model.CityEvent;
import com.smartcity.model.EventBooking;
import com.smartcity.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<CityEvent>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<CityEvent>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookEventPass(@RequestBody EventBooking booking) {
        try {
            return ResponseEntity.ok(eventService.bookEventPass(booking));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/booking/{bookingRef}")
    public ResponseEntity<?> getBookingDetails(@PathVariable String bookingRef) {
        return eventService.getBookingByRef(bookingRef)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
