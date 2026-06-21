package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.request.VisitRequestCreationDTO;
import com.rehab.rehab_center_api.dto.response.VisitRequestResponseDTO;
import com.rehab.rehab_center_api.services.VisitRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/visit-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisitRequestController {

    private final VisitRequestService service;

    @PostMapping
    public ResponseEntity<ApiResponse<VisitRequestResponseDTO>> createVisitRequest(@RequestBody VisitRequestCreationDTO request) {
        VisitRequestResponseDTO response = service.createVisitRequest(request);
        return ResponseEntity.ok(ApiResponse.<VisitRequestResponseDTO>builder()
                .success(true)
                .message("Tạo phiếu đăng ký thăm gặp thành công")
                .data(response)
                .build());
    }

    @GetMapping("/relative/{relativeId}")
    public ResponseEntity<ApiResponse<List<VisitRequestResponseDTO>>> getVisitRequestsByRelative(@PathVariable Integer relativeId) {
        List<VisitRequestResponseDTO> response = service.getVisitRequestsByRelative(relativeId);
        return ResponseEntity.ok(ApiResponse.<List<VisitRequestResponseDTO>>builder()
                .success(true)
                .message("Lấy danh sách thăm gặp thành công")
                .data(response)
                .build());
    }
}
