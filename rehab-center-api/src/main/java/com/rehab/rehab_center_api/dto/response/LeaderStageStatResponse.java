package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeaderStageStatResponse {

    private final String label;
    private final long value;
}
