package com.rehab.rehab_center_api.services.impl;

import com.rehab.rehab_center_api.dto.request.ProcessTreatmentPlanRequest;
import com.rehab.rehab_center_api.dto.response.TreatmentPlanResponse;
import com.rehab.rehab_center_api.entities.Staff;
import com.rehab.rehab_center_api.entities.TreatmentProtocol;
import com.rehab.rehab_center_api.entities.TreatmentProtocolStage;
import com.rehab.rehab_center_api.enums.TreatmentProtocolOverallStatus;
import com.rehab.rehab_center_api.enums.TreatmentProtocolStatus;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.StaffRepository;
import com.rehab.rehab_center_api.repositories.TreatmentProtocolStageRepository;
import com.rehab.rehab_center_api.security.CustomUserDetails;
import com.rehab.rehab_center_api.security.SecurityUtils;
import com.rehab.rehab_center_api.services.TreatmentPlanApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TreatmentPlanApprovalServiceImpl implements TreatmentPlanApprovalService {

    private static final String DEFAULT_MANAGER_ID = "CBQL001";

    private final TreatmentProtocolStageRepository treatmentProtocolStageRepository;
    private final StaffRepository staffRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TreatmentPlanResponse> list() {
        return treatmentProtocolStageRepository.findAll().stream()
                .sorted(Comparator
                        .comparing((TreatmentProtocolStage stage) -> stage.getStatus() != TreatmentProtocolStatus.CHO_PHE_DUYET)
                        .thenComparing(TreatmentProtocolStage::getStartDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TreatmentPlanResponse getById(String id) {
        return toResponse(getStage(id));
    }

    @Override
    @Transactional
    public TreatmentPlanResponse approve(String id, ProcessTreatmentPlanRequest request) {
        TreatmentProtocolStage stage = getPendingStage(id);
        stage.setManager(resolveManager(request));
        stage.setApprovedAt(LocalDateTime.now());
        stage.setApprovalNote(firstNonBlank(request != null ? request.getGhiChuPheDuyet() : null, "Phac do phu hop, dong y ap dung."));
        stage.setStatus(TreatmentProtocolStatus.DANG_AP_DUNG);

        TreatmentProtocol protocol = stage.getTreatmentProtocol();
        if (protocol != null) {
            protocol.setStatus(TreatmentProtocolOverallStatus.DANG_AP_DUNG);
        }

        return toResponse(treatmentProtocolStageRepository.save(stage));
    }

    @Override
    @Transactional
    public TreatmentPlanResponse reject(String id, ProcessTreatmentPlanRequest request) {
        if (request == null || request.getGhiChuPheDuyet() == null || request.getGhiChuPheDuyet().isBlank()) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "Reject reason is required");
        }

        TreatmentProtocolStage stage = getPendingStage(id);
        stage.setManager(resolveManager(request));
        stage.setApprovedAt(LocalDateTime.now());
        stage.setApprovalNote(request.getGhiChuPheDuyet().trim());
        stage.setStatus(TreatmentProtocolStatus.TU_CHOI);
        return toResponse(treatmentProtocolStageRepository.save(stage));
    }

    @Override
    @Transactional
    public TreatmentPlanResponse pause(String id, ProcessTreatmentPlanRequest request) {
        TreatmentProtocolStage stage = getActiveStage(id);
        stage.setManager(resolveManager(request));
        stage.setApprovedAt(LocalDateTime.now());
        stage.setApprovalNote(firstNonBlank(request != null ? request.getGhiChuPheDuyet() : null, "Tam dung phac do de theo doi them."));
        stage.setStatus(TreatmentProtocolStatus.TAM_DUNG);
        return toResponse(treatmentProtocolStageRepository.save(stage));
    }

    @Override
    @Transactional
    public TreatmentPlanResponse complete(String id, ProcessTreatmentPlanRequest request) {
        TreatmentProtocolStage stage = getActiveStage(id);
        stage.setManager(resolveManager(request));
        stage.setApprovedAt(LocalDateTime.now());
        stage.setApprovalNote(firstNonBlank(request != null ? request.getGhiChuPheDuyet() : null, "Hoan thanh phac do theo danh gia dieu tri."));
        stage.setStatus(TreatmentProtocolStatus.DA_HOAN_THANH);

        TreatmentProtocol protocol = stage.getTreatmentProtocol();
        if (protocol != null && protocol.getStages().stream()
                .allMatch(item -> item == stage || item.getStatus() == TreatmentProtocolStatus.DA_HOAN_THANH)) {
            protocol.setStatus(TreatmentProtocolOverallStatus.DA_HOAN_THANH);
        }

        return toResponse(treatmentProtocolStageRepository.save(stage));
    }

    private TreatmentProtocolStage getStage(String id) {
        return treatmentProtocolStageRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TREATMENT_PLAN_NOT_FOUND, "Treatment plan not found: " + id));
    }

    private TreatmentProtocolStage getPendingStage(String id) {
        TreatmentProtocolStage stage = getStage(id);
        if (stage.getStatus() != TreatmentProtocolStatus.CHO_PHE_DUYET) {
            throw new AppException(ErrorCode.TREATMENT_PLAN_NOT_PENDING, "Only pending treatment plans can be processed");
        }
        return stage;
    }

    private TreatmentProtocolStage getActiveStage(String id) {
        TreatmentProtocolStage stage = getStage(id);
        if (stage.getStatus() != TreatmentProtocolStatus.DANG_AP_DUNG) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "Only approved treatment plans can be paused or completed");
        }
        return stage;
    }

    private Staff resolveManager(ProcessTreatmentPlanRequest request) {
        String requestedManagerId = request != null ? request.getMaQuanLy() : null;
        Optional<Staff> requestedManager = findStaff(requestedManagerId);
        if (requestedManager.isPresent()) {
            return requestedManager.get();
        }

        CustomUserDetails currentUser = SecurityUtils.getCurrentUser();
        if (currentUser != null) {
            Optional<Staff> currentUserStaff = staffRepository.findByUser_Id(currentUser.getUser().getId());
            if (currentUserStaff.isPresent()) {
                return currentUserStaff.get();
            }
        }

        return staffRepository.findById(DEFAULT_MANAGER_ID).orElse(null);
    }

    private Optional<Staff> findStaff(String staffId) {
        if (staffId == null || staffId.isBlank()) {
            return Optional.empty();
        }
        return staffRepository.findById(staffId.trim());
    }

    private String firstNonBlank(String value, String fallback) {
        return value != null && !value.isBlank() ? value.trim() : fallback;
    }

    private TreatmentPlanResponse toResponse(TreatmentProtocolStage stage) {
        TreatmentProtocol protocol = stage.getTreatmentProtocol();
        return TreatmentPlanResponse.builder()
                .maPhacdoDT(stage.getId())
                .maPhacDoTong(protocol != null ? protocol.getId() : null)
                .maBenhAn(protocol != null && protocol.getMedicalRecord() != null ? protocol.getMedicalRecord().getId() : null)
                .maBacSi(protocol != null && protocol.getDoctor() != null ? protocol.getDoctor().getId() : null)
                .maQuanLy(stage.getManager() != null ? stage.getManager().getId() : null)
                .loaiMaTuy(protocol != null && protocol.getDrugType() != null ? protocol.getDrugType().name() : null)
                .giaiDoan(stage.getStageDefinition() != null ? stage.getStageDefinition().getName() : null)
                .noiDungPhacdoDT(stage.getProtocolContent())
                .mucTieu(stage.getObjective())
                .ngayBatDau(stage.getStartDate())
                .ngayKetThucDuKien(stage.getExpectedEndDate())
                .trangThai(toFrontendStatus(stage))
                .ngayPheDuyet(stage.getApprovedAt())
                .ghiChuPheDuyet(stage.getApprovalNote())
                .build();
    }

    private String toFrontendStatus(TreatmentProtocolStage stage) {
        return switch (stage.getStatus()) {
            case CHO_PHE_DUYET -> "ChoPheDuyet";
            case TU_CHOI -> "TuChoi";
            case DA_HOAN_THANH -> "HoanThanh";
            case TAM_DUNG -> "TamDung";
            case DANG_AP_DUNG -> stage.getApprovedAt() != null ? "DaPheDuyet" : "DangApDung";
        };
    }
}
