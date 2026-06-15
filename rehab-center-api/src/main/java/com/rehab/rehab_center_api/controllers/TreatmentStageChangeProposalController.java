package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.request.RejectTreatmentProposalRequest;
import com.rehab.rehab_center_api.dto.response.TreatmentProposalDetailResponse;
import com.rehab.rehab_center_api.dto.response.TreatmentProposalSummaryResponse;
import com.rehab.rehab_center_api.enums.TreatmentProposalStatus;
import com.rehab.rehab_center_api.services.TreatmentStageChangeProposalService;
import com.rehab.rehab_center_api.utils.PageableUtils;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/treatment-proposals/stage-changes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CAN_BO_QUAN_LY')")
public class TreatmentStageChangeProposalController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("proposedAt", "status", "id");

    private final TreatmentStageChangeProposalService treatmentStageChangeProposalService;

    @GetMapping
    @Operation(summary = "List stage change proposals")
    public ResponseEntity<ApiResponse<Page<TreatmentProposalSummaryResponse>>> list(
            @RequestParam(required = false) TreatmentProposalStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "proposedAt") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortDirection
    ) {
        TreatmentProposalStatus effectiveStatus = status != null ? status : TreatmentProposalStatus.CHO_DUYET;
        var pageable = PageableUtils.of(page, size, sortBy, sortDirection, ALLOWED_SORT_FIELDS, "proposedAt");
        Page<TreatmentProposalSummaryResponse> response = treatmentStageChangeProposalService.list(effectiveStatus, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Stage change proposals retrieved successfully"));
    }

    @GetMapping("/{proposalId}")
    @Operation(summary = "Get stage change proposal detail")
    public ResponseEntity<ApiResponse<TreatmentProposalDetailResponse>> getById(@PathVariable String proposalId) {
        TreatmentProposalDetailResponse response = treatmentStageChangeProposalService.getById(proposalId);
        return ResponseEntity.ok(ApiResponse.success(response, "Stage change proposal retrieved successfully"));
    }

    @PostMapping("/{proposalId}/approve")
    @Operation(summary = "Approve a stage change proposal")
    public ResponseEntity<ApiResponse<TreatmentProposalDetailResponse>> approve(@PathVariable String proposalId) {
        TreatmentProposalDetailResponse response = treatmentStageChangeProposalService.approve(proposalId);
        return ResponseEntity.ok(ApiResponse.success(response, "Stage change proposal approved successfully"));
    }

    @PostMapping("/{proposalId}/reject")
    @Operation(summary = "Reject a stage change proposal")
    public ResponseEntity<ApiResponse<TreatmentProposalDetailResponse>> reject(
            @PathVariable String proposalId,
            @Valid @RequestBody RejectTreatmentProposalRequest request
    ) {
        TreatmentProposalDetailResponse response = treatmentStageChangeProposalService.reject(proposalId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Stage change proposal rejected successfully"));
    }
}
