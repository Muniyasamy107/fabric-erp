package com.fabricerp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Public liveness/readiness probe used by Render, Railway, Docker healthchecks
 * and the Vercel frontend "is API up?" banner.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "UP");
        body.put("service", "kak-textile-erp");
        body.put("timestamp", System.currentTimeMillis());

        String db = "UNKNOWN";
        if (dataSource != null) {
            try (Connection c = dataSource.getConnection()) {
                db = c.isValid(2) ? "UP" : "DOWN";
            } catch (Exception ex) {
                db = "DOWN";
                body.put("dbError", ex.getMessage());
            }
        }
        body.put("database", db);

        if ("DOWN".equals(db)) {
            body.put("status", "DEGRADED");
            return ResponseEntity.status(503).body(body);
        }
        return ResponseEntity.ok(body);
    }
}
