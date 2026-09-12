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
        // ensureSeedAccount also re-enables and resets password if a previous
        // run left the demo user disabled or with a forgotten password.
        ensureSeedAccount("admin", "admin123", "Plant General Manager", "ADMIN");
        ensureSeedAccount("supervisor", "super123", "Shift Production Supervisor", "SUPERVISOR");
        ensureSeedAccount("weaver", "weaver123", "Loom Operator Weaver", "WEAVER");
        ensureSeedAccount("dyer", "dyer123", "Color Lab Chemist", "DYEING_MASTER");
        ensureSeedAccount("finisher", "finish123", "Finishing Master", "FINISHING_MASTER");
        ensureSeedAccount("fitter", "fitter123", "Maintenance Fitter", "FITTER");
        ensureSeedAccount("dispatcher", "dispatch123", "Dispatch Incharge", "DISPATCHER");
        migrateLegacyNames();
        migrateLegacyRoles();
        repairOrphanDisabledAccounts();
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

    /**
     * Create the documented demo login if missing. If it already exists
     * (e.g. from an older DB), force it back to the known password, role,
     * display name and active=true so "Account is disabled" never blocks
     * the default admin / staff logins after a restart.
     */
    private void ensureSeedAccount(String username, String rawPassword, String fullName, String role) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setFullName(fullName);
            user.setRole(role);
            user.setActive(true);
            userRepository.save(user);
            System.out.println("Factory User Initialized: " + username + " / " + rawPassword);
            return;
        }

        boolean changed = false;
        if (user.getActive() == null || !user.getActive()) {
            user.setActive(true);
            changed = true;
        }
        // Keep demo passwords in sync with README so operators are never locked out.
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(rawPassword));
            changed = true;
        }
        if (role != null && !role.equalsIgnoreCase(user.getRole() == null ? "" : user.getRole())) {
            user.setRole(role);
            changed = true;
        }
        if (fullName != null && (user.getFullName() == null || user.getFullName().isBlank())) {
            user.setFullName(fullName);
            changed = true;
        }
        if (changed) {
            userRepository.save(user);
            System.out.println("Factory User Restored (active + credentials): " + username);
        }
    }

    /**
     * Safety net: any leftover row with active=null is treated as enabled.
     * Null used to trip the login guard on some MySQL BIT mappings.
     */
    private void repairOrphanDisabledAccounts() {
        for (User u : userRepository.findAll()) {
            if (u.getActive() == null) {
                u.setActive(true);
                userRepository.save(u);
                System.out.println("Repaired null active flag for: " + u.getUsername());
            }
        }
    }
}
