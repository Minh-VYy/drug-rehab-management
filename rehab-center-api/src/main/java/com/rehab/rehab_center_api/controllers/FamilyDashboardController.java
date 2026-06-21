package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.response.FamilyDashboardResponseDTO;
import com.rehab.rehab_center_api.security.CustomUserDetails;
import com.rehab.rehab_center_api.security.SecurityUtils;
import com.rehab.rehab_center_api.services.DashboardOverviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/family")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NGUOI_THAN')")
public class FamilyDashboardController {

    private final DashboardOverviewService dashboardOverviewService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<FamilyDashboardResponseDTO>> getFamilyDashboard() {
        CustomUserDetails currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).body(ApiResponse.<FamilyDashboardResponseDTO>builder()
                    .success(false)
                    .message("Người dùng chưa đăng nhập")
                    .build());
        }

        FamilyDashboardResponseDTO response = dashboardOverviewService.getFamilyDashboardData(currentUser.getUser().getId());
        return ResponseEntity.ok(ApiResponse.<FamilyDashboardResponseDTO>builder()
                .success(true)
                .message("Tải dashboard người thân thành công")
                .data(response)
                .build());
    }
}
