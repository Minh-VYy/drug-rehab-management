/* ============================================================
   07 - SEED API TEST DATA FULL
   Database: rehab_center_db
   Mục tiêu:
   - Dữ liệu đủ dày để test giao diện gọi API thật.
   - Có dữ liệu cho Leader, Manager, Doctor, Admin, Staff, Family, Police.
   - Có link ảnh / link file mẫu.
   - Script có thể chạy lại, dùng mã API* để tránh trùng dữ liệu cũ.
   ============================================================ */

USE rehab_center_db;
SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
BEGIN TRAN;

/* ============================================================
   1. VAI TRO
   ============================================================ */
DECLARE @NextRoleId INT;

IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'ADMIN')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'ADMIN', N'Quản trị hệ thống');
END;

IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'LEADER')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'LEADER', N'Người lãnh đạo trung tâm');
END;

IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'MANAGER')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'MANAGER', N'Cán bộ quản lý');
END;

IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'DOCTOR')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'DOCTOR', N'Cán bộ phụ trách / Bác sĩ');
END;

IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'STAFF')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'STAFF', N'Cán bộ trung tâm / Nhân viên');
END;

IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'POLICE')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'POLICE', N'Cán bộ quản lý hồ sơ / Công an');
END;

IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'FAMILY')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'FAMILY', N'Người thân của người cai nghiện');
END;

DECLARE @RoleAdmin INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'ADMIN');
DECLARE @RoleLeader INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'LEADER');
DECLARE @RoleManager INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'MANAGER');
DECLARE @RoleDoctor INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'DOCTOR');
DECLARE @RoleStaff INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'STAFF');
DECLARE @RolePolice INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'POLICE');
DECLARE @RoleFamily INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'FAMILY');

/* ============================================================
   2. NGUOI DUNG + NHAN SU + CONG AN
   Mật khẩu demo: 123456
   ============================================================ */
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'admin_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('admin_api', '123456', N'Quản trị viên API', '0901000001', 'admin.api@rehab.vn', @RoleAdmin, 'DANG_HOAT_DONG');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'leader_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('leader_api', '123456', N'Nguyễn Minh Hoàng', '0901000002', 'leader.api@rehab.vn', @RoleLeader, 'DANG_HOAT_DONG');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'manager_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('manager_api', '123456', N'Trần Đại Nghĩa', '0901000003', 'manager.api@rehab.vn', @RoleManager, 'DANG_HOAT_DONG');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'doctor_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('doctor_api', '123456', N'BS. Mai Hoàng Yến', '0901000004', 'doctor.api@rehab.vn', @RoleDoctor, 'DANG_HOAT_DONG');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'doctor2_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('doctor2_api', '123456', N'BS. Lê Văn Hải', '0901000005', 'doctor2.api@rehab.vn', @RoleDoctor, 'DANG_HOAT_DONG');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'staff_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('staff_api', '123456', N'CB. Lê Thị Hồng', '0901000006', 'staff.api@rehab.vn', @RoleStaff, 'DANG_HOAT_DONG');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'staff2_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('staff2_api', '123456', N'CB. Phạm Quốc Bảo', '0901000007', 'staff2.api@rehab.vn', @RoleStaff, 'DANG_HOAT_DONG');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'police_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('police_api', '123456', N'Đại úy Nguyễn Văn An', '0901000008', 'police.api@danang.gov.vn', @RolePolice, 'DANG_HOAT_DONG');

IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'NS_ADM01')
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu)
    VALUES ('NS_ADM01', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'admin_api'), 'DANG_LAM_VIEC', N'Quản trị hệ thống');

IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'NS_LD001')
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu)
    VALUES ('NS_LD001', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'leader_api'), 'DANG_LAM_VIEC', N'Lãnh đạo trung tâm');

IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'NS_QL001')
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu)
    VALUES ('NS_QL001', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'manager_api'), 'DANG_LAM_VIEC', N'Cán bộ quản lý');

IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'NS_BS001')
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu)
    VALUES ('NS_BS001', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'doctor_api'), 'DANG_LAM_VIEC', N'Bác sĩ điều trị');

IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'NS_BS002')
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu)
    VALUES ('NS_BS002', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'doctor2_api'), 'DANG_LAM_VIEC', N'Bác sĩ tâm lý');

IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'NS_STF01')
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu)
    VALUES ('NS_STF01', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'staff_api'), 'DANG_LAM_VIEC', N'Nhân viên tiếp nhận');

IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'NS_STF02')
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu)
    VALUES ('NS_STF02', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'staff2_api'), 'TAM_NGHI', N'Nhân viên hành chính');

IF NOT EXISTS (SELECT 1 FROM CanBoQuanLyHoSo WHERE MaCanBoCongAn = 'CA_API01')
    INSERT INTO CanBoQuanLyHoSo (MaCanBoCongAn, MaNguoiDung, HoTen, SoHieuCAND, DonViCongTac, SoDienThoai)
    VALUES ('CA_API01', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'police_api'), N'Đại úy Nguyễn Văn An', 'CAND-API01', N'Đội Cảnh sát điều tra tội phạm về ma túy - Công an quận Hải Châu', '0901000008');

/* ============================================================
   3. DANH MUC
   ============================================================ */
IF NOT EXISTS (SELECT 1 FROM DanhMucGiaiDoan WHERE MaGiaiDoan = 'GD001')
    INSERT INTO DanhMucGiaiDoan (MaGiaiDoan, TenGiaiDoan, ThuTu, MoTa)
    VALUES ('GD001', N'Tiếp nhận và đánh giá ban đầu', 1, N'Khám sức khỏe, đánh giá tình trạng nghiện và lập hồ sơ ban đầu');

IF NOT EXISTS (SELECT 1 FROM DanhMucGiaiDoan WHERE MaGiaiDoan = 'GD002')
    INSERT INTO DanhMucGiaiDoan (MaGiaiDoan, TenGiaiDoan, ThuTu, MoTa)
    VALUES ('GD002', N'Cắt cơn và điều trị y tế', 2, N'Theo dõi cắt cơn, dùng thuốc hỗ trợ và ổn định sức khỏe');

