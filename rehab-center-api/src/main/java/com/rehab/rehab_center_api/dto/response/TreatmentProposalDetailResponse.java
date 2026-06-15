package com.rehab.rehab_center_api.dto.response;

import com.rehab.rehab_center_api.enums.TreatmentProposalStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TreatmentProposalDetailResponse {

    private final String id;
    private final String patientId;
    private final String patientName;
    private final String identityNumber;
    private final LocalDateTime admissionDate;
    private final String doctorId;
    private final String doctorName;
    private final TreatmentStageResponse currentStage;
    private final TreatmentStageResponse proposedStage;
    private final TreatmentStageResponse patientCurrentStage;
    private final String reason;
    private final LocalDateTime proposedAt;
    private final TreatmentProposalStatus status;
    private final String managerId;
    private final String managerName;
    private final LocalDateTime approvedAt;
    private final String approvalNote;
}
