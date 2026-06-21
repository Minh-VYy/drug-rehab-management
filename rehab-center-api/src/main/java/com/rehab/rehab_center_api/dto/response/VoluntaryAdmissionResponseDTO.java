package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class VoluntaryAdmissionResponseDTO {
    private Integer id;
    private Integer relativeId;
    private String patientFullName;
    private LocalDate patientDateOfBirth;
    private String permanentAddress;
    private String patientIdentityNumber;
    private String relationshipToPatient;
    private String drugTypeUsed;
    private String clinicalSymptoms;
    private String identityCardFrontFile;
    private String identityCardBackFile;
    private LocalDateTime submittedAt;
    private String status;
}