IF NOT EXISTS (SELECT 1 FROM DanhMucGiaiDoan WHERE MaGiaiDoan = 'GD003')
    INSERT INTO DanhMucGiaiDoan (MaGiaiDoan, TenGiaiDoan, ThuTu, MoTa)
    VALUES ('GD003', N'Phục hồi hành vi và tâm lý', 3, N'Tư vấn tâm lý, lao động trị liệu, giáo dục kỹ năng sống');

IF NOT EXISTS (SELECT 1 FROM DanhMucGiaiDoan WHERE MaGiaiDoan = 'GD004')
    INSERT INTO DanhMucGiaiDoan (MaGiaiDoan, TenGiaiDoan, ThuTu, MoTa)
    VALUES ('GD004', N'Tái hòa nhập cộng đồng', 4, N'Chuẩn bị ra trại, kết nối gia đình và cộng đồng');

IF NOT EXISTS (SELECT 1 FROM DanhMucThuoc WHERE MaThuoc = 'THAPI001')
    INSERT INTO DanhMucThuoc (MaThuoc, TenThuoc, DonViTinh, SoLuong, GhiChu) VALUES
    ('THAPI001', N'Methadone', N'Chai', 120, N'Dùng theo chỉ định điều trị thay thế'),
    ('THAPI002', N'Vitamin B1', N'Viên', 300, N'Hỗ trợ thần kinh'),
    ('THAPI003', N'Paracetamol 500mg', N'Viên', 500, N'Hạ sốt, giảm đau'),
    ('THAPI004', N'Oresol', N'Gói', 200, N'Bù nước và điện giải'),
    ('THAPI005', N'Diazepam', N'Viên', 80, N'Sử dụng khi có chỉ định bác sĩ');

IF NOT EXISTS (SELECT 1 FROM DanhMucHoatDong WHERE MaHoatDong = 'HDAPI001')
    INSERT INTO DanhMucHoatDong (MaHoatDong, TenHoatDong, LoaiHoatDong, ThoiGian, MoTa) VALUES
    ('HDAPI001', N'Tư vấn nhóm buổi sáng', N'TRI_LIEU', CAST(GETDATE() AS DATE), N'Chia sẻ cảm xúc, nhận diện nguy cơ tái nghiện'),
    ('HDAPI002', N'Lao động trị liệu vườn rau', N'LAO_DONG', CAST(GETDATE() AS DATE), N'Rèn luyện thói quen sinh hoạt tích cực'),
    ('HDAPI003', N'Lớp kỹ năng kiểm soát cơn thèm', N'HOC_TAP', DATEADD(day, 1, CAST(GETDATE() AS DATE)), N'Học kỹ năng đối phó khi có cơn thèm'),
    ('HDAPI004', N'Bóng chuyền phục hồi thể lực', N'THE_THAO', DATEADD(day, 1, CAST(GETDATE() AS DATE)), N'Tăng vận động và tinh thần tập thể'),
    ('HDAPI005', N'Sinh hoạt nội quy cuối tuần', N'SINH_HOAT', DATEADD(day, 2, CAST(GETDATE() AS DATE)), N'Ôn lại quy định và kế hoạch tuần mới');

