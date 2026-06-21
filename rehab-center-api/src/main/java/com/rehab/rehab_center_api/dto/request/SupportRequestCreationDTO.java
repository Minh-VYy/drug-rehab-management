package com.rehab.rehab_center_api.dto.request;

import lombok.Data;

@Data
public class SupportRequestCreationDTO {
    private Integer relativeId;
    private String title;
    private String requestContent;
}
