package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.request.ProcessTreatmentPlanRequest;
import com.rehab.rehab_center_api.dto.response.TreatmentPlanResponse;

import java.util.List;

public interface TreatmentPlanApprovalService {
    List<TreatmentPlanResponse> list();

    TreatmentPlanResponse getById(String id);

    TreatmentPlanResponse approve(String id, ProcessTreatmentPlanRequest request);

    TreatmentPlanResponse reject(String id, ProcessTreatmentPlanRequest request);
}
