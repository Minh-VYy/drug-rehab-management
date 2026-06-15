package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.MedicalRecord;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends org.springframework.data.jpa.repository.JpaRepository<MedicalRecord, String> {

    Optional<MedicalRecord> findByRehabPatient_Id(String rehabPatientId);
}
