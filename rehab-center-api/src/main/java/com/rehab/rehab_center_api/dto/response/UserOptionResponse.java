package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserOptionResponse {
    private Integer id;
    private String username;
    private String fullName;
    private String role;
    private String status;
}
