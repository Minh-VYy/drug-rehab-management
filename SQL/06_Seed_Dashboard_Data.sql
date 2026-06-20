USE rehab_center_db;
GO

SET NOCOUNT ON;

/* ============================================================
   DASHBOARD SEED DATA
   Chạy file này sau script tạo database chính.
   Mục tiêu: có dữ liệu thật cho các dashboard thay vì phụ thuộc mock FE.
   ============================================================ */

DECLARE @PasswordHash VARCHAR(255) = '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2'; -- Password@123

DECLARE @NextRoleId INT;

IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'NGUOI_THAN')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'NGUOI_THAN', N'Người thân của người cai nghiện');
END
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'CAN_BO_QUAN_LY_HO_SO')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'CAN_BO_QUAN_LY_HO_SO', N'Cán bộ quản lý hồ sơ / Công an');
END
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'CAN_BO_TRUNG_TAM')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'CAN_BO_TRUNG_TAM', N'Cán bộ trung tâm');
END
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'CAN_BO_PHU_TRACH')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'CAN_BO_PHU_TRACH', N'Bác sĩ phụ trách');
END
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'CAN_BO_QUAN_LY')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'CAN_BO_QUAN_LY', N'Cán bộ quản lý');
END
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'NGUOI_LANH_DAO')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'NGUOI_LANH_DAO', N'Người lãnh đạo trung tâm');
END
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE TenVaiTro = 'QUANTRI_HETHONG')
BEGIN
    SELECT @NextRoleId = ISNULL(MAX(MaVaiTro), 0) + 1 FROM VaiTro;
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (@NextRoleId, 'QUANTRI_HETHONG', N'Quản trị hệ thống');
END

DECLARE @RoleFamily INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'NGUOI_THAN');
DECLARE @RolePolice INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'CAN_BO_QUAN_LY_HO_SO');
DECLARE @RoleStaff INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'CAN_BO_TRUNG_TAM');
DECLARE @RoleDoctor INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'CAN_BO_PHU_TRACH');
DECLARE @RoleManager INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'CAN_BO_QUAN_LY');
DECLARE @RoleLeader INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'NGUOI_LANH_DAO');
DECLARE @RoleAdmin INT = (SELECT TOP 1 MaVaiTro FROM VaiTro WHERE TenVaiTro = 'QUANTRI_HETHONG');

DECLARE @GD1 CHAR(10) = (SELECT TOP 1 MaGiaiDoan FROM DanhMucGiaiDoan WHERE ThuTu = 1);
IF @GD1 IS NULL
BEGIN
    INSERT INTO DanhMucGiaiDoan (MaGiaiDoan, TenGiaiDoan, ThuTu, MoTa)
    VALUES ('DASHGD001', N'Giai đoạn 1 - Cắt cơn', 1, N'Cắt cơn, ổn định thể chất và đánh giá ban đầu');
    SET @GD1 = 'DASHGD001';
END

DECLARE @GD2 CHAR(10) = (SELECT TOP 1 MaGiaiDoan FROM DanhMucGiaiDoan WHERE ThuTu = 2);
IF @GD2 IS NULL
BEGIN
    INSERT INTO DanhMucGiaiDoan (MaGiaiDoan, TenGiaiDoan, ThuTu, MoTa)
    VALUES ('DASHGD002', N'Giai đoạn 2 - Phục hồi', 2, N'Phục hồi sức khỏe, tâm lý và kỹ năng sống');
    SET @GD2 = 'DASHGD002';
END

DECLARE @GD3 CHAR(10) = (SELECT TOP 1 MaGiaiDoan FROM DanhMucGiaiDoan WHERE ThuTu = 3);
IF @GD3 IS NULL
BEGIN
    INSERT INTO DanhMucGiaiDoan (MaGiaiDoan, TenGiaiDoan, ThuTu, MoTa)
    VALUES ('DASHGD003', N'Giai đoạn 3 - Tái hòa nhập', 3, N'Chuẩn bị tái hòa nhập cộng đồng');
    SET @GD3 = 'DASHGD003';
