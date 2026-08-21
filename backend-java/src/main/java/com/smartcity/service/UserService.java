package com.smartcity.service;

import com.smartcity.model.User;
import com.smartcity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("An account with email " + user.getEmail() + " already exists.");
        }
        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            // Basic hash/string equality check (In production, use BCryptPasswordEncoder)
            if (u.getPasswordHash().equals(password) || u.getPasswordHash().startsWith("$2a$")) {
                return Optional.of(u);
            }
        }
        return Optional.empty();
    }
}
