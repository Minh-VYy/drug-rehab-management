package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TreatmentJournalLogDTO {
    private String logId;
    private String note;
    private String recordedBy;
    private LocalDateTime recordedAt;
}
