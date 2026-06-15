package com.rehab.rehab_center_api.services.impl;

import com.rehab.rehab_center_api.entities.Staff;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.StaffRepository;
import com.rehab.rehab_center_api.security.CustomUserDetails;
import com.rehab.rehab_center_api.security.SecurityUtils;
import com.rehab.rehab_center_api.services.StaffProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffProfileServiceImpl implements StaffProfileService {

    private final StaffRepository staffRepository;

    @Override
    public Staff getCurrentStaff() {
        return staffRepository.findByUser_Id(requireCurrentUserId())
                .orElseThrow(() -> new AppException(
                        ErrorCode.STAFF_PROFILE_NOT_FOUND,
                        "Staff profile is not linked to the current account"
                ));
    }

    private Integer requireCurrentUserId() {
        CustomUserDetails currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new AppException(ErrorCode.ACCESS_DENIED, "Authentication is required");
        }
        return currentUser.getUser().getId();
    }
}
