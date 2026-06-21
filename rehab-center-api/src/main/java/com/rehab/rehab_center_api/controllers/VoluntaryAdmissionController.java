package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.request.VoluntaryAdmissionRequestDTO;
import com.rehab.rehab_center_api.dto.response.VoluntaryAdmissionResponseDTO;
import com.rehab.rehab_center_api.services.VoluntaryAdmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/voluntary-admissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VoluntaryAdmissionController {

    private final VoluntaryAdmissionService service;

    @PostMapping
    public ResponseEntity<ApiResponse<VoluntaryAdmissionResponseDTO>> createApplication(@RequestBody VoluntaryAdmissionRequestDTO request) {
        VoluntaryAdmissionResponseDTO response = service.createApplication(request);
        return ResponseEntity.ok(ApiResponse.<VoluntaryAdmissionResponseDTO>builder()
                .success(true)
                .message("Tạo đơn đăng ký cai nghiện tự nguyện thành công")
                .data(response)
                .build());
    }

    @GetMapping("/relative/{relativeId}")
    public ResponseEntity<ApiResponse<List<VoluntaryAdmissionResponseDTO>>> getApplicationsByRelative(@PathVariable Integer relativeId) {
        List<VoluntaryAdmissionResponseDTO> response = service.getApplicationsByRelative(relativeId);
        return ResponseEntity.ok(ApiResponse.<List<VoluntaryAdmissionResponseDTO>>builder()
                .success(true)
                .message("Lấy danh sách đơn đăng ký thành công")
                .data(response)
                .build());
    }
}
