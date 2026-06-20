package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.TreatmentProposal;
import com.rehab.rehab_center_api.enums.ProposalType;
import com.rehab.rehab_center_api.enums.TreatmentProposalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface TreatmentProposalRepository extends JpaRepository<TreatmentProposal, String> {

    @EntityGraph(attributePaths = {
            "rehabPatient",
            "rehabPatient.currentStageDefinition",
            "doctor",
            "doctor.user",
            "manager",
            "manager.user",
            "currentStageDefinition",
            "proposedStageDefinition"
    })
    Optional<TreatmentProposal> findWithDetailsById(String id);

    @EntityGraph(attributePaths = {
            "rehabPatient",
            "doctor",
            "doctor.user",
            "currentStageDefinition",
            "proposedStageDefinition"
    })
    Page<TreatmentProposal> findByProposalTypeAndStatus(
            ProposalType proposalType,
            TreatmentProposalStatus status,
            Pageable pageable
    );

    boolean existsByRehabPatient_IdAndProposalTypeAndStatusAndIdNot(
            String rehabPatientId,
            ProposalType proposalType,
            TreatmentProposalStatus status,
            String excludeProposalId
    );

    @EntityGraph(attributePaths = {
            "rehabPatient",
            "rehabPatient.currentStageDefinition",
            "doctor",
            "doctor.user",
            "manager",
            "manager.user",
            "currentStageDefinition",
            "proposedStageDefinition"
    })
    List<TreatmentProposal> findByProposalTypeAndStatusInOrderByProposedAtDesc(
            ProposalType proposalType,
            List<TreatmentProposalStatus> statuses
    );

    long countByProposalTypeAndStatus(ProposalType proposalType, TreatmentProposalStatus status);
}
