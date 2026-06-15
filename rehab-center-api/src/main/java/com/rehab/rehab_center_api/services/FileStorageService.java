package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.response.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    FileUploadResponse uploadHandoverDecisionDocument(MultipartFile file);
}
