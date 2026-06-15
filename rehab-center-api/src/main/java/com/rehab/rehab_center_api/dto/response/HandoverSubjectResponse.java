package com.rehab.rehab_center_api.dto.response;

import com.rehab.rehab_center_api.enums.HandoverSlipDetailStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class HandoverSubjectResponse {

    private final String id;
    private final String fullName;
    private final String identityNumber;
    private final LocalDate dateOfBirth;
    private final String hometown;
    private final String currentAddress;
    private final String relativeName;
    private final String relativePhone;
    private final String relativeRelationship;
    private final String violationDescription;
    private final HandoverSlipDetailStatus status;
}
