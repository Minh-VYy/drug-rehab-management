package com.rehab.rehab_center_api.services.impl;

import com.rehab.rehab_center_api.dto.mapper.TreatmentProposalMapper;
import com.rehab.rehab_center_api.dto.request.RejectTreatmentProposalRequest;
import com.rehab.rehab_center_api.dto.response.TreatmentProposalDetailResponse;
import com.rehab.rehab_center_api.dto.response.TreatmentProposalSummaryResponse;
import com.rehab.rehab_center_api.entities.MedicalRecord;
import com.rehab.rehab_center_api.entities.RehabPatient;
import com.rehab.rehab_center_api.entities.Staff;
import com.rehab.rehab_center_api.entities.TreatmentProposal;
import com.rehab.rehab_center_api.entities.TreatmentProtocolStage;
import com.rehab.rehab_center_api.entities.TreatmentStageDefinition;
import com.rehab.rehab_center_api.enums.ProposalType;
import com.rehab.rehab_center_api.enums.TreatmentProposalStatus;
import com.rehab.rehab_center_api.enums.TreatmentProtocolStatus;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.MedicalRecordRepository;
import com.rehab.rehab_center_api.repositories.RehabPatientRepository;
import com.rehab.rehab_center_api.repositories.TreatmentProposalRepository;
import com.rehab.rehab_center_api.repositories.TreatmentProtocolStageRepository;
import com.rehab.rehab_center_api.services.StaffProfileService;
import com.rehab.rehab_center_api.services.TreatmentStageChangeProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TreatmentStageChangeProposalServiceImpl implements TreatmentStageChangeProposalService {

    private static final ProposalType STAGE_CHANGE_TYPE = ProposalType.CHUYEN_GIAI_DOAN;

    private final TreatmentProposalRepository treatmentProposalRepository;
    private final TreatmentProtocolStageRepository treatmentProtocolStageRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final RehabPatientRepository rehabPatientRepository;
    private final StaffProfileService staffProfileService;
    private final TreatmentProposalMapper treatmentProposalMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<TreatmentProposalSummaryResponse> list(TreatmentProposalStatus status, Pageable pageable) {
        return treatmentProposalRepository
                .findByProposalTypeAndStatus(STAGE_CHANGE_TYPE, status, pageable)
                .map(treatmentProposalMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TreatmentProposalDetailResponse getById(String proposalId) {
        return treatmentProposalMapper.toDetailResponse(getStageChangeProposal(proposalId));
    }

    @Override
    @Transactional
    public TreatmentProposalDetailResponse approve(String proposalId) {
        Staff manager = staffProfileService.getCurrentStaff();
        TreatmentProposal proposal = getStageChangeProposal(proposalId);
        validatePending(proposal);
        validateStageTransition(proposal);
        validatePatientStageConsistency(proposal);

        RehabPatient patient = proposal.getRehabPatient();
        proposal.setStatus(TreatmentProposalStatus.DA_PHE_DUYET);
        proposal.setManager(manager);
        proposal.setApprovedAt(LocalDateTime.now());
        proposal.setApprovalNote(null);

        patient.setCurrentStageDefinition(proposal.getProposedStageDefinition());
        rehabPatientRepository.save(patient);

        syncProtocolStages(patient, proposal);

        TreatmentProposal saved = treatmentProposalRepository.save(proposal);
        return treatmentProposalMapper.toDetailResponse(saved);
    }

    @Override
    @Transactional
    public TreatmentProposalDetailResponse reject(String proposalId, RejectTreatmentProposalRequest request) {
        Staff manager = staffProfileService.getCurrentStaff();
        TreatmentProposal proposal = getStageChangeProposal(proposalId);
        validatePending(proposal);

        proposal.setStatus(TreatmentProposalStatus.TU_CHOI);
        proposal.setManager(manager);
        proposal.setApprovedAt(LocalDateTime.now());
        proposal.setApprovalNote(request.getNote().trim());

        TreatmentProposal saved = treatmentProposalRepository.save(proposal);
        return treatmentProposalMapper.toDetailResponse(saved);
    }

    private TreatmentProposal getStageChangeProposal(String proposalId) {
        TreatmentProposal proposal = treatmentProposalRepository.findWithDetailsById(proposalId)
                .orElseThrow(() -> new AppException(
                        ErrorCode.TREATMENT_PROPOSAL_NOT_FOUND,
                        "Treatment proposal not found"
                ));

        if (proposal.getProposalType() != STAGE_CHANGE_TYPE) {
            throw new AppException(
                    ErrorCode.TREATMENT_PROPOSAL_INVALID_TYPE,
                    "Only stage change proposals can be processed through this endpoint"
            );
        }

        return proposal;
    }

    private void validatePending(TreatmentProposal proposal) {
        if (proposal.getStatus() != TreatmentProposalStatus.CHO_DUYET) {
            throw new AppException(
                    ErrorCode.TREATMENT_PROPOSAL_NOT_PENDING,
                    "Only pending proposals can be approved or rejected"
            );
        }
    }

    private void validateStageTransition(TreatmentProposal proposal) {
        TreatmentStageDefinition currentStage = proposal.getCurrentStageDefinition();
        TreatmentStageDefinition proposedStage = proposal.getProposedStageDefinition();

        if (currentStage == null || proposedStage == null) {
            throw new AppException(
                    ErrorCode.VALIDATION_ERROR,
                    "Current stage and proposed stage are required"
            );
        }

        if (Objects.equals(currentStage.getId(), proposedStage.getId())) {
            throw new AppException(
                    ErrorCode.TREATMENT_PROPOSAL_INVALID_STAGE_TRANSITION,
                    "Proposed stage must be different from the current stage"
            );
        }

        if (proposedStage.getSequenceOrder() <= currentStage.getSequenceOrder()) {
            throw new AppException(
                    ErrorCode.TREATMENT_PROPOSAL_INVALID_STAGE_TRANSITION,
                    "Stage change must move forward to a later treatment stage"
            );
        }
    }

    private void validatePatientStageConsistency(TreatmentProposal proposal) {
        RehabPatient patient = proposal.getRehabPatient();
        if (patient == null) {
            throw new AppException(ErrorCode.REHAB_PATIENT_NOT_FOUND, "Rehab patient not found");
        }

        TreatmentStageDefinition patientStage = patient.getCurrentStageDefinition();
        TreatmentStageDefinition proposalCurrentStage = proposal.getCurrentStageDefinition();

        if (patientStage == null || !patientStage.getId().equals(proposalCurrentStage.getId())) {
            throw new AppException(
                    ErrorCode.TREATMENT_PROPOSAL_STAGE_MISMATCH,
                    "The patient's current stage no longer matches this proposal"
            );
        }

        if (treatmentProposalRepository.existsByRehabPatient_IdAndProposalTypeAndStatusAndIdNot(
                patient.getId(),
                STAGE_CHANGE_TYPE,
                TreatmentProposalStatus.CHO_DUYET,
                proposal.getId()
        )) {
            throw new AppException(
                    ErrorCode.TREATMENT_PROPOSAL_DUPLICATE_PENDING,
                    "Another pending stage change proposal exists for this patient"
            );
        }
    }

    private void syncProtocolStages(RehabPatient patient, TreatmentProposal proposal) {
        medicalRecordRepository.findByRehabPatient_Id(patient.getId()).ifPresent(medicalRecord -> {
            closeActiveProtocolStage(medicalRecord);
            activateProposedProtocolStage(medicalRecord, proposal.getProposedStageDefinition());
        });
    }

    private void closeActiveProtocolStage(MedicalRecord medicalRecord) {
        treatmentProtocolStageRepository
                .findByTreatmentProtocol_MedicalRecord_IdAndStatus(
                        medicalRecord.getId(),
                        TreatmentProtocolStatus.DANG_AP_DUNG
                )
                .ifPresent(activeStage -> {
                    activeStage.setStatus(TreatmentProtocolStatus.DA_HOAN_THANH);
                    treatmentProtocolStageRepository.save(activeStage);
                });
    }

    private void activateProposedProtocolStage(MedicalRecord medicalRecord, TreatmentStageDefinition proposedStage) {
        treatmentProtocolStageRepository
                .findByTreatmentProtocol_MedicalRecord_IdAndStageDefinition_Id(
                        medicalRecord.getId(),
                        proposedStage.getId()
                )
                .ifPresent(newStage -> {
                    newStage.setStatus(TreatmentProtocolStatus.DANG_AP_DUNG);
                    treatmentProtocolStageRepository.save(newStage);
                });
    }
}
