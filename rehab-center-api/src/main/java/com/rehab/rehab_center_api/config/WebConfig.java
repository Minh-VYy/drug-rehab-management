package com.rehab.rehab_center_api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Value("${application.cors.allowed-origins:http://localhost:3000,http://localhost:5500,http://localhost:5501,http://127.0.0.1:5500,http://127.0.0.1:5501}")
    private String allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins.split(","))
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("Authorization", "Content-Type", "Accept", "X-Requested-With")
                        .exposedHeaders("Authorization")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
