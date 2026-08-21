@echo off
title Smart City Guide - Launch Portal
color 0B

echo ==============================================================================
echo        SMART CITY GUIDE & CITIZEN SERVICES WEB APPLICATION
echo ==============================================================================
echo  1. Launching Interactive Web Portal in default browser...
echo  2. Project Location: %~dp0frontend-web\index.html
echo  3. Printable PDF Documentation: %~dp0docs-and-pdf\PROJECT_REPORT_AND_SOURCE_CODE.html
echo ==============================================================================

start "" "%~dp0frontend-web\index.html"

echo.
echo [INFO] Web Application Portal opened successfully.
echo [INFO] To run with full Java + MySQL backend:
echo        - Run database\smart_city_db.sql in MySQL Workbench / phpMyAdmin
echo        - In backend-java folder, execute: mvn spring-boot:run
echo.
pause
