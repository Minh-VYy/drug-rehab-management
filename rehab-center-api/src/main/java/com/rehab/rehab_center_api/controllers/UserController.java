package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.request.ChangePasswordRequest;
import com.rehab.rehab_center_api.dto.request.UpdateProfileRequest;
import com.rehab.rehab_center_api.dto.response.UserProfileResponse;
import com.rehab.rehab_center_api.dto.response.UserOptionResponse;
import com.rehab.rehab_center_api.entities.User;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.UserRepository;
import com.rehab.rehab_center_api.security.CustomUserDetails;
import com.rehab.rehab_center_api.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserOptionResponse>>> getUsers() {
        List<UserOptionResponse> users = userRepository.findAllWithRoleOrderByFullName()
                .stream()
                .map(user -> UserOptionResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .role(user.getRole() != null ? user.getRole().getName() : null)
                        .status(user.getStatus() != null ? user.getStatus().name() : null)
                        .build())
                .toList();

        return ResponseEntity.ok(ApiResponse.success(users, "Lấy danh sách người dùng thành công"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {
        CustomUserDetails userDetails = SecurityUtils.getCurrentUser();
        if (userDetails == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND, "Không tìm thấy người dùng");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "Không tìm thấy người dùng"));

        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .status(user.getStatus().name())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response, "Lấy thông tin cá nhân thành công"));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        CustomUserDetails userDetails = SecurityUtils.getCurrentUser();
        if (userDetails == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND, "Không tìm thấy người dùng");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "Không tìm thấy người dùng"));

        // Check if email is already taken by someone else
        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS, "Email đã được sử dụng bởi tài khoản khác");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : "");

        userRepository.save(user);

        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .status(user.getStatus().name())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response, "Cập nhật thông tin cá nhân thành công"));
    }

    @PutMapping("/profile/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        CustomUserDetails userDetails = SecurityUtils.getCurrentUser();
        if (userDetails == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND, "Không tìm thấy người dùng");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "Không tìm thấy người dùng"));

        // Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Mật khẩu hiện tại không chính xác");
        }

        // Set and save new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success(null, "Thay đổi mật khẩu thành công"));
    }
}
