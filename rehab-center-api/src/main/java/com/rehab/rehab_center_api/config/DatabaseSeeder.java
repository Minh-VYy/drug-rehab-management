package com.rehab.rehab_center_api.config;

import com.rehab.rehab_center_api.entities.Address;
import com.rehab.rehab_center_api.entities.HandoverSlip;
import com.rehab.rehab_center_api.entities.HandoverSlipDetail;
import com.rehab.rehab_center_api.entities.MedicalRecord;
import com.rehab.rehab_center_api.entities.PoliceRecordOfficer;
import com.rehab.rehab_center_api.entities.RehabPatient;
import com.rehab.rehab_center_api.entities.Relative;
import com.rehab.rehab_center_api.entities.Role;
import com.rehab.rehab_center_api.entities.Staff;
import com.rehab.rehab_center_api.entities.TreatmentProposal;
import com.rehab.rehab_center_api.entities.TreatmentProtocol;
import com.rehab.rehab_center_api.entities.TreatmentProtocolStage;
import com.rehab.rehab_center_api.entities.TreatmentStageDefinition;
import com.rehab.rehab_center_api.entities.User;
import com.rehab.rehab_center_api.enums.DrugType;
import com.rehab.rehab_center_api.enums.HandoverSlipDetailStatus;
import com.rehab.rehab_center_api.enums.HandoverSlipStatus;
import com.rehab.rehab_center_api.enums.ProposalType;
import com.rehab.rehab_center_api.enums.RehabPatientStatus;
import com.rehab.rehab_center_api.enums.StaffStatus;
import com.rehab.rehab_center_api.enums.TreatmentProposalStatus;
import com.rehab.rehab_center_api.enums.TreatmentProtocolOverallStatus;
import com.rehab.rehab_center_api.enums.TreatmentProtocolStatus;
import com.rehab.rehab_center_api.enums.UserStatus;
import com.rehab.rehab_center_api.repositories.MedicalRecordRepository;
import com.rehab.rehab_center_api.repositories.HandoverSlipRepository;
import com.rehab.rehab_center_api.repositories.PoliceRecordOfficerRepository;
import com.rehab.rehab_center_api.repositories.RehabPatientRepository;
import com.rehab.rehab_center_api.repositories.RelativeRepository;
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

    private Relative seededDefaultRelative;

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PoliceRecordOfficerRepository policeRecordOfficerRepository;
    private final HandoverSlipRepository handoverSlipRepository;
    private final TreatmentStageDefinitionRepository treatmentStageDefinitionRepository;
    private final StaffRepository staffRepository;
    private final RehabPatientRepository rehabPatientRepository;
    private final RelativeRepository relativeRepository;
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

        User defaultRelativeUser = createSeededUser("nguoi_than", "Nguyễn Thị Lan", "0987654322", "nguoithan@rehab.com", seededRoles.get("NGUOI_THAN"), encodedPassword);
        seedPoliceRecordOfficer("cb_quan_ly_ho_so", "CA. Đặng Văn Nam", "0987654323", "cbqlhs@rehab.com", seededRoles.get("CAN_BO_QUAN_LY_HO_SO"), encodedPassword);
        createSeededUser("cb_trung_tam", "NV. Lê Văn Hùng", "0987654324", "cbtrungtam@rehab.com", seededRoles.get("CAN_BO_TRUNG_TAM"), encodedPassword);
        createSeededUser("cb_quan_ly", "QL. Phạm Thị Phương", "0987654325", "cbquanly@rehab.com", seededRoles.get("CAN_BO_QUAN_LY"), encodedPassword);
        createSeededUser("cb_phu_trach", "BS. Trần Thị Mai", "0987654326", "cbphutrach@rehab.com", seededRoles.get("CAN_BO_PHU_TRACH"), encodedPassword);
        createSeededUser("nguoi_lanh_dao", "GĐ. Hoàng Văn Đức", "0987654327", "nguoilanhdao@rehab.com", seededRoles.get("NGUOI_LANH_DAO"), encodedPassword);
        createSeededUser("quantri_hethong", "Nguyễn Văn An", "0987654328", "admin@rehab.com", seededRoles.get("QUANTRI_HETHONG"), encodedPassword);

        // Thêm dữ liệu các tài khoản thực tế phong phú hơn
        createSeededUser("bs.nguyenmai", "BS. Nguyễn Thị Mai", "0901234567", "bs.mai@rehab.com", seededRoles.get("CAN_BO_PHU_TRACH"), encodedPassword);
        createSeededUser("bs.tranviet", "BS. Trần Văn Việt", "0901234568", "bs.viet@rehab.com", seededRoles.get("CAN_BO_PHU_TRACH"), encodedPassword);
        createSeededUser("nv.letu", "NV. Lê Văn Tư", "0901234569", "nv.tu@rehab.com", seededRoles.get("CAN_BO_TRUNG_TAM"), encodedPassword);
        createSeededUser("ql.tranminh", "QL. Trần Minh", "0901234570", "ql.minh@rehab.com", seededRoles.get("CAN_BO_QUAN_LY"), encodedPassword);
        createSeededUser("nt.hoangyen", "Hoàng Thị Yến (Người thân)", "0901234571", "nt.yen@rehab.com", seededRoles.get("NGUOI_THAN"), encodedPassword);
        createSeededUser("nt.vudinh", "Vũ Đình Cường (Người thân)", "0901234572", "nt.cuong@rehab.com", seededRoles.get("NGUOI_THAN"), encodedPassword);
        Relative defaultRelative = seedRelativeIfAbsent(defaultRelativeUser, "079123456789");

        seedTreatmentStageDefinitions();
        seedStaffProfiles();
        seedHandoverTestData();
        // Treatment demo data depends on admission-source rows that differ between DB versions.
        // Keep the app startup stable and load treatment data from the SQL script instead.
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
        seedStaffIfAbsent("bs.nguyenmai", "BSPT002", "Bác sĩ điều trị");
        seedStaffIfAbsent("bs.tranviet", "BSPT003", "Bác sĩ tâm lý");
        seedStaffIfAbsent("nv.letu", "NVTT001", "Nhân viên chăm sóc");
        seedStaffIfAbsent("ql.tranminh", "CBQL002", "Trưởng phòng hồ sơ");
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

    private void seedHandoverTestData() {
        PoliceRecordOfficer officer = policeRecordOfficerRepository.findById("CA001").orElse(null);
        if (officer == null) {
            officer = policeRecordOfficerRepository.findAll().stream().findFirst().orElse(null);
        }
        if (officer == null) {
            return;
        }

        seedHandoverSlipIfAbsent(
                "HSBG001", "QD-HSBG-001/2026", LocalDate.now().minusDays(2), LocalDateTime.now().minusDays(1),
                HandoverSlipStatus.DA_GUI, officer,
                "Nguyễn Văn B", "048201001234", LocalDate.of(1998, 3, 12),
                "Đà Nẵng", "Quận Hải Châu, Đà Nẵng",
                "Nguyễn Thị Lan", "0905123456", "Mẹ",
                "Sử dụng trái phép chất ma túy, bị phát hiện trong đợt kiểm tra hành chính.",
                HandoverSlipDetailStatus.CHO_TIEP_NHAN
        );

        seedHandoverSlipIfAbsent(
                "HSBG002", "QD-HSBG-002/2026", LocalDate.now().minusDays(4), LocalDateTime.now().minusDays(3),
                HandoverSlipStatus.DA_GUI, officer,
                "Lê Văn D", "048201005678", LocalDate.of(1995, 11, 5),
                "Quảng Nam", "Quận Thanh Khê, Đà Nẵng",
                "Lê Thị Hoa", "0918765432", "Vợ",
                "Sử dụng ma túy đá, vi phạm trật tự công cộng.",
                HandoverSlipDetailStatus.CHO_TIEP_NHAN
        );

        seedHandoverSlipIfAbsent(
                "HSBG003", "QD-HSBG-003/2026", LocalDate.now().minusDays(10), LocalDateTime.now().minusDays(9),
                HandoverSlipStatus.DANG_TIEP_NHAN, officer,
                "Phạm Thị E", "048201009012", LocalDate.of(2000, 7, 20),
                "Đà Nẵng", "Quận Sơn Trà, Đà Nẵng",
                "Phạm Văn Sơn", "0934567890", "Anh trai",
                "Tái sử dụng chất gây nghiện sau cai nghiện tại gia.",
                HandoverSlipDetailStatus.CHO_TIEP_NHAN
        );

        seedHandoverSlipIfAbsent(
                "HSBG004", "QD-HSBG-004/2026", LocalDate.now().minusDays(15), LocalDateTime.now().minusDays(14),
                HandoverSlipStatus.TU_CHOI, officer,
                "Hoàng Văn F", "048201003344", LocalDate.of(1992, 1, 15),
                "Huế", "Quận Liên Chiểu, Đà Nẵng",
                "Hoàng Thị Mai", "0978123456", "Chị gái",
                "Hồ sơ chưa đầy đủ giấy tờ xác minh, thiếu xét nghiệm y tế.",
                HandoverSlipDetailStatus.TU_CHOI
        );
    }

    private void seedHandoverSlipIfAbsent(
            String slipId,
            String decisionNumber,
            LocalDate decisionDate,
            LocalDateTime submittedAt,
            HandoverSlipStatus slipStatus,
            PoliceRecordOfficer officer,
            String subjectName,
            String identityNumber,
            LocalDate dateOfBirth,
            String hometown,
            String currentAddress,
            String relativeName,
            String relativePhone,
            String relationship,
            String violation,
            HandoverSlipDetailStatus detailStatus
    ) {
        if (handoverSlipRepository.existsById(slipId)) {
            return;
        }

        HandoverSlip slip = HandoverSlip.builder()
                .id(slipId)
                .policeOfficer(officer)
                .decisionNumber(decisionNumber)
                .decisionDate(decisionDate)
                .decisionFileUrl("seed/" + slipId + ".pdf")
                .submittedAt(submittedAt)
                .status(slipStatus)
                .subjectCount(1)
                .note("Dữ liệu mẫu cho giao diện lãnh đạo")
                .build();

        HandoverSlipDetail detail = HandoverSlipDetail.builder()
                .id(slipId + "-CT01")
                .handoverSlip(slip)
                .fullName(subjectName)
                .identityNumber(identityNumber)
                .dateOfBirth(dateOfBirth)
                .currentAddress(Address.builder().streetAddress(currentAddress).build())
                .relativeName(relativeName)
                .relativePhone(relativePhone)
                .relativeRelationship(relationship)
                .violationDescription(violation + " Quê quán: " + hometown)
                .status(detailStatus)
                .build();

        slip.getSubjects().add(detail);
        handoverSlipRepository.save(slip);
    }

    private void seedTreatmentTestData(Relative defaultRelative) {
        this.seededDefaultRelative = defaultRelative;

        TreatmentStageDefinition stage1 = treatmentStageDefinitionRepository.findById("GD001").orElse(null);
        TreatmentStageDefinition stage2 = treatmentStageDefinitionRepository.findById("GD002").orElse(null);
        TreatmentStageDefinition stage3 = treatmentStageDefinitionRepository.findById("GD003").orElse(null);
        Staff doctor = staffRepository.findById("BSPT001").orElse(null);
        Staff doctorMai = staffRepository.findById("BSPT002").orElse(null);
        Staff doctorViet = staffRepository.findById("BSPT003").orElse(null);
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

        seedPatientBundle(
                "NCN-RL001", "BA-RL001", "DX-RL001",
                "Trương Quang Đại", "079090123456",
                stage1, stage1, stage2,
                TreatmentProposalStatus.CHO_DUYET,
                "Học viên đã cắt cơn an toàn, thể trạng phục hồi tốt, không có dấu hiệu rối loạn tâm thần. Đề xuất chuyển sang Giai đoạn 2 (Phục hồi) để tập vật lý trị liệu.",
                35, 2, doctorMai, manager, null
        );

        seedPatientBundle(
                "NCN-RL002", "BA-RL002", "DX-RL002",
                "Mai Thị Mỹ Dung", "079091234567",
                stage2, stage2, stage3,
                TreatmentProposalStatus.DA_PHE_DUYET,
                "Học viên tích cực tham gia các lớp học nghề, tâm lý cực kỳ ổn định. Đã hoàn thành lộ trình phục hồi kỹ năng sống.",
                95, 5, doctor, manager, "Đồng ý chuyển giai đoạn 3. Chuẩn bị hồ sơ tái hòa nhập cộng đồng."
        );

        seedPatientBundle(
                "NCN-RL003", "BA-RL003", "DX-RL003",
                "Phan Khắc Tiệp", "079092345678",
                stage1, stage1, stage2,
                TreatmentProposalStatus.TU_CHOI,
                "Học viên đã qua thời gian cắt cơn nhưng còn thường xuyên cáu gắt, chống đối nhân viên chăm sóc.",
                40, 10, doctorViet, manager, "Từ chối đề xuất. Yêu cầu kéo dài Giai đoạn 1 thêm 15 ngày để ổn định hành vi."
        );

        seedPatientBundle(
                "NCN-RL004", "BA-RL004", "DX-RL004",
                "Đinh Trọng Hữu", "079093456789",
                stage2, stage2, stage3,
                TreatmentProposalStatus.CHO_DUYET,
                "Đã hoàn thành xuất sắc khóa học nghề mộc, kết quả test ma túy 3 lần gần nhất đều âm tính. Mong muốn sớm trở về với gia đình.",
                120, 1, doctorMai, manager, null
        );

        seedPatientBundle(
                "NCN-RL005", "BA-RL005", "DX-RL005",
                "Ngô Bảo Ngọc", "079094567890",
                stage1, stage1, stage2,
                TreatmentProposalStatus.DA_PHE_DUYET,
                "Phục hồi thể chất vượt kỳ vọng. Tăng 3kg sau 20 ngày. Hợp tác tốt với y bác sĩ.",
                30, 3, doctorViet, manager, "Duyệt chuyển Giai đoạn 2."
        );

        seedPatientBundle(
                "NCN-RL006", "BA-RL006", "DX-RL006",
                "Trần Tuấn Kiệt", "079095678901",
                stage1, stage1, stage2,
                TreatmentProposalStatus.CHO_DUYET,
                "Kiểm tra chức năng gan thận đã trở về mức bình thường. Đủ điều kiện kết thúc Detox.",
                28, 0, doctor, manager, null
        );

        seedPatientBundle(
                "NCN-RL007", "BA-RL007", "DX-RL007",
                "Lâm Trí Vĩ", "079096789012",
                stage2, stage2, stage3,
                TreatmentProposalStatus.TU_CHOI,
                "Đề xuất chuyển giai đoạn 3 vì học viên có biểu hiện tốt.",
                60, 2, doctorMai, manager, "Chưa đủ thời gian quy định ở Giai đoạn 2 (Tối thiểu 3 tháng). Cần tiếp tục theo dõi."
        );

        seedPatientBundle(
                "NCN-RL008", "BA-RL008", "DX-RL008",
                "Châu Gia Mẫn", "079097890123",
                stage1, stage1, stage2,
                TreatmentProposalStatus.HUY,
                "Đề xuất chuyển Giai đoạn 2",
                20, 1, doctorViet, null, null
        );

        seedPatientBundle(
                "NCN-RL009", "BA-RL009", "DX-RL009",
                "Quách Hải Thọ", "079098901234",
                stage2, stage1, stage2,
                TreatmentProposalStatus.DA_PHE_DUYET,
                "Học viên thể hiện thái độ cải tạo tốt, sinh hoạt đúng giờ giấc.",
                80, 15, doctor, manager, "Đồng ý phê duyệt, theo sát quá trình chuyển tiếp."
        );

        seedPatientBundle(
                "NCN-RL010", "BA-RL010", "DX-RL010",
                "Đoàn Thiện Lương", "079099012345",
                stage2, stage2, stage3,
                TreatmentProposalStatus.CHO_DUYET,
                "Đã tìm được xưởng cơ khí nhận làm việc sau khi ra trại. Gia đình cam kết bảo lãnh.",
                150, 4, doctorMai, manager, null
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
                .relative(seededDefaultRelative)
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

    private Relative seedRelativeIfAbsent(User user, String identityNumber) {
        if (user == null) {
            return null;
        }

        return relativeRepository.findByUser_Id(user.getId())
                .or(() -> relativeRepository.findByIdentityNumber(identityNumber))
                .orElseGet(() -> relativeRepository.save(Relative.builder()
                        .user(user)
                        .identityNumber(identityNumber)
                        .issueDate(LocalDate.now().minusYears(5))
                        .issuePlace("Cục Cảnh sát quản lý hành chính về trật tự xã hội")
                        .legacyAddress("123 Nguyễn Huệ, Quận 1, TP.HCM")
                        .address(Address.builder()
                                .streetAddress("123 Nguyễn Huệ")
                                .build())
                        .occupation("Lao động tự do")
                        .build()));
    }

    private User createSeededUser(String username, String fullName, String phoneNumber, String email, Role role, String encodedPassword) {
        if (role == null) {
            return null;
        }
        return userRepository.findByUsername(username).map(user -> {
            user.setFullName(fullName);
            user.setPhoneNumber(phoneNumber);
            user.setEmail(email);
            user.setRole(role);
            user.setStatus(UserStatus.DANG_HOAT_DONG);
            return userRepository.save(user);
        }).orElseGet(() -> userRepository.save(User.builder()
                    .username(username)
                    .password(encodedPassword)
                    .fullName(fullName)
                    .phoneNumber(phoneNumber)
                    .email(email)
                    .role(role)
                    .status(UserStatus.DANG_HOAT_DONG)
                    .build()));
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

        User user = userRepository.findByUsername(username).map(existingUser -> {
            existingUser.setFullName(fullName);
            existingUser.setPhoneNumber(phoneNumber);
            existingUser.setEmail(email);
            existingUser.setRole(role);
            existingUser.setStatus(UserStatus.DANG_HOAT_DONG);
            return userRepository.save(existingUser);
        }).orElseGet(() -> userRepository.save(User.builder()
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
        } else {
            policeRecordOfficerRepository.findById(officerId).ifPresent(officer -> {
            officer.setUser(user);
            officer.setFullName(fullName);
            officer.setPhoneNumber(phoneNumber);
            policeRecordOfficerRepository.save(officer);
        });
        }
    }
}
