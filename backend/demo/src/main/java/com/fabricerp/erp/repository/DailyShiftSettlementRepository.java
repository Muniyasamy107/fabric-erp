package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.DailyShiftSettlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyShiftSettlementRepository extends JpaRepository<DailyShiftSettlement, Long> {
    List<DailyShiftSettlement> findAllByOrderByIdDesc();

    long countByShiftDate(LocalDate shiftDate);
}
