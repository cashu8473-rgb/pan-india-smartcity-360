package com.smartcity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Smart City Guide & Citizen Services REST API
 * Main Spring Boot Application Entry Point
 * 
 * @author Smart City Engineering Team
 * @version 1.0.0
 */
@SpringBootApplication
public class SmartCityApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCityApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  SMART CITY GUIDE BACKEND REST API IS RUNNING!  ");
        System.out.println("  Base URL: http://localhost:8080/api/v1         ");
        System.out.println("  API Docs / Endpoints:                          ");
        System.out.println("   - /places       (City Attractions & Tourism)  ");
        System.out.println("   - /emergency    (SOS & Emergency Facilities)  ");
        System.out.println("   - /grievances   (Citizen Civic Issue Portal)  ");
        System.out.println("   - /events       (Passes & City Happenings)    ");
        System.out.println("   - /admin        (Analytics & Control Center)  ");
        System.out.println("=================================================");
    }
}
