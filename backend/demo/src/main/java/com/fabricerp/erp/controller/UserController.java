package com.fabricerp.erp.controller;

import com.fabricerp.erp.dto.request.CreateUserRequest;
import com.fabricerp.erp.dto.response.UserResponse;
import com.fabricerp.erp.entity.User;
import com.fabricerp.erp.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final List<String> VALID_ROLES = Arrays.asList(
        "ADMIN", "SUPERVISOR", "WEAVER", "DYEING_MASTER", "FINISHING_MASTER", "FITTER", "DISPATCHER"
    );

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserResponse(u.getId(), u.getUsername(), u.getFullName(), u.getRole(), u.getActive()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters");
        }
        if (userRepository.existsByUsername(request.getUsername().trim())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        String targetRole = request.getRole() != null ? request.getRole().toUpperCase().trim() : "WEAVER";
        if (!VALID_ROLES.contains(targetRole)) {
            return ResponseEntity.badRequest().body("Invalid Factory Role. Allowed: " + String.join(", ", VALID_ROLES));
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setRole(targetRole);
        user.setActive(true);
        userRepository.save(user);

        return ResponseEntity.ok(new UserResponse(
                user.getId(), user.getUsername(), user.getFullName(), user.getRole(), user.getActive()
        ));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleActive(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        boolean currentlyActive = user.getActive() == null || user.getActive();
        user.setActive(!currentlyActive);
        userRepository.save(user);

        return ResponseEntity.ok(new UserResponse(
                user.getId(), user.getUsername(), user.getFullName(), user.getRole(), user.getActive()
        ));
    }

    /**
     * ADMIN-only: issue a one-time temporary password for a staff account.
     */
    @PutMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String tempPassword = "RF-" + (100000 + new Random().nextInt(900000));
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "tempPassword", tempPassword
        ));
    }
}