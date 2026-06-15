package com.rehab.rehab_center_api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectTreatmentProposalRequest {

    @NotBlank(message = "Rejection note is required")
    @Size(max = 500, message = "Rejection note must not exceed 500 characters")
    private String note;
}
