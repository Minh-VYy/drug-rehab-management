USE rehab_center_db;
GO

-- ==============================================================
-- INSERT MOCK DATA FOR STAFF DASHBOARD & PAGES
-- ==============================================================

-- 1. Insert NguoiDung & VaiTro (If not exists)
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE MaVaiTro = 6)
BEGIN
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES 
    (6, 'CanBo', N'Cán bộ trung tâm');
END

IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'canbo01')
BEGIN
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
    VALUES ('canbo01', '123456', N'CB. Lê Thị Hồng', '0911222333', 'hong.lt@rehab.vn', 6);
END

DECLARE @MaNguoiDungCB INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'canbo01');
IF NOT EXISTS (SELECT 1 FROM NhanSu WHERE MaNhanSu = 'CB001')
BEGIN
    INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, ChucVu) VALUES ('CB001', @MaNguoiDungCB, N'Cán bộ trung tâm');
END

-- Ensure CA001 exists for HoSoBanGiao
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE MaVaiTro = 5)
BEGIN
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (5, 'CongAn', N'Cán bộ công an bàn giao');
END
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

-- 2. Mock Data: Hồ sơ bàn giao (từ intake-confirmation.page.js)
IF NOT EXISTS (SELECT 1 FROM HoSoBanGiao WHERE MaHoSoBanGiao = 'HSBG003')
BEGIN
    INSERT INTO HoSoBanGiao (MaHoSoBanGiao, MaCanBoCongAn, HoTenDoiTuong, CCCD, NgaySinh, QueQuan, NoiO_HienTai, HoTenNguoiThan, SdtNguoiThan, QuanHeVoiDoiTuong, HanhViViPham, FileQuyetDinh, TrangThaiDuyet, MaCBQL)
    VALUES 
    ('HSBG003', N'Thiếu úy Nguyễn Văn Khánh', N'Phạm Thị E', '048201009012', '2000-07-20', N'Đà Nẵng', N'Quận Sơn Trà, Đà Nẵng', N'Phạm Văn Sơn', '0934567890', N'Anh trai', N'Tái sử dụng chất gây nghiện sau cai nghiện tại gia.', 'qd003.pdf', 'ChoDuyet', 'CA001'),
    ('HSBG005', N'Trung úy Trần Văn Hùng', N'Võ Thị G', '048201007788', '1999-02-02', N'Quảng Ngãi', N'Quận Cẩm Lệ, Đà Nẵng', N'Võ Văn Tâm', '0911223344', N'Cha', N'Sử dụng trái phép chất ma túy tổng hợp.', 'qd005.pdf', 'ChoDuyet', 'CA001'),
    ('HSBG006', N'Thiếu úy Nguyễn Văn Khánh', N'Bùi Văn H', '048201004455', '1997-09-18', N'Huế', N'Quận Ngũ Hành Sơn, Đà Nẵng', N'Bùi Thị Lan', '0987654321', N'Mẹ', N'Sử dụng Heroin, bị phát hiện trong đợt kiểm tra.', 'qd006.pdf', 'DaTiepNhan', 'CA001'),
    ('HSBG007', N'Trung úy Trần Văn Hùng', N'Đỗ Văn K', '048201006677', '1996-04-30', N'Đà Nẵng', N'Quận Liên Chiểu, Đà Nẵng', N'Đỗ Thị Nga', '0966112233', N'Vợ', N'Sử dụng ma túy đá, vi phạm trật tự công cộng.', 'qd007.pdf', 'TuChoi', 'CA001');
END

-- 3. NguoiCaiNghien (từ patient-management.page.js)
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE MaVaiTro = 4)
BEGIN
    INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES (4, 'NguoiThan', N'Người thân học viên');
END
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'nguoithan02')
BEGIN
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
    VALUES ('nguoithan02', '123456', N'Người thân chung', '0999111222', 'nt02@gmail.com', 4);
END
DECLARE @MaNguoiDungNT2 INT = (SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = 'nguoithan02');
IF NOT EXISTS (SELECT 1 FROM NguoiThan WHERE SoCCCD = '048000111222')
BEGIN
    INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi)
    VALUES (@MaNguoiDungNT2, '048000111222', '2020-01-01', N'Cục QLHC', N'Đà Nẵng');
END
DECLARE @MaNT2 INT = (SELECT MaNguoiThan FROM NguoiThan WHERE SoCCCD = '048000111222');

