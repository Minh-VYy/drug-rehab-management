/* ============================================================
   08 - SEED EXTRA STATISTICS DATA - NO LOOP
   Database: rehab_center_db
   Muc tieu:
   - Bo sung du lieu day hon de test dashboard/thong ke API.
   - Khong su dung WHILE/CURSOR/vong lap trong SQL.
   - Co the chay lai: script xoa rieng du lieu prefix S08 truoc khi insert lai.
   - Chay sau: 00_Rebuild_DB_And_Seed_API_Test.sql + 06 + 07.
   ============================================================ */

USE rehab_center_db;
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRY
BEGIN TRAN;

/* ============================================================
   1. BIEN THAM CHIEU DU LIEU CO SAN TU SEED 07
   ============================================================ */
DECLARE @NT1 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048200000001');
DECLARE @NT2 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048200000002');
DECLARE @NT3 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048200000003');
DECLARE @NT4 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048200000004');
DECLARE @NT5 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048200000005');
DECLARE @UserFamily1 INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family1_api');
DECLARE @UserFamily2 INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family2_api');
DECLARE @UserFamily3 INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family3_api');
DECLARE @UserFamily4 INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family4_api');
DECLARE @UserFamily5 INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'family5_api');
DECLARE @UserDoctor INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'doctor_api');
DECLARE @UserManager INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'manager_api');
DECLARE @UserLeader INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'leader_api');
DECLARE @UserAdmin INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'admin_api');

IF @NT1 IS NULL OR @NT2 IS NULL OR @NT3 IS NULL OR @NT4 IS NULL OR @NT5 IS NULL
    THROW 50001, N'Thieu du lieu NguoiThan tu seed 07. Hay chay 07_Seed_API_Test_Data_Full.sql truoc.', 1;

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCNAPI001')
    THROW 50002, N'Thieu du lieu NguoiCaiNghien NCNAPI*. Hay chay seed 07 truoc.', 1;

/* ============================================================
   2. XOA RIENG DU LIEU S08 DE CO THE CHAY LAI KHONG TRUNG
   ============================================================ */
DELETE FROM NguoiDiCung
WHERE MaPhieu IN (
    SELECT MaPhieu FROM PhieuThamGap
    WHERE MaNguoiCaiNghien LIKE 'NCNAPI%' AND NgayTham BETWEEN '2026-08-01' AND '2026-09-30'
);
DELETE FROM PhieuThamGap WHERE MaNguoiCaiNghien LIKE 'NCNAPI%' AND NgayTham BETWEEN '2026-08-01' AND '2026-09-30';
DELETE FROM PhieuHoTro WHERE MaYeuCau LIKE 'YCS08%';
DELETE FROM ThongBao WHERE MaThongBao LIKE 'TBS08%';
DELETE FROM NhatKyDiemDanh WHERE MaLich LIKE 'LS08%';
DELETE FROM LichSinhHoat WHERE MaLich LIKE 'LS08%';
DELETE FROM ChiTietLichUongThuoc WHERE MaChiTiet LIKE 'CT08%';
DELETE FROM LichUongThuoc WHERE MaLichUong LIKE 'LU08%';
DELETE FROM LichTuVanTamLy WHERE MaLichTuVan LIKE 'TV08%';
DELETE FROM NhatKyDieuTri WHERE MaNhatKy LIKE 'NK08%';
DELETE FROM HoSoDeXuat WHERE MaDeXuat LIKE 'DXS08%';
DELETE FROM HoSoBanGiao WHERE MaHoSoBanGiao LIKE 'HSBG08%';

/* ============================================================
   3. HO SO BAN GIAO - DU LIEU CHO LEADER INTAKE STATISTICS
   ============================================================ */
