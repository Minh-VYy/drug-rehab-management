package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileUploadResponse {

    private final String url;
    private final String publicId;
    private final String originalFileName;
    private final String contentType;
    private final long sizeBytes;
}
