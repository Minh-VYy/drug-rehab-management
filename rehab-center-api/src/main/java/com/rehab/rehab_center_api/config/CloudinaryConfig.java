package com.rehab.rehab_center_api.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
@RequiredArgsConstructor
public class CloudinaryConfig {

    private final CloudinaryProperties cloudinaryProperties;

    @Bean
    public Cloudinary cloudinary() {
        if (StringUtils.hasText(cloudinaryProperties.getUrl())) {
            return new Cloudinary(cloudinaryProperties.getUrl().trim());
        }

        validateCredential("CLOUDINARY_CLOUD_NAME", cloudinaryProperties.getCloudName());
        validateCredential("CLOUDINARY_API_KEY", cloudinaryProperties.getApiKey());
        validateCredential("CLOUDINARY_API_SECRET", cloudinaryProperties.getApiSecret());

        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudinaryProperties.getCloudName().trim(),
                "api_key", cloudinaryProperties.getApiKey().trim(),
                "api_secret", cloudinaryProperties.getApiSecret().trim(),
                "secure", true
        ));
    }

    private void validateCredential(String name, String value) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalStateException(
                    "Cloudinary is not configured: missing " + name
                            + ". Create rehab-center-api/.env from .env.example and set CLOUDINARY_URL"
                            + " or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET."
            );
        }

        String trimmed = value.trim();
        if (trimmed.startsWith("${") || trimmed.startsWith("your_")) {
            throw new IllegalStateException(
                    "Cloudinary is not configured: " + name + " still uses placeholder value '"
                            + trimmed + "'. Update rehab-center-api/.env with real Cloudinary credentials."
            );
        }
    }
}