END

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'dash_admin')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('dash_admin', @PasswordHash, N'QT. Nguyễn Minh An', '0901000001', 'dash.admin@rehab.vn', @RoleAdmin, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'dash_leader')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('dash_leader', @PasswordHash, N'GĐ. Hoàng Văn Đức', '0901000002', 'dash.leader@rehab.vn', @RoleLeader, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'dash_manager')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('dash_manager', @PasswordHash, N'QL. Phạm Thị Phương', '0901000003', 'dash.manager@rehab.vn', @RoleManager, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'dash_doctor')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('dash_doctor', @PasswordHash, N'BS. Trần Thị Mai', '0901000004', 'dash.doctor@rehab.vn', @RoleDoctor, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'dash_staff')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('dash_staff', @PasswordHash, N'CB. Lê Văn Hùng', '0901000005', 'dash.staff@rehab.vn', @RoleStaff, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'dash_police')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('dash_police', @PasswordHash, N'CA. Đặng Văn Nam', '0901000006', 'dash.police@rehab.vn', @RolePolice, 'DANG_HOAT_DONG');
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'dash_family')
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai)
    VALUES ('dash_family', @PasswordHash, N'Nguyễn Thị Lan', '0901000007', 'dash.family@rehab.vn', @RoleFamily, 'DANG_HOAT_DONG');

DECLARE @UserManager INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'dash_manager');
DECLARE @UserDoctor INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'dash_doctor');
DECLARE @UserStaff INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'dash_staff');
DECLARE @UserPolice INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'dash_police');
DECLARE @UserFamily INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'dash_family');

IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'DSQL001')
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu) VALUES ('DSQL001', @UserManager, 'DANG_LAM_VIEC', N'Cán bộ quản lý');
IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'DSBS001')
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu) VALUES ('DSBS001', @UserDoctor, 'DANG_LAM_VIEC', N'Bác sĩ phụ trách');
IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'DSNV001')
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu) VALUES ('DSNV001', @UserStaff, 'DANG_LAM_VIEC', N'Cán bộ tiếp nhận');

IF NOT EXISTS (SELECT 1 FROM CanBoQuanLyHoSo WHERE MaCanBoCongAn = 'DSCA001')
    INSERT INTO CanBoQuanLyHoSo (MaCanBoCongAn, MaNguoiDung, HoTen, SoHieuCAND, DonViCongTac, SoDienThoai)
    VALUES ('DSCA001', @UserPolice, N'CA. Đặng Văn Nam', 'CAND-DASH-001', N'Công an quận Hải Châu', '0901000006');

IF NOT EXISTS (SELECT 1 FROM NguoiThan WHERE SoCCCD = '048900000001')
    INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi, NgheNghiep)
    VALUES (@UserFamily, '048900000001', '2021-05-20', N'Cục Cảnh sát QLHC', N'123 Nguyễn Văn Linh, Đà Nẵng', N'Kinh doanh');

DECLARE @RelativeId INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048900000001');

IF NOT EXISTS (SELECT 1 FROM HoSoBanGiao WHERE MaHoSoBanGiao = 'DASH-HS001')
BEGIN
    INSERT INTO HoSoBanGiao (MaHoSoBanGiao, MaCanBoCongAn, HoTenDoiTuong, CCCD, NgaySinh, QueQuan, NoiO_HienTai, HoTenNguoiThan, SdtNguoiThan, QuanHeVoiDoiTuong, HanhViViPham, FileQuyetDinh, TrangThaiDuyet, MaNhanSuDuyet, NgayDuyet, MaCBQL) VALUES
    ('DASH-HS001', N'CA. Đặng Văn Nam', N'Nguyễn Văn Bình', '048900100001', '1998-01-12', N'Đà Nẵng', N'Hải Châu, Đà Nẵng', N'Nguyễn Thị Lan', '0901000007', N'Mẹ', N'Sử dụng trái phép chất ma túy tổng hợp.', 'dash_qd_001.pdf', 'DaTiepNhan', 'DSNV001', DATEADD(day, -25, GETDATE()), 'DSCA001'),
    ('DASH-HS002', N'CA. Đặng Văn Nam', N'Trần Văn Cường', '048900100002', '1997-04-09', N'Quảng Nam', N'Cẩm Lệ, Đà Nẵng', N'Trần Thị Hoa', '0901000102', N'Chị', N'Tái sử dụng sau cai nghiện tại cộng đồng.', 'dash_qd_002.pdf', 'DaTiepNhan', 'DSNV001', DATEADD(day, -22, GETDATE()), 'DSCA001'),
    ('DASH-HS003', N'CA. Đặng Văn Nam', N'Lê Minh Khánh', '048900100003', '1999-10-02', N'Huế', N'Sơn Trà, Đà Nẵng', N'Lê Văn Khoa', '0901000103', N'Cha', N'Tàng trữ và sử dụng chất kích thích.', 'dash_qd_003.pdf', 'ChoDuyet', NULL, NULL, 'DSCA001'),
    ('DASH-HS004', N'CA. Đặng Văn Nam', N'Phạm Thị Dung', '048900100004', '2000-08-15', N'Đà Nẵng', N'Liên Chiểu, Đà Nẵng', N'Phạm Văn Sơn', '0901000104', N'Anh trai', N'Sử dụng ma túy đá, có biểu hiện kích động.', 'dash_qd_004.pdf', 'ChoDuyet', NULL, NULL, 'DSCA001'),
    ('DASH-HS005', N'CA. Đặng Văn Nam', N'Hoàng Văn Đạt', '048900100005', '1996-02-18', N'Quảng Ngãi', N'Ngũ Hành Sơn, Đà Nẵng', N'Hoàng Thị Mai', '0901000105', N'Vợ', N'Sử dụng heroin kéo dài, cần cai nghiện bắt buộc.', 'dash_qd_005.pdf', 'TuChoi', 'DSNV001', DATEADD(day, -5, GETDATE()), 'DSCA001'),
    ('DASH-HS006', N'CA. Đặng Văn Nam', N'Võ Thị Hằng', '048900100006', '2001-11-22', N'Bình Định', N'Thanh Khê, Đà Nẵng', N'Võ Văn Tâm', '0901000106', N'Cha', N'Sử dụng chất kích thích tại nơi công cộng.', 'dash_qd_006.pdf', 'ChoDuyet', NULL, NULL, 'DSCA001');
