package com.rehab.rehab_center_api.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CreateHandoverSlipRequest {

    @NotBlank(message = "Decision number is required")
    @Size(max = 50, message = "Decision number must not exceed 50 characters")
    private String decisionNumber;

    @NotNull(message = "Decision date is required")
    @PastOrPresent(message = "Decision date must not be in the future")
    private LocalDate decisionDate;

    @Size(max = 500, message = "Note must not exceed 500 characters")
    private String note;

    @NotEmpty(message = "At least one subject is required")
    @Valid
    private List<HandoverSubjectRequest> subjects;
}
