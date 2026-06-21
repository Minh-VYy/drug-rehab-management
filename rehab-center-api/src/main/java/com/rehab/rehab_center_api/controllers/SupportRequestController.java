package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.request.SupportRequestCreationDTO;
import com.rehab.rehab_center_api.dto.request.SupportRequestReplyDTO;
import com.rehab.rehab_center_api.dto.response.SupportRequestResponseDTO;
import com.rehab.rehab_center_api.services.SupportRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/support-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupportRequestController {

    private final SupportRequestService supportRequestService;

    @PostMapping
    public ResponseEntity<ApiResponse<SupportRequestResponseDTO>> createSupportRequest(@RequestBody SupportRequestCreationDTO request) {
        SupportRequestResponseDTO response = supportRequestService.createSupportRequest(request);
        return ResponseEntity.ok(ApiResponse.<SupportRequestResponseDTO>builder()
                .success(true)
                .message("Tạo phiếu hỗ trợ thành công")
                .data(response)
                .build());
    }

    @GetMapping("/relative/{relativeId}")
    public ResponseEntity<ApiResponse<List<SupportRequestResponseDTO>>> getRequestsForRelative(@PathVariable Integer relativeId) {
        List<SupportRequestResponseDTO> response = supportRequestService.getRequestsForRelative(relativeId);
        return ResponseEntity.ok(ApiResponse.<List<SupportRequestResponseDTO>>builder()
                .success(true)
                .message("Lấy danh sách phiếu hỗ trợ thành công")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupportRequestResponseDTO>>> getAllRequestsForStaff() {
        List<SupportRequestResponseDTO> response = supportRequestService.getAllRequestsForStaff();
        return ResponseEntity.ok(ApiResponse.<List<SupportRequestResponseDTO>>builder()
                .success(true)
                .message("Lấy danh sách tất cả phiếu hỗ trợ thành công")
                .data(response)
                .build());
    }

    @PutMapping("/{id}/reply")
    public ResponseEntity<ApiResponse<SupportRequestResponseDTO>> replyToRequest(@PathVariable String id, @RequestBody SupportRequestReplyDTO request) {
        SupportRequestResponseDTO response = supportRequestService.replyToRequest(id, request);
        return ResponseEntity.ok(ApiResponse.<SupportRequestResponseDTO>builder()
                .success(true)
                .message("Phản hồi phiếu hỗ trợ thành công")
                .data(response)
                .build());
    }
}
