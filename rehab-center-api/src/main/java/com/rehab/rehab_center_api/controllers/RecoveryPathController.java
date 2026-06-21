package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.response.RecoveryPathOverviewDTO;
import com.rehab.rehab_center_api.services.RecoveryPathService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recovery-path")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecoveryPathController {

    private final RecoveryPathService service;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<RecoveryPathOverviewDTO>> getRecoveryPathByPatient(@PathVariable String patientId) {
        RecoveryPathOverviewDTO response = service.getRecoveryPathByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.<RecoveryPathOverviewDTO>builder()
                .success(true)
                .message("Lấy lộ trình phục hồi thành công")
                .data(response)
                .build());
    }
}
