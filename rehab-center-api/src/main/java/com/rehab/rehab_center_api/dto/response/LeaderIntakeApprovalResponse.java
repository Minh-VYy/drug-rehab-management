package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeaderIntakeApprovalResponse {

    private final String code;
    private final String policeOfficer;
    private final String sentDate;
    private final String subjectName;
    private final String citizenId;
    private final String birthDate;
    private final String hometown;
    private final String currentAddress;
    private final String relativeName;
    private final String relativePhone;
    private final String relationship;
    private final String violation;
    private final String decisionFile;
    private final String status;
    private final String approvedBy;
    private final String approvedDate;
}
