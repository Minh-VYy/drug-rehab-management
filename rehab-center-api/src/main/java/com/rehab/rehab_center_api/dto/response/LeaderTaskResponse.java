package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeaderTaskResponse {

    private final String code;
    private final String type;
    private final String subject;
    private final String date;
    private final String status;
    private final String route;
}
