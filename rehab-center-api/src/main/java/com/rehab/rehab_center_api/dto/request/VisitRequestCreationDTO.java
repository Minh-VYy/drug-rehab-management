package com.rehab.rehab_center_api.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class VisitRequestCreationDTO {
    private Integer relativeId;
    private String patientId;
    private String visitType; // IN_PERSON, ONLINE etc.
    private LocalDate visitDate;
    private Byte visitShift;
}
