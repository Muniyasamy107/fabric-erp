package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.entity.MachineMaintenanceLog;
import com.fabricerp.erp.entity.SystemNotification;
import com.fabricerp.erp.repository.FabricRepository;
import com.fabricerp.erp.repository.MachineMaintenanceLogRepository;
import com.fabricerp.erp.repository.SystemNotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final SystemNotificationRepository notificationRepository;
    private final FabricRepository fabricRepository;
    private final MachineMaintenanceLogRepository maintenanceRepository;

    public NotificationController(SystemNotificationRepository notificationRepository,
                                  FabricRepository fabricRepository,
                                  MachineMaintenanceLogRepository maintenanceRepository) {
        this.notificationRepository = notificationRepository;
        this.fabricRepository = fabricRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    @GetMapping("/unread")
    public List<SystemNotification> getUnreadNotifications() {
        // Seed default critical notifications if database is fresh
        if (notificationRepository.count() == 0) {
            seedDefaultNotifications();
        }
        return notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }

    @GetMapping("/all")
    public List<SystemNotification> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/{id}/read")
    @Transactional
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        SystemNotification n = notificationRepository.findById(id).orElse(null);
        if (n == null) return ResponseEntity.notFound().build();
        n.setIsRead(true);
        return ResponseEntity.ok(notificationRepository.save(n));
    }

    @PutMapping("/read-all")
    @Transactional
    public ResponseEntity<?> markAllAsRead() {
        List<SystemNotification> list = notificationRepository.findAll();
        for (SystemNotification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
        return ResponseEntity.ok("All notifications marked as read");
    }

    private void seedDefaultNotifications() {
        SystemNotification n1 = new SystemNotification();
        n1.setTitle("Loom Emergency Breakdown");
        n1.setMessage("LOOM-A03 stopped due to Warp Dropper Wire trip. Fitter team notified.");
        n1.setAlertCategory("BREAKDOWN");
        n1.setSeverity("CRITICAL");
        n1.setActionUrl("/maintenance");
        notificationRepository.save(n1);

        SystemNotification n2 = new SystemNotification();
        n2.setTitle("Low Warehouse Safety Stock");
        n2.setMessage("Silk Crepe 20/22D stock is nearing safety reorder level.");
        n2.setAlertCategory("LOW_STOCK");
        n2.setSeverity("WARNING");
        n2.setActionUrl("/fabrics");
        notificationRepository.save(n2);

        SystemNotification n3 = new SystemNotification();
        n3.setTitle("ZLD Water Quality Compliance Passed");
        n3.setMessage("Daily ETP audit completed. 93.5% water recovered and routed to Jet Dyeing.");
        n3.setAlertCategory("ETP_ALERT");
        n3.setSeverity("INFO");
        n3.setActionUrl("/etp-sustainability");
        notificationRepository.save(n3);

        SystemNotification n4 = new SystemNotification();
        n4.setTitle("Global B2B Export LC Confirmed");
        n4.setMessage("Armani Group Italy $48,000 export contract LC confirmed by HSBC.");
        n4.setAlertCategory("DISPATCH");
        n4.setSeverity("INFO");
        n4.setActionUrl("/exports");
        notificationRepository.save(n4);
    }
}