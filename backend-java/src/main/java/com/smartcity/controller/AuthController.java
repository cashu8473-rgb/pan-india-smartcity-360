package com.smartcity.controller;

import com.smartcity.model.User;
import com.smartcity.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and Password are required."));
        }

        Optional<User> userOpt = userService.authenticate(email, password);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("message", "Welcome back, " + user.getFullName());
            response.put("token", "JWT_MOCK_TOKEN_" + user.getUserId() + "_" + System.currentTimeMillis());
            response.put("user", Map.of(
                    "userId", user.getUserId(),
                    "fullName", user.getFullName(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "cityZone", user.getCityZone()
            ));
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(Map.of("status", "ERROR", "message", "Invalid email or password credentials."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User created = userService.registerUser(user);
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "User registered successfully!",
                    "userId", created.getUserId()
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "ERROR", "message", ex.getMessage()));
        }
    }
}
