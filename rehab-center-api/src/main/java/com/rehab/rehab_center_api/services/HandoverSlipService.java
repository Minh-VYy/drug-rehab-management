package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.request.CreateHandoverSlipRequest;
import com.rehab.rehab_center_api.dto.request.UpdateHandoverSlipRequest;
import com.rehab.rehab_center_api.dto.response.HandoverSlipResponse;
import com.rehab.rehab_center_api.dto.response.HandoverSlipSummaryResponse;
import com.rehab.rehab_center_api.dto.response.HandoverSubjectResponse;
import com.rehab.rehab_center_api.enums.HandoverSlipStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HandoverSlipService {

    HandoverSlipResponse createDraft(CreateHandoverSlipRequest request, MultipartFile decisionFile);

    HandoverSlipResponse updateDraft(String slipId, UpdateHandoverSlipRequest request, MultipartFile decisionFile);

    HandoverSlipResponse submit(String slipId);

    HandoverSlipResponse cancel(String slipId);

    HandoverSlipResponse getById(String slipId);

    Page<HandoverSlipSummaryResponse> listMine(HandoverSlipStatus status, Pageable pageable);

    List<HandoverSubjectResponse> listSubjects(String slipId);
}
