package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.request.UpdateMedicalRecordRequest;
import com.rehab.rehab_center_api.dto.response.MedicalRecordResponse;

import java.util.List;

public interface MedicalRecordService {
    List<MedicalRecordResponse> list();

    MedicalRecordResponse getById(String id);

    MedicalRecordResponse update(String id, UpdateMedicalRecordRequest request);
}
