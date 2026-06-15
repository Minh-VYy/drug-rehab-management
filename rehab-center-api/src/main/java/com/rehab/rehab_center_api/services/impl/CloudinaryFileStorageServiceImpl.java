package com.rehab.rehab_center_api.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.rehab.rehab_center_api.config.CloudinaryProperties;
import com.rehab.rehab_center_api.dto.response.FileUploadResponse;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.services.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryFileStorageServiceImpl implements FileStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("application/pdf");

    private final Cloudinary cloudinary;
    private final CloudinaryProperties cloudinaryProperties;

    @Override
    public FileUploadResponse uploadHandoverDecisionDocument(MultipartFile file) {
        validateFile(file);

        String originalFileName = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "decision.pdf"
        );
        String publicId = UUID.randomUUID().toString();

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "raw",
                            "folder", cloudinaryProperties.getHandoverDecisionFolder(),
                            "public_id", publicId,
                            "overwrite", false
                    )
            );

            String secureUrl = (String) uploadResult.get("secure_url");
            String uploadedPublicId = (String) uploadResult.get("public_id");
            if (secureUrl == null || uploadedPublicId == null) {
                throw new AppException(ErrorCode.FILE_UPLOAD_FAILED, "Cloudinary upload response is missing required fields");
            }

            return FileUploadResponse.builder()
                    .url(secureUrl)
                    .publicId(uploadedPublicId)
                    .originalFileName(originalFileName)
                    .contentType(file.getContentType())
                    .sizeBytes(file.getSize())
                    .build();
        } catch (IOException ex) {
            log.error("Failed to read uploaded file bytes", ex);
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED, "Failed to read uploaded file");
        } catch (Exception ex) {
            log.error("Cloudinary upload failed", ex);
            String detail = ex.getMessage() != null ? ex.getMessage() : ex.getClass().getSimpleName();
            throw new AppException(
                    ErrorCode.FILE_UPLOAD_FAILED,
                    "Failed to upload file to Cloudinary. Check CLOUDINARY_URL or Cloudinary keys in .env. Detail: " + detail
            );
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.FILE_REQUIRED, "Decision document file is required");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new AppException(ErrorCode.FILE_TOO_LARGE, "Decision document must not exceed 10MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE, "Only PDF files are allowed");
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName != null && !originalFileName.toLowerCase().endsWith(".pdf")) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE, "Only PDF files are allowed");
        }
    }
}
