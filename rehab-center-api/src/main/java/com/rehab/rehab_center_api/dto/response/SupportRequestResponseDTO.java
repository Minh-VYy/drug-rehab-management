package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SupportRequestResponseDTO {
    private String id;
    private Integer relativeId;
    private String relativeName;
    private String title;
    private String requestContent;
    private LocalDateTime submittedAt;
    private String status;
    private String responseContent;
    private String staffId;
    private String staffName;
    private LocalDateTime respondedAt;
}
