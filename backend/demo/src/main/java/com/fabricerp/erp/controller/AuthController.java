package com.fabricerp.erp.controller;

import com.fabricerp.erp.dto.request.LoginRequest;
import com.fabricerp.erp.dto.request.RegisterRequest;
import com.fabricerp.erp.dto.response.AuthResponse;
import com.fabricerp.erp.entity.SystemNotification;
import com.fabricerp.erp.entity.User;
import com.fabricerp.erp.repository.SystemNotificationRepository;
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
    private final SystemNotificationRepository notificationRepository;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil, SystemNotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody(required = false) LoginRequest request) {
        if (request == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }
        String username = request.getUsername() != null ? request.getUsername().trim() : "";
        String password = request.getPassword() != null ? request.getPassword() : "";
        if (username.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // Demo / seed accounts: correct password always re-enables the row.
        // This recovers from an accidental "Disable" click in Shift Staff without
        // needing a DB console on Render.
        if (!user.isAccountEnabled() && isSeedAccount(username)) {
            user.setActive(true);
            userRepository.save(user);
        }

        // Null active is treated as enabled (legacy rows / BIT mapping quirks).
        if (!user.isAccountEnabled()) {
            return ResponseEntity.status(403).body("Account is disabled. Ask the plant admin to re-enable it from Shift Staff.");
        }

        // Heal rows that still carry a null flag so the next login is clean.
        if (user.getActive() == null) {
            user.setActive(true);
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getFullName(), user.getRole()));
    }

    /** Built-in mill logins documented in README — always recoverable. */
    private static boolean isSeedAccount(String username) {
        if (username == null) return false;
        return switch (username.trim().toLowerCase()) {
            case "admin", "supervisor", "weaver", "dyer", "finisher", "fitter", "dispatcher" -> true;
            default -> false;
        };
    }

    /**
     * Self-service staff signup from the login page. New accounts always
     * start on the shop-floor WEAVER role — the plant admin can re-assign
     * roles later from Shift Staff. Returns a token so the user is signed
     * in immediately after registering.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String username = request.getUsername() != null ? request.getUsername().trim() : "";
        String fullName = request.getFullName() != null ? request.getFullName().trim() : "";
        String password = request.getPassword() != null ? request.getPassword() : "";

        if (fullName.length() < 3) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please enter your full name (minimum 3 characters)."));
        }
        if (!username.matches("^[A-Za-z0-9._-]{3,30}$")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username must be 3-30 characters (letters, numbers, dot, dash, underscore)."));
        }
        if (password.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Password must be at least 6 characters long."));
        }
        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "This username is already taken. Try another one."));
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole("WEAVER");
        user.setActive(true);
        userRepository.save(user);

        notifyAdmins("🧵 New Staff Signup — " + fullName,
                "A new account '" + username + "' was created from the login page with WEAVER access. "
                        + "Review the role from Shift Staff if a different designation is needed.",
                "INFO", "/staff");

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.status(201)
                .body(new AuthResponse(token, user.getUsername(), user.getFullName(), user.getRole()));
    }

    /**
     * Step 1 of self-service password recovery — check the account exists.
     */
    @GetMapping("/forgot-password/{username}")
    public ResponseEntity<?> forgotCheck(@PathVariable String username) {
        User user = userRepository.findByUsername(username != null ? username.trim() : "").orElse(null);
        if (user == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "No account found for this username."));
        }
        return ResponseEntity.ok(Map.of("exists", true));
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

        notifyAdmins("🔑 Password Reset — " + user.getFullName(),
                "Staff account '" + user.getUsername() + "' (" + user.getRole()
                        + ") verified identity and received a one-time password. Please set a permanent password from Shift Staff.",
                "INFO", "/staff");

        return ResponseEntity.ok(Map.of(
                "tempPassword", tempPassword,
                "message", "Identity verified. Use this one-time password to sign in."));
    }

    private void notifyAdmins(String title, String message, String severity, String actionUrl) {
        SystemNotification n = new SystemNotification();
        n.setTitle(title);
        n.setMessage(message);
        n.setAlertCategory("QC_ALERT");
        n.setSeverity(severity);
        n.setIsRead(false);
        n.setActionUrl(actionUrl);
        notificationRepository.save(n);
    }
}