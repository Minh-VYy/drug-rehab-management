package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.request.LoginRequest;
import com.rehab.rehab_center_api.dto.request.RegisterRequest;
import com.rehab.rehab_center_api.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void logout(String token);
}
