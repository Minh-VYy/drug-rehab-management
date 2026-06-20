package com.rehab.rehab_center_api.services.impl;

import com.rehab.rehab_center_api.dto.mapper.HandoverSlipMapper;
import com.rehab.rehab_center_api.dto.request.CreateHandoverSlipRequest;
import com.rehab.rehab_center_api.dto.request.HandoverSubjectRequest;
import com.rehab.rehab_center_api.dto.request.UpdateHandoverSlipRequest;
import com.rehab.rehab_center_api.dto.response.HandoverSlipResponse;
import com.rehab.rehab_center_api.dto.response.HandoverSlipSummaryResponse;
import com.rehab.rehab_center_api.dto.response.HandoverSubjectResponse;
import com.rehab.rehab_center_api.entities.Address;
import com.rehab.rehab_center_api.entities.PoliceRecordOfficer;
import com.rehab.rehab_center_api.entities.HandoverSlip;
import com.rehab.rehab_center_api.entities.HandoverSlipDetail;
import com.rehab.rehab_center_api.enums.HandoverSlipDetailStatus;
import com.rehab.rehab_center_api.enums.HandoverSlipStatus;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.HandoverSlipDetailRepository;
import com.rehab.rehab_center_api.repositories.HandoverSlipRepository;
import com.rehab.rehab_center_api.services.FileStorageService;
import com.rehab.rehab_center_api.services.HandoverSlipService;
import com.rehab.rehab_center_api.services.PoliceRecordOfficerProfileService;
import com.rehab.rehab_center_api.utils.HandoverSlipIdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class HandoverSlipServiceImpl implements HandoverSlipService {

    private static final List<HandoverSlipStatus> EXCLUDED_SLIP_STATUSES_FOR_IDENTITY_CHECK = List.of(
            HandoverSlipStatus.BAN_NHAP,
            HandoverSlipStatus.DA_HUY
    );

    private final HandoverSlipRepository handoverSlipRepository;
    private final HandoverSlipDetailRepository handoverSlipDetailRepository;
    private final PoliceRecordOfficerProfileService policeRecordOfficerProfileService;
    private final HandoverSlipMapper handoverSlipMapper;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public HandoverSlipResponse createDraft(CreateHandoverSlipRequest request, MultipartFile decisionFile) {
        PoliceRecordOfficer officer = policeRecordOfficerProfileService.getCurrentOfficer();
        validateSubjects(request.getSubjects(), null);
        String decisionFileUrl = resolveDecisionFileUrl(decisionFile, true, null);

        HandoverSlip slip = HandoverSlip.builder()
                .id(generateNextSlipId())
                .policeOfficer(officer)
                .decisionNumber(request.getDecisionNumber().trim())
                .decisionDate(request.getDecisionDate())
                .decisionFileUrl(decisionFileUrl)
                .status(HandoverSlipStatus.BAN_NHAP)
                .note(trimToNull(request.getNote()))
                .build();

        attachSubjects(slip, request.getSubjects());
        slip.setSubjectCount(slip.getSubjects().size());

        HandoverSlip saved = handoverSlipRepository.save(slip);
        return handoverSlipMapper.toResponse(saved, true);
    }

    @Override
    @Transactional
    public HandoverSlipResponse updateDraft(String slipId, UpdateHandoverSlipRequest request, MultipartFile decisionFile) {
        PoliceRecordOfficer officer = policeRecordOfficerProfileService.getCurrentOfficer();
        HandoverSlip slip = getOwnedEditableSlip(slipId, officer);

        validateSubjects(request.getSubjects(), slip.getId());

        slip.setDecisionNumber(request.getDecisionNumber().trim());
        slip.setDecisionDate(request.getDecisionDate());
        slip.setDecisionFileUrl(resolveDecisionFileUrl(decisionFile, false, slip.getDecisionFileUrl()));
        slip.setNote(trimToNull(request.getNote()));

        slip.getSubjects().clear();
        attachSubjects(slip, request.getSubjects());
        slip.setSubjectCount(slip.getSubjects().size());

        return handoverSlipMapper.toResponse(slip, true);
    }

    @Override
    @Transactional
    public HandoverSlipResponse submit(String slipId) {
        PoliceRecordOfficer officer = policeRecordOfficerProfileService.getCurrentOfficer();
        HandoverSlip slip = getOwnedEditableSlip(slipId, officer);

        if (slip.getSubjects().isEmpty()) {
            throw new AppException(ErrorCode.HANDOVER_SUBJECT_LIST_EMPTY, "Handover slip must contain at least one subject");
        }

        slip.setStatus(HandoverSlipStatus.DA_GUI);
        slip.setSubmittedAt(LocalDateTime.now());
        slip.getSubjects().forEach(subject -> subject.setStatus(HandoverSlipDetailStatus.CHO_TIEP_NHAN));

        return handoverSlipMapper.toResponse(slip, true);
    }

    @Override
    @Transactional
    public HandoverSlipResponse cancel(String slipId) {
        PoliceRecordOfficer officer = policeRecordOfficerProfileService.getCurrentOfficer();
        HandoverSlip slip = getOwnedSlip(slipId, officer);

        if (slip.getStatus() != HandoverSlipStatus.BAN_NHAP && slip.getStatus() != HandoverSlipStatus.DA_GUI) {
            throw new AppException(ErrorCode.HANDOVER_SLIP_NOT_CANCELLABLE, "Only draft or submitted handover slips can be cancelled");
        }

        if (slip.getStatus() == HandoverSlipStatus.DA_GUI
                && slip.getSubjects().stream().anyMatch(this::isSubjectProcessed)) {
            throw new AppException(ErrorCode.HANDOVER_SLIP_NOT_CANCELLABLE, "Cannot cancel a handover slip that is already being processed");
        }

        slip.setStatus(HandoverSlipStatus.DA_HUY);
        return handoverSlipMapper.toResponse(slip, true);
    }

    @Override
    @Transactional(readOnly = true)
    public HandoverSlipResponse getById(String slipId) {
        PoliceRecordOfficer officer = policeRecordOfficerProfileService.getCurrentOfficer();
        HandoverSlip slip = getOwnedSlipWithSubjects(slipId, officer);
        return handoverSlipMapper.toResponse(slip, true);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HandoverSlipSummaryResponse> listMine(HandoverSlipStatus status, Pageable pageable) {
        PoliceRecordOfficer officer = policeRecordOfficerProfileService.getCurrentOfficer();
        Page<HandoverSlip> page = status == null
                ? handoverSlipRepository.findByPoliceOfficer_Id(officer.getId(), pageable)
                : handoverSlipRepository.findByPoliceOfficer_IdAndStatus(
                        officer.getId(), status, pageable);
        return page.map(handoverSlipMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HandoverSubjectResponse> listSubjects(String slipId) {
        PoliceRecordOfficer officer = policeRecordOfficerProfileService.getCurrentOfficer();
        getOwnedSlip(slipId, officer);
        return handoverSlipMapper.toSubjectResponses(
                handoverSlipDetailRepository.findByHandoverSlip_IdOrderByIdAsc(slipId)
        );
    }

    private HandoverSlip getOwnedSlip(String slipId, PoliceRecordOfficer officer) {
        HandoverSlip slip = handoverSlipRepository.findById(slipId)
                .orElseThrow(() -> new AppException(ErrorCode.HANDOVER_SLIP_NOT_FOUND, "Handover slip not found"));

        if (!slip.getPoliceOfficer().getId().equals(officer.getId())) {
            throw new AppException(ErrorCode.HANDOVER_SLIP_ACCESS_DENIED, "You do not have permission to access this handover slip");
        }

        return slip;
    }

    private HandoverSlip getOwnedSlipWithSubjects(String slipId, PoliceRecordOfficer officer) {
        HandoverSlip slip = handoverSlipRepository.findWithSubjectsById(slipId)
                .orElseThrow(() -> new AppException(ErrorCode.HANDOVER_SLIP_NOT_FOUND, "Handover slip not found"));

        if (!slip.getPoliceOfficer().getId().equals(officer.getId())) {
            throw new AppException(ErrorCode.HANDOVER_SLIP_ACCESS_DENIED, "You do not have permission to access this handover slip");
        }

        return slip;
    }

    private HandoverSlip getOwnedEditableSlip(String slipId, PoliceRecordOfficer officer) {
        HandoverSlip slip = getOwnedSlipWithSubjects(slipId, officer);
        if (slip.getStatus() != HandoverSlipStatus.BAN_NHAP) {
            throw new AppException(ErrorCode.HANDOVER_SLIP_NOT_EDITABLE, "Only draft handover slips can be modified");
        }
        return slip;
    }

    private void validateSubjects(List<HandoverSubjectRequest> subjects, String excludeSlipId) {
        Set<String> identityNumbers = new HashSet<>();
        for (HandoverSubjectRequest subject : subjects) {
            String identityNumber = subject.getIdentityNumber().trim();
            if (!identityNumbers.add(identityNumber)) {
                throw new AppException(
                        ErrorCode.DUPLICATE_IDENTITY_IN_REQUEST,
                        "Duplicate identity number in request: " + identityNumber
                );
            }

            boolean exists = excludeSlipId == null
                    ? handoverSlipDetailRepository.existsActiveIdentityNumber(
                            identityNumber,
                            EXCLUDED_SLIP_STATUSES_FOR_IDENTITY_CHECK,
                            HandoverSlipDetailStatus.TU_CHOI
                    )
                    : handoverSlipDetailRepository.existsActiveIdentityNumberExcludingSlip(
                            identityNumber,
                            EXCLUDED_SLIP_STATUSES_FOR_IDENTITY_CHECK,
                            HandoverSlipDetailStatus.TU_CHOI,
                            excludeSlipId
                    );

            if (exists) {
                throw new AppException(
                        ErrorCode.DUPLICATE_IDENTITY_NUMBER,
                        "Identity number is already active in another handover slip: " + identityNumber
                );
            }
        }
    }

    private void attachSubjects(HandoverSlip slip, List<HandoverSubjectRequest> subjectRequests) {
        int index = 1;
        for (HandoverSubjectRequest subjectRequest : subjectRequests) {
            HandoverSlipDetail detail = HandoverSlipDetail.builder()
                    .id(HandoverSlipIdGenerator.generateDetailId(slip.getId(), index++))
                    .handoverSlip(slip)
                    .fullName(subjectRequest.getFullName().trim())
                    .identityNumber(subjectRequest.getIdentityNumber().trim())
                    .dateOfBirth(subjectRequest.getDateOfBirth())
                    .currentAddress(Address.builder()
                            .streetAddress(subjectRequest.getCurrentAddress().trim())
                            .build())
                    .relativeName(subjectRequest.getRelativeName().trim())
                    .relativePhone(subjectRequest.getRelativePhone().trim())
                    .relativeRelationship(subjectRequest.getRelativeRelationship().trim())
                    .violationDescription(subjectRequest.getViolationDescription().trim())
                    .status(HandoverSlipDetailStatus.CHO_TIEP_NHAN)
                    .build();
            slip.getSubjects().add(detail);
        }
    }

    private String generateNextSlipId() {
        String prefix = "PBG-" + Year.now().getValue() + "-";
        long sequence = handoverSlipRepository.countByIdStartingWith(prefix) + 1;
        return HandoverSlipIdGenerator.generateSlipId(sequence);
    }

    private boolean isSubjectProcessed(HandoverSlipDetail subject) {
        return subject.getStatus() != HandoverSlipDetailStatus.CHO_TIEP_NHAN;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String resolveDecisionFileUrl(MultipartFile decisionFile, boolean required, String existingUrl) {
        if (decisionFile == null || decisionFile.isEmpty()) {
            if (required) {
                throw new AppException(ErrorCode.FILE_REQUIRED, "Decision document file is required");
            }
            if (existingUrl == null || existingUrl.isBlank()) {
                throw new AppException(ErrorCode.FILE_REQUIRED, "Decision document file is required");
            }
            return existingUrl;
        }
        return fileStorageService.uploadHandoverDecisionDocument(decisionFile).getUrl();
    }
}
