package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dtos.DiaryPatientOptionDto;
import com.rehab.rehab_center_api.dtos.TreatmentJournalDto;
import com.rehab.rehab_center_api.security.CustomUserDetails;
import com.rehab.rehab_center_api.security.SecurityUtils;
import com.rehab.rehab_center_api.services.TreatmentJournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doctor/treatment-diary")
@RequiredArgsConstructor
public class TreatmentJournalController {

    private final TreatmentJournalService treatmentJournalService;

    private Integer getCurrentUserId() {
        CustomUserDetails userDetails = SecurityUtils.getCurrentUser();
        return userDetails.getUser().getId();
    }

    @GetMapping
    public ResponseEntity<List<TreatmentJournalDto>> getDiaries() {
        return ResponseEntity.ok(treatmentJournalService.getTreatmentDiariesForDoctor(getCurrentUserId()));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<DiaryPatientOptionDto>> getPatientOptions() {
        return ResponseEntity.ok(treatmentJournalService.getPatientOptionsForDoctor(getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<TreatmentJournalDto> createDiary(@RequestBody TreatmentJournalDto dto) {
        return ResponseEntity.ok(treatmentJournalService.createTreatmentDiary(getCurrentUserId(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TreatmentJournalDto> updateDiary(@PathVariable String id, @RequestBody TreatmentJournalDto dto) {
        return ResponseEntity.ok(treatmentJournalService.updateTreatmentDiary(getCurrentUserId(), id, dto));
    }
}
