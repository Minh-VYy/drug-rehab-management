package com.rehab.rehab_center_api.config;

import com.rehab.rehab_center_api.entities.MedicalRecord;
import com.rehab.rehab_center_api.entities.PoliceRecordOfficer;
import com.rehab.rehab_center_api.entities.RehabPatient;
import com.rehab.rehab_center_api.entities.Role;
import com.rehab.rehab_center_api.entities.Staff;
import com.rehab.rehab_center_api.entities.TreatmentProposal;
import com.rehab.rehab_center_api.entities.TreatmentProtocol;
import com.rehab.rehab_center_api.entities.TreatmentProtocolStage;
import com.rehab.rehab_center_api.entities.TreatmentStageDefinition;
import com.rehab.rehab_center_api.entities.User;
import com.rehab.rehab_center_api.enums.DrugType;
import com.rehab.rehab_center_api.enums.ProposalType;
import com.rehab.rehab_center_api.enums.RehabPatientStatus;
import com.rehab.rehab_center_api.enums.StaffStatus;
import com.rehab.rehab_center_api.enums.TreatmentProposalStatus;
import com.rehab.rehab_center_api.enums.TreatmentProtocolOverallStatus;
import com.rehab.rehab_center_api.enums.TreatmentProtocolStatus;
import com.rehab.rehab_center_api.enums.UserStatus;
import com.rehab.rehab_center_api.repositories.MedicalRecordRepository;
import com.rehab.rehab_center_api.repositories.PoliceRecordOfficerRepository;
import com.rehab.rehab_center_api.repositories.RehabPatientRepository;
import com.rehab.rehab_center_api.repositories.RoleRepository;
import com.rehab.rehab_center_api.repositories.StaffRepository;
import com.rehab.rehab_center_api.repositories.TreatmentProposalRepository;
import com.rehab.rehab_center_api.repositories.TreatmentProtocolRepository;
import com.rehab.rehab_center_api.repositories.TreatmentStageDefinitionRepository;
import com.rehab.rehab_center_api.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PoliceRecordOfficerRepository policeRecordOfficerRepository;
    private final TreatmentStageDefinitionRepository treatmentStageDefinitionRepository;
    private final StaffRepository staffRepository;
    private final RehabPatientRepository rehabPatientRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final TreatmentProposalRepository treatmentProposalRepository;
    private final TreatmentProtocolRepository treatmentProtocolRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        Map<String, String> rolesToSeed = new HashMap<>();
        rolesToSeed.put("NGUOI_THAN", "Người thân của người cai nghiện");
        rolesToSeed.put("CAN_BO_QUAN_LY_HO_SO", "Cán bộ quản lý hồ sơ (Đội Cảnh sát điều tra tội phạm về ma túy - Công an Quận)");
        rolesToSeed.put("CAN_BO_TRUNG_TAM", "Cán bộ trung tâm (Nhân viên)");
        rolesToSeed.put("CAN_BO_QUAN_LY", "Cán bộ quản lý");
        rolesToSeed.put("CAN_BO_PHU_TRACH", "Cán bộ phụ trách (Bác sĩ)");
        rolesToSeed.put("NGUOI_LANH_DAO", "Người lãnh đạo trung tâm");
        rolesToSeed.put("QUANTRI_HETHONG", "Quản trị hệ thống");

        Map<String, Role> seededRoles = new HashMap<>();
        for (Map.Entry<String, String> entry : rolesToSeed.entrySet()) {
            String roleName = entry.getKey();
            String description = entry.getValue();

            Role role = roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .name(roleName)
                            .description(description)
                            .build()));
            seededRoles.put(roleName, role);
        }

        String encodedPassword = passwordEncoder.encode("Password@123");

        createSeededUser("nguoi_than", "Người Thân Cai Nghiện", "0987654322", "nguoithan@rehab.com", seededRoles.get("NGUOI_THAN"), encodedPassword);
        seedPoliceRecordOfficer("cb_quan_ly_ho_so", "Cán Bộ Quản Lý Hồ Sơ", "0987654323", "cbqlhs@rehab.com", seededRoles.get("CAN_BO_QUAN_LY_HO_SO"), encodedPassword);
        createSeededUser("cb_trung_tam", "Cán Bộ Trung Tâm", "0987654324", "cbtrungtam@rehab.com", seededRoles.get("CAN_BO_TRUNG_TAM"), encodedPassword);
        createSeededUser("cb_quan_ly", "Cán Bộ Quản Lý", "0987654325", "cbquanly@rehab.com", seededRoles.get("CAN_BO_QUAN_LY"), encodedPassword);
        createSeededUser("cb_phu_trach", "Bác Sĩ Phụ Trách", "0987654326", "cbphutrach@rehab.com", seededRoles.get("CAN_BO_PHU_TRACH"), encodedPassword);
        createSeededUser("nguoi_lanh_dao", "Người Lãnh Đạo Trung Tâm", "0987654327", "nguoilanhdao@rehab.com", seededRoles.get("NGUOI_LANH_DAO"), encodedPassword);
        createSeededUser("quantri_hethong", "Quản Trị Hệ Thống", "0987654328", "admin@rehab.com", seededRoles.get("QUANTRI_HETHONG"), encodedPassword);

        seedTreatmentStageDefinitions();
        seedStaffProfiles();
        seedTreatmentTestData();
    }

    private void seedTreatmentStageDefinitions() {
        seedStageIfAbsent("GD001", "Giai đoạn 1 - Cai nghiện", 1,
                "Giai đoạn cai nghiện, detox và ổn định thể chất ban đầu");
        seedStageIfAbsent("GD002", "Giai đoạn 2 - Phục hồi", 2,
                "Giai đoạn phục hồi sức khỏe, tâm lý và kỹ năng sống");
        seedStageIfAbsent("GD003", "Giai đoạn 3 - Tái hòa nhập", 3,
                "Giai đoạn chuẩn bị tái hòa nhập cộng đồng");
    }

    private void seedStageIfAbsent(String id, String name, int sequenceOrder, String description) {
        if (!treatmentStageDefinitionRepository.existsById(id)) {
            treatmentStageDefinitionRepository.save(TreatmentStageDefinition.builder()
                    .id(id)
                    .name(name)
                    .sequenceOrder(sequenceOrder)
                    .description(description)
                    .build());
        }
    }

    private void seedStaffProfiles() {
        seedStaffIfAbsent("cb_quan_ly", "CBQL001", "Cán bộ quản lý");
        seedStaffIfAbsent("cb_phu_trach", "BSPT001", "Bác sĩ phụ trách");
    }

    private void seedStaffIfAbsent(String username, String staffId, String position) {
        if (staffRepository.existsById(staffId)) {
            return;
        }

        userRepository.findByUsername(username).ifPresent(user -> staffRepository.save(Staff.builder()
                .id(staffId)
                .user(user)
                .status(StaffStatus.DANG_LAM_VIEC)
                .position(position)
                .build()));
    }

    private void seedTreatmentTestData() {
        TreatmentStageDefinition stage1 = treatmentStageDefinitionRepository.findById("GD001").orElse(null);
        TreatmentStageDefinition stage2 = treatmentStageDefinitionRepository.findById("GD002").orElse(null);
        TreatmentStageDefinition stage3 = treatmentStageDefinitionRepository.findById("GD003").orElse(null);
        Staff doctor = staffRepository.findById("BSPT001").orElse(null);
        Staff manager = staffRepository.findById("CBQL001").orElse(null);

        if (stage1 == null || stage2 == null || stage3 == null || doctor == null) {
            return;
        }

        seedPatientBundle(
                "NCN-SEED001", "BA-SEED001", "DX-SEED001",
                "Nguyễn Văn Test", "001234567890",
                stage1, stage1, stage2,
                TreatmentProposalStatus.CHO_DUYET,
                "Đủ điều kiện chuyển sang giai đoạn phục hồi sau 30 ngày cai nghiện",
                30, 1, doctor, manager, null
        );

        seedPatientBundle(
                "NCN-SEED002", "BA-SEED002", "DX-SEED002",
                "Trần Văn Bình", "001234567891",
                stage1, stage1, stage2,
                TreatmentProposalStatus.CHO_DUYET,
                "Ổn định sức khỏe, không còn triệu chứng cai nghiện cấp tính",
                45, 2, doctor, manager, null
        );

        seedPatientBundle(
                "NCN-SEED003", "BA-SEED003", "DX-SEED003",
                "Lê Thị Chi", "001234567892",
                stage2, stage2, stage3,
                TreatmentProposalStatus.CHO_DUYET,
                "Hoàn thành chương trình phục hồi, sẵn sàng chuẩn bị tái hòa nhập",
                90, 3, doctor, manager, null
        );

        seedPatientBundle(
                "NCN-SEED004", "BA-SEED004", "DX-SEED004",
                "Phạm Văn Dũng", "001234567893",
                stage2, stage1, stage2,
                TreatmentProposalStatus.DA_PHE_DUYET,
                "Đã đủ điều kiện chuyển giai đoạn theo đánh giá định kỳ",
                60, 10, doctor, manager, null
        );

        seedPatientBundle(
                "NCN-SEED005", "BA-SEED005", "DX-SEED005",
                "Hoàng Thị Em", "001234567894",
                stage1, stage1, stage2,
                TreatmentProposalStatus.TU_CHOI,
                "Đề xuất chuyển giai đoạn sớm hơn quy định",
                20, 5, doctor, manager,
                "Chưa đủ thời gian tối thiểu ở giai đoạn 1 theo quy định trung tâm"
        );

        seedPatientBundle(
                "NCN-SEED006", "BA-SEED006", "DX-SEED006",
                "Vũ Văn Phúc", "001234567895",
                stage2, stage2, stage3,
                TreatmentProposalStatus.CHO_DUYET,
                "Có tiến bộ tốt về kỹ năng sống và tâm lý ổn định",
                75, 1, doctor, manager, null
        );

        seedPatientBundle(
                "NCN-SEED007", "BA-SEED007", "DX-SEED007",
                "Đặng Thị Giang", "001234567896",
                stage1, stage1, stage2,
                TreatmentProposalStatus.HUY,
                "Bác sĩ hủy đề xuất do cần đánh giá lại sức khỏe",
                25, 7, doctor, null, null
        );

        seedTreatmentProtocolIfAbsent(
                "PDT-S002", "BA-SEED002", doctor,
                DrugType.HEROIN,
                stage1, TreatmentProtocolStatus.DANG_AP_DUNG,
                stage2, TreatmentProtocolStatus.CHO_PHE_DUYET
        );

        seedTreatmentProtocolIfAbsent(
                "PDT-S003", "BA-SEED003", doctor,
                DrugType.MA_TUY_DA,
                stage2, TreatmentProtocolStatus.DANG_AP_DUNG,
                stage3, TreatmentProtocolStatus.CHO_PHE_DUYET
        );
    }

    private void seedPatientBundle(
            String patientId,
            String medicalRecordId,
            String proposalId,
            String fullName,
            String identityNumber,
            TreatmentStageDefinition patientStage,
            TreatmentStageDefinition proposalCurrentStage,
            TreatmentStageDefinition proposalTargetStage,
            TreatmentProposalStatus proposalStatus,
            String reason,
            int admittedDaysAgo,
            int proposedDaysAgo,
            Staff doctor,
            Staff manager,
            String approvalNote
    ) {
        RehabPatient patient = seedPatientIfAbsent(
                patientId, fullName, identityNumber, patientStage, admittedDaysAgo
        );
        MedicalRecord medicalRecord = seedMedicalRecordIfAbsent(medicalRecordId, patient, doctor, admittedDaysAgo);
        seedProposalIfAbsent(
                proposalId,
                patient,
                proposalCurrentStage,
                proposalTargetStage,
                proposalStatus,
                reason,
                proposedDaysAgo,
                doctor,
                manager,
                approvalNote
        );

        if (medicalRecord != null && proposalStatus == TreatmentProposalStatus.DA_PHE_DUYET) {
            patient.setCurrentStageDefinition(proposalTargetStage);
            rehabPatientRepository.save(patient);
        }
    }

    private RehabPatient seedPatientIfAbsent(
            String id,
            String fullName,
            String identityNumber,
            TreatmentStageDefinition currentStage,
            int admittedDaysAgo
    ) {
        return rehabPatientRepository.findById(id).orElseGet(() -> rehabPatientRepository.save(RehabPatient.builder()
                .id(id)
                .fullName(fullName)
                .identityNumber(identityNumber)
                .admissionDate(LocalDateTime.now().minusDays(admittedDaysAgo))
                .currentStageDefinition(currentStage)
                .status(RehabPatientStatus.DANG_CAI_NGHIEN)
                .build()));
    }

    private MedicalRecord seedMedicalRecordIfAbsent(
            String id,
            RehabPatient patient,
            Staff doctor,
            int createdDaysAgo
    ) {
        if (medicalRecordRepository.existsById(id)) {
            return medicalRecordRepository.findById(id).orElse(null);
        }

        return medicalRecordRepository.save(MedicalRecord.builder()
                .id(id)
                .rehabPatient(patient)
                .doctor(doctor)
                .createdAt(LocalDateTime.now().minusDays(createdDaysAgo))
                .build());
    }

    private void seedProposalIfAbsent(
            String id,
            RehabPatient patient,
            TreatmentStageDefinition currentStage,
            TreatmentStageDefinition proposedStage,
            TreatmentProposalStatus status,
            String reason,
            int proposedDaysAgo,
            Staff doctor,
            Staff manager,
            String approvalNote
    ) {
        if (treatmentProposalRepository.existsById(id)) {
            return;
        }

        TreatmentProposal.TreatmentProposalBuilder builder = TreatmentProposal.builder()
                .id(id)
                .rehabPatient(patient)
                .doctor(doctor)
                .proposalType(ProposalType.CHUYEN_GIAI_DOAN)
                .currentStageDefinition(currentStage)
                .proposedStageDefinition(proposedStage)
                .reason(reason)
                .proposedAt(LocalDateTime.now().minusDays(proposedDaysAgo))
                .status(status);

        if (status == TreatmentProposalStatus.DA_PHE_DUYET || status == TreatmentProposalStatus.TU_CHOI) {
            builder.manager(manager);
            builder.approvedAt(LocalDateTime.now().minusDays(Math.max(1, proposedDaysAgo - 1)));
            builder.approvalNote(approvalNote);
        }

        treatmentProposalRepository.save(builder.build());
    }

    private void seedTreatmentProtocolIfAbsent(
            String protocolId,
            String medicalRecordId,
            Staff doctor,
            DrugType drugType,
            TreatmentStageDefinition activeStage,
            TreatmentProtocolStatus activeStageStatus,
            TreatmentStageDefinition nextStage,
            TreatmentProtocolStatus nextStageStatus
    ) {
        if (treatmentProtocolRepository.existsById(protocolId)) {
            return;
        }

        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId).orElse(null);
        if (medicalRecord == null) {
            return;
        }

        TreatmentProtocol protocol = TreatmentProtocol.builder()
                .id(protocolId)
                .medicalRecord(medicalRecord)
                .doctor(doctor)
                .drugType(drugType)
                .status(TreatmentProtocolOverallStatus.DANG_AP_DUNG)
                .createdAt(LocalDateTime.now().minusDays(30))
                .note("Phác đồ điều trị mẫu cho kiểm thử")
                .build();

        protocol.getStages().add(buildProtocolStage(
                protocolId + "-01",
                protocol,
                activeStage,
                activeStageStatus,
                "Detox và theo dõi triệu chứng cai nghiện",
                "Ổn định thể chất, kiểm soát triệu chứng"
        ));

        protocol.getStages().add(buildProtocolStage(
                protocolId + "-02",
                protocol,
                nextStage,
                nextStageStatus,
                "Vật lý trị liệu và tư vấn tâm lý",
                "Phục hồi chức năng và kỹ năng sống"
        ));

        treatmentProtocolRepository.save(protocol);
    }

    private TreatmentProtocolStage buildProtocolStage(
            String stageId,
            TreatmentProtocol protocol,
            TreatmentStageDefinition stageDefinition,
            TreatmentProtocolStatus status,
            String content,
            String objective
    ) {
        return TreatmentProtocolStage.builder()
                .id(stageId)
                .treatmentProtocol(protocol)
                .stageDefinition(stageDefinition)
                .sequenceOrder(stageDefinition.getSequenceOrder())
                .protocolContent(content)
                .objective(objective)
                .startDate(LocalDate.now().minusDays(30))
                .expectedEndDate(LocalDate.now().plusDays(30))
                .status(status)
                .build();
    }

    private void createSeededUser(String username, String fullName, String phoneNumber, String email, Role role, String encodedPassword) {
        if (role == null) {
            return;
        }
        if (!userRepository.existsByUsername(username)) {
            userRepository.save(User.builder()
                    .username(username)
                    .password(encodedPassword)
                    .fullName(fullName)
                    .phoneNumber(phoneNumber)
                    .email(email)
                    .role(role)
                    .status(UserStatus.DANG_HOAT_DONG)
                    .build());
        }
    }

    private void seedPoliceRecordOfficer(
            String username,
            String fullName,
            String phoneNumber,
            String email,
            Role role,
            String encodedPassword
    ) {
        if (role == null) {
            return;
        }

        User user = userRepository.findByUsername(username).orElseGet(() -> userRepository.save(User.builder()
                .username(username)
                .password(encodedPassword)
                .fullName(fullName)
                .phoneNumber(phoneNumber)
                .email(email)
                .role(role)
                .status(UserStatus.DANG_HOAT_DONG)
                .build()));

        String officerId = "CBQLHS001";
        if (!policeRecordOfficerRepository.existsById(officerId)) {
            policeRecordOfficerRepository.save(PoliceRecordOfficer.builder()
                    .id(officerId)
                    .user(user)
                    .fullName(fullName)
                    .policeBadgeNumber("CAND-001")
                    .workUnit("Đội CSĐT tội phạm về ma túy - Công an TP")
                    .phoneNumber(phoneNumber)
                    .build());
        }
    }
}
