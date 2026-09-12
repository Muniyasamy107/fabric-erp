package com.fabricerp.erp.config;

import com.fabricerp.erp.entity.User;
import com.fabricerp.erp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

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
        // One seed account per role so every shop-floor tab has a login.
        createIfMissing("admin", "admin123", "Plant General Manager", "ADMIN");
        createIfMissing("supervisor", "super123", "Shift Production Supervisor", "SUPERVISOR");
        createIfMissing("weaver", "weaver123", "Loom Operator Weaver", "WEAVER");
        createIfMissing("dyer", "dyer123", "Color Lab Chemist", "DYEING_MASTER");
        createIfMissing("finisher", "finish123", "Finishing Master", "FINISHING_MASTER");
        createIfMissing("fitter", "fitter123", "Maintenance Fitter", "FITTER");
        createIfMissing("dispatcher", "dispatch123", "Dispatch Incharge", "DISPATCHER");
        migrateLegacyNames();
        migrateLegacyRoles();
    }

    /** Old boutique-era display names are replaced with factory titles. */
    private void migrateLegacyNames() {
        for (User u : userRepository.findAll()) {
            String name = u.getFullName() != null ? u.getFullName() : "";
            if (name.toLowerCase().contains("boutique") || name.toLowerCase().contains("tailor")) {
                String replacement;
                switch (u.getRole()) {
                    case "ADMIN": replacement = "Plant General Manager"; break;
                    case "SUPERVISOR": replacement = "Shift Production Supervisor"; break;
                    case "WEAVER": replacement = "Loom Operator Weaver"; break;
                    case "DYEING_MASTER": replacement = "Color Lab Chemist"; break;
                    case "FINISHING_MASTER": replacement = "Finishing Master"; break;
                    case "FITTER": replacement = "Maintenance Fitter"; break;
                    case "DISPATCHER": replacement = "Dispatch Incharge"; break;
                    default: replacement = "Mill Employee"; break;
                }
                u.setFullName(replacement);
                userRepository.save(u);
                System.out.println("Legacy display name migrated for: " + u.getUsername());
            }
        }
    }

    /**
     * Roles that no longer exist in the mill role matrix would otherwise leave
     * the operator with an empty side menu, so they are mapped onto the
     * closest factory role once at start-up.
     */
    private void migrateLegacyRoles() {
        for (User u : userRepository.findAll()) {
            String role = u.getRole() == null ? "" : u.getRole().trim().toUpperCase(Locale.ROOT);
            String mapped = switch (role) {
                case "CASHIER", "BILLING", "SALES" -> "SUPERVISOR";
                case "DYER" -> "DYEING_MASTER";
                case "FINISHER" -> "FINISHING_MASTER";
                case "MECHANIC", "ELECTRICIAN" -> "FITTER";
                case "SECURITY", "LOADER" -> "DISPATCHER";
                default -> null;
            };
            if (mapped != null) {
                u.setRole(mapped);
                userRepository.save(u);
                System.out.println("Legacy role migrated: " + u.getUsername() + " " + role + " -> " + mapped);
            }
        }
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
