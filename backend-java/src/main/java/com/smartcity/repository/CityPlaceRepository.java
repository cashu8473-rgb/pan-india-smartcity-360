package com.smartcity.repository;

import com.smartcity.model.CityPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityPlaceRepository extends JpaRepository<CityPlace, Long> {
    List<CityPlace> findByStateIgnoreCase(String state);
    List<CityPlace> findByCityIgnoreCase(String city);
    List<CityPlace> findByCategoryCategoryId(Integer categoryId);
    List<CityPlace> findByIsFeaturedTrue();

    @Query("SELECT p FROM CityPlace p WHERE " +
           "(:state IS NULL OR LOWER(p.state) = LOWER(:state)) AND " +
           "(:city IS NULL OR LOWER(p.city) = LOWER(:city)) AND " +
           "(:categoryId IS NULL OR p.category.categoryId = :categoryId) AND " +
           "(:keyword IS NULL OR (" +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.streetName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.state) LIKE LOWER(CONCAT('%', :keyword, '%'))))")
    List<CityPlace> searchPanIndiaPlaces(
            @Param("state") String state,
            @Param("city") String city,
            @Param("categoryId") Integer categoryId,
            @Param("keyword") String keyword);
}
