package com.rehab.rehab_center_api.dto.mapper;

import com.rehab.rehab_center_api.dto.response.HandoverSlipResponse;
import com.rehab.rehab_center_api.dto.response.HandoverSlipSummaryResponse;
import com.rehab.rehab_center_api.dto.response.HandoverSubjectResponse;
import com.rehab.rehab_center_api.entities.HandoverSlip;
import com.rehab.rehab_center_api.entities.HandoverSlipDetail;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HandoverSlipMapper {

    public HandoverSlipResponse toResponse(HandoverSlip slip, boolean includeSubjects) {
        HandoverSlipResponse.HandoverSlipResponseBuilder builder = HandoverSlipResponse.builder()
                .id(slip.getId())
                .decisionNumber(slip.getDecisionNumber())
                .decisionDate(slip.getDecisionDate())
                .decisionFileUrl(slip.getDecisionFileUrl())
                .submittedAt(slip.getSubmittedAt())
                .status(slip.getStatus())
                .subjectCount(slip.getSubjectCount())
                .note(slip.getNote())
                .policeOfficerId(slip.getPoliceOfficer().getId())
                .policeOfficerName(slip.getPoliceOfficer().getFullName())
                .createdAt(slip.getCreatedAt())
                .updatedAt(slip.getUpdatedAt());

        if (includeSubjects) {
            builder.subjects(toSubjectResponses(slip.getSubjects()));
        }

        return builder.build();
    }

    public HandoverSlipSummaryResponse toSummaryResponse(HandoverSlip slip) {
        return HandoverSlipSummaryResponse.builder()
                .id(slip.getId())
                .decisionNumber(slip.getDecisionNumber())
                .decisionDate(slip.getDecisionDate())
                .submittedAt(slip.getSubmittedAt())
                .status(slip.getStatus())
                .subjectCount(slip.getSubjectCount())
                .createdAt(slip.getCreatedAt())
                .build();
    }

    public HandoverSubjectResponse toSubjectResponse(HandoverSlipDetail detail) {
        return HandoverSubjectResponse.builder()
                .id(detail.getId())
                .fullName(detail.getFullName())
                .identityNumber(detail.getIdentityNumber())
                .dateOfBirth(detail.getDateOfBirth())
                .hometown(detail.getHometown())
                .currentAddress(detail.getCurrentAddress())
                .relativeName(detail.getRelativeName())
                .relativePhone(detail.getRelativePhone())
                .relativeRelationship(detail.getRelativeRelationship())
                .violationDescription(detail.getViolationDescription())
                .status(detail.getStatus())
                .build();
    }

    public List<HandoverSubjectResponse> toSubjectResponses(List<HandoverSlipDetail> details) {
        return details.stream().map(this::toSubjectResponse).toList();
    }
}
