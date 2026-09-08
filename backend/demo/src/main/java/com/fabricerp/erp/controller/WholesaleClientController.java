package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.WholesaleClient;
import com.fabricerp.erp.repository.WholesaleClientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class WholesaleClientController {

    private final WholesaleClientRepository clientRepository;

    public WholesaleClientController(WholesaleClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @GetMapping
    public List<WholesaleClient> getAll() {
        return clientRepository.findAll();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchByPhone(@RequestParam String phone) {
        return clientRepository.findByContactPhone(phone)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody WholesaleClient client) {
        if (client.getCompanyName() == null || client.getCompanyName().isBlank()) {
            return ResponseEntity.badRequest().body("Company name is required");
        }
        if (client.getContactPhone() == null || client.getContactPhone().isBlank()) {
            return ResponseEntity.badRequest().body("Phone is required");
        }
        if (clientRepository.findByContactPhone(client.getContactPhone()).isPresent()) {
            return ResponseEntity.badRequest().body("Phone already registered");
        }
        return ResponseEntity.ok(clientRepository.save(client));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody WholesaleClient incoming) {
        WholesaleClient existing = clientRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();

        existing.setCompanyName(incoming.getCompanyName());
        existing.setContactPhone(incoming.getContactPhone());
        existing.setEmail(incoming.getEmail());
        existing.setBillingAddress(incoming.getBillingAddress());
        existing.setGstin(incoming.getGstin());
        if (incoming.getClientSegment() != null) existing.setClientSegment(incoming.getClientSegment());

        return ResponseEntity.ok(clientRepository.save(existing));
    }
}