package com.rehab.rehab_center_api.security;

public final class SecurityConstants {

    private SecurityConstants() {}

    public static final String BEARER_PREFIX = "Bearer ";
    public static final String AUTHORIZATION_HEADER = "Authorization";

    public static final String[] PUBLIC_AUTH_PATHS = {
            "/api/v1/auth/register",
            "/api/v1/auth/login"
    };

    public static final String[] PUBLIC_VY_DEMO_API_PATHS = {
            "/api/v1/medical-records",
            "/api/v1/medical-records/**",
            "/api/v1/treatment-plans",
            "/api/v1/treatment-plans/**",
            "/api/v1/doctor/treatment-plan-create/patients",
            "/api/v1/doctor/treatment-plans",
            "/api/v1/doctor/treatment-plans/**"
    };

    public static final String[] PUBLIC_API_PATHS = {
            "/api/v1/public",
            "/api/v1/public/**"
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

    public static boolean isPublicVyDemoApiPath(String path) {
        for (String publicPath : PUBLIC_VY_DEMO_API_PATHS) {
            if (publicPath.endsWith("/**")) {
                String prefix = publicPath.substring(0, publicPath.length() - 3);
                if (path.startsWith(prefix)) {
                    return true;
                }
                continue;
            }
            if (path.equals(publicPath) || path.startsWith(publicPath + "/")) {
                return true;
            }
        }
        return false;
    }

    public static boolean isPublicApiPath(String path) {
        for (String publicPath : PUBLIC_API_PATHS) {
            if (publicPath.endsWith("/**")) {
                String prefix = publicPath.substring(0, publicPath.length() - 3);
                if (path.startsWith(prefix)) {
                    return true;
                }
                continue;
            }
            if (path.equals(publicPath) || path.startsWith(publicPath + "/")) {
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
