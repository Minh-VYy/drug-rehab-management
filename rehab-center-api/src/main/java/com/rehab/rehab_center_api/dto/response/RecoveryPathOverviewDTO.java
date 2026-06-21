package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecoveryPathOverviewDTO {
    private String patientId;
    private String patientName;
    private int progressPercentage;
    private int daysRemaining;
    private String overallStatus;
    private String currentStageName;
    private List<RecoveryStageDTO> stages;
    private List<TreatmentJournalLogDTO> recentLogs;
}
