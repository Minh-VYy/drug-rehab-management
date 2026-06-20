package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.response.RoleDashboardResponse;
import com.rehab.rehab_center_api.services.DashboardOverviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/dashboards")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardOverviewService dashboardOverviewService;

    @GetMapping("/{role}")
    public ResponseEntity<ApiResponse<RoleDashboardResponse>> getDashboard(@PathVariable String role) {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardOverviewService.getDashboard(role),
                "Dashboard loaded successfully"
        ));
    }
}
