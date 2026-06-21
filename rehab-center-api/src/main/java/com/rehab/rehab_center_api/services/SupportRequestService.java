package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.request.SupportRequestCreationDTO;
import com.rehab.rehab_center_api.dto.request.SupportRequestReplyDTO;
import com.rehab.rehab_center_api.dto.response.SupportRequestResponseDTO;
import com.rehab.rehab_center_api.entities.Relative;
import com.rehab.rehab_center_api.entities.Staff;
import com.rehab.rehab_center_api.entities.SupportRequest;
import com.rehab.rehab_center_api.enums.SupportRequestStatus;
import com.rehab.rehab_center_api.repositories.RelativeRepository;
import com.rehab.rehab_center_api.repositories.StaffRepository;
import com.rehab.rehab_center_api.repositories.SupportRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportRequestService {

    private final SupportRequestRepository supportRequestRepository;
    private final RelativeRepository relativeRepository;
    private final StaffRepository staffRepository;

    private String generateId() {
        Random random = new Random();
        int num = 10000000 + random.nextInt(90000000); // 8 digits
        return "HT" + num;
    }

    public SupportRequestResponseDTO createSupportRequest(SupportRequestCreationDTO request) {
        Relative relative = relativeRepository.findById(request.getRelativeId())
                .orElseThrow(() -> new RuntimeException("Relative not found"));

        SupportRequest supportRequest = SupportRequest.builder()
                .id(generateId())
                .relative(relative)
                .title(request.getTitle())
                .requestContent(request.getRequestContent())
                .status(SupportRequestStatus.CHO_PHAN_HOI)
                .build();

        SupportRequest saved = supportRequestRepository.save(supportRequest);
        return mapToDTO(saved);
    }

    public List<SupportRequestResponseDTO> getRequestsForRelative(Integer relativeId) {
        return supportRequestRepository.findByRelativeIdOrderBySubmittedAtDesc(relativeId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<SupportRequestResponseDTO> getAllRequestsForStaff() {
        return supportRequestRepository.findAllByOrderBySubmittedAtDesc()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public SupportRequestResponseDTO replyToRequest(String id, SupportRequestReplyDTO reply) {
        SupportRequest request = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found"));

        Staff staff = staffRepository.findById(reply.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        request.setStatus(SupportRequestStatus.DA_PHAN_HOI);
        request.setResponseContent(reply.getResponseContent());
        request.setStaff(staff);
        request.setRespondedAt(LocalDateTime.now());

        SupportRequest saved = supportRequestRepository.save(request);
        return mapToDTO(saved);
    }

    private SupportRequestResponseDTO mapToDTO(SupportRequest entity) {
        return SupportRequestResponseDTO.builder()
                .id(entity.getId())
                .relativeId(entity.getRelative().getId())
                .relativeName(entity.getRelative().getUser().getFullName())
                .title(entity.getTitle())
                .requestContent(entity.getRequestContent())
                .submittedAt(entity.getSubmittedAt())
                .status(entity.getStatus().name())
                .responseContent(entity.getResponseContent())
                .staffId(entity.getStaff() != null ? entity.getStaff().getId() : null)
                .staffName(entity.getStaff() != null ? entity.getStaff().getUser().getFullName() : null)
                .respondedAt(entity.getRespondedAt())
                .build();
    }
}
