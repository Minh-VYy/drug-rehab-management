package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.response.RecoveryPathOverviewDTO;
import com.rehab.rehab_center_api.dto.response.RecoveryStageDTO;
import com.rehab.rehab_center_api.dto.response.TreatmentJournalLogDTO;
import com.rehab.rehab_center_api.entities.*;
import com.rehab.rehab_center_api.enums.TreatmentProtocolOverallStatus;
import com.rehab.rehab_center_api.enums.TreatmentProtocolStatus;
import com.rehab.rehab_center_api.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecoveryPathService {

    private final RehabPatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final TreatmentProtocolRepository protocolRepository;
    private final TreatmentProtocolStageRepository stageRepository;
    private final TreatmentJournalRepository journalRepository;

    public RecoveryPathOverviewDTO getRecoveryPathByPatient(String patientId) {
        RehabPatient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        MedicalRecord record = medicalRecordRepository.findByRehabPatient_Id(patientId)
                .orElseThrow(() -> new RuntimeException("Medical record not found for patient"));

        List<TreatmentProtocol> protocols = protocolRepository.findByMedicalRecord_IdOrderByCreatedAtDesc(record.getId());
        if (protocols.isEmpty()) {
            throw new RuntimeException("No treatment protocol found");
        }
        TreatmentProtocol currentProtocol = protocols.get(0);

        List<TreatmentProtocolStage> stages = stageRepository.findByTreatmentProtocol_IdOrderBySequenceOrderAsc(currentProtocol.getId());
        
        List<RecoveryStageDTO> stageDTOs = stages.stream().map(s -> RecoveryStageDTO.builder()
                .stageId(s.getId())
                .stageName(s.getStageDefinition().getName())
                .sequenceOrder(s.getSequenceOrder())
                .startDate(s.getStartDate())
                .expectedEndDate(s.getExpectedEndDate())
                .status(s.getStatus().name())
                .description(s.getProtocolContent())
                .build()).collect(Collectors.toList());

        int totalStages = stages.size();
        int completedStages = (int) stages.stream().filter(s -> s.getStatus() == TreatmentProtocolStatus.DA_HOAN_THANH).count();
        int progressPercentage = totalStages == 0 ? 0 : (completedStages * 100) / totalStages;

        TreatmentProtocolStage currentStage = stages.stream()
                .filter(s -> s.getStatus() == TreatmentProtocolStatus.DANG_AP_DUNG)
                .findFirst().orElse(null);
                
        String currentStageName = currentStage != null ? currentStage.getStageDefinition().getName() : "Đã hoàn thành";
        if (currentProtocol.getStatus() == TreatmentProtocolOverallStatus.BAN_NHAP) {
            currentStageName = "Chưa bắt đầu";
        }

        int daysRemaining = 0;
        if (currentStage != null && currentStage.getExpectedEndDate() != null) {
            daysRemaining = (int) ChronoUnit.DAYS.between(LocalDate.now(), currentStage.getExpectedEndDate());
            if (daysRemaining < 0) daysRemaining = 0;
        }

        List<TreatmentJournal> journals = journalRepository.findByMedicalRecord_IdOrderByRecordedAtDesc(record.getId());
        List<TreatmentJournalLogDTO> recentLogs = journals.stream()
                .limit(10) // Show last 10 logs
                .map(j -> TreatmentJournalLogDTO.builder()
                        .logId(j.getId())
                        .note(j.getHealthCondition() != null ? j.getHealthCondition() : j.getTreatmentApproach())
                        .recordedBy(j.getDoctor() != null ? j.getDoctor().getUser().getFullName() : "Hệ thống")
                        .recordedAt(j.getRecordedAt())
                        .build())
                .collect(Collectors.toList());

        return RecoveryPathOverviewDTO.builder()
                .patientId(patient.getId())
                .patientName(patient.getFullName())
                .progressPercentage(progressPercentage)
                .daysRemaining(daysRemaining)
                .overallStatus(currentProtocol.getStatus().name())
                .currentStageName(currentStageName)
                .stages(stageDTOs)
                .recentLogs(recentLogs)
                .build();
    }
}
