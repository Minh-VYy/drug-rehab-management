package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.ApiResponse;
import com.rehab.rehab_center_api.dto.response.LeaderCompletionApprovalResponse;
import com.rehab.rehab_center_api.dto.response.LeaderDashboardResponse;
import com.rehab.rehab_center_api.dto.response.LeaderIntakeApprovalResponse;
import com.rehab.rehab_center_api.dto.response.LeaderStageStatResponse;
import com.rehab.rehab_center_api.dto.response.LeaderTaskResponse;
import com.rehab.rehab_center_api.entities.HandoverSlip;
import com.rehab.rehab_center_api.entities.HandoverSlipDetail;
import com.rehab.rehab_center_api.entities.TreatmentProposal;
import com.rehab.rehab_center_api.enums.HandoverSlipDetailStatus;
import com.rehab.rehab_center_api.enums.HandoverSlipStatus;
import com.rehab.rehab_center_api.enums.ProposalType;
import com.rehab.rehab_center_api.enums.RehabPatientStatus;
import com.rehab.rehab_center_api.enums.TreatmentProposalStatus;
import com.rehab.rehab_center_api.repositories.HandoverSlipRepository;
import com.rehab.rehab_center_api.repositories.RehabPatientRepository;
import com.rehab.rehab_center_api.repositories.TreatmentProposalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/v1/leader")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NGUOI_LANH_DAO')")
public class LeaderController {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final RehabPatientRepository rehabPatientRepository;
    private final HandoverSlipRepository handoverSlipRepository;
    private final TreatmentProposalRepository treatmentProposalRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<LeaderDashboardResponse>> dashboard() {
        List<LeaderIntakeApprovalResponse> intakes = getIntakeRows();
        List<LeaderCompletionApprovalResponse> completions = getCompletionRows();

        List<LeaderTaskResponse> tasks = Stream.concat(
                        intakes.stream().map(item -> LeaderTaskResponse.builder()
                                .code(item.getCode())
                                .type("Tiếp nhận")
                                .subject(item.getSubjectName())
                                .date(item.getSentDate())
                                .status(item.getStatus())
                                .route("/approvals-receive")
                                .build()),
                        completions.stream().map(item -> LeaderTaskResponse.builder()
                                .code(item.getCode())
                                .type("Hoàn thành")
                                .subject(item.getSubjectName())
                                .date(item.getRequestDate())
                                .status(item.getStatus())
                                .route("/approvals-complete")
                                .build())
                )
                .limit(6)
                .toList();

        LeaderDashboardResponse response = LeaderDashboardResponse.builder()
                .activePatients(rehabPatientRepository.countByStatus(RehabPatientStatus.DANG_CAI_NGHIEN))
                .completedPatients(rehabPatientRepository.countByStatus(RehabPatientStatus.DA_HOAN_THANH))
                .pendingIntakes(intakes.stream().filter(item -> "ChoDuyet".equals(item.getStatus())).count())
                .pendingCompletions(completions.stream().filter(item -> "ChoDuyet".equals(item.getStatus())).count())
                .recentTasks(tasks)
                .stageStats(getStageStats())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response, "Leader dashboard retrieved successfully"));
    }

    @GetMapping("/intake-approvals")
    public ResponseEntity<ApiResponse<List<LeaderIntakeApprovalResponse>>> intakeApprovals() {
        return ResponseEntity.ok(ApiResponse.success(getIntakeRows(), "Leader intake approvals retrieved successfully"));
    }

    @PostMapping("/intake-approvals/{slipId}/approve")
    @Transactional
    public ResponseEntity<ApiResponse<LeaderIntakeApprovalResponse>> approveIntake(@PathVariable String slipId) {
        HandoverSlip slip = handoverSlipRepository.findWithSubjectsById(slipId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ bàn giao: " + slipId));

        if (slip.getStatus() == HandoverSlipStatus.DA_GUI) {
            slip.setStatus(HandoverSlipStatus.DANG_TIEP_NHAN);
            handoverSlipRepository.save(slip);
        }

        return ResponseEntity.ok(ApiResponse.success(toIntakeRow(slip), "Intake approval approved successfully"));
    }

    @PostMapping("/intake-approvals/{slipId}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<LeaderIntakeApprovalResponse>> rejectIntake(@PathVariable String slipId) {
        HandoverSlip slip = handoverSlipRepository.findWithSubjectsById(slipId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ bàn giao: " + slipId));

        if (slip.getStatus() == HandoverSlipStatus.DA_GUI) {
            slip.setStatus(HandoverSlipStatus.TU_CHOI);
            slip.getSubjects().forEach(subject -> subject.setStatus(HandoverSlipDetailStatus.TU_CHOI));
            handoverSlipRepository.save(slip);
        }

        return ResponseEntity.ok(ApiResponse.success(toIntakeRow(slip), "Intake approval rejected successfully"));
    }

    @GetMapping("/completion-approvals")
    public ResponseEntity<ApiResponse<List<LeaderCompletionApprovalResponse>>> completionApprovals() {
        return ResponseEntity.ok(ApiResponse.success(getCompletionRows(), "Leader completion approvals retrieved successfully"));
    }

    @PostMapping("/completion-approvals/{proposalId}/approve")
    @Transactional
    public ResponseEntity<ApiResponse<LeaderCompletionApprovalResponse>> approveCompletion(@PathVariable String proposalId) {
        TreatmentProposal proposal = treatmentProposalRepository.findWithDetailsById(proposalId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đề xuất: " + proposalId));

        if (proposal.getStatus() == TreatmentProposalStatus.CHO_DUYET) {
            proposal.setStatus(TreatmentProposalStatus.DA_PHE_DUYET);
            proposal.setApprovedAt(LocalDateTime.now());
            proposal.setApprovalNote("Lãnh đạo trung tâm phê duyệt hoàn thành.");
            treatmentProposalRepository.save(proposal);
        }

        return ResponseEntity.ok(ApiResponse.success(toCompletionRow(proposal), "Completion approval approved successfully"));
    }

    @PostMapping("/completion-approvals/{proposalId}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<LeaderCompletionApprovalResponse>> rejectCompletion(
            @PathVariable String proposalId,
            @RequestBody(required = false) Map<String, String> body
    ) {
        TreatmentProposal proposal = treatmentProposalRepository.findWithDetailsById(proposalId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đề xuất: " + proposalId));

        if (proposal.getStatus() == TreatmentProposalStatus.CHO_DUYET) {
            proposal.setStatus(TreatmentProposalStatus.TU_CHOI);
            proposal.setApprovedAt(LocalDateTime.now());
            proposal.setApprovalNote(body != null
                    ? body.getOrDefault("reason", "Lãnh đạo trung tâm từ chối đề xuất.")
                    : "Lãnh đạo trung tâm từ chối đề xuất.");
            treatmentProposalRepository.save(proposal);
        }

        return ResponseEntity.ok(ApiResponse.success(toCompletionRow(proposal), "Completion approval rejected successfully"));
    }

    private List<LeaderIntakeApprovalResponse> getIntakeRows() {
        return handoverSlipRepository.findByStatusInOrderBySubmittedAtDesc(List.of(
                        HandoverSlipStatus.DA_GUI,
                        HandoverSlipStatus.DANG_TIEP_NHAN,
                        HandoverSlipStatus.DA_TIEP_NHAN,
                        HandoverSlipStatus.TU_CHOI
                ))
                .stream()
                .map(this::toIntakeRow)
                .filter(Objects::nonNull)
                .toList();
    }

    private List<LeaderCompletionApprovalResponse> getCompletionRows() {
        return treatmentProposalRepository.findByProposalTypeAndStatusInOrderByProposedAtDesc(
                        ProposalType.CHUYEN_GIAI_DOAN,
                        List.of(TreatmentProposalStatus.CHO_DUYET, TreatmentProposalStatus.DA_PHE_DUYET, TreatmentProposalStatus.TU_CHOI)
                )
                .stream()
                .map(this::toCompletionRow)
                .toList();
    }

    private List<LeaderStageStatResponse> getStageStats() {
        return rehabPatientRepository.countPatientsByCurrentStage()
                .stream()
                .map(row -> LeaderStageStatResponse.builder()
                        .label((String) row[0])
                        .value((Long) row[1])
                        .build())
                .toList();
    }

    private LeaderIntakeApprovalResponse toIntakeRow(HandoverSlip slip) {
        HandoverSlipDetail subject = slip.getSubjects().stream()
                .min(Comparator.comparing(HandoverSlipDetail::getId))
                .orElse(null);

        if (subject == null) {
            return null;
        }

        return LeaderIntakeApprovalResponse.builder()
                .code(slip.getId())
                .policeOfficer(slip.getPoliceOfficer().getFullName())
                .sentDate(format(slip.getSubmittedAt()))
                .subjectName(subject.getFullName())
                .citizenId(subject.getIdentityNumber())
                .birthDate(subject.getDateOfBirth() != null ? subject.getDateOfBirth().format(DATE_FORMAT) : "-")
                .hometown(subject.getHometownDistrict() != null ? subject.getHometownDistrict().getName() : "-")
                .currentAddress(subject.getCurrentAddress() != null ? subject.getCurrentAddress().getStreetAddress() : "-")
                .relativeName(subject.getRelativeName())
                .relativePhone(subject.getRelativePhone())
                .relationship(subject.getRelativeRelationship())
                .violation(subject.getViolationDescription())
                .decisionFile(slip.getDecisionFileUrl())
                .status(mapIntakeStatus(slip.getStatus()))
                .approvedBy(isIntakeProcessed(slip.getStatus()) ? "GĐ. Hoàng Văn Đức" : null)
                .approvedDate(isIntakeProcessed(slip.getStatus()) ? format(slip.getUpdatedAt()) : null)
                .build();
    }

    private LeaderCompletionApprovalResponse toCompletionRow(TreatmentProposal proposal) {
        return LeaderCompletionApprovalResponse.builder()
                .code(proposal.getId())
                .recordCode(proposal.getRehabPatient() != null ? proposal.getRehabPatient().getId() : "-")
                .subjectName(proposal.getRehabPatient() != null ? proposal.getRehabPatient().getFullName() : "-")
                .currentPhase(proposal.getCurrentStageDefinition() != null ? proposal.getCurrentStageDefinition().getName() : "-")
                .requestDate(format(proposal.getProposedAt()))
                .requestedBy(proposal.getDoctor() != null && proposal.getDoctor().getUser() != null
                        ? proposal.getDoctor().getUser().getFullName()
                        : "-")
                .notes(proposal.getReason())
                .evaluation(evaluateProposal(proposal))
                .status(mapCompletionStatus(proposal.getStatus()))
                .approvedBy(proposal.getApprovedAt() != null ? "GĐ. Hoàng Văn Đức" : null)
                .approvedDate(proposal.getApprovedAt() != null ? format(proposal.getApprovedAt()) : null)
                .build();
    }

    private String mapIntakeStatus(HandoverSlipStatus status) {
        return switch (status) {
            case DA_GUI -> "ChoDuyet";
            case DANG_TIEP_NHAN, DA_TIEP_NHAN, TIEP_NHAN_MOT_PHAN -> "DaTiepNhan";
            case TU_CHOI -> "TuChoi";
            default -> status.name();
        };
    }

    private boolean isIntakeProcessed(HandoverSlipStatus status) {
        return status == HandoverSlipStatus.DANG_TIEP_NHAN
                || status == HandoverSlipStatus.DA_TIEP_NHAN
                || status == HandoverSlipStatus.TIEP_NHAN_MOT_PHAN
                || status == HandoverSlipStatus.TU_CHOI;
    }

    private String mapCompletionStatus(TreatmentProposalStatus status) {
        return switch (status) {
            case CHO_DUYET -> "ChoDuyet";
            case DA_PHE_DUYET -> "DaHoanThanh";
            case TU_CHOI -> "TuChoi";
            default -> status.name();
        };
    }

    private String evaluateProposal(TreatmentProposal proposal) {
        if (proposal.getStatus() == TreatmentProposalStatus.TU_CHOI) {
            return "Cần theo dõi thêm";
        }
        if (proposal.getProposedStageDefinition() != null
                && proposal.getProposedStageDefinition().getSequenceOrder() >= 3) {
            return "Tốt";
        }
        return "Khá";
    }

    private String format(LocalDateTime value) {
        return value != null ? value.format(DATE_FORMAT) : "-";
    }
}
