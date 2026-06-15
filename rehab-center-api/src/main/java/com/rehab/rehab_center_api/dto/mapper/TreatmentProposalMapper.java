package com.rehab.rehab_center_api.dto.mapper;

import com.rehab.rehab_center_api.dto.response.TreatmentProposalDetailResponse;
import com.rehab.rehab_center_api.dto.response.TreatmentProposalSummaryResponse;
import com.rehab.rehab_center_api.dto.response.TreatmentStageResponse;
import com.rehab.rehab_center_api.entities.Staff;
import com.rehab.rehab_center_api.entities.TreatmentProposal;
import com.rehab.rehab_center_api.entities.TreatmentStageDefinition;
import com.rehab.rehab_center_api.entities.User;
import org.springframework.stereotype.Component;

@Component
public class TreatmentProposalMapper {

    public TreatmentProposalSummaryResponse toSummaryResponse(TreatmentProposal proposal) {
        return TreatmentProposalSummaryResponse.builder()
                .id(proposal.getId())
                .patientId(proposal.getRehabPatient().getId())
                .patientName(proposal.getRehabPatient().getFullName())
                .doctorId(proposal.getDoctor().getId())
                .doctorName(resolveStaffName(proposal.getDoctor()))
                .currentStage(toStageResponse(proposal.getCurrentStageDefinition()))
                .proposedStage(toStageResponse(proposal.getProposedStageDefinition()))
                .reason(proposal.getReason())
                .proposedAt(proposal.getProposedAt())
                .status(proposal.getStatus())
                .build();
    }

    public TreatmentProposalDetailResponse toDetailResponse(TreatmentProposal proposal) {
        Staff manager = proposal.getManager();
        return TreatmentProposalDetailResponse.builder()
                .id(proposal.getId())
                .patientId(proposal.getRehabPatient().getId())
                .patientName(proposal.getRehabPatient().getFullName())
                .identityNumber(proposal.getRehabPatient().getIdentityNumber())
                .admissionDate(proposal.getRehabPatient().getAdmissionDate())
                .doctorId(proposal.getDoctor().getId())
                .doctorName(resolveStaffName(proposal.getDoctor()))
                .currentStage(toStageResponse(proposal.getCurrentStageDefinition()))
                .proposedStage(toStageResponse(proposal.getProposedStageDefinition()))
                .patientCurrentStage(toStageResponse(proposal.getRehabPatient().getCurrentStageDefinition()))
                .reason(proposal.getReason())
                .proposedAt(proposal.getProposedAt())
                .status(proposal.getStatus())
                .managerId(manager != null ? manager.getId() : null)
                .managerName(manager != null ? resolveStaffName(manager) : null)
                .approvedAt(proposal.getApprovedAt())
                .approvalNote(proposal.getApprovalNote())
                .build();
    }

    public TreatmentStageResponse toStageResponse(TreatmentStageDefinition stageDefinition) {
        if (stageDefinition == null) {
            return null;
        }
        return TreatmentStageResponse.builder()
                .id(stageDefinition.getId())
                .name(stageDefinition.getName())
                .sequenceOrder(stageDefinition.getSequenceOrder())
                .description(stageDefinition.getDescription())
                .build();
    }

    private String resolveStaffName(Staff staff) {
        User user = staff.getUser();
        return user != null ? user.getFullName() : null;
    }
}