END

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'DASH-NCN001')
BEGIN
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaHoSoBanGiao, MaNguoiThan, HoTen, CCCD, NgayVaoTrai, MaGiaiDoanHienTai, TrangThai) VALUES
    ('DASH-NCN001', 'DASH-HS001', @RelativeId, N'Nguyễn Văn Bình', '048900100001', DATEADD(day, -70, GETDATE()), @GD1, 'DANG_CAI_NGHIEN'),
    ('DASH-NCN002', 'DASH-HS002', @RelativeId, N'Trần Văn Cường', '048900100002', DATEADD(day, -65, GETDATE()), @GD1, 'DANG_CAI_NGHIEN'),
    ('DASH-NCN003', 'DASH-HS001', @RelativeId, N'Lê Minh Khánh', '048900100003', DATEADD(day, -55, GETDATE()), @GD2, 'DANG_CAI_NGHIEN'),
    ('DASH-NCN004', 'DASH-HS002', @RelativeId, N'Phạm Thị Dung', '048900100004', DATEADD(day, -40, GETDATE()), @GD2, 'DANG_CAI_NGHIEN'),
    ('DASH-NCN005', 'DASH-HS001', @RelativeId, N'Hoàng Văn Đạt', '048900100005', DATEADD(day, -120, GETDATE()), @GD3, 'DANG_CAI_NGHIEN'),
    ('DASH-NCN006', 'DASH-HS002', @RelativeId, N'Võ Thị Hằng', '048900100006', DATEADD(day, -150, GETDATE()), @GD3, 'DA_HOAN_THANH'),
    ('DASH-NCN007', 'DASH-HS001', @RelativeId, N'Đặng Văn Khoa', '048900100007', DATEADD(day, -20, GETDATE()), @GD1, 'DANG_KHAM_SUC_KHOE'),
    ('DASH-NCN008', 'DASH-HS002', @RelativeId, N'Bùi Thị Linh', '048900100008', DATEADD(day, -95, GETDATE()), @GD2, 'TAM_NGUNG_DIEU_TRI'),
    ('DASH-NCN009', 'DASH-HS001', @RelativeId, N'Đỗ Văn Kiên', '048900100009', DATEADD(day, -180, GETDATE()), @GD3, 'DA_HOAN_THANH'),
    ('DASH-NCN010', 'DASH-HS002', @RelativeId, N'Ngô Thị Thảo', '048900100010', DATEADD(day, -12, GETDATE()), @GD1, 'DANG_CAI_NGHIEN');
END

