package com.rehab.rehab_center_api.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails;
        }
        return null;
    }

    public static boolean hasRole(String role) {
        CustomUserDetails user = getCurrentUser();
        if (user == null) {
            return false;
        }
        String expectedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return user.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(expectedRole));
    }
}
