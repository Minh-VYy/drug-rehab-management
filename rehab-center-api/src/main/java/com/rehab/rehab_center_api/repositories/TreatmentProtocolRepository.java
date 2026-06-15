package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.TreatmentProtocol;
import com.rehab.rehab_center_api.enums.TreatmentProtocolOverallStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TreatmentProtocolRepository extends JpaRepository<TreatmentProtocol, String> {

    @EntityGraph(attributePaths = {"stages", "stages.stageDefinition", "doctor", "medicalRecord"})
    Optional<TreatmentProtocol> findWithStagesById(String id);

    List<TreatmentProtocol> findByMedicalRecord_IdOrderByCreatedAtDesc(String medicalRecordId);

    Optional<TreatmentProtocol> findByMedicalRecord_IdAndStatus(
            String medicalRecordId,
            TreatmentProtocolOverallStatus status
    );
}
