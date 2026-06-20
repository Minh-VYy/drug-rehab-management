package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.response.PublicHomeResponse;
import com.rehab.rehab_center_api.enums.RehabPatientStatus;
import com.rehab.rehab_center_api.enums.StaffStatus;
import com.rehab.rehab_center_api.repositories.RehabPatientRepository;
import com.rehab.rehab_center_api.repositories.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicHomeController {

    private static final String DOCTOR_ROLE = "CAN_BO_PHU_TRACH";
    private static final int ROLE_LEVELS = 8;
    private static final String SUPPORT_AVAILABILITY = "24/7";

    private final RehabPatientRepository rehabPatientRepository;
    private final StaffRepository staffRepository;

    @GetMapping("/home")
    public ResponseEntity<ApiResponse<PublicHomeResponse>> getHomeOverview() {
        long totalPatients = rehabPatientRepository.count();
        long completedPatients = rehabPatientRepository.countByStatus(RehabPatientStatus.DA_HOAN_THANH);
        long activeTreatmentPatients = rehabPatientRepository.countByStatusIn(List.of(
                RehabPatientStatus.DANG_KHAM_SUC_KHOE,
                RehabPatientStatus.DANG_CAI_NGHIEN
        ));
        long displayedPatients = Math.max(totalPatients, activeTreatmentPatients + completedPatients);
        int completionRate = calculateRate(completedPatients, displayedPatients);

        PublicHomeResponse response = PublicHomeResponse.builder()
                .totalPatients(displayedPatients)
                .completedPatients(completedPatients)
                .completionRate(completionRate)
                .activeDoctors(staffRepository.countByUser_Role_NameAndStatus(DOCTOR_ROLE, StaffStatus.DANG_LAM_VIEC))
                .roleLevels(ROLE_LEVELS)
                .supportAvailability(SUPPORT_AVAILABILITY)
                .build();

        return ResponseEntity.ok(ApiResponse.success(response, "Public home overview loaded"));
    }

    private int calculateRate(long completed, long total) {
        if (total <= 0) {
            return 0;
        }
        return (int) Math.round((completed * 100.0) / total);
    }
}
