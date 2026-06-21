package com.rehab.rehab_center_api.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rehab.rehab_center_api.dtos.PatientTreatmentPlanDto;
import com.rehab.rehab_center_api.dtos.TreatmentPlanRequestDto;
import com.rehab.rehab_center_api.entities.*;
import com.rehab.rehab_center_api.enums.DrugType;
import com.rehab.rehab_center_api.enums.TreatmentProtocolOverallStatus;
import com.rehab.rehab_center_api.enums.TreatmentProtocolStatus;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.*;
import com.rehab.rehab_center_api.services.TreatmentProtocolService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TreatmentProtocolServiceImpl implements TreatmentProtocolService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final TreatmentProtocolRepository treatmentProtocolRepository;
    private final StaffRepository staffRepository;
    private final TreatmentStageDefinitionRepository stageDefinitionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

    @Override
    @Transactional(readOnly = true)
    public List<PatientTreatmentPlanDto> getPatientsForDoctor(Integer userId) {
        Staff doctor = staffRepository.findByUser_Id(userId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_PROFILE_NOT_FOUND, "Không tìm thấy thông tin nhân sự"));
        List<MedicalRecord> records = medicalRecordRepository.findByDoctor_Id(doctor.getId());
        List<PatientTreatmentPlanDto> dtos = new ArrayList<>();

        for (MedicalRecord record : records) {
            RehabPatient patient = record.getRehabPatient();
            if (patient == null) continue;

            List<TreatmentProtocol> protocols = treatmentProtocolRepository.findByMedicalRecord_IdOrderByCreatedAtDesc(record.getId());
            TreatmentProtocol latestProtocol = protocols.isEmpty() ? null : protocols.get(0);

            String status = "ChuaLap";
            if (latestProtocol != null) {
                if (latestProtocol.getStatus() == TreatmentProtocolOverallStatus.BAN_NHAP) {
                    status = "Nhap";
                } else if (latestProtocol.getStatus() == TreatmentProtocolOverallStatus.CHO_PHE_DUYET) {
                    status = "ChoDuyet";
                } else if (latestProtocol.getStatus() == TreatmentProtocolOverallStatus.DANG_AP_DUNG) {
                    status = "DangApDung";
                } else {
                    status = latestProtocol.getStatus().name();
                }
            }

            PatientTreatmentPlanDto dto = PatientTreatmentPlanDto.builder()
                    .maHoSo(record.getId())
                    .hoTenHocVien(patient.getFullName())
                    .loaiMaTuy(latestProtocol != null && latestProtocol.getDrugType() != null ? getDrugTypeString(latestProtocol.getDrugType()) : "Khac")
                    .giaiDoanHienTai(patient.getCurrentStageDefinition() != null ? patient.getCurrentStageDefinition().getId() : "GiaiDoan1")
                    .phacDoGanNhat(latestProtocol != null ? latestProtocol.getId() : null)
                    .trangThai(status)
                    .build();
            dtos.add(dto);
        }
        return dtos;
    }

    private String getDrugTypeString(DrugType type) {
        if (type == null) return "Khac";
        switch (type) {
            case HEROIN: return "Heroin";
            case MA_TUY_DA: return "MaTuyDa";
            case CAN_SA: return "CanSa";
            case KHAC: return "Khac";
            default: return "Khac";
        }
    }

    private DrugType parseDrugType(String typeStr) {
        if ("Heroin".equalsIgnoreCase(typeStr)) return DrugType.HEROIN;
        if ("MaTuyDa".equalsIgnoreCase(typeStr)) return DrugType.MA_TUY_DA;
        if ("CanSa".equalsIgnoreCase(typeStr)) return DrugType.CAN_SA;
        return DrugType.KHAC;
    }

    @Override
    @Transactional(readOnly = true)
    public TreatmentPlanRequestDto getTreatmentPlanDetail(String medicalRecordId) {
        List<TreatmentProtocol> protocols = treatmentProtocolRepository.findByMedicalRecord_IdOrderByCreatedAtDesc(medicalRecordId);
        if (protocols.isEmpty()) {
            throw new AppException(ErrorCode.TREATMENT_PLAN_NOT_FOUND, "Không tìm thấy phác đồ cho bệnh án này");
        }
        TreatmentProtocol latest = protocols.get(0);

        TreatmentPlanRequestDto dto = new TreatmentPlanRequestDto();
        dto.setMaHoSo(medicalRecordId);
        dto.setLoaiMaTuy(getDrugTypeString(latest.getDrugType()));
        dto.setGhiChuBacSi(latest.getNote());
        
        String status = "ChuaLap";
        if (latest.getStatus() == TreatmentProtocolOverallStatus.BAN_NHAP) status = "Nhap";
        else if (latest.getStatus() == TreatmentProtocolOverallStatus.CHO_PHE_DUYET) status = "ChoDuyet";
        else if (latest.getStatus() == TreatmentProtocolOverallStatus.DANG_AP_DUNG) status = "DangApDung";
        dto.setTrangThai(status);

        if (latest.getStages() != null && !latest.getStages().isEmpty()) {
            TreatmentProtocolStage stage = latest.getStages().get(0); // For now we only expect 1 active stage per protocol edit
            dto.setGiaiDoan(stage.getStageDefinition().getId());
            dto.setNgayBatDau(stage.getStartDate());
            dto.setNgayKetThuc(stage.getExpectedEndDate());
            dto.setMucTieu(stage.getObjective());

            try {
                if (stage.getProtocolContent() != null && stage.getProtocolContent().startsWith("[")) {
                    List<TreatmentPlanRequestDto.SubStageDto> subStages = objectMapper.readValue(
                            stage.getProtocolContent(),
                            new TypeReference<List<TreatmentPlanRequestDto.SubStageDto>>() {}
                    );
                    dto.setCacGiaiDoanNho(subStages);
                    dto.setNoiDungPhacDo("Phác đồ chi tiết bên dưới");
                } else {
                    dto.setNoiDungPhacDo(stage.getProtocolContent());
                }
            } catch (JsonProcessingException e) {
                dto.setNoiDungPhacDo(stage.getProtocolContent());
            }
        }
        return dto;
    }

    @Override
    @Transactional
    public void saveDraft(TreatmentPlanRequestDto request, Integer userId) {
        saveTreatmentProtocol(request, userId, TreatmentProtocolOverallStatus.BAN_NHAP, TreatmentProtocolStatus.CHO_PHE_DUYET);
    }

    @Override
    @Transactional
    public void submitForApproval(TreatmentPlanRequestDto request, Integer userId) {
        saveTreatmentProtocol(request, userId, TreatmentProtocolOverallStatus.CHO_PHE_DUYET, TreatmentProtocolStatus.CHO_PHE_DUYET);
    }

    private void saveTreatmentProtocol(TreatmentPlanRequestDto request, Integer userId, TreatmentProtocolOverallStatus overallStatus, TreatmentProtocolStatus stageStatus) {
        MedicalRecord record = medicalRecordRepository.findById(request.getMaHoSo())
                .orElseThrow(() -> new AppException(ErrorCode.MEDICAL_RECORD_NOT_FOUND, "Không tìm thấy bệnh án"));
        Staff doctor = staffRepository.findByUser_Id(userId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_PROFILE_NOT_FOUND, "Không tìm thấy thông tin nhân sự"));
        TreatmentStageDefinition stageDef = stageDefinitionRepository.findById(request.getGiaiDoan())
                .orElseThrow(() -> new AppException(ErrorCode.VALIDATION_ERROR, "Giai đoạn không hợp lệ"));

        List<TreatmentProtocol> existingProtocols = treatmentProtocolRepository.findByMedicalRecord_IdOrderByCreatedAtDesc(record.getId());
        TreatmentProtocol protocol;
        
        // If there's an existing draft or pending protocol, we update it.
        if (!existingProtocols.isEmpty() && (existingProtocols.get(0).getStatus() == TreatmentProtocolOverallStatus.BAN_NHAP || existingProtocols.get(0).getStatus() == TreatmentProtocolOverallStatus.CHO_PHE_DUYET)) {
            protocol = existingProtocols.get(0);
            protocol.getStages().clear();
        } else {
            protocol = new TreatmentProtocol();
            String id = "PD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            protocol.setId(id);
            protocol.setCreatedAt(LocalDateTime.now());
        }

        protocol.setMedicalRecord(record);
        protocol.setDoctor(doctor);
        protocol.setDrugType(parseDrugType(request.getLoaiMaTuy()));
        protocol.setStatus(overallStatus);
        protocol.setNote(request.getGhiChuBacSi());

        TreatmentProtocolStage stage = new TreatmentProtocolStage();
        stage.setId("CT" + UUID.randomUUID().toString().substring(0, 13).toUpperCase());
        stage.setTreatmentProtocol(protocol);
        stage.setStageDefinition(stageDef);
        stage.setSequenceOrder(1);
        stage.setObjective(request.getMucTieu());
        stage.setStartDate(request.getNgayBatDau());
        stage.setExpectedEndDate(request.getNgayKetThuc());
        stage.setStatus(stageStatus);

        try {
            if (request.getCacGiaiDoanNho() != null && !request.getCacGiaiDoanNho().isEmpty()) {
                String jsonContent = objectMapper.writeValueAsString(request.getCacGiaiDoanNho());
                stage.setProtocolContent(jsonContent);
            } else {
                stage.setProtocolContent(request.getNoiDungPhacDo());
            }
        } catch (JsonProcessingException e) {
            stage.setProtocolContent(request.getNoiDungPhacDo());
        }

        protocol.getStages().add(stage);
        treatmentProtocolRepository.save(protocol);
    }
}
