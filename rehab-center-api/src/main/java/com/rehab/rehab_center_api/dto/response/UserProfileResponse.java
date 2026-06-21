package com.rehab.rehab_center_api.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Integer id;
    private String username;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String role;
    private String status;
}
