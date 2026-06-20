USE rehab_center_db;
GO

-- ==============================================================
-- INSERT MOCK DATA FOR MANAGER (QUẢN LÝ)
-- ==============================================================

-- 1. Insert Cán bộ Quản lý (nếu chưa có)
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'quanly01')
BEGIN
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
    VALUES ('quanly01', '123456', N'Trần Đại Nghĩa', '0911222333', 'nghia.td@rehab.vn', 3);
END

DECLARE @MaNguoiDungQL INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'quanly01');
IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'CBQL001')
BEGIN
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, ChucVu) VALUES ('CBQL001', @MaNguoiDungQL, N'Cán bộ quản lý');
END

-- 2. Đảm bảo có Bác sĩ 
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

-- 3. Đảm bảo có Người Cai Nghiện (Khắc phục lỗi khóa ngoại)
IF NOT EXISTS (SELECT 1 FROM NguoiThan WHERE SoCCCD = '048123123123')
BEGIN
    -- Tạo tài khoản người thân
    IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'nguoithan01')
    BEGIN
        INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
        VALUES ('nguoithan01', '123456', N'Nguyễn Bá Quyền', '0999888777', 'quyen.nb@gmail.com', 4); 
    END
    DECLARE @MaNguoiDungNT INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'nguoithan01');
    INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi)
    VALUES (@MaNguoiDungNT, '048123123123', '2020-01-01', N'Cục QLHC', N'Hải Châu, Đà Nẵng');
END

DECLARE @MaNguoiThan INT = (SELECT TOP 1 MaNguoiThan FROM NguoiThan);
IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCN-001')
BEGIN
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaNguoiThan, HoTen, NgayVaoTrai, TrangThai)
    VALUES ('NCN-001', @MaNguoiThan, N'Nguyễn Văn Trọng', '2025-10-01', 'DANG_CAI_NGHIEN');
END
IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCN-002')
BEGIN
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaNguoiThan, HoTen, NgayVaoTrai, TrangThai)
    VALUES ('NCN-002', @MaNguoiThan, N'Lý Hải Nam', '2025-11-15', 'DANG_CAI_NGHIEN');
END

-- 4. Hồ sơ bệnh án
IF NOT EXISTS (SELECT 1 FROM HoSoBenhAn WHERE MaBenhAn = 'BA-001')
BEGIN
    INSERT INTO HoSoBenhAn (MaBenhAn, MaNguoiCaiNghien, MaBacSi, TienSuBenh, DiUng, ChieuCao, CanNang)
    VALUES 
    ('BA-001', 'NCN-001', 'BS001', N'Rối loạn giấc ngủ', N'Không', 170.5, 65.0),
    ('BA-002', 'NCN-002', 'BS001', N'Bình thường', N'Kháng sinh', 165.0, 58.0);
END

-- 5. Lấy ID Giai đoạn (Khắc phục lỗi trùng lặp UNIQUE KEY UQ_DanhMucGiaiDoan_ThuTu)
-- Tự động tìm Giai đoạn có ThuTu = 1 trong Database hiện tại
DECLARE @MaGiaiDoan1 CHAR(10) = (SELECT TOP 1 MaGiaiDoan FROM DanhMucGiaiDoan WHERE ThuTu = 1);
IF @MaGiaiDoan1 IS NULL
BEGIN
    -- Chỉ chèn nếu bảng thật sự chưa có giai đoạn 1 nào
    INSERT INTO DanhMucGiaiDoan (MaGiaiDoan, TenGiaiDoan, ThuTu, MoTa) VALUES ('GD01', N'Cắt cơn giải độc', 1, N'Giai đoạn 1');
    SET @MaGiaiDoan1 = 'GD01';
END

-- 6. Phác đồ điều trị
IF NOT EXISTS (SELECT 1 FROM PhacDoDieuTri WHERE MaPhacDoDT = 'PD-001')
BEGIN
    INSERT INTO PhacDoDieuTri (MaPhacDoDT, MaBenhAn, MaBacSi, LoaiMaTuy, TrangThai)
    VALUES 
    ('PD-001', 'BA-001', 'BS001', 'HEROIN', 'DANG_AP_DUNG'),
    ('PD-002', 'BA-002', 'BS001', 'MA_TUY_DA', 'BAN_NHAP');
END

-- 7. Chi tiết phác đồ (Cần quản lý duyệt)
IF NOT EXISTS (SELECT 1 FROM ChiTietPhacDoDieuTri WHERE MaChiTietPhacDo = 'CTPD-001')
BEGIN
    INSERT INTO ChiTietPhacDoDieuTri (MaChiTietPhacDo, MaPhacDoDT, MaGiaiDoan, ThuTu, NoiDungPhacDoDT, MucTieu, NgayBatDau, NgayKetThucDuKien, TrangThai)
    VALUES 
    ('CTPD-001', 'PD-001', @MaGiaiDoan1, 1, N'Sử dụng thuốc cắt cơn theo liệu trình 15 ngày.', N'Cắt cơn, ổn định sức khỏe.', '2026-06-01', '2026-06-15', 'CHO_PHE_DUYET'),
    ('CTPD-002', 'PD-002', @MaGiaiDoan1, 1, N'Điều trị tâm lý và thuốc hỗ trợ phục hồi hệ thần kinh.', N'Kiểm soát hành vi.', '2026-06-10', '2026-06-30', 'CHO_PHE_DUYET');
END

PRINT 'Giai doan 2 Manager Mock Data inserted successfully without conflicts.';
GO
