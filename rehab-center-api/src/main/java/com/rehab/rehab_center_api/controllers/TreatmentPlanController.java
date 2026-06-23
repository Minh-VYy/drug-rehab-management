package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.request.ProcessTreatmentPlanRequest;
import com.rehab.rehab_center_api.dto.response.TreatmentPlanResponse;
import com.rehab.rehab_center_api.services.TreatmentPlanApprovalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/treatment-plans")
@RequiredArgsConstructor
public class TreatmentPlanController {

    private final TreatmentPlanApprovalService treatmentPlanApprovalService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TreatmentPlanResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(treatmentPlanApprovalService.list()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TreatmentPlanResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(treatmentPlanApprovalService.getById(id)));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<TreatmentPlanResponse>> approve(
            @PathVariable String id,
            @Valid @RequestBody(required = false) ProcessTreatmentPlanRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                treatmentPlanApprovalService.approve(id, request),
                "Treatment plan approved successfully"
        ));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<TreatmentPlanResponse>> reject(
            @PathVariable String id,
            @Valid @RequestBody ProcessTreatmentPlanRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                treatmentPlanApprovalService.reject(id, request),
                "Treatment plan rejected successfully"
        ));
    }

    @PutMapping("/{id}/pause")
    public ResponseEntity<ApiResponse<TreatmentPlanResponse>> pause(
            @PathVariable String id,
            @Valid @RequestBody(required = false) ProcessTreatmentPlanRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                treatmentPlanApprovalService.pause(id, request),
                "Treatment plan paused successfully"
        ));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<TreatmentPlanResponse>> complete(
            @PathVariable String id,
            @Valid @RequestBody(required = false) ProcessTreatmentPlanRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                treatmentPlanApprovalService.complete(id, request),
                "Treatment plan completed successfully"
        ));
    }
}
