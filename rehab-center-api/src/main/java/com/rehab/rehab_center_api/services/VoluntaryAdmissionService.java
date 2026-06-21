package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.request.VoluntaryAdmissionRequestDTO;
import com.rehab.rehab_center_api.dto.response.VoluntaryAdmissionResponseDTO;
import com.rehab.rehab_center_api.entities.Address;
import com.rehab.rehab_center_api.entities.Relative;
import com.rehab.rehab_center_api.entities.VoluntaryAdmissionApplication;
import com.rehab.rehab_center_api.enums.DrugType;
import com.rehab.rehab_center_api.enums.VoluntaryApplicationStatus;
import com.rehab.rehab_center_api.repositories.RelativeRepository;
import com.rehab.rehab_center_api.repositories.VoluntaryAdmissionApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoluntaryAdmissionService {

    private final VoluntaryAdmissionApplicationRepository repository;
    private final RelativeRepository relativeRepository;

    public VoluntaryAdmissionResponseDTO createApplication(VoluntaryAdmissionRequestDTO request) {
        Relative relative = relativeRepository.findById(request.getRelativeId())
                .orElseThrow(() -> new RuntimeException("Relative not found"));

        String address = request.getPermanentAddress();

        DrugType drugType;
        try {
            drugType = DrugType.valueOf(request.getDrugTypeUsed());
        } catch (IllegalArgumentException e) {
            drugType = DrugType.KHAC;
        }

        VoluntaryAdmissionApplication application = VoluntaryAdmissionApplication.builder()
                .relative(relative)
                .patientFullName(request.getPatientFullName())
                .patientDateOfBirth(request.getPatientDateOfBirth())
                .permanentAddress(address)
                .patientIdentityNumber(request.getPatientIdentityNumber())
                .relationshipToPatient(request.getRelationshipToPatient())
                .drugTypeUsed(drugType)
                .clinicalSymptoms(request.getClinicalSymptoms())
                .identityCardFrontFile(request.getIdentityCardFrontFile())
                .identityCardBackFile(request.getIdentityCardBackFile())
                .status(VoluntaryApplicationStatus.CHO_DUYET)
                .build();

        VoluntaryAdmissionApplication saved = repository.save(application);
        return mapToDTO(saved);
    }

    public List<VoluntaryAdmissionResponseDTO> getApplicationsByRelative(Integer relativeId) {
        return repository.findByRelativeIdOrderBySubmittedAtDesc(relativeId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private VoluntaryAdmissionResponseDTO mapToDTO(VoluntaryAdmissionApplication entity) {
        return VoluntaryAdmissionResponseDTO.builder()
                .id(entity.getId())
                .relativeId(entity.getRelative().getId())
                .patientFullName(entity.getPatientFullName())
                .patientDateOfBirth(entity.getPatientDateOfBirth())
                .permanentAddress(entity.getPermanentAddress())
                .patientIdentityNumber(entity.getPatientIdentityNumber())
                .relationshipToPatient(entity.getRelationshipToPatient())
                .drugTypeUsed(entity.getDrugTypeUsed().name())
                .clinicalSymptoms(entity.getClinicalSymptoms())
                .identityCardFrontFile(entity.getIdentityCardFrontFile())
                .identityCardBackFile(entity.getIdentityCardBackFile())
                .submittedAt(entity.getSubmittedAt())
                .status(entity.getStatus().name())
                .build();
    }
}
