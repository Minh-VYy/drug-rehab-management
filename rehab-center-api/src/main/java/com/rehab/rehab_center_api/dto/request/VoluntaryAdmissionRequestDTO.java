package com.rehab.rehab_center_api.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class VoluntaryAdmissionRequestDTO {
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
}
