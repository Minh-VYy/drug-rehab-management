USE rehab_center_db;
GO

-- ==============================================================
-- INSERT MOCK DATA FOR LEADER DASHBOARD / APPROVALS
-- ==============================================================

-- 1. Insert NguoiDung & VaiTro (If not exists)
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE MaVaiTro = 1)
BEGIN
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES 
    (1, 'Admin', N'Quản trị hệ thống'),
    (2, 'LanhDao', N'Lãnh đạo trung tâm'),
    (3, 'QuanLy', N'Cán bộ quản lý'),
    (4, 'BacSi', N'Bác sĩ điều trị'),
    (5, 'CongAn', N'Cán bộ công an bàn giao');
END

-- 2. Cán bộ Công An (để tạo Hồ sơ bàn giao)
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'congan01')
BEGIN
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
    VALUES ('congan01', '123456', N'Đại úy Nguyễn Văn An', '0988111222', 'an.nv@congan.vn', 5);
END

DECLARE @MaNguoiDungCongAn INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'congan01');
IF NOT EXISTS (SELECT 1 FROM CanBoQuanLyHoSo WHERE MaCanBoCongAn = 'CA001')
BEGIN
    INSERT INTO CanBoQuanLyHoSo (MaCanBoCongAn, MaNguoiDung, HoTen, SoHieuCAND, DonViCongTac, SoDienThoai)
    VALUES ('CA001', @MaNguoiDungCongAn, N'Đại úy Nguyễn Văn An', 'CAND-00123', N'Công an Phường Hải Châu 1', '0988111222');
END

-- 3. Mock Data: Hồ sơ bàn giao (Intake Approvals)
IF NOT EXISTS (SELECT 1 FROM HoSoBanGiao WHERE MaHoSoBanGiao = 'HSBG-2026-001')
BEGIN
    INSERT INTO HoSoBanGiao (MaHoSoBanGiao, MaCanBoCongAn, HoTenDoiTuong, CCCD, NgaySinh, HoTenNguoiThan, SdtNguoiThan, QuanHeVoiDoiTuong, HanhViViPham, FileQuyetDinh, TrangThaiDuyet, MaCBQL)
    VALUES 
    ('HSBG-2026-001', N'Nguyễn Văn An', N'Trần Tuấn Kiệt', '048099123456', '1995-05-10', N'Trần Văn Hùng', '0912345678', N'Bố', N'Tổ chức và sử dụng trái phép chất ma túy tại cơ sở kinh doanh karaoke.', 'QD_XuPhat_001.pdf', 'ChoDuyet', 'CA001'),
    ('HSBG-2026-002', N'Nguyễn Văn An', N'Lê Thị Thu', '048099654321', '1998-08-20', N'Lê Văn Sang', '0987654321', N'Anh trai', N'Bị bắt quả tang tàng trữ lượng nhỏ ma túy đá.', 'QD_XuPhat_002.pdf', 'DaTiepNhan', 'CA001'),
    ('HSBG-2026-003', N'Nguyễn Văn An', N'Phạm Minh Chí', '048099111222', '2001-12-05', N'Phạm Khắc Tùng', '0909112233', N'Bố', N'Gây rối trật tự công cộng sau khi sử dụng chất kích thích.', 'QD_XuPhat_003.pdf', 'ChoDuyet', 'CA001');
END

-- 4. Bác sĩ & Quản lý (để tạo Hồ sơ đề xuất hoàn thành)
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'bacsi01')
BEGIN
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
    VALUES ('bacsi01', '123456', N'BS. Mai Hoàng Yến', '0901222333', 'yen.mh@rehab.vn', 4);
END

DECLARE @MaNguoiDungBS INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'bacsi01');
IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'BS001')
BEGIN
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, ChucVu) VALUES ('BS001', @MaNguoiDungBS, N'Bác sĩ điều trị');
END

-- 5. Người cai nghiện & Người thân
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'nguoithan01')
BEGIN
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
    VALUES ('nguoithan01', '123456', N'Nguyễn Bá Quyền', '0999888777', 'quyen.nb@gmail.com', 4); -- role 4 is just mock
END

DECLARE @MaNguoiDungNT INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'nguoithan01');
IF NOT EXISTS (SELECT 1 FROM NguoiThan WHERE SoCCCD = '048123123123')
BEGIN
    INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi)
    VALUES (@MaNguoiDungNT, '048123123123', '2020-01-01', N'Cục QLHC', N'Hải Châu, Đà Nẵng');
END

DECLARE @MaNguoiThan INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048123123123');
IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCN-001')
BEGIN
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaNguoiThan, HoTen, NgayVaoTrai, TrangThai)
    VALUES 
    ('NCN-001', @MaNguoiThan, N'Nguyễn Văn Trọng', '2025-10-01', 'DANG_CAI_NGHIEN'),
    ('NCN-002', @MaNguoiThan, N'Lý Hải Nam', '2025-11-15', 'DANG_CAI_NGHIEN');
END

-- 6. Mock Data: Hồ sơ đề xuất (Completion Approvals)
IF NOT EXISTS (SELECT 1 FROM HoSoDeXuat WHERE MaDeXuat = 'DXHT-001')
BEGIN
    INSERT INTO HoSoDeXuat (MaDeXuat, MaNguoiCaiNghien, MaBacSi, LoaiDeXuat, LyDo, NgayDeXuat, TrangThai)
    VALUES 
    ('DXHT-001', 'NCN-001', 'BS001', N'RA_TRAI', N'Học viên đã hoàn thành xuất sắc phác đồ cắt cơn và phục hồi 6 tháng. Phục hồi tâm lý tốt, đủ điều kiện tái hòa nhập.', '2026-06-15', 'CHO_DUYET'),
    ('DXHT-002', 'NCN-002', 'BS001', N'RA_TRAI', N'Học viên phục hồi tốt, gia đình bảo lãnh xin ra trại sớm để tiếp tục quản lý tại địa phương.', '2026-06-18', 'CHO_DUYET');
END

PRINT 'Giai doan 1 Leader Mock Data inserted successfully.';
GO
