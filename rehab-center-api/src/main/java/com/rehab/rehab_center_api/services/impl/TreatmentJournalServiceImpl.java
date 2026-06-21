package com.rehab.rehab_center_api.services.impl;

import com.rehab.rehab_center_api.dtos.DiaryPatientOptionDto;
import com.rehab.rehab_center_api.dtos.TreatmentJournalDto;
import com.rehab.rehab_center_api.entities.*;
import com.rehab.rehab_center_api.enums.AddictionLevel;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.*;
import com.rehab.rehab_center_api.services.TreatmentJournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreatmentJournalServiceImpl implements TreatmentJournalService {

    private final TreatmentJournalRepository treatmentJournalRepository;
    private final StaffRepository staffRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final TreatmentProtocolRepository treatmentProtocolRepository;
    private final TreatmentProtocolStageRepository stageRepository;

    private Staff getDoctor(Integer userId) {
        return staffRepository.findByUser_Id(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "Không tìm thấy bác sĩ"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TreatmentJournalDto> getTreatmentDiariesForDoctor(Integer userId) {
        Staff doctor = getDoctor(userId);
        List<TreatmentJournal> journals = treatmentJournalRepository.findByDoctor_IdOrderByRecordedAtDesc(doctor.getId());
        return journals.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DiaryPatientOptionDto> getPatientOptionsForDoctor(Integer userId) {
        Staff doctor = getDoctor(userId);
        List<MedicalRecord> records = medicalRecordRepository.findByDoctor_Id(doctor.getId());
        List<DiaryPatientOptionDto> options = new ArrayList<>();
        for (MedicalRecord record : records) {
            String hoTen = record.getRehabPatient() != null ? record.getRehabPatient().getFullName() : "";
            String phacDo = "";
            List<TreatmentProtocol> protocols = treatmentProtocolRepository.findByMedicalRecord_IdOrderByCreatedAtDesc(record.getId());
            if (!protocols.isEmpty() && protocols.get(0).getStages() != null && !protocols.get(0).getStages().isEmpty()) {
                phacDo = protocols.get(0).getStages().get(0).getId();
            }
            options.add(DiaryPatientOptionDto.builder()
                    .maBenhAn(record.getId())
                    .hoTenHocVien(hoTen)
                    .maChiTietPhacDo(phacDo)
                    .build());
        }
        return options;
    }

    @Override
    @Transactional
    public TreatmentJournalDto createTreatmentDiary(Integer userId, TreatmentJournalDto dto) {
        Staff doctor = getDoctor(userId);
        
        MedicalRecord record = medicalRecordRepository.findById(dto.getMaBenhAn())
                .orElseThrow(() -> new AppException(ErrorCode.VALIDATION_ERROR, "Không tìm thấy bệnh án"));
        
        TreatmentProtocolStage stage = null;
        if (dto.getMaChiTietPhacDo() != null && !dto.getMaChiTietPhacDo().isEmpty()) {
            stage = stageRepository.findById(dto.getMaChiTietPhacDo()).orElse(null);
        }

        // Generate ID
        long count = treatmentJournalRepository.count() + 1;
        String newId = String.format("NKD%03d", count);

        TreatmentJournal journal = TreatmentJournal.builder()
                .id(newId)
                .medicalRecord(record)
                .doctor(doctor)
                .treatmentProtocolStage(stage)
                .recordedAt(parseDate(dto.getNgayGhi()))
                .healthCondition(dto.getTinhTrangSucKhoe())
                .symptoms(dto.getTrieuChung())
                .temperature(parseBigDecimal(dto.getNhietDo()))
                .bloodPressure(dto.getHuyetAp())
                .heartRate(parseInteger(dto.getNhipTim()))
                .medicationUsed(dto.getThuocSuDung())
                .dosage(dto.getLieuLuong())
                .addictionLevel(parseAddictionLevel(dto.getMucDoNghien()))
                .diagnosis(dto.getChanDoan())
                .treatmentApproach(dto.getHuongXuLy())
                .build();

        journal = treatmentJournalRepository.save(journal);
        return mapToDto(journal);
    }

    @Override
    @Transactional
    public TreatmentJournalDto updateTreatmentDiary(Integer userId, String id, TreatmentJournalDto dto) {
        Staff doctor = getDoctor(userId);
        TreatmentJournal journal = treatmentJournalRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VALIDATION_ERROR, "Không tìm thấy nhật ký"));
        
        if (!journal.getDoctor().getId().equals(doctor.getId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED, "Không có quyền sửa nhật ký này");
        }

        journal.setRecordedAt(parseDate(dto.getNgayGhi()));
        journal.setHealthCondition(dto.getTinhTrangSucKhoe());
        journal.setSymptoms(dto.getTrieuChung());
        journal.setTemperature(parseBigDecimal(dto.getNhietDo()));
        journal.setBloodPressure(dto.getHuyetAp());
        journal.setHeartRate(parseInteger(dto.getNhipTim()));
        journal.setMedicationUsed(dto.getThuocSuDung());
        journal.setDosage(dto.getLieuLuong());
        journal.setAddictionLevel(parseAddictionLevel(dto.getMucDoNghien()));
        journal.setDiagnosis(dto.getChanDoan());
        journal.setTreatmentApproach(dto.getHuongXuLy());

        journal = treatmentJournalRepository.save(journal);
        return mapToDto(journal);
    }

    private TreatmentJournalDto mapToDto(TreatmentJournal journal) {
        return TreatmentJournalDto.builder()
                .maNhatKy(journal.getId())
                .maBenhAn(journal.getMedicalRecord() != null ? journal.getMedicalRecord().getId() : "")
                .maBacSi(journal.getDoctor() != null ? journal.getDoctor().getId() : "")
                .maChiTietPhacDo(journal.getTreatmentProtocolStage() != null ? journal.getTreatmentProtocolStage().getId() : "")
                .hoTenHocVien(journal.getMedicalRecord() != null && journal.getMedicalRecord().getRehabPatient() != null ? journal.getMedicalRecord().getRehabPatient().getFullName() : "")
                .ngayGhi(journal.getRecordedAt() != null ? journal.getRecordedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : "")
                .tinhTrangSucKhoe(journal.getHealthCondition())
                .trieuChung(journal.getSymptoms())
                .nhietDo(journal.getTemperature() != null ? journal.getTemperature().toString() : "")
                .huyetAp(journal.getBloodPressure())
                .nhipTim(journal.getHeartRate() != null ? journal.getHeartRate().toString() : "")
                .thuocSuDung(journal.getMedicationUsed())
                .lieuLuong(journal.getDosage())
                .mucDoNghien(journal.getAddictionLevel() != null ? journal.getAddictionLevel().name() : "Nhe")
                .chanDoan(journal.getDiagnosis())
                .huongXuLy(journal.getTreatmentApproach())
                .build();
    }

    private LocalDateTime parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return LocalDateTime.now();
        }
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd")).atStartOfDay();
        } catch (DateTimeParseException e) {
            return LocalDateTime.now();
        }
    }

    private BigDecimal parseBigDecimal(String str) {
        if (str == null || str.trim().isEmpty()) return null;
        try {
            return new BigDecimal(str);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer parseInteger(String str) {
        if (str == null || str.trim().isEmpty()) return null;
        try {
            return Integer.parseInt(str);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private AddictionLevel parseAddictionLevel(String level) {
        if (level == null) return AddictionLevel.Nhe;
        switch (level) {
            case "TrungBinh": return AddictionLevel.TrungBinh;
            case "Nang": return AddictionLevel.Nang;
            default: return AddictionLevel.Nhe;
        }
    }
}
