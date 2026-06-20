package com.rehab.rehab_center_api.services.impl;

import com.rehab.rehab_center_api.dto.request.UpdateMedicalRecordRequest;
import com.rehab.rehab_center_api.dto.response.MedicalRecordResponse;
import com.rehab.rehab_center_api.entities.MedicalRecord;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.MedicalRecordRepository;
import com.rehab.rehab_center_api.services.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> list() {
        return medicalRecordRepository.findAll().stream()
                .sorted(Comparator.comparing(MedicalRecord::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MedicalRecordResponse getById(String id) {
        return toResponse(getRecord(id));
    }

    @Override
    @Transactional
    public MedicalRecordResponse update(String id, UpdateMedicalRecordRequest request) {
        MedicalRecord record = getRecord(id);
        record.setMedicalHistory(request.getTienSuBenh());
        record.setAllergies(request.getDiUng());
        record.setHeight(request.getChieuCao());
        record.setWeight(request.getCanNang());
        record.setBloodGroup(request.getNhomMau());
        record.setLastUpdatedAt(LocalDateTime.now());
        return toResponse(medicalRecordRepository.save(record));
    }

    private MedicalRecord getRecord(String id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MEDICAL_RECORD_NOT_FOUND, "Medical record not found: " + id));
    }

    private MedicalRecordResponse toResponse(MedicalRecord record) {
        return MedicalRecordResponse.builder()
                .maBenhAn(record.getId())
                .maNguoiCaiNghien(record.getRehabPatient() != null ? record.getRehabPatient().getId() : null)
                .maBacSi(record.getDoctor() != null ? record.getDoctor().getId() : null)
                .tienSuBenh(record.getMedicalHistory())
                .diUng(record.getAllergies())
                .chieuCao(record.getHeight())
                .canNang(record.getWeight())
                .nhomMau(record.getBloodGroup())
                .ngayLap(record.getCreatedAt())
                .ngayCapNhatCuoi(record.getLastUpdatedAt())
                .build();
    }
}
