package com.rehab.rehab_center_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicHomeResponse {
    private long totalPatients;
    private long completedPatients;
    private int completionRate;
    private long activeDoctors;
    private int roleLevels;
    private String supportAvailability;
}
