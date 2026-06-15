package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.request.RejectTreatmentProposalRequest;
import com.rehab.rehab_center_api.dto.response.TreatmentProposalDetailResponse;
import com.rehab.rehab_center_api.dto.response.TreatmentProposalSummaryResponse;
import com.rehab.rehab_center_api.enums.TreatmentProposalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TreatmentStageChangeProposalService {

    Page<TreatmentProposalSummaryResponse> list(TreatmentProposalStatus status, Pageable pageable);

    TreatmentProposalDetailResponse getById(String proposalId);

    TreatmentProposalDetailResponse approve(String proposalId);

    TreatmentProposalDetailResponse reject(String proposalId, RejectTreatmentProposalRequest request);
}
