package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dtos.PatientTreatmentPlanDto;
import com.rehab.rehab_center_api.dtos.TreatmentPlanRequestDto;
import com.rehab.rehab_center_api.services.TreatmentProtocolService;
import com.rehab.rehab_center_api.security.SecurityUtils;
import com.rehab.rehab_center_api.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doctor")
@RequiredArgsConstructor
public class TreatmentProtocolController {

    private final TreatmentProtocolService treatmentProtocolService;

    private Integer getCurrentDoctorId() {
        try {
            CustomUserDetails userDetails = SecurityUtils.getCurrentUser();
            if (userDetails != null) {
                return userDetails.getUser().getId();
            }
        } catch (Exception e) {
            // ignore
        }
        // Fallback for public demo
        return 1;
    }

    @GetMapping("/treatment-plan-create/patients")
    public ResponseEntity<List<PatientTreatmentPlanDto>> getPatientsForDoctor() {
        return ResponseEntity.ok(treatmentProtocolService.getPatientsForDoctor(getCurrentDoctorId()));
    }

    @GetMapping("/treatment-plans/{maHoSo}")
    public ResponseEntity<TreatmentPlanRequestDto> getTreatmentPlanDetail(@PathVariable String maHoSo) {
        return ResponseEntity.ok(treatmentProtocolService.getTreatmentPlanDetail(maHoSo));
    }

    @PostMapping("/treatment-plans/draft")
    public ResponseEntity<Void> saveDraft(@RequestBody TreatmentPlanRequestDto request) {
        treatmentProtocolService.saveDraft(request, getCurrentDoctorId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/treatment-plans/submit")
    public ResponseEntity<Void> submitForApproval(@RequestBody TreatmentPlanRequestDto request) {
        treatmentProtocolService.submitForApproval(request, getCurrentDoctorId());
        return ResponseEntity.ok().build();
    }
}