IF NOT EXISTS (SELECT 1 FROM HoSoBenhAn WHERE MaBenhAn = 'DSBA001')
BEGIN
    INSERT INTO HoSoBenhAn (MaBenhAn, MaNguoiCaiNghien, MaBacSi, TienSuBenh, DiUng, ChieuCao, CanNang, NhomMau, NgayLap, NgayCapNhatCuoi) VALUES
    ('DSBA001', 'DASH-NCN001', 'DSBS001', N'Mất ngủ kéo dài', N'Không', 170.0, 62.5, 'O+', DATEADD(day, -69, GETDATE()), GETDATE()),
    ('DSBA002', 'DASH-NCN002', 'DSBS001', N'Rối loạn lo âu nhẹ', N'Không', 166.0, 59.0, 'A+', DATEADD(day, -64, GETDATE()), GETDATE()),
    ('DSBA003', 'DASH-NCN003', 'DSBS001', N'Viêm dạ dày', N'Hải sản', 160.0, 52.0, 'B+', DATEADD(day, -54, GETDATE()), GETDATE()),
    ('DSBA004', 'DASH-NCN004', 'DSBS001', N'Không ghi nhận bệnh nền', N'Không', 158.0, 50.5, 'AB+', DATEADD(day, -39, GETDATE()), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM PhacDoDieuTri WHERE MaPhacDoDT = 'DSPDT001')
BEGIN
    INSERT INTO PhacDoDieuTri (MaPhacDoDT, MaBenhAn, MaBacSi, LoaiMaTuy, TrangThai, NgayLap, GhiChu) VALUES
    ('DSPDT001', 'DSBA001', 'DSBS001', N'HEROIN', 'DANG_AP_DUNG', DATEADD(day, -68, GETDATE()), N'Cắt cơn và phục hồi thể chất'),
    ('DSPDT002', 'DSBA002', 'DSBS001', N'MA_TUY_DA', 'DANG_AP_DUNG', DATEADD(day, -63, GETDATE()), N'Điều trị tâm lý hành vi'),
    ('DSPDT003', 'DSBA003', 'DSBS001', N'CAN_SA', 'BAN_NHAP', DATEADD(day, -6, GETDATE()), N'Chờ quản lý duyệt');

    INSERT INTO ChiTietPhacDoDieuTri (MaChiTietPhacDo, MaPhacDoDT, MaGiaiDoan, ThuTu, NoiDungPhacDoDT, MucTieu, NgayBatDau, NgayKetThucDuKien, TrangThai, MaQuanLy, NgayPheDuyet, GhiChuPheDuyet) VALUES
    ('DSCTPDT001', 'DSPDT001', @GD1, 1, N'Cắt cơn bằng phác đồ an thần nhẹ', N'Ổn định thể chất', DATEADD(day, -68, GETDATE()), DATEADD(day, -50, GETDATE()), 'DA_HOAN_THANH', 'DSQL001', DATEADD(day, -68, GETDATE()), N'Đã duyệt'),
    ('DSCTPDT002', 'DSPDT001', @GD2, 2, N'Tư vấn tâm lý và lao động trị liệu', N'Phục hồi nhận thức', DATEADD(day, -49, GETDATE()), DATEADD(day, 15, GETDATE()), 'DANG_AP_DUNG', 'DSQL001', DATEADD(day, -49, GETDATE()), N'Đã duyệt'),
    ('DSCTPDT003', 'DSPDT002', @GD1, 1, N'Ổn định giấc ngủ và kiểm soát hành vi', N'Giảm kích động', DATEADD(day, -63, GETDATE()), DATEADD(day, -40, GETDATE()), 'DA_HOAN_THANH', 'DSQL001', DATEADD(day, -63, GETDATE()), N'Đã duyệt'),
    ('DSCTPDT004', 'DSPDT003', @GD1, 1, N'Đánh giá ban đầu và lập kế hoạch cắt cơn', N'Xác định mức độ nghiện', GETDATE(), DATEADD(day, 20, GETDATE()), 'CHO_PHE_DUYET', NULL, NULL, NULL),
    ('DSCTPDT005', 'DSPDT003', @GD2, 2, N'Tư vấn phục hồi kỹ năng sống', N'Tăng khả năng tự kiểm soát', DATEADD(day, 21, GETDATE()), DATEADD(day, 60, GETDATE()), 'CHO_PHE_DUYET', NULL, NULL, NULL);
END