/* ============================================================
   4. NGUOI THAN
   ============================================================ */
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'family1_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('family1_api', '123456', N'Nguyễn Thị Lan', '0912000001', 'lan.nt@example.com', @RoleFamily, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiThan WHERE SoCCCD = '048200000001')
    INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi, NgheNghiep, AnhChanDung)
    VALUES ((SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family1_api'), '048200000001', '2020-01-10', N'Cục CSQLHC về TTXH', N'Quận Hải Châu, Đà Nẵng', N'Kinh doanh tự do', 'https://picsum.photos/seed/family1/320/320');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'family2_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('family2_api', '123456', N'Lê Văn Sang', '0912000002', 'sang.lv@example.com', @RoleFamily, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiThan WHERE SoCCCD = '048200000002')
    INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi, NgheNghiep, AnhChanDung)
    VALUES ((SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family2_api'), '048200000002', '2019-05-22', N'Cục CSQLHC về TTXH', N'Quận Thanh Khê, Đà Nẵng', N'Công nhân', 'https://picsum.photos/seed/family2/320/320');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'family3_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('family3_api', '123456', N'Phạm Văn Sơn', '0912000003', 'son.pv@example.com', @RoleFamily, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiThan WHERE SoCCCD = '048200000003')
    INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi, NgheNghiep, AnhChanDung)
    VALUES ((SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family3_api'), '048200000003', '2018-03-15', N'Cục CSQLHC về TTXH', N'Quận Sơn Trà, Đà Nẵng', N'Lái xe', 'https://picsum.photos/seed/family3/320/320');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'family4_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('family4_api', '123456', N'Hoàng Thị Mai', '0912000004', 'mai.ht@example.com', @RoleFamily, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiThan WHERE SoCCCD = '048200000004')
    INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi, NgheNghiep, AnhChanDung)
    VALUES ((SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family4_api'), '048200000004', '2021-07-01', N'Cục CSQLHC về TTXH', N'Quận Liên Chiểu, Đà Nẵng', N'Giáo viên', 'https://picsum.photos/seed/family4/320/320');

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'family5_api')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('family5_api', '123456', N'Võ Thanh Bình', '0912000005', 'binh.vt@example.com', @RoleFamily, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiThan WHERE SoCCCD = '048200000005')
    INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi, NgheNghiep, AnhChanDung)
    VALUES ((SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family5_api'), '048200000005', '2022-09-12', N'Cục CSQLHC về TTXH', N'Quận Cẩm Lệ, Đà Nẵng', N'Nhân viên văn phòng', 'https://picsum.photos/seed/family5/320/320');

DECLARE @NT1 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048200000001');
DECLARE @NT2 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048200000002');
DECLARE @NT3 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048200000003');
DECLARE @NT4 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048200000004');
DECLARE @NT5 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048200000005');

/* ============================================================
   5. DON TU NGUYEN + HO SO BAN GIAO
   ============================================================ */
IF NOT EXISTS (SELECT 1 FROM DonDangKyTuNguyen WHERE SoCCCDNguoiCaiNghien = '048211111101')
    INSERT INTO DonDangKyTuNguyen (MaNguoiThan, HoTenNguoiCaiNghien, NgaySinhNguoiCaiNghien, DiaChiThuongTru, SoCCCDNguoiCaiNghien, QuanHeVoiNguoiCaiNghien, LoaiMaTuySuDung, BieuHienLamSang, TepCCCDMatTruoc, TepCCCDMatSau, NgayGuiDon, TrangThai, MaNhanSu)
    VALUES (@NT1, N'Nguyễn Văn Khoa', '1997-04-12', N'Quận Hải Châu, Đà Nẵng', '048211111101', N'Con', N'MA_TUY_DA', N'Mất ngủ, lo âu, bỏ bữa, có biểu hiện kích động', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', DATEADD(day, -40, GETDATE()), 'DA_NHAP_TRAI', 'NS_STF01');

IF NOT EXISTS (SELECT 1 FROM DonDangKyTuNguyen WHERE SoCCCDNguoiCaiNghien = '048211111102')
    INSERT INTO DonDangKyTuNguyen (MaNguoiThan, HoTenNguoiCaiNghien, NgaySinhNguoiCaiNghien, DiaChiThuongTru, SoCCCDNguoiCaiNghien, QuanHeVoiNguoiCaiNghien, LoaiMaTuySuDung, BieuHienLamSang, TepCCCDMatTruoc, TepCCCDMatSau, NgayGuiDon, TrangThai, MaNhanSu)
    VALUES (@NT2, N'Lê Minh Tâm', '1995-09-20', N'Quận Thanh Khê, Đà Nẵng', '048211111102', N'Em trai', N'HEROIN', N'Sụt cân, mệt mỏi, thường xuyên vắng nhà', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', DATEADD(day, -28, GETDATE()), 'DA_TIEP_NHAN', 'NS_STF01');

IF NOT EXISTS (SELECT 1 FROM DonDangKyTuNguyen WHERE SoCCCDNguoiCaiNghien = '048211111103')
    INSERT INTO DonDangKyTuNguyen (MaNguoiThan, HoTenNguoiCaiNghien, NgaySinhNguoiCaiNghien, DiaChiThuongTru, SoCCCDNguoiCaiNghien, QuanHeVoiNguoiCaiNghien, LoaiMaTuySuDung, BieuHienLamSang, TepCCCDMatTruoc, TepCCCDMatSau, NgayGuiDon, TrangThai, MaNhanSu)
    VALUES (@NT3, N'Phạm Quốc Huy', '2000-11-05', N'Quận Sơn Trà, Đà Nẵng', '048211111103', N'Cháu', N'CAN_SA', N'Hay cáu gắt, học tập giảm sút, giao tiếp kém', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', DATEADD(day, -5, GETDATE()), 'CHO_DUYET', NULL);

IF NOT EXISTS (SELECT 1 FROM HoSoBanGiao WHERE MaHoSoBanGiao = 'HSBGAPI001')
    INSERT INTO HoSoBanGiao (MaHoSoBanGiao, MaCanBoCongAn, HoTenDoiTuong, CCCD, NgaySinh, QueQuan, NoiO_HienTai, HoTenNguoiThan, SdtNguoiThan, QuanHeVoiDoiTuong, HanhViViPham, FileQuyetDinh, TrangThaiDuyet, MaNhanSuDuyet, NgayDuyet, MaCBQL)
    VALUES
    ('HSBGAPI001', N'CA_API01', N'Trần Tuấn Kiệt', '048211111201', '1996-05-10', N'Đà Nẵng', N'Quận Hải Châu, Đà Nẵng', N'Trần Văn Hùng', '0912222201', N'Bố', N'Sử dụng trái phép chất ma túy tại cơ sở kinh doanh karaoke', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01'),
    ('HSBGAPI002', N'CA_API01', N'Lê Thị Thu', '048211111202', '1998-08-20', N'Đà Nẵng', N'Quận Thanh Khê, Đà Nẵng', N'Lê Văn Sang', '0912222202', N'Anh trai', N'Bị phát hiện tàng trữ và sử dụng ma túy đá', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -20, GETDATE()), 'CA_API01'),
    ('HSBGAPI003', N'CA_API01', N'Phạm Minh Chí', '048211111203', '2001-12-05', N'Quảng Nam', N'Quận Sơn Trà, Đà Nẵng', N'Phạm Khắc Tùng', '0912222203', N'Bố', N'Gây rối trật tự công cộng sau khi sử dụng chất kích thích', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -15, GETDATE()), 'CA_API01'),
    ('HSBGAPI004', N'CA_API01', N'Hoàng Văn Nam', '048211111204', '1994-01-15', N'Thừa Thiên Huế', N'Quận Liên Chiểu, Đà Nẵng', N'Hoàng Thị Mai', '0912222204', N'Chị gái', N'Hồ sơ chưa đủ giấy tờ xét nghiệm y tế', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'TuChoi', 'NS_LD001', DATEADD(day, -10, GETDATE()), 'CA_API01'),
    ('HSBGAPI005', N'CA_API01', N'Võ Anh Dũng', '048211111205', '1992-03-18', N'Đà Nẵng', N'Quận Cẩm Lệ, Đà Nẵng', N'Võ Thanh Bình', '0912222205', N'Anh trai', N'Tái sử dụng chất gây nghiện sau cai nghiện tại gia đình', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01');

/* ============================================================
   6. NGUOI CAI NGHIEN
   ============================================================ */
DECLARE @DonKhoa INT = (SELECT MaDonTuNguyen FROM DonDangKyTuNguyen WHERE SoCCCDNguoiCaiNghien = '048211111101');
DECLARE @DonTam INT = (SELECT MaDonTuNguyen FROM DonDangKyTuNguyen WHERE SoCCCDNguoiCaiNghien = '048211111102');

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCNAPI001')
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaDonTuNguyen, MaHoSoBanGiao, MaNguoiThan, HoTen, CCCD, NgayVaoTrai, MaGiaiDoanHienTai, TrangThai)
    VALUES ('NCNAPI001', @DonKhoa, NULL, @NT1, N'Nguyễn Văn Khoa', '048211111101', DATEADD(day, -35, GETDATE()), 'GD002', 'DANG_CAI_NGHIEN');

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCNAPI002')
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaDonTuNguyen, MaHoSoBanGiao, MaNguoiThan, HoTen, CCCD, NgayVaoTrai, MaGiaiDoanHienTai, TrangThai)
    VALUES ('NCNAPI002', @DonTam, NULL, @NT2, N'Lê Minh Tâm', '048211111102', DATEADD(day, -22, GETDATE()), 'GD001', 'DANG_CAI_NGHIEN');

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCNAPI003')
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaDonTuNguyen, MaHoSoBanGiao, MaNguoiThan, HoTen, CCCD, NgayVaoTrai, MaGiaiDoanHienTai, TrangThai)
    VALUES ('NCNAPI003', NULL, 'HSBGAPI002', @NT2, N'Lê Thị Thu', '048211111202', DATEADD(day, -20, GETDATE()), 'GD002', 'DANG_CAI_NGHIEN');

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCNAPI004')
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaDonTuNguyen, MaHoSoBanGiao, MaNguoiThan, HoTen, CCCD, NgayVaoTrai, MaGiaiDoanHienTai, TrangThai)
    VALUES ('NCNAPI004', NULL, 'HSBGAPI003', @NT3, N'Phạm Minh Chí', '048211111203', DATEADD(day, -15, GETDATE()), 'GD001', 'DANG_KHAM_SUC_KHOE');

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCNAPI005')
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaDonTuNguyen, MaHoSoBanGiao, MaNguoiThan, HoTen, CCCD, NgayVaoTrai, MaGiaiDoanHienTai, TrangThai)
    VALUES ('NCNAPI005', NULL, 'HSBGAPI002', @NT4, N'Trần Tuấn Kiệt', '048211111206', DATEADD(day, -100, GETDATE()), 'GD004', 'DA_HOAN_THANH');

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCNAPI006')
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaDonTuNguyen, MaHoSoBanGiao, MaNguoiThan, HoTen, CCCD, NgayVaoTrai, MaGiaiDoanHienTai, TrangThai)
    VALUES ('NCNAPI006', NULL, 'HSBGAPI003', @NT5, N'Võ Anh Dũng', '048211111207', DATEADD(day, -60, GETDATE()), 'GD003', 'DANG_CAI_NGHIEN');

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCNAPI007')
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaDonTuNguyen, MaHoSoBanGiao, MaNguoiThan, HoTen, CCCD, NgayVaoTrai, MaGiaiDoanHienTai, TrangThai)
    VALUES ('NCNAPI007', @DonKhoa, NULL, @NT1, N'Đỗ Quốc Việt', '048211111108', DATEADD(day, -12, GETDATE()), 'GD001', 'TAM_NGUNG_DIEU_TRI');

/* ============================================================
   7. PHAN CONG - BENH AN - PHAC DO
   ============================================================ */
IF NOT EXISTS (SELECT 1 FROM PhanCongPhuTrach WHERE MaPhanCong = 'PCAPI001')
    INSERT INTO PhanCongPhuTrach (MaPhanCong, MaNguoiCaiNghien, MaBacSi, MaQuanLy, NgayBatDau, NgayKetThuc, TrangThai) VALUES
    ('PCAPI001', 'NCNAPI001', 'NS_BS001', 'NS_QL001', DATEADD(day, -35, CAST(GETDATE() AS DATE)), DATEADD(day, 60, CAST(GETDATE() AS DATE)), 'DANG_PHU_TRACH'),
    ('PCAPI002', 'NCNAPI002', 'NS_BS001', 'NS_QL001', DATEADD(day, -22, CAST(GETDATE() AS DATE)), DATEADD(day, 80, CAST(GETDATE() AS DATE)), 'DANG_PHU_TRACH'),
    ('PCAPI003', 'NCNAPI003', 'NS_BS002', 'NS_QL001', DATEADD(day, -20, CAST(GETDATE() AS DATE)), DATEADD(day, 90, CAST(GETDATE() AS DATE)), 'DANG_PHU_TRACH'),
    ('PCAPI004', 'NCNAPI004', 'NS_BS001', 'NS_QL001', DATEADD(day, -15, CAST(GETDATE() AS DATE)), DATEADD(day, 120, CAST(GETDATE() AS DATE)), 'DANG_PHU_TRACH'),
    ('PCAPI005', 'NCNAPI005', 'NS_BS002', 'NS_QL001', DATEADD(day, -100, CAST(GETDATE() AS DATE)), DATEADD(day, -2, CAST(GETDATE() AS DATE)), 'DA_KET_THUC'),
    ('PCAPI006', 'NCNAPI006', 'NS_BS001', 'NS_QL001', DATEADD(day, -60, CAST(GETDATE() AS DATE)), DATEADD(day, 40, CAST(GETDATE() AS DATE)), 'DANG_PHU_TRACH'),
    ('PCAPI007', 'NCNAPI007', 'NS_BS001', 'NS_QL001', DATEADD(day, -12, CAST(GETDATE() AS DATE)), DATEADD(day, 110, CAST(GETDATE() AS DATE)), 'TAM_NGUNG');

IF NOT EXISTS (SELECT 1 FROM HoSoBenhAn WHERE MaBenhAn = 'BAAPI001')
    INSERT INTO HoSoBenhAn (MaBenhAn, MaNguoiCaiNghien, MaBacSi, TienSuBenh, DiUng, ChieuCao, CanNang, NhomMau, NgayLap, NgayCapNhatCuoi) VALUES
    ('BAAPI001', 'NCNAPI001', 'NS_BS001', N'Tiền sử mất ngủ kéo dài, viêm dạ dày nhẹ', N'Không ghi nhận', 170.50, 62.30, 'O+', DATEADD(day, -34, GETDATE()), DATEADD(day, -1, GETDATE())),
    ('BAAPI002', 'NCNAPI002', 'NS_BS001', N'Từng điều trị rối loạn lo âu', N'Dị ứng hải sản', 166.00, 55.20, 'A+', DATEADD(day, -21, GETDATE()), DATEADD(day, -3, GETDATE())),
    ('BAAPI003', 'NCNAPI003', 'NS_BS002', N'Suy nhược cơ thể, thiếu máu nhẹ', N'Penicillin', 158.00, 48.50, 'B+', DATEADD(day, -19, GETDATE()), DATEADD(day, -2, GETDATE())),
    ('BAAPI004', 'NCNAPI004', 'NS_BS001', N'Tăng huyết áp nhẹ, tiền sử sử dụng chất kích thích', N'Không ghi nhận', 172.00, 68.00, 'AB+', DATEADD(day, -14, GETDATE()), DATEADD(day, -1, GETDATE())),
    ('BAAPI005', 'NCNAPI005', 'NS_BS002', N'Đã hoàn thành điều trị, sức khỏe ổn định', N'Không ghi nhận', 169.00, 64.00, 'O-', DATEADD(day, -98, GETDATE()), DATEADD(day, -2, GETDATE())),
    ('BAAPI006', 'NCNAPI006', 'NS_BS001', N'Thể trạng yếu sau giai đoạn cắt cơn', N'Dị ứng bụi', 175.00, 70.00, 'A-', DATEADD(day, -59, GETDATE()), DATEADD(day, -4, GETDATE())),
    ('BAAPI007', 'NCNAPI007', 'NS_BS001', N'Cần theo dõi tâm lý, có biểu hiện né tránh giao tiếp', N'Không ghi nhận', 168.00, 59.00, 'B-', DATEADD(day, -11, GETDATE()), GETDATE());

IF NOT EXISTS (SELECT 1 FROM PhacDoDieuTri WHERE MaPhacDoDT = 'PDAPI001')
    INSERT INTO PhacDoDieuTri (MaPhacDoDT, MaBenhAn, MaBacSi, LoaiMaTuy, TrangThai, NgayLap, GhiChu) VALUES
    ('PDAPI001', 'BAAPI001', 'NS_BS001', 'MA_TUY_DA', 'DANG_AP_DUNG', DATEADD(day, -30, GETDATE()), N'Phác đồ điều trị cắt cơn và phục hồi hành vi'),
    ('PDAPI002', 'BAAPI002', 'NS_BS001', 'HEROIN', 'DANG_AP_DUNG', DATEADD(day, -20, GETDATE()), N'Kết hợp điều trị y tế và tư vấn tâm lý'),
    ('PDAPI003', 'BAAPI003', 'NS_BS002', 'CAN_SA', 'BAN_NHAP', DATEADD(day, -18, GETDATE()), N'Đang chờ hoàn thiện chi tiết giai đoạn'),
    ('PDAPI004', 'BAAPI004', 'NS_BS001', 'MA_TUY_DA', 'DANG_AP_DUNG', DATEADD(day, -12, GETDATE()), N'Ưu tiên ổn định sức khỏe ban đầu'),
    ('PDAPI005', 'BAAPI005', 'NS_BS002', 'KETAMINE', 'DA_HOAN_THANH', DATEADD(day, -95, GETDATE()), N'Đã hoàn thành chương trình'),
    ('PDAPI006', 'BAAPI006', 'NS_BS001', 'KHAC', 'DANG_AP_DUNG', DATEADD(day, -58, GETDATE()), N'Theo dõi sức khỏe tổng quát');

IF NOT EXISTS (SELECT 1 FROM ChiTietPhacDoDieuTri WHERE MaChiTietPhacDo = 'CTPDAPI001')
    INSERT INTO ChiTietPhacDoDieuTri (MaChiTietPhacDo, MaPhacDoDT, MaGiaiDoan, ThuTu, NoiDungPhacDoDT, MucTieu, NgayBatDau, NgayKetThucDuKien, TrangThai, MaQuanLy, NgayPheDuyet, GhiChuPheDuyet) VALUES
    ('CTPDAPI001', 'PDAPI001', 'GD001', 1, N'Khám tổng quát, xét nghiệm, đánh giá mức độ phụ thuộc', N'Hoàn thiện hồ sơ ban đầu', DATEADD(day, -30, CAST(GETDATE() AS DATE)), DATEADD(day, -20, CAST(GETDATE() AS DATE)), 'DA_HOAN_THANH', 'NS_QL001', DATEADD(day, -30, GETDATE()), N'Đã duyệt'),
    ('CTPDAPI002', 'PDAPI001', 'GD002', 2, N'Theo dõi cắt cơn, hỗ trợ giấc ngủ, dinh dưỡng', N'Ổn định thể chất', DATEADD(day, -19, CAST(GETDATE() AS DATE)), DATEADD(day, 10, CAST(GETDATE() AS DATE)), 'DANG_AP_DUNG', 'NS_QL001', DATEADD(day, -19, GETDATE()), N'Đã duyệt'),
    ('CTPDAPI003', 'PDAPI002', 'GD001', 1, N'Đánh giá tình trạng phụ thuộc Heroin', N'Xác định hướng điều trị thay thế', DATEADD(day, -20, CAST(GETDATE() AS DATE)), DATEADD(day, -12, CAST(GETDATE() AS DATE)), 'DA_HOAN_THANH', 'NS_QL001', DATEADD(day, -20, GETDATE()), N'Đã duyệt'),
    ('CTPDAPI004', 'PDAPI002', 'GD002', 2, N'Dùng thuốc theo dõi và tư vấn cá nhân', N'Giảm triệu chứng cai', DATEADD(day, -11, CAST(GETDATE() AS DATE)), DATEADD(day, 25, CAST(GETDATE() AS DATE)), 'CHO_PHE_DUYET', NULL, NULL, NULL),
    ('CTPDAPI005', 'PDAPI003', 'GD001', 1, N'Lập hồ sơ đánh giá ban đầu', N'Kiểm tra sức khỏe', DATEADD(day, -18, CAST(GETDATE() AS DATE)), DATEADD(day, -8, CAST(GETDATE() AS DATE)), 'TU_CHOI', 'NS_QL001', DATEADD(day, -17, GETDATE()), N'Cần bổ sung mục tiêu chi tiết hơn'),
    ('CTPDAPI006', 'PDAPI004', 'GD002', 1, N'Điều trị triệu chứng kích động và mất ngủ', N'Ổn định tinh thần', DATEADD(day, -10, CAST(GETDATE() AS DATE)), DATEADD(day, 20, CAST(GETDATE() AS DATE)), 'CHO_PHE_DUYET', NULL, NULL, NULL),
    ('CTPDAPI007', 'PDAPI005', 'GD004', 4, N'Chuẩn bị tái hòa nhập, đánh giá cuối kỳ', N'Hoàn thành cai nghiện', DATEADD(day, -15, CAST(GETDATE() AS DATE)), DATEADD(day, -2, CAST(GETDATE() AS DATE)), 'DA_HOAN_THANH', 'NS_QL001', DATEADD(day, -14, GETDATE()), N'Đạt yêu cầu'),
    ('CTPDAPI008', 'PDAPI006', 'GD003', 3, N'Tư vấn tâm lý nhóm và hoạt động trị liệu', N'Cải thiện hành vi xã hội', DATEADD(day, -30, CAST(GETDATE() AS DATE)), DATEADD(day, 15, CAST(GETDATE() AS DATE)), 'DANG_AP_DUNG', 'NS_QL001', DATEADD(day, -29, GETDATE()), N'Đã duyệt');

/* ============================================================
   8. NHAT KY DIEU TRI + DE XUAT
   ============================================================ */
IF NOT EXISTS (SELECT 1 FROM NhatKyDieuTri WHERE MaNhatKy = 'NKAPI001')
    INSERT INTO NhatKyDieuTri (MaNhatKy, MaBenhAn, MaBacSi, MaChiTietPhacDo, NgayGhi, TinhTrangSucKhoe, TrieuChung, NhietDo, HuyetAp, NhipTim, ThuocSuDung, LieuLuong, MucDoNghien, ChanDoan, HuongXuLy) VALUES
    ('NKAPI001', 'BAAPI001', 'NS_BS001', 'CTPDAPI002', DATEADD(day, -2, GETDATE()), N'Tỉnh táo, hợp tác tốt, ăn ngủ cải thiện', N'Thèm thuốc nhẹ về đêm', 36.8, '120/80', 76, N'Vitamin B1', N'2 viên/ngày', 'Nhe', N'Hội chứng cai giảm', N'Tiếp tục trị liệu hành vi'),
    ('NKAPI002', 'BAAPI002', 'NS_BS001', 'CTPDAPI004', DATEADD(day, -1, GETDATE()), N'Mệt mỏi, đau đầu nhẹ, lo âu', N'Đau đầu, khó ngủ', 37.1, '115/75', 82, N'Paracetamol', N'1 viên khi đau', 'TrungBinh', N'Cần theo dõi giấc ngủ', N'Bổ sung tư vấn cá nhân'),
    ('NKAPI003', 'BAAPI003', 'NS_BS002', 'CTPDAPI005', DATEADD(day, -5, GETDATE()), N'Thể trạng còn yếu', N'Chán ăn', 36.7, '110/70', 78, N'Oresol', N'1 gói/ngày', 'TrungBinh', N'Suy nhược nhẹ', N'Tăng dinh dưỡng'),
    ('NKAPI004', 'BAAPI005', 'NS_BS002', 'CTPDAPI007', DATEADD(day, -2, GETDATE()), N'Sức khỏe ổn định, tâm lý tích cực', N'Không ghi nhận', 36.5, '120/80', 72, NULL, NULL, 'Nhe', N'Đạt tiêu chí hoàn thành', N'Đề xuất ra trại');

IF NOT EXISTS (SELECT 1 FROM HoSoDeXuat WHERE MaDeXuat = 'DXAPI001')
    INSERT INTO HoSoDeXuat (MaDeXuat, MaNguoiCaiNghien, MaBacSi, LoaiDeXuat, MaGiaiDoanHienTai, MaGiaiDoanDeXuat, LyDo, NgayDeXuat, NgayPheDuyet, MaQuanLy, GhiChuPheDuyet, TrangThai, PhienBan) VALUES
    ('DXAPI001', 'NCNAPI001', 'NS_BS001', N'CHUYEN_GIAI_DOAN', 'GD002', 'GD003', N'Đã ổn định sức khỏe sau giai đoạn cắt cơn, đủ điều kiện chuyển phục hồi', DATEADD(day, -1, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
    ('DXAPI002', 'NCNAPI002', 'NS_BS001', N'CHUYEN_GIAI_DOAN', 'GD001', 'GD002', N'Kết quả khám ban đầu ổn định, đề xuất vào giai đoạn cắt cơn', DATEADD(day, -3, GETDATE()), DATEADD(day, -2, GETDATE()), 'NS_QL001', N'Đồng ý chuyển giai đoạn', 'DA_PHE_DUYET', 0),
    ('DXAPI003', 'NCNAPI005', 'NS_BS002', N'RA_TRAI', 'GD004', NULL, N'Hoàn thành đầy đủ chương trình, đủ điều kiện tái hòa nhập cộng đồng', DATEADD(day, -2, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
    ('DXAPI004', 'NCNAPI006', 'NS_BS001', N'CHUYEN_GIAI_DOAN', 'GD003', 'GD004', N'Tâm lý ổn định, gia đình phối hợp tốt', DATEADD(day, -8, GETDATE()), DATEADD(day, -7, GETDATE()), 'NS_QL001', N'Cần thêm 2 tuần theo dõi trước khi chuyển', 'TU_CHOI', 0),
    ('DXAPI005', 'NCNAPI004', 'NS_BS001', N'GIA_HAN_CAI_NGHIEN', 'GD001', NULL, N'Có biểu hiện chưa ổn định, cần theo dõi thêm', DATEADD(day, -5, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0);

/* ============================================================
   9. THAM GAP - HO TRO - THONG BAO
   ============================================================ */
IF NOT EXISTS (SELECT 1 FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI001' AND NgayTham = CAST(DATEADD(day, 2, GETDATE()) AS DATE))
    INSERT INTO PhieuThamGap (MaNguoiThan, MaNguoiCaiNghien, LoaiThamGap, NgayTham, CaTham, TrangThai, NgayTao, MaNhanSu) VALUES
    (@NT1, 'NCNAPI001', 1, DATEADD(day, 2, CAST(GETDATE() AS DATE)), 1, 'CHO_DUYET', GETDATE(), 'NS_STF01'),
    (@NT2, 'NCNAPI002', 1, DATEADD(day, 3, CAST(GETDATE() AS DATE)), 2, 'DA_DONG_Y', DATEADD(day, -1, GETDATE()), 'NS_STF01'),
    (@NT3, 'NCNAPI004', 2, DATEADD(day, -2, CAST(GETDATE() AS DATE)), 3, 'HOAN_THANH', DATEADD(day, -5, GETDATE()), 'NS_STF01'),
    (@NT4, 'NCNAPI005', 1, DATEADD(day, 1, CAST(GETDATE() AS DATE)), 1, 'TU_CHOI', DATEADD(day, -4, GETDATE()), 'NS_STF01');

DECLARE @Phieu1 INT = (SELECT TOP 1 MaPhieu FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI001' ORDER BY MaPhieu DESC);
DECLARE @Phieu2 INT = (SELECT TOP 1 MaPhieu FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI002' ORDER BY MaPhieu DESC);

IF @Phieu1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM NguoiDiCung WHERE MaPhieu = @Phieu1 AND SoGiayTo = '048299990001')
    INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
    VALUES (@Phieu1, N'Nguyễn Văn Minh', 1, '048299990001', N'Em trai', 'https://picsum.photos/seed/visitor1/320/320');

IF @Phieu2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM NguoiDiCung WHERE MaPhieu = @Phieu2 AND SoGiayTo = '048299990002')
    INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
    VALUES (@Phieu2, N'Lê Thị Hạnh', 1, '048299990002', N'Chị gái', 'https://picsum.photos/seed/visitor2/320/320');

IF NOT EXISTS (SELECT 1 FROM PhieuHoTro WHERE MaYeuCau = 'YCAPI001')
    INSERT INTO PhieuHoTro (MaYeuCau, MaNguoiThan, TieuDe, NoiDungYeuCau, NgayGui, TrangThai, NoiDungPhanHoi, MaNhanVien, NgayPhanHoi) VALUES
    ('YCAPI001', @NT1, N'Hỏi về tình hình sức khỏe', N'Gia đình muốn biết tình hình ăn uống và sức khỏe của Nguyễn Văn Khoa trong tuần này.', DATEADD(day, -2, GETDATE()), 'DA_PHAN_HOI', N'Học viên ăn uống tốt, tinh thần ổn định, tham gia đầy đủ các buổi trị liệu.', 'NS_STF01', DATEADD(day, -1, GETDATE())),
    ('YCAPI002', @NT2, N'Xin gửi thêm vật dụng cá nhân', N'Gia đình muốn gửi thêm quần áo và sách đọc cho Lê Minh Tâm.', DATEADD(day, -1, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
    ('YCAPI003', @NT3, N'Đăng ký tư vấn với cán bộ trung tâm', N'Gia đình cần trao đổi thêm về quá trình phục hồi tâm lý của học viên.', DATEADD(day, -4, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đã sắp xếp lịch tư vấn vào chiều thứ Sáu.', 'NS_STF01', DATEADD(day, -3, GETDATE()));

IF NOT EXISTS (SELECT 1 FROM ThongBao WHERE MaThongBao = 'TBAPI001')
    INSERT INTO ThongBao (MaThongBao, MaNhanVien, TieuDe, NoiDung, NgayTao, LoaiThongBao, TrangThai, MaNguoiDungNhan) VALUES
    ('TBAPI001', 'NS_STF01', N'Lịch thăm gặp cuối tuần', N'Trung tâm mở đăng ký thăm gặp cho gia đình vào sáng thứ Bảy và Chủ nhật.', DATEADD(day, -1, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
    ('TBAPI002', 'NS_STF01', N'Thông báo nội bộ về điểm danh', N'Cán bộ phụ trách cần hoàn tất điểm danh trước 17:00 mỗi ngày.', DATEADD(hour, -6, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
    ('TBAPI003', 'NS_STF01', N'Hồ sơ hỗ trợ đã được phản hồi', N'Yêu cầu hỗ trợ của gia đình đã được cán bộ trung tâm phản hồi.', DATEADD(hour, -3, GETDATE()), 'CaNhan', 'CHUA_DOC', (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family1_api'));

/* ============================================================
   10. LICH SINH HOAT - DIEM DANH - THUOC - TU VAN
   ============================================================ */
IF NOT EXISTS (SELECT 1 FROM LichSinhHoat WHERE MaLich = 'LSAPI001')
    INSERT INTO LichSinhHoat (MaLich, MaNhanVien, MaHoatDong, ThoiGianBatDau, ThoiGianKetThuc, DiaDiem) VALUES
    ('LSAPI001', 'NS_STF01', 'HDAPI001', DATEADD(hour, -8, GETDATE()), DATEADD(hour, -7, GETDATE()), N'Phòng trị liệu nhóm A'),
    ('LSAPI002', 'NS_STF01', 'HDAPI002', DATEADD(hour, -5, GETDATE()), DATEADD(hour, -3, GETDATE()), N'Khu vườn trị liệu'),
    ('LSAPI003', 'NS_STF01', 'HDAPI003', DATEADD(hour, 2, GETDATE()), DATEADD(hour, 4, GETDATE()), N'Phòng học kỹ năng');

IF NOT EXISTS (SELECT 1 FROM NhatKyDiemDanh WHERE MaLich = 'LSAPI001' AND MaNguoiCaiNghien = 'NCNAPI001')
    INSERT INTO NhatKyDiemDanh (MaLich, MaNguoiCaiNghien, MaNhanVien, ThoiGian, TrangThai, GhiChu) VALUES
    ('LSAPI001', 'NCNAPI001', 'NS_STF01', DATEADD(hour, -7, GETDATE()), 'CO_MAT', NULL),
    ('LSAPI001', 'NCNAPI002', 'NS_STF01', DATEADD(hour, -7, GETDATE()), 'CO_MAT', NULL),
    ('LSAPI001', 'NCNAPI003', 'NS_STF01', DATEADD(hour, -7, GETDATE()), 'TRE_GIO', N'Trễ 10 phút do kiểm tra sức khỏe'),
    ('LSAPI002', 'NCNAPI004', 'NS_STF01', DATEADD(hour, -4, GETDATE()), 'CO_PHEP', N'Có lịch khám'),
    ('LSAPI002', 'NCNAPI006', 'NS_STF01', DATEADD(hour, -4, GETDATE()), 'CO_MAT', NULL);

IF NOT EXISTS (SELECT 1 FROM LichUongThuoc WHERE MaLichUong = 'LUAPI001')
    INSERT INTO LichUongThuoc (MaLichUong, MaNguoiCaiNghien, MaBacSi, NgayBatDau, NgayKetThuc, TrangThai) VALUES
    ('LUAPI001', 'NCNAPI001', 'NS_BS001', DATEADD(day, -15, CAST(GETDATE() AS DATE)), DATEADD(day, 30, CAST(GETDATE() AS DATE)), 'DANG_THUC_HIEN'),
    ('LUAPI002', 'NCNAPI002', 'NS_BS001', DATEADD(day, -10, CAST(GETDATE() AS DATE)), DATEADD(day, 20, CAST(GETDATE() AS DATE)), 'DANG_THUC_HIEN'),
    ('LUAPI003', 'NCNAPI005', 'NS_BS002', DATEADD(day, -50, CAST(GETDATE() AS DATE)), DATEADD(day, -5, CAST(GETDATE() AS DATE)), 'DA_HOAN_THANH');

IF NOT EXISTS (SELECT 1 FROM ChiTietLichUongThuoc WHERE MaChiTiet = 'CTLUAPI01')
    INSERT INTO ChiTietLichUongThuoc (MaChiTiet, MaLichUong, MaThuoc, LieuLuong, TanSuat, GioUong) VALUES
    ('CTLUAPI01', 'LUAPI001', 'THAPI002', N'2 viên', N'1 lần/ngày', '08:00:00'),
    ('CTLUAPI02', 'LUAPI001', 'THAPI004', N'1 gói', N'Khi mất nước', '14:00:00'),
    ('CTLUAPI03', 'LUAPI002', 'THAPI001', N'5ml', N'1 lần/ngày', '07:30:00'),
    ('CTLUAPI04', 'LUAPI003', 'THAPI002', N'1 viên', N'1 lần/ngày', '08:00:00');

IF NOT EXISTS (SELECT 1 FROM LichTuVanTamLy WHERE MaLichTuVan = 'TVAPI001')
    INSERT INTO LichTuVanTamLy (MaLichTuVan, MaNguoiCaiNghien, MaBacSi, ThoiGianBatDau, ThoiLuong, ChuDe, KetQuaTuVan, TrangThai) VALUES
    ('TVAPI001', 'NCNAPI001', 'NS_BS002', DATEADD(day, -2, GETDATE()), 60, N'Nhận diện nguy cơ tái nghiện', N'Học viên chia sẻ tốt, nhận diện được nhóm bạn xấu là nguy cơ cao.', 'DA_HOAN_THANH'),
    ('TVAPI002', 'NCNAPI002', 'NS_BS002', DATEADD(day, 1, GETDATE()), 45, N'Ổn định cảm xúc sau cắt cơn', NULL, 'CHUA_BAT_DAU'),
    ('TVAPI003', 'NCNAPI006', 'NS_BS002', DATEADD(hour, 1, GETDATE()), 50, N'Chuẩn bị tái hòa nhập gia đình', NULL, 'CHUA_BAT_DAU'),
    ('TVAPI004', 'NCNAPI004', 'NS_BS002', DATEADD(hour, -1, GETDATE()), 45, N'Tư vấn cá nhân khẩn cấp', NULL, 'DANG_TIEN_HANH');

/* ============================================================
   11. SUMMARY KIEM TRA NHANH
   ============================================================ */
COMMIT TRAN;

PRINT N'07_Seed_API_Test_Data_Full.sql chạy thành công.';

SELECT 'VaiTro' AS Bang, COUNT(*) AS SoDong FROM VaiTro
UNION ALL SELECT 'NguoiDung', COUNT(*) FROM NguoiDung
UNION ALL SELECT 'NhanSu', COUNT(*) FROM NhanSu
UNION ALL SELECT 'NguoiThan', COUNT(*) FROM NguoiThan
UNION ALL SELECT 'NguoiCaiNghien', COUNT(*) FROM NguoiCaiNghien
UNION ALL SELECT 'HoSoBanGiao', COUNT(*) FROM HoSoBanGiao
UNION ALL SELECT 'HoSoBenhAn', COUNT(*) FROM HoSoBenhAn
UNION ALL SELECT 'PhacDoDieuTri', COUNT(*) FROM PhacDoDieuTri
UNION ALL SELECT 'ChiTietPhacDoDieuTri', COUNT(*) FROM ChiTietPhacDoDieuTri
UNION ALL SELECT 'HoSoDeXuat', COUNT(*) FROM HoSoDeXuat
UNION ALL SELECT 'PhieuThamGap', COUNT(*) FROM PhieuThamGap
UNION ALL SELECT 'PhieuHoTro', COUNT(*) FROM PhieuHoTro
UNION ALL SELECT 'ThongBao', COUNT(*) FROM ThongBao;

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRAN;
    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    DECLARE @ErrorLine INT = ERROR_LINE();
    RAISERROR(N'Lỗi seed dữ liệu tại dòng %d: %s', 16, 1, @ErrorLine, @ErrorMessage);
END CATCH;
