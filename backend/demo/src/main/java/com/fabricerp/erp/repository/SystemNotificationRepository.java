package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.SystemNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemNotificationRepository extends JpaRepository<SystemNotification, Long> {
    List<SystemNotification> findByIsReadFalseOrderByCreatedAtDesc();
    List<SystemNotification> findTop100ByIsReadFalseOrderByCreatedAtDesc();
    List<SystemNotification> findAllByOrderByCreatedAtDesc();
    long countByIsReadFalse();
    boolean existsByTitleAndIsReadFalse(String title);
}