package com.fabricerp.erp.config;

import com.fabricerp.erp.entity.User;
import com.fabricerp.erp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        createIfMissing("admin", "admin123", "Plant General Manager", "ADMIN");
        createIfMissing("supervisor", "super123", "Shift Production Supervisor", "SUPERVISOR");
        createIfMissing("weaver", "weaver123", "Loom Operator Weaver", "WEAVER");
        createIfMissing("dyer", "dyer123", "Color Lab Chemist", "DYEING_MASTER");
    }

    private void createIfMissing(String username, String rawPassword, String fullName, String role) {
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setFullName(fullName);
            user.setRole(role);
            user.setActive(true);
            userRepository.save(user);
            System.out.println("Factory User Initialized: " + username + " / " + rawPassword);
        }
    }
}