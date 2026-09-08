package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.WorkerShiftAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkerShiftAttendanceRepository extends JpaRepository<WorkerShiftAttendance, Long> {
    List<WorkerShiftAttendance> findAllByOrderByAttendanceDateDesc();
    List<WorkerShiftAttendance> findByAttendanceDateOrderByPlantDepartmentAsc(LocalDate attendanceDate);
    List<WorkerShiftAttendance> findByWorkerBadgeNumber(String workerBadgeNumber);
}