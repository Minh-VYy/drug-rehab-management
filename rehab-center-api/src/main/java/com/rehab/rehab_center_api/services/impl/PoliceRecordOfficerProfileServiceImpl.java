package com.rehab.rehab_center_api.services.impl;

import com.rehab.rehab_center_api.entities.PoliceRecordOfficer;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.PoliceRecordOfficerRepository;
import com.rehab.rehab_center_api.security.CustomUserDetails;
import com.rehab.rehab_center_api.security.SecurityUtils;
import com.rehab.rehab_center_api.services.PoliceRecordOfficerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PoliceRecordOfficerProfileServiceImpl implements PoliceRecordOfficerProfileService {

    private final PoliceRecordOfficerRepository policeRecordOfficerRepository;

    @Override
    public PoliceRecordOfficer getCurrentOfficer() {
        return policeRecordOfficerRepository.findByUser_Id(requireCurrentUserId())
                .orElseThrow(() -> new AppException(
                        ErrorCode.POLICE_OFFICER_PROFILE_NOT_FOUND,
                        "Police record officer profile is not linked to the current account"
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
