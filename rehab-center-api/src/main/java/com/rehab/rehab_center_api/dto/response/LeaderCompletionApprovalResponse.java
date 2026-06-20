package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeaderCompletionApprovalResponse {

    private final String code;
    private final String recordCode;
    private final String subjectName;
    private final String currentPhase;
    private final String requestDate;
    private final String requestedBy;
    private final String notes;
    private final String evaluation;
    private final String status;
    private final String approvedBy;
    private final String approvedDate;
}
