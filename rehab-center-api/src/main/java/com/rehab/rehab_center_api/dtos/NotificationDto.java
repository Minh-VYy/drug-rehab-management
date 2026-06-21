package com.rehab.rehab_center_api.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationDto {
    private String id;
    private String type; // success, warning, info, danger (mapped for frontend)
    private String title;
    private String desc;
    private String time; // formatted time e.g., "10 phút trước" or just ISO
    @JsonProperty("isRead")
    private boolean isRead;
}
