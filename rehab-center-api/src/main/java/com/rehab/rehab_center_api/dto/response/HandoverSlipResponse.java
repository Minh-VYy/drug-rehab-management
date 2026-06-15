package com.rehab.rehab_center_api.dto.response;

import com.rehab.rehab_center_api.enums.HandoverSlipStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class HandoverSlipResponse {

    private final String id;
    private final String decisionNumber;
    private final LocalDate decisionDate;
    private final String decisionFileUrl;
    private final LocalDateTime submittedAt;
    private final HandoverSlipStatus status;
    private final Integer subjectCount;
    private final String note;
    private final String policeOfficerId;
    private final String policeOfficerName;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final List<HandoverSubjectResponse> subjects;
}
