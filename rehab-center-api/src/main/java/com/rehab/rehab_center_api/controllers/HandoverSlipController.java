package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.request.CreateHandoverSlipRequest;
import com.rehab.rehab_center_api.dto.request.UpdateHandoverSlipRequest;
import com.rehab.rehab_center_api.dto.response.HandoverSlipResponse;
import com.rehab.rehab_center_api.dto.response.HandoverSlipSummaryResponse;
import com.rehab.rehab_center_api.dto.response.HandoverSubjectResponse;
import com.rehab.rehab_center_api.enums.HandoverSlipStatus;
import com.rehab.rehab_center_api.services.HandoverSlipService;
import com.rehab.rehab_center_api.utils.PageableUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/handover-slips")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CAN_BO_QUAN_LY_HO_SO')")
public class HandoverSlipController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt", "decisionDate", "submittedAt", "status", "id"
    );

    private final HandoverSlipService handoverSlipService;

    @Operation(
            requestBody = @RequestBody(
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            encoding = {
                                    @Encoding(name = "data", contentType = MediaType.APPLICATION_JSON_VALUE),
                                    @Encoding(name = "file", contentType = MediaType.APPLICATION_PDF_VALUE)
                            }
                    )
            )
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<HandoverSlipResponse>> createDraft(
            @Valid @RequestPart("data") CreateHandoverSlipRequest request,
            @RequestPart("file") MultipartFile file
    ) {
        HandoverSlipResponse response = handoverSlipService.createDraft(request, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Handover slip draft created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<HandoverSlipSummaryResponse>>> listMine(
            @RequestParam(required = false) HandoverSlipStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortDirection
    ) {
        var pageable = PageableUtils.of(page, size, sortBy, sortDirection, ALLOWED_SORT_FIELDS, "createdAt");
        Page<HandoverSlipSummaryResponse> response = handoverSlipService.listMine(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Handover slips retrieved successfully"));
    }

    @GetMapping("/{slipId}")
    public ResponseEntity<ApiResponse<HandoverSlipResponse>> getById(@PathVariable String slipId) {
        HandoverSlipResponse response = handoverSlipService.getById(slipId);
        return ResponseEntity.ok(ApiResponse.success(response, "Handover slip retrieved successfully"));
    }

    @Operation(
            requestBody = @RequestBody(
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            encoding = {
                                    @Encoding(name = "data", contentType = MediaType.APPLICATION_JSON_VALUE),
                                    @Encoding(name = "file", contentType = MediaType.APPLICATION_PDF_VALUE)
                            }
                    )
            )
    )
    @PutMapping(value = "/{slipId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<HandoverSlipResponse>> updateDraft(
            @PathVariable String slipId,
            @Valid @RequestPart("data") UpdateHandoverSlipRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        HandoverSlipResponse response = handoverSlipService.updateDraft(slipId, request, file);
        return ResponseEntity.ok(ApiResponse.success(response, "Handover slip draft updated successfully"));
    }

    @PostMapping("/{slipId}/submit")
    public ResponseEntity<ApiResponse<HandoverSlipResponse>> submit(@PathVariable String slipId) {
        HandoverSlipResponse response = handoverSlipService.submit(slipId);
        return ResponseEntity.ok(ApiResponse.success(response, "Handover slip submitted successfully"));
    }

    @PatchMapping("/{slipId}/cancel")
    public ResponseEntity<ApiResponse<HandoverSlipResponse>> cancel(@PathVariable String slipId) {
        HandoverSlipResponse response = handoverSlipService.cancel(slipId);
        return ResponseEntity.ok(ApiResponse.success(response, "Handover slip cancelled successfully"));
    }

    @GetMapping("/{slipId}/subjects")
    public ResponseEntity<ApiResponse<List<HandoverSubjectResponse>>> listSubjects(@PathVariable String slipId) {
        List<HandoverSubjectResponse> response = handoverSlipService.listSubjects(slipId);
        return ResponseEntity.ok(ApiResponse.success(response, "Handover subjects retrieved successfully"));
    }
}
