package com.rehab.rehab_center_api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "cloudinary")
public class CloudinaryProperties {

    private String url;
    private String cloudName;
    private String apiKey;
    private String apiSecret;
    private String handoverDecisionFolder = "rehab-center/handover-decisions";
}