IF NOT EXISTS (SELECT 1 FROM NguoiCaiNghien WHERE MaNguoiCaiNghien = 'NCN001')
BEGIN
    INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaHoSoBanGiao, MaNguoiThan, HoTen, CCCD, NgayVaoTrai, TrangThai)
    VALUES 
    ('NCN001', 'HSBG003', @MaNT2, N'Nguyễn Văn Bình', '048201001234', '2026-06-10', 'DANG_CAI_NGHIEN'),
    ('NCN002', 'HSBG003', @MaNT2, N'Trần Văn Cường', '048201001235', '2026-06-12', 'DANG_KHAM_SUC_KHOE'),
    ('NCN003', 'HSBG003', @MaNT2, N'Phạm Thị Dung', '048301001236', '2026-05-01', 'DANG_CAI_NGHIEN'),
    ('NCN004', 'HSBG003', @MaNT2, N'Hoàng Văn Đạt', '048201001237', '2026-03-20', 'DANG_CAI_NGHIEN'),
    ('NCN005', 'HSBG005', @MaNT2, N'Vũ Thị Hằng', '048301001238', '2026-01-05', 'DA_HOAN_THANH'),
    ('NCN006', 'HSBG005', @MaNT2, N'Đặng Văn Khoa', '048201001239', '2026-06-18', 'DANG_KHAM_SUC_KHOE'),
    ('NCN007', 'HSBG005', @MaNT2, N'Bùi Thị Linh', '048301001240', '2026-04-22', 'TAM_NGUNG_DIEU_TRI');
END

-- 4. PhieuThamGap (từ visit-approval.page.js)
IF NOT EXISTS (SELECT 1 FROM PhieuThamGap WHERE MaNguoiCaiNghien = 'NCN001' AND NgayTham = '2026-06-22')
BEGIN
    INSERT INTO PhieuThamGap (MaNguoiThan, MaNguoiCaiNghien, LoaiThamGap, NgayTham, CaTham, TrangThai, MaNhanSu)
    VALUES 
    (@MaNT2, 'NCN001', 1, '2026-06-22', 1, 'CHO_DUYET', 'CB001'),
    (@MaNT2, 'NCN002', 2, '2026-06-23', 2, 'CHO_DUYET', 'CB001'),
    (@MaNT2, 'NCN003', 1, '2026-06-18', 1, 'DA_DONG_Y', 'CB001'),
    (@MaNT2, 'NCN004', 1, '2026-06-15', 2, 'TU_CHOI', 'CB001');
END

-- 5. LichSinhHoat (từ activity-schedule.page.js)
IF NOT EXISTS (SELECT 1 FROM DanhMucHoatDong WHERE MaHoatDong = 'HD001')
BEGIN
    INSERT INTO DanhMucHoatDong (MaHoatDong, TenHoatDong, LoaiHoatDong, ThoiGian) VALUES 
    ('HD001', N'Giáo dục', N'HOC_TAP', '2026-01-01'),
    ('HD002', N'Lao động', N'LAO_DONG', '2026-01-01'),
    ('HD003', N'Thể thao', N'THE_THAO', '2026-01-01');
END

IF NOT EXISTS (SELECT 1 FROM LichSinhHoat WHERE MaLich = 'LSH001')
BEGIN
    INSERT INTO LichSinhHoat (MaLich, MaNhanVien, MaHoatDong, ThoiGianBatDau, ThoiGianKetThuc, DiaDiem)
    VALUES 
    ('LSH001', 'CB001', 'HD001', '2026-06-20 08:00', '2026-06-20 10:00', N'Hội trường A'),
    ('LSH002', 'CB001', 'HD002', '2026-06-20 14:00', '2026-06-20 16:00', N'Khuôn viên trung tâm'),
    ('LSH003', 'CB001', 'HD003', '2026-06-21 15:30', '2026-06-21 17:00', N'Sân thể thao');
END

-- 6. NhatKyDiemDanh (từ attendance.page.js)
IF NOT EXISTS (SELECT 1 FROM NhatKyDiemDanh WHERE MaLich = 'LSH001' AND MaNguoiCaiNghien = 'NCN001')
BEGIN
    INSERT INTO NhatKyDiemDanh (MaLich, MaNguoiCaiNghien, MaNhanVien, ThoiGian, TrangThai, GhiChu)
    VALUES 
    ('LSH001', 'NCN001', 'CB001', '2026-06-20 08:00', 'CO_MAT', NULL),
    ('LSH001', 'NCN003', 'CB001', '2026-06-20 08:00', 'CO_MAT', NULL),
    ('LSH001', 'NCN007', 'CB001', '2026-06-20 08:00', 'CO_PHEP', N'Đang điều trị y tế tại phòng khám trung tâm.'),
    ('LSH002', 'NCN002', 'CB001', '2026-06-20 14:00', 'CO_MAT', NULL),
    ('LSH002', 'NCN006', 'CB001', '2026-06-20 14:00', 'VANG_MAT', N'Không có mặt, chưa rõ lý do, cần xác minh.');
END

PRINT '05_Insert_MockData_Staff executed successfully.'
GO
