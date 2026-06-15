package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TreatmentStageResponse {

    private final String id;
    private final String name;
    private final Integer sequenceOrder;
    private final String description;
}
