package com.smartcity.repository;

import com.smartcity.model.EventBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventBookingRepository extends JpaRepository<EventBooking, Long> {
    Optional<EventBooking> findByBookingRef(String bookingRef);
    List<EventBooking> findByEventEventId(Long eventId);
    List<EventBooking> findByUserUserId(Long userId);
}
