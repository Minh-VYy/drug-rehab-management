package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.TreatmentJournal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreatmentJournalRepository extends JpaRepository<TreatmentJournal, String> {
    List<TreatmentJournal> findByDoctor_IdOrderByRecordedAtDesc(String doctorId);
    List<TreatmentJournal> findByMedicalRecord_IdOrderByRecordedAtDesc(String medicalRecordId);
}
