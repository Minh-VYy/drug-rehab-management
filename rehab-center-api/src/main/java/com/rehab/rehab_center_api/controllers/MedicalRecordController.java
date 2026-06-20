package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.request.UpdateMedicalRecordRequest;
import com.rehab.rehab_center_api.dto.response.MedicalRecordResponse;
import com.rehab.rehab_center_api.services.MedicalRecordService;
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
@RequestMapping("/api/v1/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicalRecordResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(medicalRecordService.list()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecordResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(medicalRecordService.getById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecordResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody UpdateMedicalRecordRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                medicalRecordService.update(id, request),
                "Medical record updated successfully"
        ));
    }
}
