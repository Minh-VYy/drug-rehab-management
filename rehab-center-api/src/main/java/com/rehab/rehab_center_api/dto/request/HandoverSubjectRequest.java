package com.rehab.rehab_center_api.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class HandoverSubjectRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @NotBlank(message = "Identity number is required")
    @Pattern(regexp = "^\\d{12}$", message = "Identity number must contain exactly 12 digits")
    private String identityNumber;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Hometown is required")
    @Size(max = 255, message = "Hometown must not exceed 255 characters")
    private String hometown;

    @NotBlank(message = "Current address is required")
    @Size(max = 255, message = "Current address must not exceed 255 characters")
    private String currentAddress;

    @NotBlank(message = "Relative name is required")
    @Size(max = 100, message = "Relative name must not exceed 100 characters")
    private String relativeName;

    @NotBlank(message = "Relative phone is required")
    @Pattern(regexp = "^0\\d{9,10}$", message = "Relative phone must be a valid Vietnamese phone number")
    private String relativePhone;

    @NotBlank(message = "Relative relationship is required")
    @Size(max = 50, message = "Relative relationship must not exceed 50 characters")
    private String relativeRelationship;

    @NotBlank(message = "Violation description is required")
    @Size(max = 500, message = "Violation description must not exceed 500 characters")
    private String violationDescription;
}
