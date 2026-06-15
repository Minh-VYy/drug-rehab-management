package com.rehab.rehab_center_api.security;

public final class SecurityConstants {

    private SecurityConstants() {}

    public static final String BEARER_PREFIX = "Bearer ";
    public static final String AUTHORIZATION_HEADER = "Authorization";

    public static final String[] PUBLIC_AUTH_PATHS = {
            "/api/v1/auth/register",
            "/api/v1/auth/login"
    };

    public static final String[] SWAGGER_PATHS = {
            "/api-docs",
            "/api-docs/**",
            "/swagger-ui",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/webjars",
            "/webjars/**"
    };

    public static boolean isPublicAuthPath(String path) {
        for (String publicPath : PUBLIC_AUTH_PATHS) {
            if (path.equals(publicPath)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isSwaggerPath(String path) {
        if (path.equals("/swagger-ui.html")) {
            return true;
        }
        for (String swaggerPath : SWAGGER_PATHS) {
            if (swaggerPath.endsWith("/**")) {
                String prefix = swaggerPath.substring(0, swaggerPath.length() - 3);
                if (path.startsWith(prefix)) {
                    return true;
                }
            } else if (path.equals(swaggerPath)) {
                return true;
            }
        }
        return false;
    }
}
