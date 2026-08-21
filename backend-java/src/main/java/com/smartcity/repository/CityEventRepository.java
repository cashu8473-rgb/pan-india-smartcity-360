package com.smartcity.repository;

import com.smartcity.model.CityEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CityEventRepository extends JpaRepository<CityEvent, Long> {
    List<CityEvent> findByStatus(CityEvent.EventStatus status);
    List<CityEvent> findByStartDateAfter(LocalDateTime dateTime);
    List<CityEvent> findByZone(String zone);
}
