package com.fabricerp.erp.controller;

import com.fabricerp.erp.dto.request.LoginRequest;
import com.fabricerp.erp.dto.response.AuthResponse;
import com.fabricerp.erp.entity.User;
import com.fabricerp.erp.repository.UserRepository;
import com.fabricerp.erp.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        if (user.getActive() != null && !user.getActive()) {
            return ResponseEntity.status(403).body("Account is disabled");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getFullName(), user.getRole()));
    }

    /**
     * Step 1 of self-service password recovery — check the account exists.
     */
    @GetMapping("/forgot-password/{username}")
    public ResponseEntity<?> forgotCheck(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(u -> ResponseEntity.ok(Map.of("exists", true)))
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "No account found for this username.")));
    }

    /**
     * Step 2 — verify the registered full name and issue a one-time
     * temporary password (no email server needed inside the mill).
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotReset(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String fullName = body.get("fullName");

        User user = userRepository.findByUsername(username != null ? username.trim() : "").orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "No account found for this username."));
        }
        if (fullName == null || user.getFullName() == null
                || !user.getFullName().trim().equalsIgnoreCase(fullName.trim())) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Verification failed. The full name does not match our records."));
        }

        String tempPassword = "RF-" + (100000 + new Random().nextInt(900000));
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "tempPassword", tempPassword,
                "message", "Identity verified. Use this one-time password to sign in."));
    }
}