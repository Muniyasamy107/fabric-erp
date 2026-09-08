package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.BoilerSteamLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoilerSteamLogRepository extends JpaRepository<BoilerSteamLog, Long> {
    List<BoilerSteamLog> findAllByOrderByLogDateDesc();
    Optional<BoilerSteamLog> findBySteamLogNumber(String steamLogNumber);
}