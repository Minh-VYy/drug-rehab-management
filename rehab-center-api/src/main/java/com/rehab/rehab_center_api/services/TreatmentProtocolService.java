package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dtos.PatientTreatmentPlanDto;
import com.rehab.rehab_center_api.dtos.TreatmentPlanRequestDto;

import java.util.List;

public interface TreatmentProtocolService {
    List<PatientTreatmentPlanDto> getPatientsForDoctor(Integer userId);
    TreatmentPlanRequestDto getTreatmentPlanDetail(String medicalRecordId);
    void saveDraft(TreatmentPlanRequestDto request, Integer userId);
    void submitForApproval(TreatmentPlanRequestDto request, Integer userId);
}
