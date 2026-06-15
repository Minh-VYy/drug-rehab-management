package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.TreatmentProtocolStage;
import com.rehab.rehab_center_api.enums.TreatmentProtocolStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TreatmentProtocolStageRepository extends JpaRepository<TreatmentProtocolStage, String> {

    List<TreatmentProtocolStage> findByTreatmentProtocol_IdOrderBySequenceOrderAsc(String treatmentProtocolId);

    Optional<TreatmentProtocolStage> findByTreatmentProtocol_MedicalRecord_IdAndStatus(
            String medicalRecordId,
            TreatmentProtocolStatus status
    );

    boolean existsByTreatmentProtocol_MedicalRecord_IdAndStatus(
            String medicalRecordId,
            TreatmentProtocolStatus status
    );

    Optional<TreatmentProtocolStage> findByTreatmentProtocol_MedicalRecord_IdAndStageDefinition_Id(
            String medicalRecordId,
            String stageDefinitionId
    );
}
