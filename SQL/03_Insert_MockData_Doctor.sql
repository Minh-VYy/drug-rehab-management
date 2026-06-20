USE rehab_center_db;
GO

-- ==============================================================
-- INSERT MOCK DATA FOR DOCTOR (BÁC SĨ)
-- ==============================================================

-- 1. Đảm bảo Bác sĩ tồn tại
IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'BS001')
BEGIN
    IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'bacsi01')
    BEGIN
        INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
        VALUES ('bacsi01', '123456', N'BS. Mai Hoàng Yến', '0901222333', 'yen.mh@rehab.vn', 4);
    END
    DECLARE @MaNguoiDungBS INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'bacsi01');
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, ChucVu) VALUES ('BS001', @MaNguoiDungBS, N'Bác sĩ điều trị');
END

-- Đảm bảo có Bác sĩ thứ 2
IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'BS002')
BEGIN
    IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'bacsi02')
    BEGIN
        INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
        VALUES ('bacsi02', '123456', N'BS. Lê Văn Hải', '0988777666', 'hai.lv@rehab.vn', 4);
    END
    DECLARE @MaNguoiDungBS2 INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'bacsi02');
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, ChucVu) VALUES ('BS002', @MaNguoiDungBS2, N'Bác sĩ điều trị');
END

-- 2. Đảm bảo Người Cai Nghiện tồn tại
DECLARE @MaNguoiThan INT = (SELECT TOP 1 MaNguoiThan FROM NguoiThan);
IF @MaNguoiThan IS NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'nguoithan01')
    BEGIN
        INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
        VALUES ('nguoithan01', '123456', N'Nguyễn Bá Quyền', '0999888777', 'quyen.nb@gmail.com', 4); 
    END
    DECLARE @MaNguoiDungNT INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'nguoithan01');
    INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi)
    VALUES (@MaNguoiDungNT, '048123123123', '2020-01-01', N'Cục QLHC', N'Hải Châu, Đà Nẵng');
    SET @MaNguoiThan = (SELECT SCOPE_IDENTITY());
END

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCN-003')
BEGIN
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaNguoiThan, HoTen, NgayVaoTrai, TrangThai)
    VALUES ('NCN-003', @MaNguoiThan, N'Hoàng Văn Nam', '2026-01-05', 'DANG_CAI_NGHIEN');
END
IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCN-004')
BEGIN
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaNguoiThan, HoTen, NgayVaoTrai, TrangThai)
    VALUES ('NCN-004', @MaNguoiThan, N'Đỗ Minh Trí', '2026-02-10', 'DANG_CAI_NGHIEN');
END

-- 3. Hồ sơ bệnh án của Bác sĩ 001 (BS001) - Có hồ sơ cần cập nhật và đã cập nhật
IF NOT EXISTS (SELECT 1 FROM HoSoBenhAn WHERE MaBenhAn = 'BA-003')
BEGIN
    -- Hồ sơ cũ, quá 7 ngày chưa cập nhật (Cần cập nhật)
    INSERT INTO HoSoBenhAn (MaBenhAn, MaNguoiCaiNghien, MaBacSi, TienSuBenh, DiUng, ChieuCao, CanNang, NgayLap, NgayCapNhatCuoi)
    VALUES ('BA-003', 'NCN-003', 'BS001', N'Viêm dạ dày', N'Hải sản', 168.0, 62.0, DATEADD(DAY, -20, GETDATE()), DATEADD(DAY, -10, GETDATE()));
END

IF NOT EXISTS (SELECT 1 FROM HoSoBenhAn WHERE MaBenhAn = 'BA-004')
BEGIN
    -- Hồ sơ mới cập nhật (Đã cập nhật)
    INSERT INTO HoSoBenhAn (MaBenhAn, MaNguoiCaiNghien, MaBacSi, TienSuBenh, DiUng, ChieuCao, CanNang, NgayLap, NgayCapNhatCuoi)
    VALUES ('BA-004', 'NCN-004', 'BS001', N'Sức khoẻ ổn định', N'Không', 172.0, 70.0, DATEADD(DAY, -5, GETDATE()), DATEADD(DAY, -1, GETDATE()));
END

PRINT 'Giai doan 3 Doctor Mock Data inserted successfully without conflicts.';
GO
