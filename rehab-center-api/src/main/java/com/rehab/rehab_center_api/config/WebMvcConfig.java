package com.rehab.rehab_center_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Swagger UI may send JSON {@code @RequestPart} as application/octet-stream.
     * Allow Jackson to deserialize those parts.
     */
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        for (HttpMessageConverter<?> converter : converters) {
            if (converter instanceof MappingJackson2HttpMessageConverter jacksonConverter) {
                List<MediaType> mediaTypes = new ArrayList<>(jacksonConverter.getSupportedMediaTypes());
                if (!mediaTypes.contains(MediaType.APPLICATION_OCTET_STREAM)) {
                    mediaTypes.add(MediaType.APPLICATION_OCTET_STREAM);
                    jacksonConverter.setSupportedMediaTypes(mediaTypes);
                }
            }
        }
    }
}
