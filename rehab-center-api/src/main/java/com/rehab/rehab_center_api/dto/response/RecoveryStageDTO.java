package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class RecoveryStageDTO {
    private String stageId;
    private String stageName;
    private int sequenceOrder;
    private LocalDate startDate;
    private LocalDate expectedEndDate;
    private String status;
    private String description;
}
