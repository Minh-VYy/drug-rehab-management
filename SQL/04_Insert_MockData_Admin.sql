USE rehab_center_db;
GO

-- ==============================================================
-- INSERT MOCK DATA FOR ADMIN
-- ==============================================================

-- 1. Đảm bảo các Vai trò (Roles) cơ bản tồn tại
IF NOT EXISTS (SELECT 1 FROM VaiTro WHERE MaVaiTro = 1)
BEGIN
    -- Lưu ý: Identity INSERT có thể tắt/bật tùy database config, ta sẽ insert thông thường nếu ko khoá identity,
    -- hoặc giả định VaiTro đã được tạo cùng DB. Nếu chưa có, ta tạo bằng tên.
    -- Ở đây tạm giả định bảng VaiTro cho phép chèn. 
    -- Nếu có lỗi IDENTITY_INSERT, bỏ qua phần này vì DB thực tế luôn có sẵn bảng VaiTro do script khởi tạo.
    PRINT 'Skipping Role insertions assuming Database Initialization script already handled it.';
END

-- 2. Đảm bảo Admin Hệ thống tồn tại (Status: HoatDong)
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'admin01')
BEGIN
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
    VALUES ('admin01', '123456', N'Admin Hệ thống', '0900000000', 'admin01@rehab.vn', 1);
END

-- 3. Đảm bảo Bác sĩ tồn tại (Status: HoatDong)
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'bacsi01')
BEGIN
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
    VALUES ('bacsi01', '123456', N'BS. Mai Hoàng Yến', '0901222333', 'yen.mh@rehab.vn', 4);
END

-- 4. Đảm bảo Người thân tồn tại (Cập nhật thành TamKhoa để test Dashboard)
IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE TenDangNhap = 'nguoithan01')
BEGIN
    INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro)
    VALUES ('nguoithan01', '123456', N'Nguyễn Bá Quyền', '0999888777', 'quyen.nb@gmail.com', 4); 
    -- Tạm cập nhật thành TamKhoa nếu có cột TrangThai. Bảng NguoiDung hiện tại theo ERD không có cột TrangThai
    -- nhưng logic Mock Data của Frontend có thuộc tính status: 'TamKhoa'. Ta xử lý logic trên Backend.
END

PRINT 'Giai doan 4 Admin Mock Data inserted successfully.';
GO
