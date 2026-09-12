package com.fabricerp.erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    private String fullName;

    @Column(nullable = false)
    private String role; // ADMIN, SUPERVISOR, WEAVER, DYEING_MASTER, FINISHING_MASTER, FITTER, DISPATCHER

    /**
     * TINYINT(1) avoids MySQL BIT(1) quirks where some drivers map the value
     * incorrectly and leave the account looking disabled on login.
     */
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean active = true;

    @PrePersist
    @PreUpdate
    private void ensureActiveDefault() {
        if (this.active == null) {
            this.active = true;
        }
    }

    /** Treat null the same as enabled — never lock a row out by accident. */
    public boolean isAccountEnabled() {
        return active == null || Boolean.TRUE.equals(active);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}