INSERT INTO HoSoBanGiao (MaHoSoBanGiao, MaCanBoCongAn, HoTenDoiTuong, CCCD, NgaySinh, QueQuan, NoiO_HienTai, HoTenNguoiThan, SdtNguoiThan, QuanHeVoiDoiTuong, HanhViViPham, FileQuyetDinh, TrangThaiDuyet, MaNhanSuDuyet, NgayDuyet, MaCBQL) VALUES
('HSBG08001', N'Đại úy Nguyễn Văn An', N'Đỗ Minh Quân', '048255000101', '1991-02-02', N'Đà Nẵng', N'Quận Hải Châu, Đà Nẵng', N'Đỗ Văn Lâm', '0913000001', N'Cha', N'Sử dụng trái phép chất ma túy tại khu vực công cộng', 'https://example.com/files/quyet-dinh/hsbg08001.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01'),
('HSBG08002', N'Đại úy Nguyễn Văn An', N'Nguyễn Hoàng Nam', '048255000102', '1992-03-03', N'Đà Nẵng', N'Quận Thanh Khê, Đà Nẵng', N'Nguyễn Thị Hòa', '0913000002', N'Mẹ', N'Dương tính với chất ma túy qua kiểm tra nhanh', 'https://example.com/files/quyet-dinh/hsbg08002.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -3, GETDATE()), 'CA_API01'),
('HSBG08003', N'Đại úy Nguyễn Văn An', N'Trần Đức Anh', '048255000103', '1993-04-04', N'Đà Nẵng', N'Quận Sơn Trà, Đà Nẵng', N'Trần Văn Đức', '0913000003', N'Cha', N'Tụ tập sử dụng chất kích thích nhiều lần', 'https://example.com/files/quyet-dinh/hsbg08003.pdf', 'TuChoi', 'NS_LD001', DATEADD(day, -4, GETDATE()), 'CA_API01'),
('HSBG08004', N'Đại úy Nguyễn Văn An', N'Lê Quốc Việt', '048255000104', '1994-05-05', N'Đà Nẵng', N'Quận Ngũ Hành Sơn, Đà Nẵng', N'Lê Thị Nhi', '0913000004', N'Chị', N'Có biểu hiện lệ thuộc chất kích thích cần quản lý điều trị', 'https://example.com/files/quyet-dinh/hsbg08004.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01'),
('HSBG08005', N'Đại úy Nguyễn Văn An', N'Phạm Tuấn Kiệt', '048255000105', '1995-06-06', N'Đà Nẵng', N'Quận Cẩm Lệ, Đà Nẵng', N'Phạm Văn Hùng', '0913000005', N'Anh', N'Sử dụng trái phép chất ma túy tại khu vực công cộng', 'https://example.com/files/quyet-dinh/hsbg08005.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -6, GETDATE()), 'CA_API01'),
('HSBG08006', N'Đại úy Nguyễn Văn An', N'Võ Gia Bảo', '048255000106', '1996-07-07', N'Đà Nẵng', N'Quận Liên Chiểu, Đà Nẵng', N'Võ Thị Mai', '0913000006', N'Mẹ', N'Dương tính với chất ma túy qua kiểm tra nhanh', 'https://example.com/files/quyet-dinh/hsbg08006.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01'),
('HSBG08007', N'Đại úy Nguyễn Văn An', N'Hoàng Minh Khang', '048255000107', '1997-08-08', N'Đà Nẵng', N'Huyện Hòa Vang, Đà Nẵng', N'Hoàng Văn Sơn', '0913000007', N'Cha', N'Tụ tập sử dụng chất kích thích nhiều lần', 'https://example.com/files/quyet-dinh/hsbg08007.pdf', 'TuChoi', 'NS_LD001', DATEADD(day, -8, GETDATE()), 'CA_API01'),
('HSBG08008', N'Đại úy Nguyễn Văn An', N'Bùi Thanh Phong', '048255000108', '1998-09-09', N'Đà Nẵng', N'Quận Hải Châu, Đà Nẵng', N'Bùi Thị Thu', '0913000008', N'Mẹ', N'Có biểu hiện lệ thuộc chất kích thích cần quản lý điều trị', 'https://example.com/files/quyet-dinh/hsbg08008.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -9, GETDATE()), 'CA_API01'),
('HSBG08009', N'Đại úy Nguyễn Văn An', N'Đặng Hữu Nghĩa', '048255000109', '1999-10-10', N'Đà Nẵng', N'Quận Thanh Khê, Đà Nẵng', N'Đặng Văn Long', '0913000009', N'Anh', N'Sử dụng trái phép chất ma túy tại khu vực công cộng', 'https://example.com/files/quyet-dinh/hsbg08009.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01'),
('HSBG08010', N'Đại úy Nguyễn Văn An', N'Phan Văn Lộc', '048255000110', '2000-11-11', N'Đà Nẵng', N'Quận Sơn Trà, Đà Nẵng', N'Phan Thị Lan', '0913000010', N'Chị', N'Dương tính với chất ma túy qua kiểm tra nhanh', 'https://example.com/files/quyet-dinh/hsbg08010.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -11, GETDATE()), 'CA_API01'),
('HSBG08011', N'Đại úy Nguyễn Văn An', N'Ngô Nhật Minh', '048255000111', '2001-12-12', N'Đà Nẵng', N'Quận Cẩm Lệ, Đà Nẵng', N'Ngô Văn Bình', '0913000011', N'Cha', N'Tụ tập sử dụng chất kích thích nhiều lần', 'https://example.com/files/quyet-dinh/hsbg08011.pdf', 'TuChoi', 'NS_LD001', DATEADD(day, -12, GETDATE()), 'CA_API01'),
('HSBG08012', N'Đại úy Nguyễn Văn An', N'Hồ Quốc Thái', '048255000112', '1990-01-13', N'Đà Nẵng', N'Quận Liên Chiểu, Đà Nẵng', N'Hồ Thị Dung', '0913000012', N'Mẹ', N'Có biểu hiện lệ thuộc chất kích thích cần quản lý điều trị', 'https://example.com/files/quyet-dinh/hsbg08012.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01'),
('HSBG08013', N'Đại úy Nguyễn Văn An', N'Dương Văn Hậu', '048255000113', '1991-02-14', N'Đà Nẵng', N'Quận Hải Châu, Đà Nẵng', N'Dương Văn Tài', '0913000013', N'Anh', N'Sử dụng trái phép chất ma túy tại khu vực công cộng', 'https://example.com/files/quyet-dinh/hsbg08013.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -14, GETDATE()), 'CA_API01'),
('HSBG08014', N'Đại úy Nguyễn Văn An', N'Mai Thành Công', '048255000114', '1992-03-15', N'Đà Nẵng', N'Quận Ngũ Hành Sơn, Đà Nẵng', N'Mai Thị Hạnh', '0913000014', N'Mẹ', N'Dương tính với chất ma túy qua kiểm tra nhanh', 'https://example.com/files/quyet-dinh/hsbg08014.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01'),
('HSBG08015', N'Đại úy Nguyễn Văn An', N'Tạ Minh Trí', '048255000115', '1993-04-16', N'Đà Nẵng', N'Huyện Hòa Vang, Đà Nẵng', N'Tạ Văn Cường', '0913000015', N'Cha', N'Tụ tập sử dụng chất kích thích nhiều lần', 'https://example.com/files/quyet-dinh/hsbg08015.pdf', 'TuChoi', 'NS_LD001', DATEADD(day, -16, GETDATE()), 'CA_API01'),
('HSBG08016', N'Đại úy Nguyễn Văn An', N'Lý Hoàng Long', '048255000116', '1994-05-17', N'Đà Nẵng', N'Quận Sơn Trà, Đà Nẵng', N'Lý Thị Sen', '0913000016', N'Mẹ', N'Có biểu hiện lệ thuộc chất kích thích cần quản lý điều trị', 'https://example.com/files/quyet-dinh/hsbg08016.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -17, GETDATE()), 'CA_API01'),
('HSBG08017', N'Đại úy Nguyễn Văn An', N'Chu Văn Tiến', '048255000117', '1995-06-18', N'Đà Nẵng', N'Quận Cẩm Lệ, Đà Nẵng', N'Chu Văn Tín', '0913000017', N'Anh', N'Sử dụng trái phép chất ma túy tại khu vực công cộng', 'https://example.com/files/quyet-dinh/hsbg08017.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01'),
('HSBG08018', N'Đại úy Nguyễn Văn An', N'Đinh Minh Đức', '048255000118', '1996-07-19', N'Đà Nẵng', N'Quận Thanh Khê, Đà Nẵng', N'Đinh Thị Ngọc', '0913000018', N'Chị', N'Dương tính với chất ma túy qua kiểm tra nhanh', 'https://example.com/files/quyet-dinh/hsbg08018.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -19, GETDATE()), 'CA_API01'),
('HSBG08019', N'Đại úy Nguyễn Văn An', N'Cao Văn Tường', '048255000119', '1997-08-20', N'Đà Nẵng', N'Quận Liên Chiểu, Đà Nẵng', N'Cao Văn Tùng', '0913000019', N'Cha', N'Tụ tập sử dụng chất kích thích nhiều lần', 'https://example.com/files/quyet-dinh/hsbg08019.pdf', 'TuChoi', 'NS_LD001', DATEADD(day, -20, GETDATE()), 'CA_API01'),
('HSBG08020', N'Đại úy Nguyễn Văn An', N'Tô Thành Đạt', '048255000120', '1998-09-21', N'Đà Nẵng', N'Quận Hải Châu, Đà Nẵng', N'Tô Thị Vân', '0913000020', N'Mẹ', N'Có biểu hiện lệ thuộc chất kích thích cần quản lý điều trị', 'https://example.com/files/quyet-dinh/hsbg08020.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01'),
('HSBG08021', N'Đại úy Nguyễn Văn An', N'La Văn Hưng', '048255000121', '1999-10-22', N'Đà Nẵng', N'Quận Sơn Trà, Đà Nẵng', N'La Văn Hòa', '0913000021', N'Cha', N'Sử dụng trái phép chất ma túy tại khu vực công cộng', 'https://example.com/files/quyet-dinh/hsbg08021.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -2, GETDATE()), 'CA_API01'),
('HSBG08022', N'Đại úy Nguyễn Văn An', N'Triệu Quốc Khánh', '048255000122', '2000-11-23', N'Đà Nẵng', N'Quận Cẩm Lệ, Đà Nẵng', N'Triệu Thị Tuyết', '0913000022', N'Mẹ', N'Dương tính với chất ma túy qua kiểm tra nhanh', 'https://example.com/files/quyet-dinh/hsbg08022.pdf', 'ChoDuyet', NULL, NULL, 'CA_API01'),
('HSBG08023', N'Đại úy Nguyễn Văn An', N'Hà Minh Sơn', '048255000123', '2001-12-24', N'Đà Nẵng', N'Huyện Hòa Vang, Đà Nẵng', N'Hà Văn Mạnh', '0913000023', N'Anh', N'Tụ tập sử dụng chất kích thích nhiều lần', 'https://example.com/files/quyet-dinh/hsbg08023.pdf', 'TuChoi', 'NS_LD001', DATEADD(day, -4, GETDATE()), 'CA_API01'),
('HSBG08024', N'Đại úy Nguyễn Văn An', N'Vương Hoàng Hải', '048255000124', '1990-01-25', N'Đà Nẵng', N'Quận Ngũ Hành Sơn, Đà Nẵng', N'Vương Thị Hường', '0913000024', N'Chị', N'Có biểu hiện lệ thuộc chất kích thích cần quản lý điều trị', 'https://example.com/files/quyet-dinh/hsbg08024.pdf', 'DaTiepNhan', 'NS_LD001', DATEADD(day, -5, GETDATE()), 'CA_API01');

/* ============================================================
   4. HO SO DE XUAT - DU LIEU CHO THONG KE PHE DUYET/HOAN THANH
   ============================================================ */
INSERT INTO HoSoDeXuat (MaDeXuat, MaNguoiCaiNghien, MaBacSi, LoaiDeXuat, MaGiaiDoanHienTai, MaGiaiDoanDeXuat, LyDo, NgayDeXuat, NgayPheDuyet, MaQuanLy, GhiChuPheDuyet, TrangThai, PhienBan) VALUES
('DXS08001', 'NCNAPI001', 'NS_BS001', N'CHUYEN_GIAI_DOAN', 'GD001', 'GD002', N'Kết quả điều trị ổn định, học viên hợp tác tốt với phác đồ', DATEADD(day, -3, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DXS08002', 'NCNAPI002', 'NS_BS002', N'RA_TRAI', 'GD002', 'GD004', N'Gia đình phối hợp tốt, học viên đủ điều kiện chuyển giai đoạn', DATEADD(day, -4, GETDATE()), DATEADD(day, -2, GETDATE()), 'NS_QL001', N'Đã xem xét hồ sơ và cập nhật trạng thái theo kết quả hội đồng', 'DA_PHE_DUYET', 0),
('DXS08003', 'NCNAPI003', 'NS_BS001', N'GIA_HAN_CAI_NGHIEN', 'GD003', NULL, N'Cần xem xét thêm do có biểu hiện lo âu và mất ngủ', DATEADD(day, -5, GETDATE()), DATEADD(day, -3, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'TU_CHOI', 0),
('DXS08004', 'NCNAPI004', 'NS_BS002', N'GIAM_THOI_HAN', 'GD004', NULL, N'Đã hoàn thành đầy đủ lịch tư vấn và hoạt động phục hồi', DATEADD(day, -6, GETDATE()), DATEADD(day, -4, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'HUY', 0),
('DXS08005', 'NCNAPI005', 'NS_BS001', N'KHAC', 'GD001', NULL, N'Bác sĩ đề nghị điều chỉnh thời hạn theo dõi để bảo đảm an toàn', DATEADD(day, -7, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DXS08006', 'NCNAPI006', 'NS_BS002', N'CHUYEN_GIAI_DOAN', 'GD002', 'GD003', N'Kết quả điều trị ổn định, học viên hợp tác tốt với phác đồ', DATEADD(day, -8, GETDATE()), DATEADD(day, -6, GETDATE()), 'NS_QL001', N'Đã xem xét hồ sơ và cập nhật trạng thái theo kết quả hội đồng', 'DA_PHE_DUYET', 0),
('DXS08007', 'NCNAPI007', 'NS_BS001', N'RA_TRAI', 'GD003', 'GD004', N'Gia đình phối hợp tốt, học viên đủ điều kiện chuyển giai đoạn', DATEADD(day, -9, GETDATE()), DATEADD(day, -7, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'TU_CHOI', 0),
('DXS08008', 'NCNAPI001', 'NS_BS002', N'GIA_HAN_CAI_NGHIEN', 'GD004', NULL, N'Cần xem xét thêm do có biểu hiện lo âu và mất ngủ', DATEADD(day, -10, GETDATE()), DATEADD(day, -8, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'HUY', 0),
('DXS08009', 'NCNAPI002', 'NS_BS001', N'GIAM_THOI_HAN', 'GD001', 'GD002', N'Đã hoàn thành đầy đủ lịch tư vấn và hoạt động phục hồi', DATEADD(day, -11, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DXS08010', 'NCNAPI003', 'NS_BS002', N'KHAC', 'GD002', NULL, N'Bác sĩ đề nghị điều chỉnh thời hạn theo dõi để bảo đảm an toàn', DATEADD(day, -12, GETDATE()), DATEADD(day, -0, GETDATE()), 'NS_QL001', N'Đã xem xét hồ sơ và cập nhật trạng thái theo kết quả hội đồng', 'DA_PHE_DUYET', 0),
('DXS08011', 'NCNAPI004', 'NS_BS001', N'CHUYEN_GIAI_DOAN', 'GD003', 'GD004', N'Kết quả điều trị ổn định, học viên hợp tác tốt với phác đồ', DATEADD(day, -13, GETDATE()), DATEADD(day, -1, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'TU_CHOI', 0),
('DXS08012', 'NCNAPI005', 'NS_BS002', N'RA_TRAI', 'GD004', 'GD004', N'Gia đình phối hợp tốt, học viên đủ điều kiện chuyển giai đoạn', DATEADD(day, -14, GETDATE()), DATEADD(day, -2, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'HUY', 0),
('DXS08013', 'NCNAPI006', 'NS_BS001', N'GIA_HAN_CAI_NGHIEN', 'GD001', NULL, N'Cần xem xét thêm do có biểu hiện lo âu và mất ngủ', DATEADD(day, -15, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DXS08014', 'NCNAPI007', 'NS_BS002', N'GIAM_THOI_HAN', 'GD002', 'GD003', N'Đã hoàn thành đầy đủ lịch tư vấn và hoạt động phục hồi', DATEADD(day, -16, GETDATE()), DATEADD(day, -4, GETDATE()), 'NS_QL001', N'Đã xem xét hồ sơ và cập nhật trạng thái theo kết quả hội đồng', 'DA_PHE_DUYET', 0),
('DXS08015', 'NCNAPI001', 'NS_BS001', N'KHAC', 'GD003', NULL, N'Bác sĩ đề nghị điều chỉnh thời hạn theo dõi để bảo đảm an toàn', DATEADD(day, -17, GETDATE()), DATEADD(day, -5, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'TU_CHOI', 0),
('DXS08016', 'NCNAPI002', 'NS_BS002', N'CHUYEN_GIAI_DOAN', 'GD004', NULL, N'Kết quả điều trị ổn định, học viên hợp tác tốt với phác đồ', DATEADD(day, -18, GETDATE()), DATEADD(day, -6, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'HUY', 0),
('DXS08017', 'NCNAPI003', 'NS_BS001', N'RA_TRAI', 'GD001', 'GD004', N'Gia đình phối hợp tốt, học viên đủ điều kiện chuyển giai đoạn', DATEADD(day, -19, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DXS08018', 'NCNAPI004', 'NS_BS002', N'GIA_HAN_CAI_NGHIEN', 'GD002', NULL, N'Cần xem xét thêm do có biểu hiện lo âu và mất ngủ', DATEADD(day, -20, GETDATE()), DATEADD(day, -8, GETDATE()), 'NS_QL001', N'Đã xem xét hồ sơ và cập nhật trạng thái theo kết quả hội đồng', 'DA_PHE_DUYET', 0),
('DXS08019', 'NCNAPI005', 'NS_BS001', N'GIAM_THOI_HAN', 'GD003', 'GD004', N'Đã hoàn thành đầy đủ lịch tư vấn và hoạt động phục hồi', DATEADD(day, -21, GETDATE()), DATEADD(day, -9, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'TU_CHOI', 0),
('DXS08020', 'NCNAPI006', 'NS_BS002', N'KHAC', 'GD004', NULL, N'Bác sĩ đề nghị điều chỉnh thời hạn theo dõi để bảo đảm an toàn', DATEADD(day, -22, GETDATE()), DATEADD(day, -0, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'HUY', 0),
('DXS08021', 'NCNAPI007', 'NS_BS001', N'CHUYEN_GIAI_DOAN', 'GD001', 'GD002', N'Kết quả điều trị ổn định, học viên hợp tác tốt với phác đồ', DATEADD(day, -23, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DXS08022', 'NCNAPI001', 'NS_BS002', N'RA_TRAI', 'GD002', 'GD004', N'Gia đình phối hợp tốt, học viên đủ điều kiện chuyển giai đoạn', DATEADD(day, -24, GETDATE()), DATEADD(day, -2, GETDATE()), 'NS_QL001', N'Đã xem xét hồ sơ và cập nhật trạng thái theo kết quả hội đồng', 'DA_PHE_DUYET', 0),
('DXS08023', 'NCNAPI002', 'NS_BS001', N'GIA_HAN_CAI_NGHIEN', 'GD003', NULL, N'Cần xem xét thêm do có biểu hiện lo âu và mất ngủ', DATEADD(day, -25, GETDATE()), DATEADD(day, -3, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'TU_CHOI', 0),
('DXS08024', 'NCNAPI003', 'NS_BS002', N'GIAM_THOI_HAN', 'GD004', NULL, N'Đã hoàn thành đầy đủ lịch tư vấn và hoạt động phục hồi', DATEADD(day, -26, GETDATE()), DATEADD(day, -4, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'HUY', 0),
('DXS08025', 'NCNAPI004', 'NS_BS001', N'KHAC', 'GD001', NULL, N'Bác sĩ đề nghị điều chỉnh thời hạn theo dõi để bảo đảm an toàn', DATEADD(day, -27, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DXS08026', 'NCNAPI005', 'NS_BS002', N'CHUYEN_GIAI_DOAN', 'GD002', 'GD003', N'Kết quả điều trị ổn định, học viên hợp tác tốt với phác đồ', DATEADD(day, -28, GETDATE()), DATEADD(day, -6, GETDATE()), 'NS_QL001', N'Đã xem xét hồ sơ và cập nhật trạng thái theo kết quả hội đồng', 'DA_PHE_DUYET', 0),
('DXS08027', 'NCNAPI006', 'NS_BS001', N'RA_TRAI', 'GD003', 'GD004', N'Gia đình phối hợp tốt, học viên đủ điều kiện chuyển giai đoạn', DATEADD(day, -29, GETDATE()), DATEADD(day, -7, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'TU_CHOI', 0),
('DXS08028', 'NCNAPI007', 'NS_BS002', N'GIA_HAN_CAI_NGHIEN', 'GD004', NULL, N'Cần xem xét thêm do có biểu hiện lo âu và mất ngủ', DATEADD(day, -30, GETDATE()), DATEADD(day, -8, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'HUY', 0),
('DXS08029', 'NCNAPI001', 'NS_BS001', N'GIAM_THOI_HAN', 'GD001', 'GD002', N'Đã hoàn thành đầy đủ lịch tư vấn và hoạt động phục hồi', DATEADD(day, -31, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DXS08030', 'NCNAPI002', 'NS_BS002', N'KHAC', 'GD002', NULL, N'Bác sĩ đề nghị điều chỉnh thời hạn theo dõi để bảo đảm an toàn', DATEADD(day, -32, GETDATE()), DATEADD(day, -0, GETDATE()), 'NS_QL001', N'Đã xem xét hồ sơ và cập nhật trạng thái theo kết quả hội đồng', 'DA_PHE_DUYET', 0),
('DXS08031', 'NCNAPI003', 'NS_BS001', N'CHUYEN_GIAI_DOAN', 'GD003', 'GD004', N'Kết quả điều trị ổn định, học viên hợp tác tốt với phác đồ', DATEADD(day, -33, GETDATE()), DATEADD(day, -1, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'TU_CHOI', 0),
('DXS08032', 'NCNAPI004', 'NS_BS002', N'RA_TRAI', 'GD004', 'GD004', N'Gia đình phối hợp tốt, học viên đủ điều kiện chuyển giai đoạn', DATEADD(day, -34, GETDATE()), DATEADD(day, -2, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'HUY', 0),
('DXS08033', 'NCNAPI005', 'NS_BS001', N'GIA_HAN_CAI_NGHIEN', 'GD001', NULL, N'Cần xem xét thêm do có biểu hiện lo âu và mất ngủ', DATEADD(day, -35, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DXS08034', 'NCNAPI006', 'NS_BS002', N'GIAM_THOI_HAN', 'GD002', 'GD003', N'Đã hoàn thành đầy đủ lịch tư vấn và hoạt động phục hồi', DATEADD(day, -36, GETDATE()), DATEADD(day, -4, GETDATE()), 'NS_QL001', N'Đã xem xét hồ sơ và cập nhật trạng thái theo kết quả hội đồng', 'DA_PHE_DUYET', 0),
('DXS08035', 'NCNAPI007', 'NS_BS001', N'KHAC', 'GD003', NULL, N'Bác sĩ đề nghị điều chỉnh thời hạn theo dõi để bảo đảm an toàn', DATEADD(day, -37, GETDATE()), DATEADD(day, -5, GETDATE()), 'NS_QL001', N'Chưa đủ điều kiện, cần theo dõi thêm', 'TU_CHOI', 0);

/* ============================================================
   5. PHIEU HO TRO - 60 DONG DE TEST THONG KE HO TRO
   ============================================================ */
INSERT INTO PhieuHoTro (MaYeuCau, MaNguoiThan, TieuDe, NoiDungYeuCau, NgayGui, TrangThai, NoiDungPhanHoi, MaNhanVien, NgayPhanHoi) VALUES
('YCS08001', @NT1, N'Hỏi thăm tình hình sức khỏe trong tuần', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -2, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đã ghi nhận và phản hồi thông tin cơ bản, học viên đang ổn định.', 'NS_STF01', DATEADD(hour, -1, GETDATE())),
('YCS08002', @NT2, N'Xin hướng dẫn thủ tục thăm gặp', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -3, GETDATE()), 'DA_PHAN_HOI', N'Gia đình vui lòng mang CCCD bản gốc và đến trước giờ hẹn 15 phút.', 'NS_STF01', DATEADD(hour, -2, GETDATE())),
('YCS08003', @NT3, N'Đề nghị cập nhật lộ trình phục hồi', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -4, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08004', @NT4, N'Xin gửi thêm vật dụng cá nhân', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -5, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đồng ý tiếp nhận vật dụng đúng danh mục cho phép.', 'NS_STF01', DATEADD(hour, -4, GETDATE())),
('YCS08005', @NT5, N'Gia đình cần tư vấn tâm lý', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -6, GETDATE()), 'DA_PHAN_HOI', N'Cán bộ tư vấn sẽ liên hệ gia đình trong khung giờ hành chính.', 'NS_STF01', DATEADD(hour, -5, GETDATE())),
('YCS08006', @NT1, N'Hỏi về lịch uống thuốc', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -7, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08007', @NT2, N'Đề nghị trung tâm xác nhận tình trạng học viên', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -8, GETDATE()), 'DA_PHAN_HOI', N'Gia đình vui lòng mang CCCD bản gốc và đến trước giờ hẹn 15 phút.', 'NS_STF01', DATEADD(hour, -7, GETDATE())),
('YCS08008', @NT3, N'Cần đổi ngày thăm gặp', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -9, GETDATE()), 'DA_PHAN_HOI', N'Lộ trình phục hồi đã được cập nhật trên hệ thống, gia đình có thể theo dõi trong mục tiến trình.', 'NS_STF01', DATEADD(hour, -8, GETDATE())),
('YCS08009', @NT4, N'Hỏi về quy định gửi đồ ăn', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -10, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08010', @NT5, N'Đề nghị hỗ trợ liên hệ bác sĩ phụ trách', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -11, GETDATE()), 'DA_PHAN_HOI', N'Cán bộ tư vấn sẽ liên hệ gia đình trong khung giờ hành chính.', 'NS_STF01', DATEADD(hour, -10, GETDATE())),
('YCS08011', @NT1, N'Hỏi thăm tình hình sức khỏe trong tuần', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -12, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đã ghi nhận và phản hồi thông tin cơ bản, học viên đang ổn định.', 'NS_STF01', DATEADD(hour, -11, GETDATE())),
('YCS08012', @NT2, N'Xin hướng dẫn thủ tục thăm gặp', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -13, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08013', @NT3, N'Đề nghị cập nhật lộ trình phục hồi', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -14, GETDATE()), 'DA_PHAN_HOI', N'Lộ trình phục hồi đã được cập nhật trên hệ thống, gia đình có thể theo dõi trong mục tiến trình.', 'NS_STF01', DATEADD(hour, -13, GETDATE())),
('YCS08014', @NT4, N'Xin gửi thêm vật dụng cá nhân', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -15, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đồng ý tiếp nhận vật dụng đúng danh mục cho phép.', 'NS_STF01', DATEADD(hour, -14, GETDATE())),
('YCS08015', @NT5, N'Gia đình cần tư vấn tâm lý', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -16, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08016', @NT1, N'Hỏi về lịch uống thuốc', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -17, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đã ghi nhận và phản hồi thông tin cơ bản, học viên đang ổn định.', 'NS_STF01', DATEADD(hour, -16, GETDATE())),
('YCS08017', @NT2, N'Đề nghị trung tâm xác nhận tình trạng học viên', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -18, GETDATE()), 'DA_PHAN_HOI', N'Gia đình vui lòng mang CCCD bản gốc và đến trước giờ hẹn 15 phút.', 'NS_STF01', DATEADD(hour, -17, GETDATE())),
('YCS08018', @NT3, N'Cần đổi ngày thăm gặp', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -19, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08019', @NT4, N'Hỏi về quy định gửi đồ ăn', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -20, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đồng ý tiếp nhận vật dụng đúng danh mục cho phép.', 'NS_STF01', DATEADD(hour, -19, GETDATE())),
('YCS08020', @NT5, N'Đề nghị hỗ trợ liên hệ bác sĩ phụ trách', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -21, GETDATE()), 'DA_PHAN_HOI', N'Cán bộ tư vấn sẽ liên hệ gia đình trong khung giờ hành chính.', 'NS_STF01', DATEADD(hour, -20, GETDATE())),
('YCS08021', @NT1, N'Hỏi thăm tình hình sức khỏe trong tuần', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -22, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08022', @NT2, N'Xin hướng dẫn thủ tục thăm gặp', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -23, GETDATE()), 'DA_PHAN_HOI', N'Gia đình vui lòng mang CCCD bản gốc và đến trước giờ hẹn 15 phút.', 'NS_STF01', DATEADD(hour, -22, GETDATE())),
('YCS08023', @NT3, N'Đề nghị cập nhật lộ trình phục hồi', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -24, GETDATE()), 'DA_PHAN_HOI', N'Lộ trình phục hồi đã được cập nhật trên hệ thống, gia đình có thể theo dõi trong mục tiến trình.', 'NS_STF01', DATEADD(hour, -23, GETDATE())),
('YCS08024', @NT4, N'Xin gửi thêm vật dụng cá nhân', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -25, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08025', @NT5, N'Gia đình cần tư vấn tâm lý', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -26, GETDATE()), 'DA_PHAN_HOI', N'Cán bộ tư vấn sẽ liên hệ gia đình trong khung giờ hành chính.', 'NS_STF01', DATEADD(hour, -25, GETDATE())),
('YCS08026', @NT1, N'Hỏi về lịch uống thuốc', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -27, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đã ghi nhận và phản hồi thông tin cơ bản, học viên đang ổn định.', 'NS_STF01', DATEADD(hour, -26, GETDATE())),
('YCS08027', @NT2, N'Đề nghị trung tâm xác nhận tình trạng học viên', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -28, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08028', @NT3, N'Cần đổi ngày thăm gặp', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -29, GETDATE()), 'DA_PHAN_HOI', N'Lộ trình phục hồi đã được cập nhật trên hệ thống, gia đình có thể theo dõi trong mục tiến trình.', 'NS_STF01', DATEADD(hour, -28, GETDATE())),
('YCS08029', @NT4, N'Hỏi về quy định gửi đồ ăn', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -30, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đồng ý tiếp nhận vật dụng đúng danh mục cho phép.', 'NS_STF01', DATEADD(hour, -29, GETDATE())),
('YCS08030', @NT5, N'Đề nghị hỗ trợ liên hệ bác sĩ phụ trách', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -31, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08031', @NT1, N'Hỏi thăm tình hình sức khỏe trong tuần', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -32, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đã ghi nhận và phản hồi thông tin cơ bản, học viên đang ổn định.', 'NS_STF01', DATEADD(hour, -31, GETDATE())),
('YCS08032', @NT2, N'Xin hướng dẫn thủ tục thăm gặp', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -33, GETDATE()), 'DA_PHAN_HOI', N'Gia đình vui lòng mang CCCD bản gốc và đến trước giờ hẹn 15 phút.', 'NS_STF01', DATEADD(hour, -32, GETDATE())),
('YCS08033', @NT3, N'Đề nghị cập nhật lộ trình phục hồi', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -34, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08034', @NT4, N'Xin gửi thêm vật dụng cá nhân', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -35, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đồng ý tiếp nhận vật dụng đúng danh mục cho phép.', 'NS_STF01', DATEADD(hour, -34, GETDATE())),
('YCS08035', @NT5, N'Gia đình cần tư vấn tâm lý', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -36, GETDATE()), 'DA_PHAN_HOI', N'Cán bộ tư vấn sẽ liên hệ gia đình trong khung giờ hành chính.', 'NS_STF01', DATEADD(hour, -35, GETDATE())),
('YCS08036', @NT1, N'Hỏi về lịch uống thuốc', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -37, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08037', @NT2, N'Đề nghị trung tâm xác nhận tình trạng học viên', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -38, GETDATE()), 'DA_PHAN_HOI', N'Gia đình vui lòng mang CCCD bản gốc và đến trước giờ hẹn 15 phút.', 'NS_STF01', DATEADD(hour, -37, GETDATE())),
('YCS08038', @NT3, N'Cần đổi ngày thăm gặp', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -39, GETDATE()), 'DA_PHAN_HOI', N'Lộ trình phục hồi đã được cập nhật trên hệ thống, gia đình có thể theo dõi trong mục tiến trình.', 'NS_STF01', DATEADD(hour, -38, GETDATE())),
('YCS08039', @NT4, N'Hỏi về quy định gửi đồ ăn', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -40, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08040', @NT5, N'Đề nghị hỗ trợ liên hệ bác sĩ phụ trách', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -41, GETDATE()), 'DA_PHAN_HOI', N'Cán bộ tư vấn sẽ liên hệ gia đình trong khung giờ hành chính.', 'NS_STF01', DATEADD(hour, -40, GETDATE())),
('YCS08041', @NT1, N'Hỏi thăm tình hình sức khỏe trong tuần', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -42, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đã ghi nhận và phản hồi thông tin cơ bản, học viên đang ổn định.', 'NS_STF01', DATEADD(hour, -41, GETDATE())),
('YCS08042', @NT2, N'Xin hướng dẫn thủ tục thăm gặp', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -43, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08043', @NT3, N'Đề nghị cập nhật lộ trình phục hồi', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -44, GETDATE()), 'DA_PHAN_HOI', N'Lộ trình phục hồi đã được cập nhật trên hệ thống, gia đình có thể theo dõi trong mục tiến trình.', 'NS_STF01', DATEADD(hour, -43, GETDATE())),
('YCS08044', @NT4, N'Xin gửi thêm vật dụng cá nhân', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -45, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đồng ý tiếp nhận vật dụng đúng danh mục cho phép.', 'NS_STF01', DATEADD(hour, -44, GETDATE())),
('YCS08045', @NT5, N'Gia đình cần tư vấn tâm lý', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -1, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08046', @NT1, N'Hỏi về lịch uống thuốc', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -2, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đã ghi nhận và phản hồi thông tin cơ bản, học viên đang ổn định.', 'NS_STF01', DATEADD(hour, -46, GETDATE())),
('YCS08047', @NT2, N'Đề nghị trung tâm xác nhận tình trạng học viên', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -3, GETDATE()), 'DA_PHAN_HOI', N'Gia đình vui lòng mang CCCD bản gốc và đến trước giờ hẹn 15 phút.', 'NS_STF01', DATEADD(hour, -47, GETDATE())),
('YCS08048', @NT3, N'Cần đổi ngày thăm gặp', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -4, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08049', @NT4, N'Hỏi về quy định gửi đồ ăn', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -5, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đồng ý tiếp nhận vật dụng đúng danh mục cho phép.', 'NS_STF01', DATEADD(hour, -1, GETDATE())),
('YCS08050', @NT5, N'Đề nghị hỗ trợ liên hệ bác sĩ phụ trách', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -6, GETDATE()), 'DA_PHAN_HOI', N'Cán bộ tư vấn sẽ liên hệ gia đình trong khung giờ hành chính.', 'NS_STF01', DATEADD(hour, -2, GETDATE())),
('YCS08051', @NT1, N'Hỏi thăm tình hình sức khỏe trong tuần', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -7, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08052', @NT2, N'Xin hướng dẫn thủ tục thăm gặp', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -8, GETDATE()), 'DA_PHAN_HOI', N'Gia đình vui lòng mang CCCD bản gốc và đến trước giờ hẹn 15 phút.', 'NS_STF01', DATEADD(hour, -4, GETDATE())),
('YCS08053', @NT3, N'Đề nghị cập nhật lộ trình phục hồi', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -9, GETDATE()), 'DA_PHAN_HOI', N'Lộ trình phục hồi đã được cập nhật trên hệ thống, gia đình có thể theo dõi trong mục tiến trình.', 'NS_STF01', DATEADD(hour, -5, GETDATE())),
('YCS08054', @NT4, N'Xin gửi thêm vật dụng cá nhân', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -10, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08055', @NT5, N'Gia đình cần tư vấn tâm lý', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -11, GETDATE()), 'DA_PHAN_HOI', N'Cán bộ tư vấn sẽ liên hệ gia đình trong khung giờ hành chính.', 'NS_STF01', DATEADD(hour, -7, GETDATE())),
('YCS08056', @NT1, N'Hỏi về lịch uống thuốc', N'Gia đình mong được cập nhật tình hình sức khỏe, ăn uống và giấc ngủ của học viên.', DATEADD(day, -12, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đã ghi nhận và phản hồi thông tin cơ bản, học viên đang ổn định.', 'NS_STF01', DATEADD(hour, -8, GETDATE())),
('YCS08057', @NT2, N'Đề nghị trung tâm xác nhận tình trạng học viên', N'Gia đình chưa rõ quy định về giấy tờ, thời gian và số người đi cùng khi thăm gặp.', DATEADD(day, -13, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL),
('YCS08058', @NT3, N'Cần đổi ngày thăm gặp', N'Gia đình muốn xem tiến độ phục hồi và giai đoạn điều trị hiện tại của học viên.', DATEADD(day, -14, GETDATE()), 'DA_PHAN_HOI', N'Lộ trình phục hồi đã được cập nhật trên hệ thống, gia đình có thể theo dõi trong mục tiến trình.', 'NS_STF01', DATEADD(hour, -10, GETDATE())),
('YCS08059', @NT4, N'Hỏi về quy định gửi đồ ăn', N'Gia đình muốn gửi thêm quần áo, sách đọc và đồ dùng cá nhân theo quy định.', DATEADD(day, -15, GETDATE()), 'DA_PHAN_HOI', N'Trung tâm đồng ý tiếp nhận vật dụng đúng danh mục cho phép.', 'NS_STF01', DATEADD(hour, -11, GETDATE())),
('YCS08060', @NT5, N'Đề nghị hỗ trợ liên hệ bác sĩ phụ trách', N'Gia đình cần trao đổi với cán bộ tư vấn để phối hợp động viên học viên.', DATEADD(day, -16, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL);

/* ============================================================
   6. THONG BAO - 80 DONG DE TEST BADGE/NOTIFICATION/DASHBOARD
   ============================================================ */
INSERT INTO ThongBao (MaThongBao, MaNhanVien, TieuDe, NoiDung, NgayTao, LoaiThongBao, TrangThai, MaNguoiDungNhan) VALUES
('TBS08001', 'NS_STF01', N'Lịch thăm gặp tuần này', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -3, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08002', 'NS_STF01', N'Nhắc hoàn tất điểm danh', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -6, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08003', 'NS_STF01', N'Cập nhật quy định gửi vật dụng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -9, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08004', 'NS_STF01', N'Thông báo lịch tư vấn tâm lý', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -12, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08005', 'NS_STF01', N'Cập nhật phác đồ điều trị', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -15, GETDATE()), 'CaNhan', 'CHUA_DOC', @UserFamily5),
('TBS08006', 'NS_STF01', N'Thông báo họp giao ban nội bộ', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -18, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08007', 'NS_STF01', N'Kết quả xử lý yêu cầu hỗ trợ', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -21, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08008', 'NS_STF01', N'Nhắc lịch uống thuốc buổi sáng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -24, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08009', 'NS_STF01', N'Thông báo bảo trì hệ thống', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -27, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08010', 'NS_STF01', N'Nhắc cập nhật hồ sơ bệnh án', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -30, GETDATE()), 'CaNhan', 'DA_DOC', @UserFamily1),
('TBS08011', 'NS_STF01', N'Lịch thăm gặp tuần này', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -33, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08012', 'NS_STF01', N'Nhắc hoàn tất điểm danh', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -36, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08013', 'NS_STF01', N'Cập nhật quy định gửi vật dụng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -39, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08014', 'NS_STF01', N'Thông báo lịch tư vấn tâm lý', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -42, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08015', 'NS_STF01', N'Cập nhật phác đồ điều trị', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -45, GETDATE()), 'CaNhan', 'DA_DOC', @UserDoctor),
('TBS08016', 'NS_STF01', N'Thông báo họp giao ban nội bộ', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -48, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08017', 'NS_STF01', N'Kết quả xử lý yêu cầu hỗ trợ', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -51, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08018', 'NS_STF01', N'Nhắc lịch uống thuốc buổi sáng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -54, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08019', 'NS_STF01', N'Thông báo bảo trì hệ thống', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -57, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08020', 'NS_STF01', N'Nhắc cập nhật hồ sơ bệnh án', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -60, GETDATE()), 'CaNhan', 'CHUA_DOC', @UserFamily2),
('TBS08021', 'NS_STF01', N'Lịch thăm gặp tuần này', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -63, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08022', 'NS_STF01', N'Nhắc hoàn tất điểm danh', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -66, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08023', 'NS_STF01', N'Cập nhật quy định gửi vật dụng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -69, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08024', 'NS_STF01', N'Thông báo lịch tư vấn tâm lý', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -72, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08025', 'NS_STF01', N'Cập nhật phác đồ điều trị', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -75, GETDATE()), 'CaNhan', 'CHUA_DOC', @UserManager),
('TBS08026', 'NS_STF01', N'Thông báo họp giao ban nội bộ', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -78, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08027', 'NS_STF01', N'Kết quả xử lý yêu cầu hỗ trợ', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -81, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08028', 'NS_STF01', N'Nhắc lịch uống thuốc buổi sáng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -84, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08029', 'NS_STF01', N'Thông báo bảo trì hệ thống', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -87, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08030', 'NS_STF01', N'Nhắc cập nhật hồ sơ bệnh án', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -90, GETDATE()), 'CaNhan', 'DA_DOC', @UserFamily3),
('TBS08031', 'NS_STF01', N'Lịch thăm gặp tuần này', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -93, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08032', 'NS_STF01', N'Nhắc hoàn tất điểm danh', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -96, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08033', 'NS_STF01', N'Cập nhật quy định gửi vật dụng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -99, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08034', 'NS_STF01', N'Thông báo lịch tư vấn tâm lý', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -102, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08035', 'NS_STF01', N'Cập nhật phác đồ điều trị', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -105, GETDATE()), 'CaNhan', 'DA_DOC', @UserLeader),
('TBS08036', 'NS_STF01', N'Thông báo họp giao ban nội bộ', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -108, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08037', 'NS_STF01', N'Kết quả xử lý yêu cầu hỗ trợ', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -111, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08038', 'NS_STF01', N'Nhắc lịch uống thuốc buổi sáng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -114, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08039', 'NS_STF01', N'Thông báo bảo trì hệ thống', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -117, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08040', 'NS_STF01', N'Nhắc cập nhật hồ sơ bệnh án', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -120, GETDATE()), 'CaNhan', 'CHUA_DOC', @UserFamily4),
('TBS08041', 'NS_STF01', N'Lịch thăm gặp tuần này', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -123, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08042', 'NS_STF01', N'Nhắc hoàn tất điểm danh', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -126, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08043', 'NS_STF01', N'Cập nhật quy định gửi vật dụng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -129, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08044', 'NS_STF01', N'Thông báo lịch tư vấn tâm lý', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -132, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08045', 'NS_STF01', N'Cập nhật phác đồ điều trị', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -135, GETDATE()), 'CaNhan', 'CHUA_DOC', @UserAdmin),
('TBS08046', 'NS_STF01', N'Thông báo họp giao ban nội bộ', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -138, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08047', 'NS_STF01', N'Kết quả xử lý yêu cầu hỗ trợ', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -141, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08048', 'NS_STF01', N'Nhắc lịch uống thuốc buổi sáng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -144, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08049', 'NS_STF01', N'Thông báo bảo trì hệ thống', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -147, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08050', 'NS_STF01', N'Nhắc cập nhật hồ sơ bệnh án', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -150, GETDATE()), 'CaNhan', 'DA_DOC', @UserFamily5),
('TBS08051', 'NS_STF01', N'Lịch thăm gặp tuần này', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -153, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08052', 'NS_STF01', N'Nhắc hoàn tất điểm danh', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -156, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08053', 'NS_STF01', N'Cập nhật quy định gửi vật dụng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -159, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08054', 'NS_STF01', N'Thông báo lịch tư vấn tâm lý', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -162, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08055', 'NS_STF01', N'Cập nhật phác đồ điều trị', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -165, GETDATE()), 'CaNhan', 'DA_DOC', @UserFamily1),
('TBS08056', 'NS_STF01', N'Thông báo họp giao ban nội bộ', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -168, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08057', 'NS_STF01', N'Kết quả xử lý yêu cầu hỗ trợ', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -171, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08058', 'NS_STF01', N'Nhắc lịch uống thuốc buổi sáng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -174, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08059', 'NS_STF01', N'Thông báo bảo trì hệ thống', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -177, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08060', 'NS_STF01', N'Nhắc cập nhật hồ sơ bệnh án', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -180, GETDATE()), 'CaNhan', 'CHUA_DOC', @UserDoctor),
('TBS08061', 'NS_STF01', N'Lịch thăm gặp tuần này', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -183, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08062', 'NS_STF01', N'Nhắc hoàn tất điểm danh', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -186, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08063', 'NS_STF01', N'Cập nhật quy định gửi vật dụng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -189, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08064', 'NS_STF01', N'Thông báo lịch tư vấn tâm lý', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -192, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08065', 'NS_STF01', N'Cập nhật phác đồ điều trị', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -195, GETDATE()), 'CaNhan', 'CHUA_DOC', @UserFamily2),
('TBS08066', 'NS_STF01', N'Thông báo họp giao ban nội bộ', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -198, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08067', 'NS_STF01', N'Kết quả xử lý yêu cầu hỗ trợ', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -201, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08068', 'NS_STF01', N'Nhắc lịch uống thuốc buổi sáng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -204, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08069', 'NS_STF01', N'Thông báo bảo trì hệ thống', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -207, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08070', 'NS_STF01', N'Nhắc cập nhật hồ sơ bệnh án', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -210, GETDATE()), 'CaNhan', 'DA_DOC', @UserManager),
('TBS08071', 'NS_STF01', N'Lịch thăm gặp tuần này', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -213, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08072', 'NS_STF01', N'Nhắc hoàn tất điểm danh', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -216, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08073', 'NS_STF01', N'Cập nhật quy định gửi vật dụng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -219, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08074', 'NS_STF01', N'Thông báo lịch tư vấn tâm lý', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -222, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08075', 'NS_STF01', N'Cập nhật phác đồ điều trị', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -225, GETDATE()), 'CaNhan', 'DA_DOC', @UserFamily3),
('TBS08076', 'NS_STF01', N'Thông báo họp giao ban nội bộ', N'Trung tâm cập nhật lịch thăm gặp mới, gia đình vui lòng theo dõi trên hệ thống.', DATEADD(hour, -228, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TBS08077', 'NS_STF01', N'Kết quả xử lý yêu cầu hỗ trợ', N'Cán bộ phụ trách hoàn tất điểm danh học viên trong ngày trước 17:00.', DATEADD(hour, -231, GETDATE()), 'TatCa', 'CHUA_DOC', NULL),
('TBS08078', 'NS_STF01', N'Nhắc lịch uống thuốc buổi sáng', N'Danh mục vật dụng được phép gửi đã được cập nhật theo quy định mới.', DATEADD(hour, -234, GETDATE()), 'NoiBo', 'DA_DOC', NULL),
('TBS08079', 'NS_STF01', N'Thông báo bảo trì hệ thống', N'Lịch tư vấn tâm lý đã được sắp xếp, vui lòng kiểm tra chi tiết trong dashboard.', DATEADD(hour, -237, GETDATE()), 'TatCa', 'DA_DOC', NULL),
('TBS08080', 'NS_STF01', N'Nhắc cập nhật hồ sơ bệnh án', N'Phác đồ điều trị có thay đổi, cán bộ liên quan cần kiểm tra và xác nhận.', DATEADD(hour, -240, GETDATE()), 'CaNhan', 'CHUA_DOC', @UserLeader);

/* ============================================================
   7. PHIEU THAM GAP - 70 DONG CO CAC TRANG THAI KHAC NHAU
   ============================================================ */
INSERT INTO PhieuThamGap (MaNguoiThan, MaNguoiCaiNghien, LoaiThamGap, NgayTham, CaTham, TrangThai, NgayTao, MaNhanSu) VALUES
(@NT1, 'NCNAPI001', 1, '2026-08-01', 2, 'CHO_DUYET', DATEADD(day, -2, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI002', 1, '2026-08-02', 3, 'DA_DONG_Y', DATEADD(day, -3, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI003', 1, '2026-08-03', 1, 'HOAN_THANH', DATEADD(day, -4, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI004', 2, '2026-08-04', 2, 'TU_CHOI', DATEADD(day, -5, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI005', 1, '2026-08-05', 3, 'HUY', DATEADD(day, -6, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI006', 1, '2026-08-06', 1, 'CHO_DUYET', DATEADD(day, -7, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI007', 1, '2026-08-07', 2, 'DA_DONG_Y', DATEADD(day, -8, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI001', 2, '2026-08-08', 3, 'HOAN_THANH', DATEADD(day, -9, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI002', 1, '2026-08-09', 1, 'TU_CHOI', DATEADD(day, -10, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI003', 1, '2026-08-10', 2, 'HUY', DATEADD(day, -11, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI004', 1, '2026-08-11', 3, 'CHO_DUYET', DATEADD(day, -12, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI005', 2, '2026-08-12', 1, 'DA_DONG_Y', DATEADD(day, -13, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI006', 1, '2026-08-13', 2, 'HOAN_THANH', DATEADD(day, -14, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI007', 1, '2026-08-14', 3, 'TU_CHOI', DATEADD(day, -15, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI001', 1, '2026-08-15', 1, 'HUY', DATEADD(day, -16, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI002', 2, '2026-08-16', 2, 'CHO_DUYET', DATEADD(day, -17, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI003', 1, '2026-08-17', 3, 'DA_DONG_Y', DATEADD(day, -18, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI004', 1, '2026-08-18', 1, 'HOAN_THANH', DATEADD(day, -19, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI005', 1, '2026-08-19', 2, 'TU_CHOI', DATEADD(day, -20, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI006', 2, '2026-08-20', 3, 'HUY', DATEADD(day, -1, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI007', 1, '2026-08-21', 1, 'CHO_DUYET', DATEADD(day, -2, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI001', 1, '2026-08-22', 2, 'DA_DONG_Y', DATEADD(day, -3, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI002', 1, '2026-08-23', 3, 'HOAN_THANH', DATEADD(day, -4, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI003', 2, '2026-08-24', 1, 'TU_CHOI', DATEADD(day, -5, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI004', 1, '2026-08-25', 2, 'HUY', DATEADD(day, -6, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI005', 1, '2026-08-26', 3, 'CHO_DUYET', DATEADD(day, -7, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI006', 1, '2026-08-27', 1, 'DA_DONG_Y', DATEADD(day, -8, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI007', 2, '2026-08-28', 2, 'HOAN_THANH', DATEADD(day, -9, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI001', 1, '2026-08-29', 3, 'TU_CHOI', DATEADD(day, -10, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI002', 1, '2026-08-30', 1, 'HUY', DATEADD(day, -11, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI003', 1, '2026-08-31', 2, 'CHO_DUYET', DATEADD(day, -12, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI004', 2, '2026-09-01', 3, 'DA_DONG_Y', DATEADD(day, -13, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI005', 1, '2026-09-02', 1, 'HOAN_THANH', DATEADD(day, -14, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI006', 1, '2026-09-03', 2, 'TU_CHOI', DATEADD(day, -15, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI007', 1, '2026-09-04', 3, 'HUY', DATEADD(day, -16, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI001', 2, '2026-09-05', 1, 'CHO_DUYET', DATEADD(day, -17, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI002', 1, '2026-09-06', 2, 'DA_DONG_Y', DATEADD(day, -18, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI003', 1, '2026-09-07', 3, 'HOAN_THANH', DATEADD(day, -19, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI004', 1, '2026-09-08', 1, 'TU_CHOI', DATEADD(day, -20, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI005', 2, '2026-09-09', 2, 'HUY', DATEADD(day, -1, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI006', 1, '2026-09-10', 3, 'CHO_DUYET', DATEADD(day, -2, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI007', 1, '2026-09-11', 1, 'DA_DONG_Y', DATEADD(day, -3, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI001', 1, '2026-09-12', 2, 'HOAN_THANH', DATEADD(day, -4, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI002', 2, '2026-09-13', 3, 'TU_CHOI', DATEADD(day, -5, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI003', 1, '2026-09-14', 1, 'HUY', DATEADD(day, -6, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI004', 1, '2026-09-15', 2, 'CHO_DUYET', DATEADD(day, -7, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI005', 1, '2026-09-16', 3, 'DA_DONG_Y', DATEADD(day, -8, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI006', 2, '2026-09-17', 1, 'HOAN_THANH', DATEADD(day, -9, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI007', 1, '2026-09-18', 2, 'TU_CHOI', DATEADD(day, -10, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI001', 1, '2026-09-19', 3, 'HUY', DATEADD(day, -11, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI002', 1, '2026-09-20', 1, 'CHO_DUYET', DATEADD(day, -12, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI003', 2, '2026-09-21', 2, 'DA_DONG_Y', DATEADD(day, -13, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI004', 1, '2026-09-22', 3, 'HOAN_THANH', DATEADD(day, -14, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI005', 1, '2026-09-23', 1, 'TU_CHOI', DATEADD(day, -15, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI006', 1, '2026-09-24', 2, 'HUY', DATEADD(day, -16, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI007', 2, '2026-09-25', 3, 'CHO_DUYET', DATEADD(day, -17, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI001', 1, '2026-09-26', 1, 'DA_DONG_Y', DATEADD(day, -18, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI002', 1, '2026-09-27', 2, 'HOAN_THANH', DATEADD(day, -19, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI003', 1, '2026-09-28', 3, 'TU_CHOI', DATEADD(day, -20, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI004', 2, '2026-09-29', 1, 'HUY', DATEADD(day, -1, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI005', 1, '2026-08-01', 2, 'CHO_DUYET', DATEADD(day, -2, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI006', 1, '2026-08-02', 3, 'DA_DONG_Y', DATEADD(day, -3, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI007', 1, '2026-08-03', 1, 'HOAN_THANH', DATEADD(day, -4, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI001', 2, '2026-08-04', 2, 'TU_CHOI', DATEADD(day, -5, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI002', 1, '2026-08-05', 3, 'HUY', DATEADD(day, -6, GETDATE()), 'NS_STF01'),
(@NT1, 'NCNAPI003', 1, '2026-08-06', 1, 'CHO_DUYET', DATEADD(day, -7, GETDATE()), 'NS_STF01'),
(@NT2, 'NCNAPI004', 1, '2026-08-07', 2, 'DA_DONG_Y', DATEADD(day, -8, GETDATE()), 'NS_STF01'),
(@NT3, 'NCNAPI005', 2, '2026-08-08', 3, 'HOAN_THANH', DATEADD(day, -9, GETDATE()), 'NS_STF01'),
(@NT4, 'NCNAPI006', 1, '2026-08-09', 1, 'TU_CHOI', DATEADD(day, -10, GETDATE()), 'NS_STF01'),
(@NT5, 'NCNAPI007', 1, '2026-08-10', 2, 'HUY', DATEADD(day, -11, GETDATE()), 'NS_STF01');

/* ============================================================
   8. NGUOI DI CUNG - GAN VOI CAC PHIEU THAM GAP VUA INSERT
   ============================================================ */
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Nguyễn Văn Minh', 1, '048299080001', N'Em trai', 'https://picsum.photos/seed/visitor-s08-001/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI001' AND NgayTham = '2026-08-01' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Trần Thị Hạnh', 1, '048299080002', N'Chị gái', 'https://picsum.photos/seed/visitor-s08-002/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI002' AND NgayTham = '2026-08-02' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Lê Quốc Cường', 1, '048299080003', N'Cha', 'https://picsum.photos/seed/visitor-s08-003/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI003' AND NgayTham = '2026-08-03' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Phạm Thị Duyên', 1, '048299080004', N'Mẹ', 'https://picsum.photos/seed/visitor-s08-004/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI004' AND NgayTham = '2026-08-04' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Hoàng Văn Phúc', 1, '048299080005', N'Anh trai', 'https://picsum.photos/seed/visitor-s08-005/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI005' AND NgayTham = '2026-08-05' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Võ Thị Ngọc', 1, '048299080006', N'Cô ruột', 'https://picsum.photos/seed/visitor-s08-006/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI006' AND NgayTham = '2026-08-06' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Bùi Thanh Tùng', 1, '048299080007', N'Chú', 'https://picsum.photos/seed/visitor-s08-007/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI007' AND NgayTham = '2026-08-07' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Đặng Thị Hoa', 1, '048299080008', N'Vợ', 'https://picsum.photos/seed/visitor-s08-008/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI001' AND NgayTham = '2026-08-08' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Phan Quốc Bảo', 1, '048299080009', N'Chồng', 'https://picsum.photos/seed/visitor-s08-009/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI002' AND NgayTham = '2026-08-09' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Ngô Thị Yến', 1, '048299080010', N'Người giám hộ', 'https://picsum.photos/seed/visitor-s08-010/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI003' AND NgayTham = '2026-08-10' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Nguyễn Văn Minh', 1, '048299080011', N'Em trai', 'https://picsum.photos/seed/visitor-s08-011/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI004' AND NgayTham = '2026-08-11' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Trần Thị Hạnh', 1, '048299080012', N'Chị gái', 'https://picsum.photos/seed/visitor-s08-012/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI005' AND NgayTham = '2026-08-12' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Lê Quốc Cường', 1, '048299080013', N'Cha', 'https://picsum.photos/seed/visitor-s08-013/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI006' AND NgayTham = '2026-08-13' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Phạm Thị Duyên', 1, '048299080014', N'Mẹ', 'https://picsum.photos/seed/visitor-s08-014/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI007' AND NgayTham = '2026-08-14' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Hoàng Văn Phúc', 1, '048299080015', N'Anh trai', 'https://picsum.photos/seed/visitor-s08-015/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI001' AND NgayTham = '2026-08-15' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Võ Thị Ngọc', 1, '048299080016', N'Cô ruột', 'https://picsum.photos/seed/visitor-s08-016/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI002' AND NgayTham = '2026-08-16' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Bùi Thanh Tùng', 1, '048299080017', N'Chú', 'https://picsum.photos/seed/visitor-s08-017/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI003' AND NgayTham = '2026-08-17' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Đặng Thị Hoa', 1, '048299080018', N'Vợ', 'https://picsum.photos/seed/visitor-s08-018/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI004' AND NgayTham = '2026-08-18' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Phan Quốc Bảo', 1, '048299080019', N'Chồng', 'https://picsum.photos/seed/visitor-s08-019/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI005' AND NgayTham = '2026-08-19' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Ngô Thị Yến', 1, '048299080020', N'Người giám hộ', 'https://picsum.photos/seed/visitor-s08-020/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI006' AND NgayTham = '2026-08-20' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Nguyễn Văn Minh', 1, '048299080021', N'Em trai', 'https://picsum.photos/seed/visitor-s08-021/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI007' AND NgayTham = '2026-08-21' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Trần Thị Hạnh', 1, '048299080022', N'Chị gái', 'https://picsum.photos/seed/visitor-s08-022/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI001' AND NgayTham = '2026-08-22' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Lê Quốc Cường', 1, '048299080023', N'Cha', 'https://picsum.photos/seed/visitor-s08-023/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI002' AND NgayTham = '2026-08-23' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Phạm Thị Duyên', 1, '048299080024', N'Mẹ', 'https://picsum.photos/seed/visitor-s08-024/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI003' AND NgayTham = '2026-08-24' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Hoàng Văn Phúc', 1, '048299080025', N'Anh trai', 'https://picsum.photos/seed/visitor-s08-025/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI004' AND NgayTham = '2026-08-25' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Võ Thị Ngọc', 1, '048299080026', N'Cô ruột', 'https://picsum.photos/seed/visitor-s08-026/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI005' AND NgayTham = '2026-08-26' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Bùi Thanh Tùng', 1, '048299080027', N'Chú', 'https://picsum.photos/seed/visitor-s08-027/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI006' AND NgayTham = '2026-08-27' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Đặng Thị Hoa', 1, '048299080028', N'Vợ', 'https://picsum.photos/seed/visitor-s08-028/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI007' AND NgayTham = '2026-08-28' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Phan Quốc Bảo', 1, '048299080029', N'Chồng', 'https://picsum.photos/seed/visitor-s08-029/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI001' AND NgayTham = '2026-08-29' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Ngô Thị Yến', 1, '048299080030', N'Người giám hộ', 'https://picsum.photos/seed/visitor-s08-030/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI002' AND NgayTham = '2026-08-30' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Nguyễn Văn Minh', 1, '048299080031', N'Em trai', 'https://picsum.photos/seed/visitor-s08-031/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI003' AND NgayTham = '2026-08-31' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Trần Thị Hạnh', 1, '048299080032', N'Chị gái', 'https://picsum.photos/seed/visitor-s08-032/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI004' AND NgayTham = '2026-09-01' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Lê Quốc Cường', 1, '048299080033', N'Cha', 'https://picsum.photos/seed/visitor-s08-033/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI005' AND NgayTham = '2026-09-02' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Phạm Thị Duyên', 1, '048299080034', N'Mẹ', 'https://picsum.photos/seed/visitor-s08-034/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI006' AND NgayTham = '2026-09-03' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Hoàng Văn Phúc', 1, '048299080035', N'Anh trai', 'https://picsum.photos/seed/visitor-s08-035/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI007' AND NgayTham = '2026-09-04' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Võ Thị Ngọc', 1, '048299080036', N'Cô ruột', 'https://picsum.photos/seed/visitor-s08-036/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI001' AND NgayTham = '2026-09-05' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Bùi Thanh Tùng', 1, '048299080037', N'Chú', 'https://picsum.photos/seed/visitor-s08-037/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI002' AND NgayTham = '2026-09-06' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Đặng Thị Hoa', 1, '048299080038', N'Vợ', 'https://picsum.photos/seed/visitor-s08-038/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI003' AND NgayTham = '2026-09-07' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Phan Quốc Bảo', 1, '048299080039', N'Chồng', 'https://picsum.photos/seed/visitor-s08-039/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI004' AND NgayTham = '2026-09-08' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Ngô Thị Yến', 1, '048299080040', N'Người giám hộ', 'https://picsum.photos/seed/visitor-s08-040/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI005' AND NgayTham = '2026-09-09' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Nguyễn Văn Minh', 1, '048299080041', N'Em trai', 'https://picsum.photos/seed/visitor-s08-041/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI006' AND NgayTham = '2026-09-10' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Trần Thị Hạnh', 1, '048299080042', N'Chị gái', 'https://picsum.photos/seed/visitor-s08-042/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI007' AND NgayTham = '2026-09-11' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Lê Quốc Cường', 1, '048299080043', N'Cha', 'https://picsum.photos/seed/visitor-s08-043/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI001' AND NgayTham = '2026-09-12' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Phạm Thị Duyên', 1, '048299080044', N'Mẹ', 'https://picsum.photos/seed/visitor-s08-044/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI002' AND NgayTham = '2026-09-13' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Hoàng Văn Phúc', 1, '048299080045', N'Anh trai', 'https://picsum.photos/seed/visitor-s08-045/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI003' AND NgayTham = '2026-09-14' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Võ Thị Ngọc', 1, '048299080046', N'Cô ruột', 'https://picsum.photos/seed/visitor-s08-046/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI004' AND NgayTham = '2026-09-15' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Bùi Thanh Tùng', 1, '048299080047', N'Chú', 'https://picsum.photos/seed/visitor-s08-047/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI005' AND NgayTham = '2026-09-16' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Đặng Thị Hoa', 1, '048299080048', N'Vợ', 'https://picsum.photos/seed/visitor-s08-048/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI006' AND NgayTham = '2026-09-17' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Phan Quốc Bảo', 1, '048299080049', N'Chồng', 'https://picsum.photos/seed/visitor-s08-049/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI007' AND NgayTham = '2026-09-18' ORDER BY MaPhieu DESC;
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh)
SELECT TOP 1 MaPhieu, N'Ngô Thị Yến', 1, '048299080050', N'Người giám hộ', 'https://picsum.photos/seed/visitor-s08-050/320/320'
FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCNAPI001' AND NgayTham = '2026-09-19' ORDER BY MaPhieu DESC;

/* ============================================================
   9. LICH SINH HOAT - 30 DONG
   ============================================================ */
INSERT INTO LichSinhHoat (MaLich, MaNhanVien, MaHoatDong, ThoiGianBatDau, ThoiGianKetThuc, DiaDiem) VALUES
('LS080001', 'NS_STF01', 'HDAPI001', '2026-08-01T08:00:00', '2026-08-01T10:00:00', N'Phòng trị liệu nhóm A'),
('LS080002', 'NS_STF01', 'HDAPI002', '2026-08-02T09:00:00', '2026-08-02T11:00:00', N'Khu vườn trị liệu'),
('LS080003', 'NS_STF01', 'HDAPI003', '2026-08-03T10:00:00', '2026-08-03T12:00:00', N'Phòng học kỹ năng'),
('LS080004', 'NS_STF01', 'HDAPI004', '2026-08-04T11:00:00', '2026-08-04T13:00:00', N'Sân thể thao trung tâm'),
('LS080005', 'NS_STF01', 'HDAPI005', '2026-08-05T12:00:00', '2026-08-05T14:00:00', N'Hội trường tầng 2'),
('LS080006', 'NS_STF01', 'HDAPI001', '2026-08-06T13:00:00', '2026-08-06T15:00:00', N'Phòng sinh hoạt chung'),
('LS080007', 'NS_STF01', 'HDAPI002', '2026-08-07T14:00:00', '2026-08-07T16:00:00', N'Phòng trị liệu nhóm A'),
('LS080008', 'NS_STF01', 'HDAPI003', '2026-08-08T07:00:00', '2026-08-08T09:00:00', N'Khu vườn trị liệu'),
('LS080009', 'NS_STF01', 'HDAPI004', '2026-08-09T08:00:00', '2026-08-09T10:00:00', N'Phòng học kỹ năng'),
('LS080010', 'NS_STF01', 'HDAPI005', '2026-08-10T09:00:00', '2026-08-10T11:00:00', N'Sân thể thao trung tâm'),
('LS080011', 'NS_STF01', 'HDAPI001', '2026-08-11T10:00:00', '2026-08-11T12:00:00', N'Hội trường tầng 2'),
('LS080012', 'NS_STF01', 'HDAPI002', '2026-08-12T11:00:00', '2026-08-12T13:00:00', N'Phòng sinh hoạt chung'),
('LS080013', 'NS_STF01', 'HDAPI003', '2026-08-13T12:00:00', '2026-08-13T14:00:00', N'Phòng trị liệu nhóm A'),
('LS080014', 'NS_STF01', 'HDAPI004', '2026-08-14T13:00:00', '2026-08-14T15:00:00', N'Khu vườn trị liệu'),
('LS080015', 'NS_STF01', 'HDAPI005', '2026-08-15T14:00:00', '2026-08-15T16:00:00', N'Phòng học kỹ năng'),
('LS080016', 'NS_STF01', 'HDAPI001', '2026-08-16T07:00:00', '2026-08-16T09:00:00', N'Sân thể thao trung tâm'),
('LS080017', 'NS_STF01', 'HDAPI002', '2026-08-17T08:00:00', '2026-08-17T10:00:00', N'Hội trường tầng 2'),
('LS080018', 'NS_STF01', 'HDAPI003', '2026-08-18T09:00:00', '2026-08-18T11:00:00', N'Phòng sinh hoạt chung'),
('LS080019', 'NS_STF01', 'HDAPI004', '2026-08-19T10:00:00', '2026-08-19T12:00:00', N'Phòng trị liệu nhóm A'),
('LS080020', 'NS_STF01', 'HDAPI005', '2026-08-20T11:00:00', '2026-08-20T13:00:00', N'Khu vườn trị liệu'),
('LS080021', 'NS_STF01', 'HDAPI001', '2026-08-21T12:00:00', '2026-08-21T14:00:00', N'Phòng học kỹ năng'),
('LS080022', 'NS_STF01', 'HDAPI002', '2026-08-22T13:00:00', '2026-08-22T15:00:00', N'Sân thể thao trung tâm'),
('LS080023', 'NS_STF01', 'HDAPI003', '2026-08-23T14:00:00', '2026-08-23T16:00:00', N'Hội trường tầng 2'),
('LS080024', 'NS_STF01', 'HDAPI004', '2026-08-24T07:00:00', '2026-08-24T09:00:00', N'Phòng sinh hoạt chung'),
('LS080025', 'NS_STF01', 'HDAPI005', '2026-08-25T08:00:00', '2026-08-25T10:00:00', N'Phòng trị liệu nhóm A'),
('LS080026', 'NS_STF01', 'HDAPI001', '2026-08-26T09:00:00', '2026-08-26T11:00:00', N'Khu vườn trị liệu'),
('LS080027', 'NS_STF01', 'HDAPI002', '2026-08-27T10:00:00', '2026-08-27T12:00:00', N'Phòng học kỹ năng'),
('LS080028', 'NS_STF01', 'HDAPI003', '2026-08-28T11:00:00', '2026-08-28T13:00:00', N'Sân thể thao trung tâm'),
('LS080029', 'NS_STF01', 'HDAPI004', '2026-08-29T12:00:00', '2026-08-29T14:00:00', N'Hội trường tầng 2'),
('LS080030', 'NS_STF01', 'HDAPI005', '2026-08-30T13:00:00', '2026-08-30T15:00:00', N'Phòng sinh hoạt chung');

/* ============================================================
   10. NHAT KY DIEM DANH - 210 DONG
   ============================================================ */
INSERT INTO NhatKyDiemDanh (MaLich, MaNguoiCaiNghien, MaNhanVien, ThoiGian, TrangThai, GhiChu) VALUES
('LS080001', 'NCNAPI001', 'NS_STF01', '2026-08-01T10:15:00', 'CO_MAT', NULL),
('LS080001', 'NCNAPI002', 'NS_STF01', '2026-08-01T10:15:00', 'CO_MAT', NULL),
('LS080001', 'NCNAPI003', 'NS_STF01', '2026-08-01T10:15:00', 'CO_MAT', NULL),
('LS080001', 'NCNAPI004', 'NS_STF01', '2026-08-01T10:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080001', 'NCNAPI005', 'NS_STF01', '2026-08-01T10:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080001', 'NCNAPI006', 'NS_STF01', '2026-08-01T10:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080001', 'NCNAPI007', 'NS_STF01', '2026-08-01T10:15:00', 'CO_MAT', NULL),
('LS080002', 'NCNAPI001', 'NS_STF01', '2026-08-02T11:15:00', 'CO_MAT', NULL),
('LS080002', 'NCNAPI002', 'NS_STF01', '2026-08-02T11:15:00', 'CO_MAT', NULL),
('LS080002', 'NCNAPI003', 'NS_STF01', '2026-08-02T11:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080002', 'NCNAPI004', 'NS_STF01', '2026-08-02T11:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080002', 'NCNAPI005', 'NS_STF01', '2026-08-02T11:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080002', 'NCNAPI006', 'NS_STF01', '2026-08-02T11:15:00', 'CO_MAT', NULL),
('LS080002', 'NCNAPI007', 'NS_STF01', '2026-08-02T11:15:00', 'CO_MAT', NULL),
('LS080003', 'NCNAPI001', 'NS_STF01', '2026-08-03T12:15:00', 'CO_MAT', NULL),
('LS080003', 'NCNAPI002', 'NS_STF01', '2026-08-03T12:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080003', 'NCNAPI003', 'NS_STF01', '2026-08-03T12:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080003', 'NCNAPI004', 'NS_STF01', '2026-08-03T12:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080003', 'NCNAPI005', 'NS_STF01', '2026-08-03T12:15:00', 'CO_MAT', NULL),
('LS080003', 'NCNAPI006', 'NS_STF01', '2026-08-03T12:15:00', 'CO_MAT', NULL),
('LS080003', 'NCNAPI007', 'NS_STF01', '2026-08-03T12:15:00', 'CO_MAT', NULL),
('LS080004', 'NCNAPI001', 'NS_STF01', '2026-08-04T13:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080004', 'NCNAPI002', 'NS_STF01', '2026-08-04T13:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080004', 'NCNAPI003', 'NS_STF01', '2026-08-04T13:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080004', 'NCNAPI004', 'NS_STF01', '2026-08-04T13:15:00', 'CO_MAT', NULL),
('LS080004', 'NCNAPI005', 'NS_STF01', '2026-08-04T13:15:00', 'CO_MAT', NULL),
('LS080004', 'NCNAPI006', 'NS_STF01', '2026-08-04T13:15:00', 'CO_MAT', NULL),
('LS080004', 'NCNAPI007', 'NS_STF01', '2026-08-04T13:15:00', 'CO_MAT', NULL),
('LS080005', 'NCNAPI001', 'NS_STF01', '2026-08-05T09:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080005', 'NCNAPI002', 'NS_STF01', '2026-08-05T09:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080005', 'NCNAPI003', 'NS_STF01', '2026-08-05T09:15:00', 'CO_MAT', NULL),
('LS080005', 'NCNAPI004', 'NS_STF01', '2026-08-05T09:15:00', 'CO_MAT', NULL),
('LS080005', 'NCNAPI005', 'NS_STF01', '2026-08-05T09:15:00', 'CO_MAT', NULL),
('LS080005', 'NCNAPI006', 'NS_STF01', '2026-08-05T09:15:00', 'CO_MAT', NULL),
('LS080005', 'NCNAPI007', 'NS_STF01', '2026-08-05T09:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080006', 'NCNAPI001', 'NS_STF01', '2026-08-06T10:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080006', 'NCNAPI002', 'NS_STF01', '2026-08-06T10:15:00', 'CO_MAT', NULL),
('LS080006', 'NCNAPI003', 'NS_STF01', '2026-08-06T10:15:00', 'CO_MAT', NULL),
('LS080006', 'NCNAPI004', 'NS_STF01', '2026-08-06T10:15:00', 'CO_MAT', NULL),
('LS080006', 'NCNAPI005', 'NS_STF01', '2026-08-06T10:15:00', 'CO_MAT', NULL),
('LS080006', 'NCNAPI006', 'NS_STF01', '2026-08-06T10:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080006', 'NCNAPI007', 'NS_STF01', '2026-08-06T10:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080007', 'NCNAPI001', 'NS_STF01', '2026-08-07T11:15:00', 'CO_MAT', NULL),
('LS080007', 'NCNAPI002', 'NS_STF01', '2026-08-07T11:15:00', 'CO_MAT', NULL),
('LS080007', 'NCNAPI003', 'NS_STF01', '2026-08-07T11:15:00', 'CO_MAT', NULL),
('LS080007', 'NCNAPI004', 'NS_STF01', '2026-08-07T11:15:00', 'CO_MAT', NULL),
('LS080007', 'NCNAPI005', 'NS_STF01', '2026-08-07T11:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080007', 'NCNAPI006', 'NS_STF01', '2026-08-07T11:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080007', 'NCNAPI007', 'NS_STF01', '2026-08-07T11:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080008', 'NCNAPI001', 'NS_STF01', '2026-08-08T12:15:00', 'CO_MAT', NULL),
('LS080008', 'NCNAPI002', 'NS_STF01', '2026-08-08T12:15:00', 'CO_MAT', NULL),
('LS080008', 'NCNAPI003', 'NS_STF01', '2026-08-08T12:15:00', 'CO_MAT', NULL),
('LS080008', 'NCNAPI004', 'NS_STF01', '2026-08-08T12:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080008', 'NCNAPI005', 'NS_STF01', '2026-08-08T12:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080008', 'NCNAPI006', 'NS_STF01', '2026-08-08T12:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080008', 'NCNAPI007', 'NS_STF01', '2026-08-08T12:15:00', 'CO_MAT', NULL),
('LS080009', 'NCNAPI001', 'NS_STF01', '2026-08-09T13:15:00', 'CO_MAT', NULL),
('LS080009', 'NCNAPI002', 'NS_STF01', '2026-08-09T13:15:00', 'CO_MAT', NULL),
('LS080009', 'NCNAPI003', 'NS_STF01', '2026-08-09T13:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080009', 'NCNAPI004', 'NS_STF01', '2026-08-09T13:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080009', 'NCNAPI005', 'NS_STF01', '2026-08-09T13:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080009', 'NCNAPI006', 'NS_STF01', '2026-08-09T13:15:00', 'CO_MAT', NULL),
('LS080009', 'NCNAPI007', 'NS_STF01', '2026-08-09T13:15:00', 'CO_MAT', NULL),
('LS080010', 'NCNAPI001', 'NS_STF01', '2026-08-10T09:15:00', 'CO_MAT', NULL),
('LS080010', 'NCNAPI002', 'NS_STF01', '2026-08-10T09:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080010', 'NCNAPI003', 'NS_STF01', '2026-08-10T09:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080010', 'NCNAPI004', 'NS_STF01', '2026-08-10T09:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080010', 'NCNAPI005', 'NS_STF01', '2026-08-10T09:15:00', 'CO_MAT', NULL),
('LS080010', 'NCNAPI006', 'NS_STF01', '2026-08-10T09:15:00', 'CO_MAT', NULL),
('LS080010', 'NCNAPI007', 'NS_STF01', '2026-08-10T09:15:00', 'CO_MAT', NULL),
('LS080011', 'NCNAPI001', 'NS_STF01', '2026-08-11T10:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080011', 'NCNAPI002', 'NS_STF01', '2026-08-11T10:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080011', 'NCNAPI003', 'NS_STF01', '2026-08-11T10:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080011', 'NCNAPI004', 'NS_STF01', '2026-08-11T10:15:00', 'CO_MAT', NULL),
('LS080011', 'NCNAPI005', 'NS_STF01', '2026-08-11T10:15:00', 'CO_MAT', NULL),
('LS080011', 'NCNAPI006', 'NS_STF01', '2026-08-11T10:15:00', 'CO_MAT', NULL),
('LS080011', 'NCNAPI007', 'NS_STF01', '2026-08-11T10:15:00', 'CO_MAT', NULL),
('LS080012', 'NCNAPI001', 'NS_STF01', '2026-08-12T11:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080012', 'NCNAPI002', 'NS_STF01', '2026-08-12T11:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080012', 'NCNAPI003', 'NS_STF01', '2026-08-12T11:15:00', 'CO_MAT', NULL),
('LS080012', 'NCNAPI004', 'NS_STF01', '2026-08-12T11:15:00', 'CO_MAT', NULL),
('LS080012', 'NCNAPI005', 'NS_STF01', '2026-08-12T11:15:00', 'CO_MAT', NULL),
('LS080012', 'NCNAPI006', 'NS_STF01', '2026-08-12T11:15:00', 'CO_MAT', NULL),
('LS080012', 'NCNAPI007', 'NS_STF01', '2026-08-12T11:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080013', 'NCNAPI001', 'NS_STF01', '2026-08-13T12:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080013', 'NCNAPI002', 'NS_STF01', '2026-08-13T12:15:00', 'CO_MAT', NULL),
('LS080013', 'NCNAPI003', 'NS_STF01', '2026-08-13T12:15:00', 'CO_MAT', NULL),
('LS080013', 'NCNAPI004', 'NS_STF01', '2026-08-13T12:15:00', 'CO_MAT', NULL),
('LS080013', 'NCNAPI005', 'NS_STF01', '2026-08-13T12:15:00', 'CO_MAT', NULL),
('LS080013', 'NCNAPI006', 'NS_STF01', '2026-08-13T12:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080013', 'NCNAPI007', 'NS_STF01', '2026-08-13T12:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080014', 'NCNAPI001', 'NS_STF01', '2026-08-14T13:15:00', 'CO_MAT', NULL),
('LS080014', 'NCNAPI002', 'NS_STF01', '2026-08-14T13:15:00', 'CO_MAT', NULL),
('LS080014', 'NCNAPI003', 'NS_STF01', '2026-08-14T13:15:00', 'CO_MAT', NULL),
('LS080014', 'NCNAPI004', 'NS_STF01', '2026-08-14T13:15:00', 'CO_MAT', NULL),
('LS080014', 'NCNAPI005', 'NS_STF01', '2026-08-14T13:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080014', 'NCNAPI006', 'NS_STF01', '2026-08-14T13:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080014', 'NCNAPI007', 'NS_STF01', '2026-08-14T13:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080015', 'NCNAPI001', 'NS_STF01', '2026-08-15T09:15:00', 'CO_MAT', NULL),
('LS080015', 'NCNAPI002', 'NS_STF01', '2026-08-15T09:15:00', 'CO_MAT', NULL),
('LS080015', 'NCNAPI003', 'NS_STF01', '2026-08-15T09:15:00', 'CO_MAT', NULL),
('LS080015', 'NCNAPI004', 'NS_STF01', '2026-08-15T09:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080015', 'NCNAPI005', 'NS_STF01', '2026-08-15T09:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080015', 'NCNAPI006', 'NS_STF01', '2026-08-15T09:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080015', 'NCNAPI007', 'NS_STF01', '2026-08-15T09:15:00', 'CO_MAT', NULL),
('LS080016', 'NCNAPI001', 'NS_STF01', '2026-08-16T10:15:00', 'CO_MAT', NULL),
('LS080016', 'NCNAPI002', 'NS_STF01', '2026-08-16T10:15:00', 'CO_MAT', NULL),
('LS080016', 'NCNAPI003', 'NS_STF01', '2026-08-16T10:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080016', 'NCNAPI004', 'NS_STF01', '2026-08-16T10:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080016', 'NCNAPI005', 'NS_STF01', '2026-08-16T10:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080016', 'NCNAPI006', 'NS_STF01', '2026-08-16T10:15:00', 'CO_MAT', NULL),
('LS080016', 'NCNAPI007', 'NS_STF01', '2026-08-16T10:15:00', 'CO_MAT', NULL),
('LS080017', 'NCNAPI001', 'NS_STF01', '2026-08-17T11:15:00', 'CO_MAT', NULL),
('LS080017', 'NCNAPI002', 'NS_STF01', '2026-08-17T11:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080017', 'NCNAPI003', 'NS_STF01', '2026-08-17T11:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080017', 'NCNAPI004', 'NS_STF01', '2026-08-17T11:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080017', 'NCNAPI005', 'NS_STF01', '2026-08-17T11:15:00', 'CO_MAT', NULL),
('LS080017', 'NCNAPI006', 'NS_STF01', '2026-08-17T11:15:00', 'CO_MAT', NULL),
('LS080017', 'NCNAPI007', 'NS_STF01', '2026-08-17T11:15:00', 'CO_MAT', NULL),
('LS080018', 'NCNAPI001', 'NS_STF01', '2026-08-18T12:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080018', 'NCNAPI002', 'NS_STF01', '2026-08-18T12:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080018', 'NCNAPI003', 'NS_STF01', '2026-08-18T12:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080018', 'NCNAPI004', 'NS_STF01', '2026-08-18T12:15:00', 'CO_MAT', NULL),
('LS080018', 'NCNAPI005', 'NS_STF01', '2026-08-18T12:15:00', 'CO_MAT', NULL),
('LS080018', 'NCNAPI006', 'NS_STF01', '2026-08-18T12:15:00', 'CO_MAT', NULL),
('LS080018', 'NCNAPI007', 'NS_STF01', '2026-08-18T12:15:00', 'CO_MAT', NULL),
('LS080019', 'NCNAPI001', 'NS_STF01', '2026-08-19T13:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080019', 'NCNAPI002', 'NS_STF01', '2026-08-19T13:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080019', 'NCNAPI003', 'NS_STF01', '2026-08-19T13:15:00', 'CO_MAT', NULL),
('LS080019', 'NCNAPI004', 'NS_STF01', '2026-08-19T13:15:00', 'CO_MAT', NULL),
('LS080019', 'NCNAPI005', 'NS_STF01', '2026-08-19T13:15:00', 'CO_MAT', NULL),
('LS080019', 'NCNAPI006', 'NS_STF01', '2026-08-19T13:15:00', 'CO_MAT', NULL),
('LS080019', 'NCNAPI007', 'NS_STF01', '2026-08-19T13:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080020', 'NCNAPI001', 'NS_STF01', '2026-08-20T09:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080020', 'NCNAPI002', 'NS_STF01', '2026-08-20T09:15:00', 'CO_MAT', NULL),
('LS080020', 'NCNAPI003', 'NS_STF01', '2026-08-20T09:15:00', 'CO_MAT', NULL),
('LS080020', 'NCNAPI004', 'NS_STF01', '2026-08-20T09:15:00', 'CO_MAT', NULL),
('LS080020', 'NCNAPI005', 'NS_STF01', '2026-08-20T09:15:00', 'CO_MAT', NULL),
('LS080020', 'NCNAPI006', 'NS_STF01', '2026-08-20T09:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080020', 'NCNAPI007', 'NS_STF01', '2026-08-20T09:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080021', 'NCNAPI001', 'NS_STF01', '2026-08-21T10:15:00', 'CO_MAT', NULL),
('LS080021', 'NCNAPI002', 'NS_STF01', '2026-08-21T10:15:00', 'CO_MAT', NULL),
('LS080021', 'NCNAPI003', 'NS_STF01', '2026-08-21T10:15:00', 'CO_MAT', NULL),
('LS080021', 'NCNAPI004', 'NS_STF01', '2026-08-21T10:15:00', 'CO_MAT', NULL),
('LS080021', 'NCNAPI005', 'NS_STF01', '2026-08-21T10:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080021', 'NCNAPI006', 'NS_STF01', '2026-08-21T10:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080021', 'NCNAPI007', 'NS_STF01', '2026-08-21T10:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080022', 'NCNAPI001', 'NS_STF01', '2026-08-22T11:15:00', 'CO_MAT', NULL),
('LS080022', 'NCNAPI002', 'NS_STF01', '2026-08-22T11:15:00', 'CO_MAT', NULL),
('LS080022', 'NCNAPI003', 'NS_STF01', '2026-08-22T11:15:00', 'CO_MAT', NULL),
('LS080022', 'NCNAPI004', 'NS_STF01', '2026-08-22T11:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080022', 'NCNAPI005', 'NS_STF01', '2026-08-22T11:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080022', 'NCNAPI006', 'NS_STF01', '2026-08-22T11:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080022', 'NCNAPI007', 'NS_STF01', '2026-08-22T11:15:00', 'CO_MAT', NULL),
('LS080023', 'NCNAPI001', 'NS_STF01', '2026-08-23T12:15:00', 'CO_MAT', NULL),
('LS080023', 'NCNAPI002', 'NS_STF01', '2026-08-23T12:15:00', 'CO_MAT', NULL),
('LS080023', 'NCNAPI003', 'NS_STF01', '2026-08-23T12:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080023', 'NCNAPI004', 'NS_STF01', '2026-08-23T12:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080023', 'NCNAPI005', 'NS_STF01', '2026-08-23T12:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080023', 'NCNAPI006', 'NS_STF01', '2026-08-23T12:15:00', 'CO_MAT', NULL),
('LS080023', 'NCNAPI007', 'NS_STF01', '2026-08-23T12:15:00', 'CO_MAT', NULL),
('LS080024', 'NCNAPI001', 'NS_STF01', '2026-08-24T13:15:00', 'CO_MAT', NULL),
('LS080024', 'NCNAPI002', 'NS_STF01', '2026-08-24T13:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080024', 'NCNAPI003', 'NS_STF01', '2026-08-24T13:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080024', 'NCNAPI004', 'NS_STF01', '2026-08-24T13:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080024', 'NCNAPI005', 'NS_STF01', '2026-08-24T13:15:00', 'CO_MAT', NULL),
('LS080024', 'NCNAPI006', 'NS_STF01', '2026-08-24T13:15:00', 'CO_MAT', NULL),
('LS080024', 'NCNAPI007', 'NS_STF01', '2026-08-24T13:15:00', 'CO_MAT', NULL),
('LS080025', 'NCNAPI001', 'NS_STF01', '2026-08-25T09:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080025', 'NCNAPI002', 'NS_STF01', '2026-08-25T09:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080025', 'NCNAPI003', 'NS_STF01', '2026-08-25T09:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080025', 'NCNAPI004', 'NS_STF01', '2026-08-25T09:15:00', 'CO_MAT', NULL),
('LS080025', 'NCNAPI005', 'NS_STF01', '2026-08-25T09:15:00', 'CO_MAT', NULL),
('LS080025', 'NCNAPI006', 'NS_STF01', '2026-08-25T09:15:00', 'CO_MAT', NULL),
('LS080025', 'NCNAPI007', 'NS_STF01', '2026-08-25T09:15:00', 'CO_MAT', NULL),
('LS080026', 'NCNAPI001', 'NS_STF01', '2026-08-26T10:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080026', 'NCNAPI002', 'NS_STF01', '2026-08-26T10:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080026', 'NCNAPI003', 'NS_STF01', '2026-08-26T10:15:00', 'CO_MAT', NULL),
('LS080026', 'NCNAPI004', 'NS_STF01', '2026-08-26T10:15:00', 'CO_MAT', NULL),
('LS080026', 'NCNAPI005', 'NS_STF01', '2026-08-26T10:15:00', 'CO_MAT', NULL),
('LS080026', 'NCNAPI006', 'NS_STF01', '2026-08-26T10:15:00', 'CO_MAT', NULL),
('LS080026', 'NCNAPI007', 'NS_STF01', '2026-08-26T10:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080027', 'NCNAPI001', 'NS_STF01', '2026-08-27T11:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080027', 'NCNAPI002', 'NS_STF01', '2026-08-27T11:15:00', 'CO_MAT', NULL),
('LS080027', 'NCNAPI003', 'NS_STF01', '2026-08-27T11:15:00', 'CO_MAT', NULL),
('LS080027', 'NCNAPI004', 'NS_STF01', '2026-08-27T11:15:00', 'CO_MAT', NULL),
('LS080027', 'NCNAPI005', 'NS_STF01', '2026-08-27T11:15:00', 'CO_MAT', NULL),
('LS080027', 'NCNAPI006', 'NS_STF01', '2026-08-27T11:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080027', 'NCNAPI007', 'NS_STF01', '2026-08-27T11:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080028', 'NCNAPI001', 'NS_STF01', '2026-08-28T12:15:00', 'CO_MAT', NULL),
('LS080028', 'NCNAPI002', 'NS_STF01', '2026-08-28T12:15:00', 'CO_MAT', NULL),
('LS080028', 'NCNAPI003', 'NS_STF01', '2026-08-28T12:15:00', 'CO_MAT', NULL),
('LS080028', 'NCNAPI004', 'NS_STF01', '2026-08-28T12:15:00', 'CO_MAT', NULL),
('LS080028', 'NCNAPI005', 'NS_STF01', '2026-08-28T12:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080028', 'NCNAPI006', 'NS_STF01', '2026-08-28T12:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080028', 'NCNAPI007', 'NS_STF01', '2026-08-28T12:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080029', 'NCNAPI001', 'NS_STF01', '2026-08-29T13:15:00', 'CO_MAT', NULL),
('LS080029', 'NCNAPI002', 'NS_STF01', '2026-08-29T13:15:00', 'CO_MAT', NULL),
('LS080029', 'NCNAPI003', 'NS_STF01', '2026-08-29T13:15:00', 'CO_MAT', NULL),
('LS080029', 'NCNAPI004', 'NS_STF01', '2026-08-29T13:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080029', 'NCNAPI005', 'NS_STF01', '2026-08-29T13:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080029', 'NCNAPI006', 'NS_STF01', '2026-08-29T13:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080029', 'NCNAPI007', 'NS_STF01', '2026-08-29T13:15:00', 'CO_MAT', NULL),
('LS080030', 'NCNAPI001', 'NS_STF01', '2026-08-30T09:15:00', 'CO_MAT', NULL),
('LS080030', 'NCNAPI002', 'NS_STF01', '2026-08-30T09:15:00', 'CO_MAT', NULL),
('LS080030', 'NCNAPI003', 'NS_STF01', '2026-08-30T09:15:00', 'TRE_GIO', N'Đến trễ do kiểm tra sức khỏe'),
('LS080030', 'NCNAPI004', 'NS_STF01', '2026-08-30T09:15:00', 'CO_PHEP', N'Vắng có phép do có lịch khám'),
('LS080030', 'NCNAPI005', 'NS_STF01', '2026-08-30T09:15:00', 'VANG_MAT', N'Cần cán bộ phụ trách kiểm tra lại'),
('LS080030', 'NCNAPI006', 'NS_STF01', '2026-08-30T09:15:00', 'CO_MAT', NULL),
('LS080030', 'NCNAPI007', 'NS_STF01', '2026-08-30T09:15:00', 'CO_MAT', NULL);

/* ============================================================
   11. LICH UONG THUOC + CHI TIET - THEM DU LIEU CHO DOCTOR
   ============================================================ */
INSERT INTO LichUongThuoc (MaLichUong, MaNguoiCaiNghien, MaBacSi, NgayBatDau, NgayKetThuc, TrangThai) VALUES
('LU080001', 'NCNAPI001', 'NS_BS001', '2026-07-02', NULL, 'DANG_THUC_HIEN'),
('LU080002', 'NCNAPI002', 'NS_BS002', '2026-07-03', '2026-07-19', 'DA_HOAN_THANH'),
('LU080003', 'NCNAPI003', 'NS_BS001', '2026-07-04', '2026-07-21', 'TAM_DUNG'),
('LU080004', 'NCNAPI004', 'NS_BS002', '2026-07-05', NULL, 'DANG_THUC_HIEN'),
('LU080005', 'NCNAPI005', 'NS_BS001', '2026-07-06', NULL, 'DANG_THUC_HIEN'),
('LU080006', 'NCNAPI006', 'NS_BS002', '2026-07-07', '2026-07-27', 'DA_HOAN_THANH'),
('LU080007', 'NCNAPI007', 'NS_BS001', '2026-07-08', '2026-07-29', 'TAM_DUNG'),
('LU080008', 'NCNAPI001', 'NS_BS002', '2026-07-09', NULL, 'DANG_THUC_HIEN'),
('LU080009', 'NCNAPI002', 'NS_BS001', '2026-07-10', NULL, 'DANG_THUC_HIEN'),
('LU080010', 'NCNAPI003', 'NS_BS002', '2026-07-11', '2026-07-25', 'DA_HOAN_THANH'),
('LU080011', 'NCNAPI004', 'NS_BS001', '2026-07-12', '2026-07-27', 'TAM_DUNG'),
('LU080012', 'NCNAPI005', 'NS_BS002', '2026-07-13', NULL, 'DANG_THUC_HIEN'),
('LU080013', 'NCNAPI006', 'NS_BS001', '2026-07-14', NULL, 'DANG_THUC_HIEN'),
('LU080014', 'NCNAPI007', 'NS_BS002', '2026-07-15', '2026-08-02', 'DA_HOAN_THANH'),
('LU080015', 'NCNAPI001', 'NS_BS001', '2026-07-16', '2026-08-04', 'TAM_DUNG'),
('LU080016', 'NCNAPI002', 'NS_BS002', '2026-07-17', NULL, 'DANG_THUC_HIEN'),
('LU080017', 'NCNAPI003', 'NS_BS001', '2026-07-18', NULL, 'DANG_THUC_HIEN'),
('LU080018', 'NCNAPI004', 'NS_BS002', '2026-07-19', '2026-08-10', 'DA_HOAN_THANH'),
('LU080019', 'NCNAPI005', 'NS_BS001', '2026-07-20', '2026-08-12', 'TAM_DUNG'),
('LU080020', 'NCNAPI006', 'NS_BS002', '2026-07-21', NULL, 'DANG_THUC_HIEN'),
('LU080021', 'NCNAPI007', 'NS_BS001', '2026-07-22', NULL, 'DANG_THUC_HIEN'),
('LU080022', 'NCNAPI001', 'NS_BS002', '2026-07-23', '2026-08-08', 'DA_HOAN_THANH'),
('LU080023', 'NCNAPI002', 'NS_BS001', '2026-07-24', '2026-08-10', 'TAM_DUNG'),
('LU080024', 'NCNAPI003', 'NS_BS002', '2026-07-25', NULL, 'DANG_THUC_HIEN'),
('LU080025', 'NCNAPI004', 'NS_BS001', '2026-07-26', NULL, 'DANG_THUC_HIEN'),
('LU080026', 'NCNAPI005', 'NS_BS002', '2026-07-27', '2026-08-16', 'DA_HOAN_THANH'),
('LU080027', 'NCNAPI006', 'NS_BS001', '2026-07-28', '2026-08-18', 'TAM_DUNG'),
('LU080028', 'NCNAPI007', 'NS_BS002', '2026-07-29', NULL, 'DANG_THUC_HIEN'),
('LU080029', 'NCNAPI001', 'NS_BS001', '2026-07-30', NULL, 'DANG_THUC_HIEN'),
('LU080030', 'NCNAPI002', 'NS_BS002', '2026-07-31', '2026-08-14', 'DA_HOAN_THANH');

INSERT INTO ChiTietLichUongThuoc (MaChiTiet, MaLichUong, MaThuoc, LieuLuong, TanSuat, GioUong) VALUES
('CT080001', 'LU080001', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080002', 'LU080002', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080003', 'LU080003', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080004', 'LU080004', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080005', 'LU080005', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080006', 'LU080006', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080007', 'LU080007', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080008', 'LU080008', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080009', 'LU080009', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080010', 'LU080010', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080011', 'LU080011', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080012', 'LU080012', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080013', 'LU080013', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080014', 'LU080014', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080015', 'LU080015', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080016', 'LU080016', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080017', 'LU080017', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080018', 'LU080018', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080019', 'LU080019', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080020', 'LU080020', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080021', 'LU080021', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080022', 'LU080022', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080023', 'LU080023', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080024', 'LU080024', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080025', 'LU080025', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080026', 'LU080026', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080027', 'LU080027', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080028', 'LU080028', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080029', 'LU080029', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080030', 'LU080030', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080031', 'LU080001', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080032', 'LU080002', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080033', 'LU080003', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080034', 'LU080004', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080035', 'LU080005', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080036', 'LU080006', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080037', 'LU080007', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080038', 'LU080008', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080039', 'LU080009', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080040', 'LU080010', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080041', 'LU080011', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080042', 'LU080012', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080043', 'LU080013', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080044', 'LU080014', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080045', 'LU080015', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080046', 'LU080016', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080047', 'LU080017', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080048', 'LU080018', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080049', 'LU080019', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080050', 'LU080020', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080051', 'LU080021', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080052', 'LU080022', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080053', 'LU080023', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080054', 'LU080024', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080055', 'LU080025', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00'),
('CT080056', 'LU080026', 'THAPI001', N'1 viên', N'1 lần/ngày', '07:30:00'),
('CT080057', 'LU080027', 'THAPI002', N'2 viên', N'2 lần/ngày', '08:00:00'),
('CT080058', 'LU080028', 'THAPI003', N'5ml', N'Khi cần', '13:30:00'),
('CT080059', 'LU080029', 'THAPI004', N'1 gói', N'Sau ăn sáng', '19:00:00'),
('CT080060', 'LU080030', 'THAPI005', N'1/2 viên', N'Trước khi ngủ', '21:00:00');

/* ============================================================
   12. LICH TU VAN TAM LY - 30 DONG
   ============================================================ */
INSERT INTO LichTuVanTamLy (MaLichTuVan, MaNguoiCaiNghien, MaBacSi, ThoiGianBatDau, ThoiLuong, ChuDe, KetQuaTuVan, TrangThai) VALUES
('TV080001', 'NCNAPI001', 'NS_BS002', '2026-08-01T09:30:00', 60, N'Ổn định cảm xúc sau cắt cơn', NULL, 'CHUA_BAT_DAU'),
('TV080002', 'NCNAPI002', 'NS_BS002', '2026-08-02T10:30:00', 75, N'Nhận diện nguy cơ tái nghiện', N'Cần thêm buổi tư vấn nhóm để củng cố kỹ năng.', 'DA_HOAN_THANH'),
('TV080003', 'NCNAPI003', 'NS_BS002', '2026-08-03T11:30:00', 90, N'Kỹ năng từ chối bạn xấu', NULL, 'DANG_TIEN_HANH'),
('TV080004', 'NCNAPI004', 'NS_BS002', '2026-08-04T12:30:00', 45, N'Kết nối gia đình và hỗ trợ phục hồi', NULL, 'HUY'),
('TV080005', 'NCNAPI005', 'NS_BS002', '2026-08-05T13:30:00', 60, N'Chuẩn bị tái hòa nhập cộng đồng', NULL, 'CHUA_BAT_DAU'),
('TV080006', 'NCNAPI006', 'NS_BS002', '2026-08-06T14:30:00', 75, N'Tư vấn cá nhân khẩn cấp', N'Cần thêm buổi tư vấn nhóm để củng cố kỹ năng.', 'DA_HOAN_THANH'),
('TV080007', 'NCNAPI007', 'NS_BS002', '2026-08-07T15:30:00', 90, N'Ổn định cảm xúc sau cắt cơn', NULL, 'DANG_TIEN_HANH'),
('TV080008', 'NCNAPI001', 'NS_BS002', '2026-08-08T08:30:00', 45, N'Nhận diện nguy cơ tái nghiện', NULL, 'HUY'),
('TV080009', 'NCNAPI002', 'NS_BS002', '2026-08-09T09:30:00', 60, N'Kỹ năng từ chối bạn xấu', NULL, 'CHUA_BAT_DAU'),
('TV080010', 'NCNAPI003', 'NS_BS002', '2026-08-10T10:30:00', 75, N'Kết nối gia đình và hỗ trợ phục hồi', N'Cần thêm buổi tư vấn nhóm để củng cố kỹ năng.', 'DA_HOAN_THANH'),
('TV080011', 'NCNAPI004', 'NS_BS002', '2026-08-11T11:30:00', 90, N'Chuẩn bị tái hòa nhập cộng đồng', NULL, 'DANG_TIEN_HANH'),
('TV080012', 'NCNAPI005', 'NS_BS002', '2026-08-12T12:30:00', 45, N'Tư vấn cá nhân khẩn cấp', NULL, 'HUY'),
('TV080013', 'NCNAPI006', 'NS_BS002', '2026-08-13T13:30:00', 60, N'Ổn định cảm xúc sau cắt cơn', NULL, 'CHUA_BAT_DAU'),
('TV080014', 'NCNAPI007', 'NS_BS002', '2026-08-14T14:30:00', 75, N'Nhận diện nguy cơ tái nghiện', N'Cần thêm buổi tư vấn nhóm để củng cố kỹ năng.', 'DA_HOAN_THANH'),
('TV080015', 'NCNAPI001', 'NS_BS002', '2026-08-15T15:30:00', 90, N'Kỹ năng từ chối bạn xấu', NULL, 'DANG_TIEN_HANH'),
('TV080016', 'NCNAPI002', 'NS_BS002', '2026-08-16T08:30:00', 45, N'Kết nối gia đình và hỗ trợ phục hồi', NULL, 'HUY'),
('TV080017', 'NCNAPI003', 'NS_BS002', '2026-08-17T09:30:00', 60, N'Chuẩn bị tái hòa nhập cộng đồng', NULL, 'CHUA_BAT_DAU'),
('TV080018', 'NCNAPI004', 'NS_BS002', '2026-08-18T10:30:00', 75, N'Tư vấn cá nhân khẩn cấp', N'Cần thêm buổi tư vấn nhóm để củng cố kỹ năng.', 'DA_HOAN_THANH'),
('TV080019', 'NCNAPI005', 'NS_BS002', '2026-08-19T11:30:00', 90, N'Ổn định cảm xúc sau cắt cơn', NULL, 'DANG_TIEN_HANH'),
('TV080020', 'NCNAPI006', 'NS_BS002', '2026-08-20T12:30:00', 45, N'Nhận diện nguy cơ tái nghiện', NULL, 'HUY'),
('TV080021', 'NCNAPI007', 'NS_BS002', '2026-08-21T13:30:00', 60, N'Kỹ năng từ chối bạn xấu', NULL, 'CHUA_BAT_DAU'),
('TV080022', 'NCNAPI001', 'NS_BS002', '2026-08-22T14:30:00', 75, N'Kết nối gia đình và hỗ trợ phục hồi', N'Cần thêm buổi tư vấn nhóm để củng cố kỹ năng.', 'DA_HOAN_THANH'),
('TV080023', 'NCNAPI002', 'NS_BS002', '2026-08-23T15:30:00', 90, N'Chuẩn bị tái hòa nhập cộng đồng', NULL, 'DANG_TIEN_HANH'),
('TV080024', 'NCNAPI003', 'NS_BS002', '2026-08-24T08:30:00', 45, N'Tư vấn cá nhân khẩn cấp', NULL, 'HUY'),
('TV080025', 'NCNAPI004', 'NS_BS002', '2026-08-25T09:30:00', 60, N'Ổn định cảm xúc sau cắt cơn', NULL, 'CHUA_BAT_DAU'),
('TV080026', 'NCNAPI005', 'NS_BS002', '2026-08-26T10:30:00', 75, N'Nhận diện nguy cơ tái nghiện', N'Cần thêm buổi tư vấn nhóm để củng cố kỹ năng.', 'DA_HOAN_THANH'),
('TV080027', 'NCNAPI006', 'NS_BS002', '2026-08-27T11:30:00', 90, N'Kỹ năng từ chối bạn xấu', NULL, 'DANG_TIEN_HANH'),
('TV080028', 'NCNAPI007', 'NS_BS002', '2026-08-28T12:30:00', 45, N'Kết nối gia đình và hỗ trợ phục hồi', NULL, 'HUY'),
('TV080029', 'NCNAPI001', 'NS_BS002', '2026-08-29T13:30:00', 60, N'Chuẩn bị tái hòa nhập cộng đồng', NULL, 'CHUA_BAT_DAU'),
('TV080030', 'NCNAPI002', 'NS_BS002', '2026-08-30T14:30:00', 75, N'Tư vấn cá nhân khẩn cấp', N'Cần thêm buổi tư vấn nhóm để củng cố kỹ năng.', 'DA_HOAN_THANH');

/* ============================================================
   13. NHAT KY DIEU TRI - 35 DONG
   ============================================================ */
INSERT INTO NhatKyDieuTri (MaNhatKy, MaBenhAn, MaBacSi, MaChiTietPhacDo, NgayGhi, TinhTrangSucKhoe, TrieuChung, NhietDo, HuyetAp, NhipTim, ThuocSuDung, LieuLuong, MucDoNghien, ChanDoan, HuongXuLy) VALUES
('NK080001', 'BAAPI001', 'NS_BS001', NULL, DATEADD(day, -1, GETDATE()), N'Tỉnh táo, hợp tác tốt, ăn ngủ cải thiện', N'Khó ngủ nhẹ', 36.4, '110/70', 69, N'Vitamin B1', N'1 viên/ngày', 'Nhe', N'Ổn định', N'Tiếp tục theo dõi'),
('NK080002', 'BAAPI002', 'NS_BS002', NULL, DATEADD(day, -2, GETDATE()), N'Mệt mỏi nhẹ sau buổi trị liệu', N'Đau đầu thoáng qua', 36.5, '115/75', 70, N'Paracetamol', N'2 viên/ngày', 'TrungBinh', N'Theo dõi thêm', N'Duy trì phác đồ hiện tại'),
('NK080003', 'BAAPI003', 'NS_BS001', NULL, DATEADD(day, -3, GETDATE()), N'Thể trạng ổn định, không ghi nhận bất thường', N'Không ghi nhận', 36.6, '120/80', 71, N'Oresol', N'1 gói khi cần', 'Nang', N'Cần tư vấn bổ sung', N'Tăng cường tư vấn tâm lý'),
('NK080004', 'BAAPI004', 'NS_BS002', NULL, DATEADD(day, -4, GETDATE()), N'Có biểu hiện lo âu vào buổi tối', N'Chán ăn buổi sáng', 36.7, '125/80', 72, N'Methadone', N'Theo chỉ định', 'Nhe', N'Đáp ứng điều trị tốt', N'Bổ sung dinh dưỡng'),
('NK080005', 'BAAPI005', 'NS_BS001', NULL, DATEADD(day, -5, GETDATE()), N'Tâm lý tích cực, tham gia hoạt động đầy đủ', N'Thèm thuốc mức độ thấp', 36.8, '130/85', 73, N'Không dùng thuốc bổ sung', N'Không có', 'TrungBinh', N'Nguy cơ tái nghiện thấp', N'Nhắc tham gia sinh hoạt nhóm'),
('NK080006', 'BAAPI006', 'NS_BS002', NULL, DATEADD(day, -6, GETDATE()), N'Tỉnh táo, hợp tác tốt, ăn ngủ cải thiện', N'Khó ngủ nhẹ', 36.9, '110/70', 74, N'Vitamin B1', N'1 viên/ngày', 'Nang', N'Ổn định', N'Tiếp tục theo dõi'),
('NK080007', 'BAAPI007', 'NS_BS001', NULL, DATEADD(day, -7, GETDATE()), N'Mệt mỏi nhẹ sau buổi trị liệu', N'Đau đầu thoáng qua', 37.0, '115/75', 75, N'Paracetamol', N'2 viên/ngày', 'Nhe', N'Theo dõi thêm', N'Duy trì phác đồ hiện tại'),
('NK080008', 'BAAPI001', 'NS_BS002', NULL, DATEADD(day, -8, GETDATE()), N'Thể trạng ổn định, không ghi nhận bất thường', N'Không ghi nhận', 36.3, '120/80', 76, N'Oresol', N'1 gói khi cần', 'TrungBinh', N'Cần tư vấn bổ sung', N'Tăng cường tư vấn tâm lý'),
('NK080009', 'BAAPI002', 'NS_BS001', NULL, DATEADD(day, -9, GETDATE()), N'Có biểu hiện lo âu vào buổi tối', N'Chán ăn buổi sáng', 36.4, '125/80', 77, N'Methadone', N'Theo chỉ định', 'Nang', N'Đáp ứng điều trị tốt', N'Bổ sung dinh dưỡng'),
('NK080010', 'BAAPI003', 'NS_BS002', NULL, DATEADD(day, -10, GETDATE()), N'Tâm lý tích cực, tham gia hoạt động đầy đủ', N'Thèm thuốc mức độ thấp', 36.5, '130/85', 78, N'Không dùng thuốc bổ sung', N'Không có', 'Nhe', N'Nguy cơ tái nghiện thấp', N'Nhắc tham gia sinh hoạt nhóm'),
('NK080011', 'BAAPI004', 'NS_BS001', NULL, DATEADD(day, -11, GETDATE()), N'Tỉnh táo, hợp tác tốt, ăn ngủ cải thiện', N'Khó ngủ nhẹ', 36.6, '110/70', 79, N'Vitamin B1', N'1 viên/ngày', 'TrungBinh', N'Ổn định', N'Tiếp tục theo dõi'),
('NK080012', 'BAAPI005', 'NS_BS002', NULL, DATEADD(day, -12, GETDATE()), N'Mệt mỏi nhẹ sau buổi trị liệu', N'Đau đầu thoáng qua', 36.7, '115/75', 80, N'Paracetamol', N'2 viên/ngày', 'Nang', N'Theo dõi thêm', N'Duy trì phác đồ hiện tại'),
('NK080013', 'BAAPI006', 'NS_BS001', NULL, DATEADD(day, -13, GETDATE()), N'Thể trạng ổn định, không ghi nhận bất thường', N'Không ghi nhận', 36.8, '120/80', 81, N'Oresol', N'1 gói khi cần', 'Nhe', N'Cần tư vấn bổ sung', N'Tăng cường tư vấn tâm lý'),
('NK080014', 'BAAPI007', 'NS_BS002', NULL, DATEADD(day, -14, GETDATE()), N'Có biểu hiện lo âu vào buổi tối', N'Chán ăn buổi sáng', 36.9, '125/80', 82, N'Methadone', N'Theo chỉ định', 'TrungBinh', N'Đáp ứng điều trị tốt', N'Bổ sung dinh dưỡng'),
('NK080015', 'BAAPI001', 'NS_BS001', NULL, DATEADD(day, -15, GETDATE()), N'Tâm lý tích cực, tham gia hoạt động đầy đủ', N'Thèm thuốc mức độ thấp', 37.0, '130/85', 83, N'Không dùng thuốc bổ sung', N'Không có', 'Nang', N'Nguy cơ tái nghiện thấp', N'Nhắc tham gia sinh hoạt nhóm'),
('NK080016', 'BAAPI002', 'NS_BS002', NULL, DATEADD(day, -16, GETDATE()), N'Tỉnh táo, hợp tác tốt, ăn ngủ cải thiện', N'Khó ngủ nhẹ', 36.3, '110/70', 84, N'Vitamin B1', N'1 viên/ngày', 'Nhe', N'Ổn định', N'Tiếp tục theo dõi'),
('NK080017', 'BAAPI003', 'NS_BS001', NULL, DATEADD(day, -17, GETDATE()), N'Mệt mỏi nhẹ sau buổi trị liệu', N'Đau đầu thoáng qua', 36.4, '115/75', 85, N'Paracetamol', N'2 viên/ngày', 'TrungBinh', N'Theo dõi thêm', N'Duy trì phác đồ hiện tại'),
('NK080018', 'BAAPI004', 'NS_BS002', NULL, DATEADD(day, -18, GETDATE()), N'Thể trạng ổn định, không ghi nhận bất thường', N'Không ghi nhận', 36.5, '120/80', 86, N'Oresol', N'1 gói khi cần', 'Nang', N'Cần tư vấn bổ sung', N'Tăng cường tư vấn tâm lý'),
('NK080019', 'BAAPI005', 'NS_BS001', NULL, DATEADD(day, -19, GETDATE()), N'Có biểu hiện lo âu vào buổi tối', N'Chán ăn buổi sáng', 36.6, '125/80', 87, N'Methadone', N'Theo chỉ định', 'Nhe', N'Đáp ứng điều trị tốt', N'Bổ sung dinh dưỡng'),
('NK080020', 'BAAPI006', 'NS_BS002', NULL, DATEADD(day, -20, GETDATE()), N'Tâm lý tích cực, tham gia hoạt động đầy đủ', N'Thèm thuốc mức độ thấp', 36.7, '130/85', 68, N'Không dùng thuốc bổ sung', N'Không có', 'TrungBinh', N'Nguy cơ tái nghiện thấp', N'Nhắc tham gia sinh hoạt nhóm'),
('NK080021', 'BAAPI007', 'NS_BS001', NULL, DATEADD(day, -21, GETDATE()), N'Tỉnh táo, hợp tác tốt, ăn ngủ cải thiện', N'Khó ngủ nhẹ', 36.8, '110/70', 69, N'Vitamin B1', N'1 viên/ngày', 'Nang', N'Ổn định', N'Tiếp tục theo dõi'),
('NK080022', 'BAAPI001', 'NS_BS002', NULL, DATEADD(day, -22, GETDATE()), N'Mệt mỏi nhẹ sau buổi trị liệu', N'Đau đầu thoáng qua', 36.9, '115/75', 70, N'Paracetamol', N'2 viên/ngày', 'Nhe', N'Theo dõi thêm', N'Duy trì phác đồ hiện tại'),
('NK080023', 'BAAPI002', 'NS_BS001', NULL, DATEADD(day, -23, GETDATE()), N'Thể trạng ổn định, không ghi nhận bất thường', N'Không ghi nhận', 37.0, '120/80', 71, N'Oresol', N'1 gói khi cần', 'TrungBinh', N'Cần tư vấn bổ sung', N'Tăng cường tư vấn tâm lý'),
('NK080024', 'BAAPI003', 'NS_BS002', NULL, DATEADD(day, -24, GETDATE()), N'Có biểu hiện lo âu vào buổi tối', N'Chán ăn buổi sáng', 36.3, '125/80', 72, N'Methadone', N'Theo chỉ định', 'Nang', N'Đáp ứng điều trị tốt', N'Bổ sung dinh dưỡng'),
('NK080025', 'BAAPI004', 'NS_BS001', NULL, DATEADD(day, -25, GETDATE()), N'Tâm lý tích cực, tham gia hoạt động đầy đủ', N'Thèm thuốc mức độ thấp', 36.4, '130/85', 73, N'Không dùng thuốc bổ sung', N'Không có', 'Nhe', N'Nguy cơ tái nghiện thấp', N'Nhắc tham gia sinh hoạt nhóm'),
('NK080026', 'BAAPI005', 'NS_BS002', NULL, DATEADD(day, -26, GETDATE()), N'Tỉnh táo, hợp tác tốt, ăn ngủ cải thiện', N'Khó ngủ nhẹ', 36.5, '110/70', 74, N'Vitamin B1', N'1 viên/ngày', 'TrungBinh', N'Ổn định', N'Tiếp tục theo dõi'),
('NK080027', 'BAAPI006', 'NS_BS001', NULL, DATEADD(day, -27, GETDATE()), N'Mệt mỏi nhẹ sau buổi trị liệu', N'Đau đầu thoáng qua', 36.6, '115/75', 75, N'Paracetamol', N'2 viên/ngày', 'Nang', N'Theo dõi thêm', N'Duy trì phác đồ hiện tại'),
('NK080028', 'BAAPI007', 'NS_BS002', NULL, DATEADD(day, -28, GETDATE()), N'Thể trạng ổn định, không ghi nhận bất thường', N'Không ghi nhận', 36.7, '120/80', 76, N'Oresol', N'1 gói khi cần', 'Nhe', N'Cần tư vấn bổ sung', N'Tăng cường tư vấn tâm lý'),
('NK080029', 'BAAPI001', 'NS_BS001', NULL, DATEADD(day, -29, GETDATE()), N'Có biểu hiện lo âu vào buổi tối', N'Chán ăn buổi sáng', 36.8, '125/80', 77, N'Methadone', N'Theo chỉ định', 'TrungBinh', N'Đáp ứng điều trị tốt', N'Bổ sung dinh dưỡng'),
('NK080030', 'BAAPI002', 'NS_BS002', NULL, DATEADD(day, -30, GETDATE()), N'Tâm lý tích cực, tham gia hoạt động đầy đủ', N'Thèm thuốc mức độ thấp', 36.9, '130/85', 78, N'Không dùng thuốc bổ sung', N'Không có', 'Nang', N'Nguy cơ tái nghiện thấp', N'Nhắc tham gia sinh hoạt nhóm'),
('NK080031', 'BAAPI003', 'NS_BS001', NULL, DATEADD(day, -31, GETDATE()), N'Tỉnh táo, hợp tác tốt, ăn ngủ cải thiện', N'Khó ngủ nhẹ', 37.0, '110/70', 79, N'Vitamin B1', N'1 viên/ngày', 'Nhe', N'Ổn định', N'Tiếp tục theo dõi'),
('NK080032', 'BAAPI004', 'NS_BS002', NULL, DATEADD(day, -32, GETDATE()), N'Mệt mỏi nhẹ sau buổi trị liệu', N'Đau đầu thoáng qua', 36.3, '115/75', 80, N'Paracetamol', N'2 viên/ngày', 'TrungBinh', N'Theo dõi thêm', N'Duy trì phác đồ hiện tại'),
('NK080033', 'BAAPI005', 'NS_BS001', NULL, DATEADD(day, -33, GETDATE()), N'Thể trạng ổn định, không ghi nhận bất thường', N'Không ghi nhận', 36.4, '120/80', 81, N'Oresol', N'1 gói khi cần', 'Nang', N'Cần tư vấn bổ sung', N'Tăng cường tư vấn tâm lý'),
('NK080034', 'BAAPI006', 'NS_BS002', NULL, DATEADD(day, -34, GETDATE()), N'Có biểu hiện lo âu vào buổi tối', N'Chán ăn buổi sáng', 36.5, '125/80', 82, N'Methadone', N'Theo chỉ định', 'Nhe', N'Đáp ứng điều trị tốt', N'Bổ sung dinh dưỡng'),
('NK080035', 'BAAPI007', 'NS_BS001', NULL, DATEADD(day, -35, GETDATE()), N'Tâm lý tích cực, tham gia hoạt động đầy đủ', N'Thèm thuốc mức độ thấp', 36.6, '130/85', 83, N'Không dùng thuốc bổ sung', N'Không có', 'TrungBinh', N'Nguy cơ tái nghiện thấp', N'Nhắc tham gia sinh hoạt nhóm');

/* ============================================================
   14. SUMMARY KIEM TRA NHANH
   ============================================================ */
COMMIT TRAN;

PRINT N'08_Seed_Extra_Stats_NoLoop.sql chạy thành công. Dữ liệu thống kê đã được bổ sung.';

SELECT 'HoSoBanGiao' AS Bang, COUNT(*) AS SoDong FROM HoSoBanGiao
UNION ALL SELECT 'HoSoDeXuat', COUNT(*) FROM HoSoDeXuat
UNION ALL SELECT 'PhieuHoTro', COUNT(*) FROM PhieuHoTro
UNION ALL SELECT 'ThongBao', COUNT(*) FROM ThongBao
UNION ALL SELECT 'PhieuThamGap', COUNT(*) FROM PhieuThamGap
UNION ALL SELECT 'NguoiDiCung', COUNT(*) FROM NguoiDiCung
UNION ALL SELECT 'LichSinhHoat', COUNT(*) FROM LichSinhHoat
UNION ALL SELECT 'NhatKyDiemDanh', COUNT(*) FROM NhatKyDiemDanh
UNION ALL SELECT 'LichUongThuoc', COUNT(*) FROM LichUongThuoc
UNION ALL SELECT 'ChiTietLichUongThuoc', COUNT(*) FROM ChiTietLichUongThuoc
UNION ALL SELECT 'LichTuVanTamLy', COUNT(*) FROM LichTuVanTamLy
UNION ALL SELECT 'NhatKyDieuTri', COUNT(*) FROM NhatKyDieuTri;

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRAN;
    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    DECLARE @ErrorLine INT = ERROR_LINE();
    RAISERROR(N'Lỗi seed thêm dữ liệu tại dòng %d: %s', 16, 1, @ErrorLine, @ErrorMessage);
END CATCH;
GO