IF NOT EXISTS (SELECT 1 FROM HoSoDeXuat WHERE MaDeXuat = 'DSDX001')
BEGIN
    INSERT INTO HoSoDeXuat (MaDeXuat, MaNguoiCaiNghien, MaBacSi, LoaiDeXuat, MaGiaiDoanHienTai, MaGiaiDoanDeXuat, LyDo, NgayDeXuat, NgayPheDuyet, MaQuanLy, GhiChuPheDuyet, TrangThai, PhienBan) VALUES
    ('DSDX001', 'DASH-NCN001', 'DSBS001', N'CHUYEN_GIAI_DOAN', @GD1, @GD2, N'Ổn định sức khỏe, đủ điều kiện chuyển giai đoạn phục hồi.', DATEADD(day, -1, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
    ('DSDX002', 'DASH-NCN002', 'DSBS001', N'CHUYEN_GIAI_DOAN', @GD1, @GD2, N'Không còn biểu hiện cai cấp tính.', DATEADD(day, -2, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
    ('DSDX003', 'DASH-NCN005', 'DSBS001', N'RA_TRAI', @GD3, NULL, N'Hoàn thành đầy đủ các nội dung phục hồi và tái hòa nhập.', DATEADD(day, -1, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
    ('DSDX004', 'DASH-NCN006', 'DSBS001', N'RA_TRAI', @GD3, NULL, N'Đã hoàn thành chương trình, gia đình cam kết hỗ trợ sau cai.', DATEADD(day, -8, GETDATE()), DATEADD(day, -7, GETDATE()), 'DSQL001', N'Đồng ý hoàn thành chương trình', 'DA_PHE_DUYET', 0),
    ('DSDX005', 'DASH-NCN008', 'DSBS001', N'CHUYEN_GIAI_DOAN', @GD2, @GD3, N'Cần đánh giá lại do tạm ngưng điều trị.', DATEADD(day, -4, GETDATE()), DATEADD(day, -3, GETDATE()), 'DSQL001', N'Chưa đủ điều kiện', 'TU_CHOI', 0);
END

IF NOT EXISTS (SELECT 1 FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'DASH-NCN001' AND NgayTham = CAST(DATEADD(day, 1, GETDATE()) AS date))
BEGIN
    INSERT INTO PhieuThamGap (MaNguoiThan, MaNguoiCaiNghien, LoaiThamGap, NgayTham, CaTham, TrangThai, NgayTao, MaNhanSu) VALUES
    (@RelativeId, 'DASH-NCN001', 1, DATEADD(day, 1, GETDATE()), 1, 'CHO_DUYET', GETDATE(), 'DSNV001'),
    (@RelativeId, 'DASH-NCN002', 2, DATEADD(day, 2, GETDATE()), 2, 'CHO_DUYET', GETDATE(), 'DSNV001'),
    (@RelativeId, 'DASH-NCN003', 1, DATEADD(day, -1, GETDATE()), 1, 'DA_DONG_Y', DATEADD(day, -3, GETDATE()), 'DSNV001'),
    (@RelativeId, 'DASH-NCN004', 1, DATEADD(day, -4, GETDATE()), 2, 'HOAN_THANH', DATEADD(day, -7, GETDATE()), 'DSNV001');
END

IF NOT EXISTS (SELECT 1 FROM DanhMucHoatDong WHERE MaHoatDong = 'DSHD001')
BEGIN
    INSERT INTO DanhMucHoatDong (MaHoatDong, TenHoatDong, LoaiHoatDong, ThoiGian, MoTa) VALUES
    ('DSHD001', N'Tư vấn nhóm phục hồi', 'TRI_LIEU', CAST(GETDATE() AS date), N'Tư vấn nhóm về kiểm soát cơn thèm'),
    ('DSHD002', N'Lao động trị liệu vườn rau', 'LAO_DONG', CAST(GETDATE() AS date), N'Hoạt động lao động trị liệu buổi chiều'),
    ('DSHD003', N'Thể thao phục hồi thể chất', 'THE_THAO', CAST(GETDATE() AS date), N'Rèn luyện thể lực');
END

IF NOT EXISTS (SELECT 1 FROM LichSinhHoat WHERE MaLich = 'DSLSH001')
BEGIN
    INSERT INTO LichSinhHoat (MaLich, MaNhanVien, MaHoatDong, ThoiGianBatDau, ThoiGianKetThuc, DiaDiem) VALUES
    ('DSLSH001', 'DSNV001', 'DSHD001', DATEADD(hour, 8, CAST(CAST(GETDATE() AS date) AS datetime)), DATEADD(hour, 10, CAST(CAST(GETDATE() AS date) AS datetime)), N'Phòng sinh hoạt chung'),
    ('DSLSH002', 'DSNV001', 'DSHD002', DATEADD(hour, 14, CAST(CAST(GETDATE() AS date) AS datetime)), DATEADD(hour, 16, CAST(CAST(GETDATE() AS date) AS datetime)), N'Khu vườn trị liệu'),
    ('DSLSH003', 'DSNV001', 'DSHD003', DATEADD(hour, 16, CAST(CAST(GETDATE() AS date) AS datetime)), DATEADD(hour, 17, CAST(CAST(GETDATE() AS date) AS datetime)), N'Sân thể thao');

    INSERT INTO NhatKyDiemDanh (MaLich, MaNguoiCaiNghien, MaNhanVien, ThoiGian, TrangThai, GhiChu) VALUES
    ('DSLSH001', 'DASH-NCN001', 'DSNV001', DATEADD(hour, 8, CAST(CAST(GETDATE() AS date) AS datetime)), 'CO_MAT', NULL),
    ('DSLSH001', 'DASH-NCN002', 'DSNV001', DATEADD(hour, 8, CAST(CAST(GETDATE() AS date) AS datetime)), 'CO_MAT', NULL),
    ('DSLSH001', 'DASH-NCN003', 'DSNV001', DATEADD(hour, 8, CAST(CAST(GETDATE() AS date) AS datetime)), 'TRE_GIO', N'Đến muộn 15 phút'),
    ('DSLSH002', 'DASH-NCN004', 'DSNV001', DATEADD(hour, 14, CAST(CAST(GETDATE() AS date) AS datetime)), 'VANG_MAT', N'Theo dõi sức khỏe tại phòng y tế');
END

IF NOT EXISTS (SELECT 1 FROM LichUongThuoc WHERE MaLichUong = 'DSLUT001')
BEGIN
    INSERT INTO LichUongThuoc (MaLichUong, MaNguoiCaiNghien, MaBacSi, NgayBatDau, NgayKetThuc, TrangThai) VALUES
    ('DSLUT001', 'DASH-NCN001', 'DSBS001', CAST(GETDATE() AS date), DATEADD(day, 14, GETDATE()), 'DANG_THUC_HIEN'),
    ('DSLUT002', 'DASH-NCN002', 'DSBS001', CAST(GETDATE() AS date), DATEADD(day, 10, GETDATE()), 'DANG_THUC_HIEN');
END

IF NOT EXISTS (SELECT 1 FROM LichTuVanTamLy WHERE MaLichTuVan = 'DSTV001')
BEGIN
    INSERT INTO LichTuVanTamLy (MaLichTuVan, MaNguoiCaiNghien, MaBacSi, ThoiGianBatDau, ThoiLuong, ChuDe, KetQuaTuVan, TrangThai) VALUES
    ('DSTV001', 'DASH-NCN001', 'DSBS001', DATEADD(hour, 9, CAST(CAST(GETDATE() AS date) AS datetime)), 45, N'Tư vấn kiểm soát cơn thèm', NULL, 'CHUA_BAT_DAU'),
    ('DSTV002', 'DASH-NCN003', 'DSBS001', DATEADD(hour, 15, CAST(CAST(GETDATE() AS date) AS datetime)), 60, N'Chuẩn bị tái hòa nhập', NULL, 'CHUA_BAT_DAU');
END

IF NOT EXISTS (SELECT 1 FROM PhieuHoTro WHERE MaYeuCau = 'DSYC001')
BEGIN
    INSERT INTO PhieuHoTro (MaYeuCau, MaNguoiThan, TieuDe, NoiDungYeuCau, NgayGui, TrangThai, NoiDungPhanHoi, MaNhanVien, NgayPhanHoi) VALUES
    ('DSYC001', @RelativeId, N'Hỏi thăm sức khỏe học viên', N'Gia đình muốn cập nhật tình hình sức khỏe và sinh hoạt tuần này.', DATEADD(day, -1, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
    ('DSYC002', @RelativeId, N'Xin gửi thêm vật dụng cá nhân', N'Gia đình muốn gửi thêm quần áo và sách đọc.', DATEADD(day, -5, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đã tiếp nhận thông tin, gia đình có thể gửi vào khung giờ hành chính.', 'DSNV001', DATEADD(day, -4, GETDATE()));
END

PRINT N'06_Seed_Dashboard_Data.sql executed successfully.';
GO
