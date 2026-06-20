package com.rehab.rehab_center_api.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessTreatmentPlanRequest {

    @Size(max = 10)
    private String maQuanLy;

    @Size(max = 500)
    private String ghiChuPheDuyet;
}
