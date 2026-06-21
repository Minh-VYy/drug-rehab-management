package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class VisitRequestResponseDTO {
    private Integer id;
    private Integer relativeId;
    private String patientId;
    private String patientName;
    private String visitType;
    private LocalDate visitDate;
    private Byte visitShift;
    private String status;
    private LocalDateTime createdAt;
}
