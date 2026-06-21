package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.request.VisitRequestCreationDTO;
import com.rehab.rehab_center_api.dto.response.VisitRequestResponseDTO;
import com.rehab.rehab_center_api.entities.RehabPatient;
import com.rehab.rehab_center_api.entities.Relative;
import com.rehab.rehab_center_api.entities.Staff;
import com.rehab.rehab_center_api.entities.VisitRequest;
import com.rehab.rehab_center_api.enums.VisitRequestStatus;
import com.rehab.rehab_center_api.enums.VisitType;
import com.rehab.rehab_center_api.repositories.RehabPatientRepository;
import com.rehab.rehab_center_api.repositories.RelativeRepository;
import com.rehab.rehab_center_api.repositories.StaffRepository;
import com.rehab.rehab_center_api.repositories.VisitRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitRequestService {

    private final VisitRequestRepository visitRequestRepository;
    private final RelativeRepository relativeRepository;
    private final RehabPatientRepository patientRepository;
    private final StaffRepository staffRepository;

    public VisitRequestResponseDTO createVisitRequest(VisitRequestCreationDTO request) {
        Relative relative = relativeRepository.findById(request.getRelativeId())
                .orElseThrow(() -> new RuntimeException("Relative not found"));

        RehabPatient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // PhieuThamGap requires MaNhanSu NOT NULL in DB.
        // We will assign a default staff or the first staff available.
        List<Staff> staffs = staffRepository.findAll();
        Staff defaultStaff = staffs.isEmpty() ? null : staffs.get(0);

        VisitType type;
        try {
            type = VisitType.valueOf(request.getVisitType());
        } catch (Exception e) {
            type = VisitType.TRUC_TIEP;
        }

        VisitRequest visitRequest = VisitRequest.builder()
                .relative(relative)
                .rehabPatient(patient)
                .staff(defaultStaff)
                .visitType(type)
                .visitDate(request.getVisitDate())
                .visitShift(request.getVisitShift())
                .status(VisitRequestStatus.CHO_DUYET)
                .build();

        VisitRequest saved = visitRequestRepository.save(visitRequest);
        return mapToDTO(saved);
    }

    public List<VisitRequestResponseDTO> getVisitRequestsByRelative(Integer relativeId) {
        return visitRequestRepository.findByRelativeIdOrderByCreatedAtDesc(relativeId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private VisitRequestResponseDTO mapToDTO(VisitRequest entity) {
        return VisitRequestResponseDTO.builder()
                .id(entity.getId())
                .relativeId(entity.getRelative().getId())
                .patientId(entity.getRehabPatient().getId())
                .patientName(entity.getRehabPatient().getFullName())
                .visitType(entity.getVisitType().name())
                .visitDate(entity.getVisitDate())
                .visitShift(entity.getVisitShift())
                .status(entity.getStatus().name())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
