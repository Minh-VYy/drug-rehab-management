package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.response.RoleDashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardOverviewService {

    private final JdbcTemplate jdbcTemplate;

    public RoleDashboardResponse getDashboard(String role) {
        DashboardStats stats = loadStats();
        return switch (normalizeRole(role)) {
            case "admin" -> adminDashboard(stats);
            case "leader", "director" -> leaderDashboard(stats);
            case "manager" -> managerDashboard(stats);
            case "doctor" -> doctorDashboard(stats);
            case "staff" -> staffDashboard(stats);
            case "family" -> familyDashboard(stats);
            case "police" -> policeDashboard(stats);
            default -> commonDashboard(stats);
        };
    }

    private DashboardStats loadStats() {
        long totalPatients = count("SELECT COUNT(*) FROM NguoiCaiNghien");
        long activePatients = count("""
                SELECT COUNT(*) FROM NguoiCaiNghien
                WHERE TrangThai IN ('DANG_KHAM_SUC_KHOE', 'DANG_CAI_NGHIEN')
                """);
        long completedPatients = count("SELECT COUNT(*) FROM NguoiCaiNghien WHERE TrangThai = 'DA_HOAN_THANH'");
        long pausedPatients = count("SELECT COUNT(*) FROM NguoiCaiNghien WHERE TrangThai = 'TAM_NGUNG_DIEU_TRI'");

        long pendingIntakes = count("SELECT COUNT(*) FROM HoSoBanGiao WHERE TrangThaiDuyet = 'ChoDuyet'")
                + count("SELECT COUNT(*) FROM DonDangKyTuNguyen WHERE TrangThai = 'CHO_DUYET'");
        long approvedIntakes = count("SELECT COUNT(*) FROM HoSoBanGiao WHERE TrangThaiDuyet = 'DaTiepNhan'")
                + count("SELECT COUNT(*) FROM DonDangKyTuNguyen WHERE TrangThai IN ('DA_TIEP_NHAN', 'DA_NHAP_TRAI')");
        long rejectedIntakes = count("SELECT COUNT(*) FROM HoSoBanGiao WHERE TrangThaiDuyet = 'TuChoi'")
                + count("SELECT COUNT(*) FROM DonDangKyTuNguyen WHERE TrangThai = 'TU_CHOI'");

        long pendingPlans = count("SELECT COUNT(*) FROM ChiTietPhacDoDieuTri WHERE TrangThai = 'CHO_PHE_DUYET'");
        long approvedPlans = count("SELECT COUNT(*) FROM ChiTietPhacDoDieuTri WHERE TrangThai IN ('DANG_AP_DUNG', 'DA_HOAN_THANH')");
        long rejectedPlans = count("SELECT COUNT(*) FROM ChiTietPhacDoDieuTri WHERE TrangThai = 'TU_CHOI'");

        long pendingStageProposals = count("""
                SELECT COUNT(*) FROM HoSoDeXuat
                WHERE LoaiDeXuat = N'CHUYEN_GIAI_DOAN' AND TrangThai = 'CHO_DUYET'
                """);
        long pendingCompletionProposals = count("""
                SELECT COUNT(*) FROM HoSoDeXuat
                WHERE LoaiDeXuat = N'RA_TRAI' AND TrangThai = 'CHO_DUYET'
                """);
        long approvedProposals = count("SELECT COUNT(*) FROM HoSoDeXuat WHERE TrangThai = 'DA_PHE_DUYET'");
        long rejectedProposals = count("SELECT COUNT(*) FROM HoSoDeXuat WHERE TrangThai = 'TU_CHOI'");

        long pendingVisits = count("SELECT COUNT(*) FROM PhieuThamGap WHERE TrangThai = 'CHO_DUYET'");
        long approvedVisits = count("SELECT COUNT(*) FROM PhieuThamGap WHERE TrangThai = 'DA_DONG_Y'");
        long completedVisits = count("SELECT COUNT(*) FROM PhieuThamGap WHERE TrangThai = 'HOAN_THANH'");

        long todayActivities = count("""
                SELECT COUNT(*) FROM LichSinhHoat
                WHERE CAST(ThoiGianBatDau AS date) = CAST(GETDATE() AS date)
                """);
        long presentAttendances = count("""
                SELECT COUNT(*) FROM NhatKyDiemDanh
                WHERE TrangThai = 'CO_MAT' AND CAST(ThoiGian AS date) = CAST(GETDATE() AS date)
                """);
        long absentAttendances = count("""
                SELECT COUNT(*) FROM NhatKyDiemDanh
                WHERE TrangThai IN ('VANG_MAT', 'TRE_GIO') AND CAST(ThoiGian AS date) = CAST(GETDATE() AS date)
                """);

        long totalUsers = count("SELECT COUNT(*) FROM NguoiDung");
        long activeUsers = count("SELECT COUNT(*) FROM NguoiDung WHERE TrangThai = 'DANG_HOAT_DONG'");
        long lockedUsers = count("SELECT COUNT(*) FROM NguoiDung WHERE TrangThai = 'TAM_KHOA'");
        long totalRoles = count("SELECT COUNT(*) FROM VaiTro");
        long activeStaff = count("SELECT COUNT(*) FROM NhanSu WHERE TrangThai = 'DANG_LAM_VIEC'");
        long activeDoctors = count("""
                SELECT COUNT(*) FROM NhanSu ns
                JOIN NguoiDung nd ON nd.MaNguoiDung = ns.MaNguoiDung
                JOIN VaiTro vt ON vt.MaVaiTro = nd.MaVaiTro
                WHERE ns.TrangThai = 'DANG_LAM_VIEC' AND vt.TenVaiTro = 'CAN_BO_PHU_TRACH'
                """);

        long medicalRecords = count("SELECT COUNT(*) FROM HoSoBenhAn");
        long activeMedicineSchedules = count("SELECT COUNT(*) FROM LichUongThuoc WHERE TrangThai = 'DANG_THUC_HIEN'");
        long todayCounseling = count("""
                SELECT COUNT(*) FROM LichTuVanTamLy
                WHERE CAST(ThoiGianBatDau AS date) = CAST(GETDATE() AS date)
                """);
        long pendingSupport = count("SELECT COUNT(*) FROM PhieuHoTro WHERE TrangThai = 'CHO_PHAN_HOI'");
        long handoverTotal = count("SELECT COUNT(*) FROM HoSoBanGiao");

        return new DashboardStats(
                totalPatients, activePatients, completedPatients, pausedPatients,
                pendingIntakes, approvedIntakes, rejectedIntakes,
                pendingPlans, approvedPlans, rejectedPlans,
                pendingStageProposals, pendingCompletionProposals, approvedProposals, rejectedProposals,
                pendingVisits, approvedVisits, completedVisits,
                todayActivities, presentAttendances, absentAttendances,
                totalUsers, activeUsers, lockedUsers, totalRoles, activeStaff, activeDoctors,
                medicalRecords, activeMedicineSchedules, todayCounseling, pendingSupport, handoverTotal
        );
    }

    private RoleDashboardResponse adminDashboard(DashboardStats s) {
        return base("purple", "fa-shield-halved", "Quản trị hệ thống",
                "Xin chào", "Theo dõi tài khoản, phân quyền, nhân sự và tín hiệu vận hành hệ thống.",
                "Độ ổn định", "99.8%", "Dữ liệu dashboard đang lấy trực tiếp từ SQL Server.")
                .metrics(List.of(
                        metric("Tài khoản", s.totalUsers, "fa-users-gear", "blue", s.activeUsers + " đang hoạt động", false),
                        metric("Vai trò", s.totalRoles, "fa-user-shield", "purple", "Cấu hình phân quyền", false),
                        metric("Nhân sự", s.activeStaff, "fa-id-badge", "green", "Đang làm việc", false),
                        metric("Tạm khóa", s.lockedUsers, "fa-lock", "red", "Cần rà soát", s.lockedUsers > 0)
                ))
                .visual(new RoleDashboardResponse.Visual("Tình trạng tài khoản", "Phân bổ trạng thái người dùng",
                        "SQL", pct(s.activeUsers, Math.max(s.totalUsers, 1)), "hoạt động", List.of(
                        datum("Đang hoạt động", s.activeUsers, "green"),
                        datum("Tạm khóa", s.lockedUsers, "orange"),
                        datum("Khác", Math.max(s.totalUsers - s.activeUsers - s.lockedUsers, 0), "red")
                )))
                .focus(focus("Việc cần xử lý", "Các mục quản trị nên kiểm tra trước", List.of(
                        focusItem("Tài khoản mới", "Rà soát người dùng và trạng thái", format(s.totalUsers) + " mục", "fa-user-plus", "blue", "/users"),
                        focusItem("Vai trò hệ thống", "Kiểm tra quyền nhạy cảm", format(s.totalRoles) + " vai trò", "fa-key", "purple", "/roles"),
                        focusItem("Nhật ký hệ thống", "Theo dõi hoạt động bất thường", "Mở log", "fa-list-check", "green", "/system-logs")
                )))
                .timeline(defaultTimeline("Nhịp quản trị"))
                .actions(List.of(
                        action("Quản lý tài khoản", "Tạo, khóa, phân quyền", "fa-users", "blue", "/users"),
                        action("Quản lý vai trò", "Cấu hình quyền", "fa-user-shield", "purple", "/roles"),
                        action("Nhật ký hệ thống", "Theo dõi hoạt động", "fa-clock-rotate-left", "green", "/system-logs")
                ))
                .signals(List.of(
                        signal("Có " + s.lockedUsers + " tài khoản đang tạm khóa.", "fa-lock", s.lockedUsers > 0 ? "orange" : "green"),
                        signal("Nhân sự đang làm việc: " + s.activeStaff + ".", "fa-id-badge", "blue")
                ))
                .build();
    }

    private RoleDashboardResponse leaderDashboard(DashboardStats s) {
        long approvalTotal = s.approvedIntakes + s.rejectedIntakes + s.pendingIntakes + s.approvedProposals + s.rejectedProposals;
        long successTotal = s.approvedIntakes + s.approvedProposals;
        return base("blue", "fa-building-user", "Lãnh đạo trung tâm",
                "Xin chào", "Nắm toàn cảnh tiếp nhận, điều trị và hoàn thành cai nghiện.",
                "Tỷ lệ duyệt", pct(successTotal, approvalTotal), "Tính từ các hồ sơ và đề xuất trong cơ sở dữ liệu.")
                .metrics(List.of(
                        metric("Đang điều trị", s.activePatients, "fa-user-injured", "blue", "Học viên đang ở trung tâm", false),
                        metric("Chờ tiếp nhận", s.pendingIntakes, "fa-clock", "orange", "Hồ sơ cần duyệt", s.pendingIntakes > 0),
                        metric("Chờ hoàn thành", s.pendingCompletionProposals, "fa-clipboard-check", "purple", "Đề xuất ra trại", s.pendingCompletionProposals > 0),
                        metric("Đã hoàn thành", s.completedPatients, "fa-circle-check", "green", "Hoàn tất chương trình", false)
                ))
                .visual(stageVisual("Thống kê theo giai đoạn", "Người cai nghiện đang điều trị theo từng giai đoạn"))
                .focus(focus("Cần xử lý gần đây", "Ưu tiên duyệt trong ngày", List.of(
                        focusItem("Duyệt tiếp nhận", "Hồ sơ bàn giao/tự nguyện đang chờ", format(s.pendingIntakes) + " hồ sơ", "fa-user-check", "orange", "/approvals-receive"),
                        focusItem("Duyệt hoàn thành", "Đề xuất hoàn tất chương trình", format(s.pendingCompletionProposals) + " đề xuất", "fa-circle-check", "green", "/approvals-complete"),
                        focusItem("Báo cáo tổng quan", "Xem xu hướng toàn trung tâm", "Realtime", "fa-chart-line", "blue", "/reports")
                )))
                .timeline(defaultTimeline("Nhịp lãnh đạo"))
                .actions(List.of(
                        action("Duyệt tiếp nhận", "Xem hồ sơ chờ duyệt", "fa-user-check", "orange", "/approvals-receive"),
                        action("Duyệt hoàn thành", "Chốt chương trình", "fa-circle-check", "green", "/approvals-complete"),
                        action("Báo cáo", "Tổng quan trung tâm", "fa-chart-line", "blue", "/reports")
                ))
                .signals(List.of(
                        signal("Có " + s.pendingIntakes + " hồ sơ tiếp nhận đang chờ duyệt.", "fa-clock", s.pendingIntakes > 0 ? "orange" : "green"),
                        signal("Tỷ lệ hoàn thành hiện tại: " + pct(s.completedPatients, Math.max(s.totalPatients, 1)) + ".", "fa-chart-simple", "blue")
                ))
                .build();
    }

    private RoleDashboardResponse managerDashboard(DashboardStats s) {
        long approvalTotal = s.pendingPlans + s.approvedPlans + s.rejectedPlans;
        return base("green", "fa-chart-pie", "Cán bộ quản lý",
                "Xin chào", "Điều phối phác đồ, phân công phụ trách và duyệt chuyển giai đoạn.",
                "Hàng đợi", format(s.pendingPlans + s.pendingStageProposals), "Các phác đồ và đề xuất đang chờ xử lý.")
                .metrics(List.of(
                        metric("Đang điều trị", s.activePatients, "fa-user-injured", "blue", "Theo dõi trong trung tâm", false),
                        metric("Phác đồ chờ duyệt", s.pendingPlans, "fa-stamp", "orange", "Cần xem xét", s.pendingPlans > 0),
                        metric("Chờ chuyển giai đoạn", s.pendingStageProposals, "fa-forward-step", "purple", "Đề xuất từ bác sĩ", s.pendingStageProposals > 0),
                        metricText("Tỷ lệ duyệt", pct(s.approvedPlans, approvalTotal), "fa-chart-line", "green", "Phác đồ đã duyệt", false)
                ))
                .visual(stageVisual("Phân bố giai đoạn", "Số học viên theo giai đoạn điều trị"))
                .focus(focus("Ưu tiên quản lý", "Các hàng đợi cần điều phối", List.of(
                        focusItem("Phê duyệt phác đồ", "Kiểm tra đề xuất bác sĩ", format(s.pendingPlans) + " chờ", "fa-stamp", "orange", "/treatment-approval"),
                        focusItem("Phân công phụ trách", "Gắn bác sĩ/cán bộ theo hồ sơ", "Mở", "fa-user-pen", "green", "/assignment"),
                        focusItem("Duyệt chuyển giai đoạn", "Đảm bảo đúng điều kiện lâm sàng", format(s.pendingStageProposals) + " đề xuất", "fa-forward-step", "purple", "/stage-approval")
                )))
                .timeline(defaultTimeline("Nhịp quản lý"))
                .actions(List.of(
                        action("Duyệt phác đồ", "Phác đồ chờ xét", "fa-stamp", "orange", "/treatment-approval"),
                        action("Phân công", "Bác sĩ/cán bộ", "fa-user-pen", "green", "/assignment"),
                        action("Báo cáo", "Hiệu suất quản lý", "fa-chart-simple", "blue", "/manager-reports")
                ))
                .signals(List.of(
                        signal("Còn " + s.pendingPlans + " chi tiết phác đồ cần duyệt.", "fa-file-signature", s.pendingPlans > 0 ? "orange" : "green"),
                        signal("Đề xuất chuyển giai đoạn đang chờ: " + s.pendingStageProposals + ".", "fa-forward-step", "purple")
                ))
                .build();
    }

    private RoleDashboardResponse doctorDashboard(DashboardStats s) {
        return base("orange", "fa-user-doctor", "Bác sĩ phụ trách",
                "Xin chào", "Theo dõi bệnh án, lịch thuốc, tư vấn và đề xuất điều trị.",
                "Hồ sơ y tế", format(s.medicalRecords), "Số liệu lấy từ bệnh án và lịch điều trị.")
                .metrics(List.of(
                        metric("Bệnh án", s.medicalRecords, "fa-notes-medical", "blue", "Đang quản lý", false),
                        metric("Lịch thuốc", s.activeMedicineSchedules, "fa-pills", "purple", "Đang thực hiện", false),
                        metric("Tư vấn hôm nay", s.todayCounseling, "fa-comments", "green", "Lịch trong ngày", false),
                        metric("Đề xuất chờ", s.pendingStageProposals + s.pendingCompletionProposals, "fa-file-circle-plus", "orange", "Cần theo dõi", s.pendingStageProposals + s.pendingCompletionProposals > 0)
                ))
                .visual(stageVisual("Theo dõi điều trị", "Học viên theo giai đoạn hiện tại"))
                .focus(focus("Việc của bác sĩ", "Các thao tác điều trị thường dùng", List.of(
                        focusItem("Cập nhật bệnh án", "Chỉ số, triệu chứng, ghi chú", format(s.medicalRecords) + " hồ sơ", "fa-notes-medical", "orange", "/medical-records"),
                        focusItem("Tạo phác đồ", "Chuẩn bị kế hoạch điều trị", "Mới", "fa-file-prescription", "blue", "/treatment-plan-create"),
                        focusItem("Đề xuất hoàn thành", "Học viên đủ điều kiện", format(s.pendingCompletionProposals) + " hồ sơ", "fa-award", "green", "/completion-proposal")
                )))
                .timeline(defaultTimeline("Nhịp điều trị"))
                .actions(List.of(
                        action("Bệnh án", "Cập nhật hồ sơ", "fa-file-medical", "blue", "/medical-records"),
                        action("Lịch thuốc", "Theo dõi dùng thuốc", "fa-pills", "purple", "/medicine-schedule"),
                        action("Nhật ký điều trị", "Ghi nhận tiến triển", "fa-book-medical", "green", "/treatment-diary")
                ))
                .signals(List.of(
                        signal("Có " + s.todayCounseling + " lịch tư vấn trong ngày.", "fa-comments", "green"),
                        signal("Đề xuất đang chờ xử lý: " + (s.pendingStageProposals + s.pendingCompletionProposals) + ".", "fa-file-circle-plus", "orange")
                ))
                .build();
    }

    private RoleDashboardResponse staffDashboard(DashboardStats s) {
        return base("cyan", "fa-id-badge", "Cán bộ trung tâm",
                "Xin chào", "Điều phối tiếp nhận, thăm gặp, lịch sinh hoạt và điểm danh hằng ngày.",
                "Vận hành hôm nay", format(s.todayActivities) + " lịch", "Tổng hợp từ lịch sinh hoạt và điểm danh.")
                .metrics(List.of(
                        metric("Chờ tiếp nhận", s.pendingIntakes, "fa-file-import", "orange", "Hồ sơ cần xác nhận", s.pendingIntakes > 0),
                        metric("Học viên", s.activePatients, "fa-users", "blue", "Đang theo dõi", false),
                        metric("Chờ thăm gặp", s.pendingVisits, "fa-calendar-check", "purple", "Phiếu cần duyệt", s.pendingVisits > 0),
                        metric("Lịch hôm nay", s.todayActivities, "fa-calendar-days", "green", "Sinh hoạt trong ngày", false)
                ))
                .visual(new RoleDashboardResponse.Visual("Điểm danh hôm nay", "Tình trạng tham gia hoạt động",
                        "SQL", format(s.presentAttendances), "có mặt", List.of(
                        datum("Có mặt", s.presentAttendances, "green"),
                        datum("Vắng/trễ", s.absentAttendances, "red"),
                        datum("Chưa ghi nhận", Math.max(s.activePatients - s.presentAttendances - s.absentAttendances, 0), "orange")
                )))
                .focus(focus("Hàng đợi vận hành", "Các việc cán bộ cần xử lý", List.of(
                        focusItem("Xác nhận tiếp nhận", "Hồ sơ đã được lãnh đạo duyệt", format(s.pendingIntakes) + " hồ sơ", "fa-file-import", "orange", "/receive"),
                        focusItem("Duyệt thăm gặp", "Xếp lịch và kiểm tra điều kiện", format(s.pendingVisits) + " phiếu", "fa-calendar-check", "purple", "/visits"),
                        focusItem("Điểm danh", "Ghi nhận sinh hoạt trong ngày", format(s.todayActivities) + " lịch", "fa-user-check", "blue", "/attendance")
                )))
                .timeline(defaultTimeline("Nhịp cán bộ"))
                .actions(List.of(
                        action("Tiếp nhận", "Xác nhận hồ sơ", "fa-file-import", "orange", "/receive"),
                        action("Học viên", "Quản lý danh sách", "fa-users", "blue", "/patients"),
                        action("Lịch sinh hoạt", "Tạo và theo dõi", "fa-calendar-days", "green", "/activities")
                ))
                .signals(List.of(
                        signal("Phiếu thăm gặp chờ duyệt: " + s.pendingVisits + ".", "fa-calendar-check", s.pendingVisits > 0 ? "orange" : "green"),
                        signal("Vắng/trễ hôm nay: " + s.absentAttendances + ".", "fa-user-clock", s.absentAttendances > 0 ? "red" : "green")
                ))
                .build();
    }

    private RoleDashboardResponse familyDashboard(DashboardStats s) {
        return base("purple", "fa-heart", "Người thân",
                "Xin chào", "Theo dõi hồ sơ, lịch thăm gặp, lộ trình phục hồi và yêu cầu hỗ trợ.",
                "Kết nối trung tâm", format(s.pendingSupport), "Yêu cầu hỗ trợ đang chờ phản hồi.")
                .metrics(List.of(
                        metric("Đang điều trị", s.activePatients, "fa-user-injured", "blue", "Học viên tại trung tâm", false),
                        metric("Đơn tự nguyện chờ", s.pendingIntakes, "fa-file-circle-plus", "orange", "Cần xử lý", s.pendingIntakes > 0),
                        metric("Lịch thăm chờ", s.pendingVisits, "fa-calendar-plus", "green", "Phiếu đang duyệt", s.pendingVisits > 0),
                        metric("Yêu cầu hỗ trợ", s.pendingSupport, "fa-headset", "purple", "Chờ phản hồi", s.pendingSupport > 0)
                ))
                .visual(stageVisual("Lộ trình phục hồi", "Tổng quan học viên trong trung tâm"))
                .focus(focus("Việc có thể làm", "Các thao tác thường dùng của người thân", List.of(
                        focusItem("Đăng ký thăm gặp", "Chọn ngày và người đi cùng", format(s.pendingVisits) + " chờ", "fa-calendar-plus", "green", "/visit-register"),
                        focusItem("Xem lộ trình", "Theo dõi tiến trình phục hồi", pct(s.completedPatients, Math.max(s.totalPatients, 1)), "fa-route", "purple", "/treatment-path"),
                        focusItem("Gửi hỗ trợ", "Trao đổi với trung tâm", format(s.pendingSupport) + " yêu cầu", "fa-headset", "orange", "/support")
                )))
                .timeline(defaultTimeline("Nhịp gia đình"))
                .actions(List.of(
                        action("Đăng ký cai nghiện", "Tạo hồ sơ tự nguyện", "fa-file-circle-plus", "blue", "/register-rehab"),
                        action("Đăng ký thăm", "Chọn ca thăm gặp", "fa-calendar-plus", "green", "/visit-register"),
                        action("Yêu cầu hỗ trợ", "Gửi phản hồi", "fa-headset", "orange", "/support")
                ))
                .signals(List.of(
                        signal("Yêu cầu hỗ trợ chưa phản hồi: " + s.pendingSupport + ".", "fa-headset", s.pendingSupport > 0 ? "orange" : "green"),
                        signal("Tỷ lệ hoàn thành toàn trung tâm: " + pct(s.completedPatients, Math.max(s.totalPatients, 1)) + ".", "fa-chart-line", "blue")
                ))
                .build();
    }

    private RoleDashboardResponse policeDashboard(DashboardStats s) {
        return base("blue", "fa-building-shield", "Cán bộ quản lý hồ sơ",
                "Xin chào", "Gửi hồ sơ bàn giao, theo dõi trạng thái và bổ sung thông tin khi cần.",
                "Hồ sơ bàn giao", format(s.handoverTotal), "Số liệu lấy từ bảng hồ sơ bàn giao.")
                .metrics(List.of(
                        metric("Tổng hồ sơ", s.handoverTotal, "fa-folder-open", "blue", "Đã ghi nhận", false),
                        metric("Chờ duyệt", s.pendingIntakes, "fa-clock", "orange", "Đang xử lý", s.pendingIntakes > 0),
                        metric("Đã tiếp nhận", s.approvedIntakes, "fa-circle-check", "green", "Trung tâm đã nhận", false),
                        metric("Từ chối", s.rejectedIntakes, "fa-circle-xmark", "red", "Cần rà soát", s.rejectedIntakes > 0)
                ))
                .visual(new RoleDashboardResponse.Visual("Trạng thái bàn giao", "Phân bổ hồ sơ theo trạng thái",
                        "SQL", format(s.handoverTotal), "hồ sơ", List.of(
                        datum("Chờ duyệt", s.pendingIntakes, "orange"),
                        datum("Đã tiếp nhận", s.approvedIntakes, "green"),
                        datum("Từ chối", s.rejectedIntakes, "red")
                )))
                .focus(focus("Hồ sơ cần theo dõi", "Các nhóm hồ sơ quan trọng", List.of(
                        focusItem("Gửi hồ sơ", "Lập hồ sơ bàn giao mới", "Mới", "fa-file-circle-plus", "blue", "/transfer"),
                        focusItem("Danh sách bàn giao", "Theo dõi trạng thái xử lý", format(s.handoverTotal) + " hồ sơ", "fa-folder-open", "green", "/transfer-list"),
                        focusItem("Cần bổ sung", "Hồ sơ bị yêu cầu chỉnh sửa", format(s.rejectedIntakes) + " hồ sơ", "fa-file-circle-exclamation", "red", "/transfer-list")
                )))
                .timeline(defaultTimeline("Nhịp bàn giao"))
                .actions(List.of(
                        action("Gửi hồ sơ", "Tạo bàn giao", "fa-file-arrow-up", "blue", "/transfer"),
                        action("Danh sách", "Theo dõi trạng thái", "fa-folder-open", "green", "/transfer-list"),
                        action("Lịch sử", "Tra cứu bàn giao", "fa-clock-rotate-left", "purple", "/handover-history")
                ))
                .signals(List.of(
                        signal("Hồ sơ chờ duyệt: " + s.pendingIntakes + ".", "fa-clock", s.pendingIntakes > 0 ? "orange" : "green"),
                        signal("Hồ sơ từ chối/cần bổ sung: " + s.rejectedIntakes + ".", "fa-file-circle-exclamation", s.rejectedIntakes > 0 ? "red" : "green")
                ))
                .build();
    }

    private RoleDashboardResponse commonDashboard(DashboardStats s) {
        return base("blue", "fa-chart-line", "Dashboard",
                "Xin chào", "Tổng hợp nhanh tình hình vận hành trung tâm.",
                "Tổng quan", format(s.totalPatients), "Số liệu tổng hợp từ cơ sở dữ liệu.")
                .metrics(List.of(
                        metric("Học viên", s.totalPatients, "fa-users", "blue", "Tổng hồ sơ", false),
                        metric("Đang điều trị", s.activePatients, "fa-heart-pulse", "green", "Đang theo dõi", false),
                        metric("Chờ xử lý", s.pendingIntakes + s.pendingPlans + s.pendingVisits, "fa-clock", "orange", "Hàng đợi", true),
                        metric("Hoàn thành", s.completedPatients, "fa-circle-check", "purple", "Kết thúc chương trình", false)
                ))
                .visual(stageVisual("Tổng quan giai đoạn", "Phân bổ học viên theo giai đoạn"))
                .focus(focus("Điểm cần chú ý", "Các hàng đợi toàn hệ thống", List.of(
                        focusItem("Tiếp nhận", "Hồ sơ đang chờ", format(s.pendingIntakes) + " hồ sơ", "fa-file-import", "orange", "/receive"),
                        focusItem("Phác đồ", "Chi tiết phác đồ chờ duyệt", format(s.pendingPlans) + " mục", "fa-stamp", "purple", "/treatment-approval"),
                        focusItem("Thăm gặp", "Phiếu thăm gặp chờ duyệt", format(s.pendingVisits) + " phiếu", "fa-calendar-check", "green", "/visits")
                )))
                .timeline(defaultTimeline("Nhịp vận hành"))
                .actions(List.of(
                        action("Dashboard", "Quay về tổng quan", "fa-house", "blue", "/"),
                        action("Thông báo", "Xem thông báo", "fa-bell", "orange", "/notifications"),
                        action("Hồ sơ cá nhân", "Cập nhật thông tin", "fa-user", "green", "/profile")
                ))
                .signals(List.of(
                        signal("Tổng hàng đợi hiện tại: " + (s.pendingIntakes + s.pendingPlans + s.pendingVisits) + ".", "fa-clock", "orange"),
                        signal("Học viên đã hoàn thành: " + s.completedPatients + ".", "fa-circle-check", "green")
                ))
                .build();
    }

    private DashboardBuilder base(String theme, String icon, String roleLabel, String title, String subtitle,
                                  String commandLabel, String commandValue, String commandText) {
        return new DashboardBuilder(theme, icon, roleLabel, title, subtitle, commandLabel, commandValue, commandText);
    }

    private RoleDashboardResponse.Visual stageVisual(String title, String subtitle) {
        List<RoleDashboardResponse.ChartDatum> stages = stageData();
        long total = stages.stream().mapToLong(RoleDashboardResponse.ChartDatum::value).sum();
        return new RoleDashboardResponse.Visual(title, subtitle, "SQL", format(total), "học viên", stages);
    }

    private List<RoleDashboardResponse.ChartDatum> stageData() {
        try {
            List<RoleDashboardResponse.ChartDatum> rows = jdbcTemplate.query("""
                    SELECT COALESCE(g.TenGiaiDoan, N'Chưa phân giai đoạn') AS label, COUNT(*) AS value
                    FROM NguoiCaiNghien n
                    LEFT JOIN DanhMucGiaiDoan g ON g.MaGiaiDoan = n.MaGiaiDoanHienTai
                    WHERE n.TrangThai IN ('DANG_KHAM_SUC_KHOE', 'DANG_CAI_NGHIEN')
                    GROUP BY COALESCE(g.TenGiaiDoan, N'Chưa phân giai đoạn')
                    ORDER BY MIN(COALESCE(g.ThuTu, 99))
                    """, (rs, rowNum) -> datum(rs.getString("label"), rs.getLong("value"), toneByIndex(rowNum)));
            if (!rows.isEmpty()) {
                return rows;
            }
        } catch (Exception ignored) {
        }

        return List.of(
                datum("Giai đoạn 1 - Cắt cơn", 0, "blue"),
                datum("Giai đoạn 2 - Phục hồi", 0, "green"),
                datum("Giai đoạn 3 - Tái hòa nhập", 0, "purple")
        );
    }

    private RoleDashboardResponse.Visual attendanceVisual(DashboardStats s) {
        return new RoleDashboardResponse.Visual("Điểm danh hôm nay", "Tình trạng tham gia hoạt động",
                "SQL", format(s.presentAttendances), "có mặt", List.of(
                datum("Có mặt", s.presentAttendances, "green"),
                datum("Vắng/trễ", s.absentAttendances, "red"),
                datum("Chưa ghi nhận", Math.max(s.activePatients - s.presentAttendances - s.absentAttendances, 0), "orange")
        ));
    }

    private RoleDashboardResponse.Metric metric(String label, long value, String icon, String tone, String trend, boolean warn) {
        return new RoleDashboardResponse.Metric(label, format(value), icon, tone, trend, warn);
    }

    private RoleDashboardResponse.Metric metricText(String label, String value, String icon, String tone, String trend, boolean warn) {
        return new RoleDashboardResponse.Metric(label, value, icon, tone, trend, warn);
    }

    private RoleDashboardResponse.ChartDatum datum(String label, long value, String tone) {
        return new RoleDashboardResponse.ChartDatum(label, value, tone, null);
    }

    private RoleDashboardResponse.Focus focus(String title, String subtitle, List<RoleDashboardResponse.FocusItem> items) {
        return new RoleDashboardResponse.Focus(title, subtitle, items);
    }

    private RoleDashboardResponse.FocusItem focusItem(String title, String text, String meta, String icon, String tone, String route) {
        return new RoleDashboardResponse.FocusItem(title, text, meta, icon, tone, route);
    }

    private RoleDashboardResponse.Timeline defaultTimeline(String title) {
        return new RoleDashboardResponse.Timeline(title, "Cập nhật tự động từ dữ liệu vận hành", List.of(
                new RoleDashboardResponse.TimelineItem("08:00", "Rà soát hàng đợi", "Kiểm tra hồ sơ cần xử lý trong ngày"),
                new RoleDashboardResponse.TimelineItem("10:30", "Cập nhật điều trị", "Đồng bộ bệnh án, phác đồ và giai đoạn"),
                new RoleDashboardResponse.TimelineItem("15:00", "Tổng hợp báo cáo", "Theo dõi trạng thái cuối ngày")
        ));
    }

    private RoleDashboardResponse.Action action(String label, String text, String icon, String tone, String route) {
        return new RoleDashboardResponse.Action(label, text, icon, tone, route);
    }

    private RoleDashboardResponse.Signal signal(String text, String icon, String tone) {
        return new RoleDashboardResponse.Signal(text, icon, tone);
    }

    private long count(String sql, Object... args) {
        try {
            Long result = jdbcTemplate.queryForObject(sql, Long.class, args);
            return result != null ? result : 0;
        } catch (Exception ignored) {
            return 0;
        }
    }

    private String pct(long value, long total) {
        if (total <= 0) {
            return "0%";
        }
        return Math.round((value * 100.0) / total) + "%";
    }

    private String format(long value) {
        return String.format(Locale.US, "%,d", value);
    }

    private String toneByIndex(int index) {
        return switch (index % 5) {
            case 0 -> "blue";
            case 1 -> "green";
            case 2 -> "purple";
            case 3 -> "orange";
            default -> "cyan";
        };
    }

    private String normalizeRole(String role) {
        return role == null ? "common" : role.trim().toLowerCase(Locale.ROOT);
    }

    private record DashboardStats(
            long totalPatients,
            long activePatients,
            long completedPatients,
            long pausedPatients,
            long pendingIntakes,
            long approvedIntakes,
            long rejectedIntakes,
            long pendingPlans,
            long approvedPlans,
            long rejectedPlans,
            long pendingStageProposals,
            long pendingCompletionProposals,
            long approvedProposals,
            long rejectedProposals,
            long pendingVisits,
            long approvedVisits,
            long completedVisits,
            long todayActivities,
            long presentAttendances,
            long absentAttendances,
            long totalUsers,
            long activeUsers,
            long lockedUsers,
            long totalRoles,
            long activeStaff,
            long activeDoctors,
            long medicalRecords,
            long activeMedicineSchedules,
            long todayCounseling,
            long pendingSupport,
            long handoverTotal
    ) {}

    private static final class DashboardBuilder {
        private final String theme;
        private final String icon;
        private final String roleLabel;
        private final String title;
        private final String subtitle;
        private final String commandLabel;
        private final String commandValue;
        private final String commandText;
        private List<RoleDashboardResponse.Metric> metrics = List.of();
        private RoleDashboardResponse.Visual visual;
        private RoleDashboardResponse.Focus focus;
        private RoleDashboardResponse.Timeline timeline;
        private List<RoleDashboardResponse.Action> actions = List.of();
        private List<RoleDashboardResponse.Signal> signals = List.of();

        private DashboardBuilder(String theme, String icon, String roleLabel, String title, String subtitle,
                                 String commandLabel, String commandValue, String commandText) {
            this.theme = theme;
            this.icon = icon;
            this.roleLabel = roleLabel;
            this.title = title;
            this.subtitle = subtitle;
            this.commandLabel = commandLabel;
            this.commandValue = commandValue;
            this.commandText = commandText;
        }

        private DashboardBuilder metrics(List<RoleDashboardResponse.Metric> metrics) {
            this.metrics = metrics;
            return this;
        }

        private DashboardBuilder visual(RoleDashboardResponse.Visual visual) {
            this.visual = visual;
            return this;
        }

        private DashboardBuilder focus(RoleDashboardResponse.Focus focus) {
            this.focus = focus;
            return this;
        }

        private DashboardBuilder timeline(RoleDashboardResponse.Timeline timeline) {
            this.timeline = timeline;
            return this;
        }

        private DashboardBuilder actions(List<RoleDashboardResponse.Action> actions) {
            this.actions = actions;
            return this;
        }

        private DashboardBuilder signals(List<RoleDashboardResponse.Signal> signals) {
            this.signals = signals;
            return this;
        }

        private RoleDashboardResponse build() {
            return new RoleDashboardResponse(
                    theme, icon, roleLabel, title, null, subtitle, commandLabel, commandValue, commandText,
                    metrics, visual, focus, timeline, actions, signals
            );
        }
    }
}
