package com.rehab.rehab_center_api.dto.response;

import com.rehab.rehab_center_api.enums.HandoverSlipStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class HandoverSlipSummaryResponse {

    private final String id;
    private final String decisionNumber;
    private final LocalDate decisionDate;
    private final LocalDateTime submittedAt;
    private final HandoverSlipStatus status;
    private final Integer subjectCount;
    private final LocalDateTime createdAt;
}
