/* ============================================================
   DATABASE: rehab_center_db
   SOURCE  : ERD moi nhat - erd (2).mdj
   DBMS    : Microsoft SQL Server
   NOTE    : Script co the chay lai tu dau.
             Neu database da ton tai thi se xoa va tao lai.
   ============================================================ */

USE master;
GO

IF DB_ID(N'rehab_center_db') IS NOT NULL
BEGIN
    ALTER DATABASE rehab_center_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE rehab_center_db;
END
GO

CREATE DATABASE rehab_center_db;
GO

USE rehab_center_db;
GO

SET NOCOUNT ON;
GO

/* ============================================================
   1. BANG VAI TRO VA NGUOI DUNG
   ============================================================ */

CREATE TABLE VaiTro (
    MaVaiTro INT NOT NULL,
    TenVaiTro VARCHAR(50) NOT NULL,
    MoTa NVARCHAR(100) NOT NULL,
    CONSTRAINT PK_VaiTro PRIMARY KEY (MaVaiTro),
    CONSTRAINT UQ_VaiTro_TenVaiTro UNIQUE (TenVaiTro)
);
GO

CREATE TABLE NguoiDung (
    MaNguoiDung INT IDENTITY(1,1) NOT NULL,
    TenDangNhap VARCHAR(50) NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    HoTen NVARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    MaVaiTro INT NOT NULL,
    TrangThai VARCHAR(20) NOT NULL CONSTRAINT DF_NguoiDung_TrangThai DEFAULT ('DANG_HOAT_DONG'),
    NgayTao DATETIME NULL CONSTRAINT DF_NguoiDung_NgayTao DEFAULT (GETDATE()),
    CONSTRAINT PK_NguoiDung PRIMARY KEY (MaNguoiDung),
    CONSTRAINT UQ_NguoiDung_TenDangNhap UNIQUE (TenDangNhap),
    CONSTRAINT FK_NguoiDung_VaiTro FOREIGN KEY (MaVaiTro) REFERENCES VaiTro(MaVaiTro),
    CONSTRAINT CK_NguoiDung_TrangThai CHECK (TrangThai IN ('DANG_HOAT_DONG', 'TAM_KHOA', 'DA_XOA'))
);
GO

CREATE TABLE NhanSu (
    MaNhanSu CHAR(10) NOT NULL,
    MaNguoiDung INT NOT NULL,
    TrangThai VARCHAR(20) NOT NULL CONSTRAINT DF_NhanSu_TrangThai DEFAULT ('DANG_LAM_VIEC'),
    ChucVu NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_NhanSu PRIMARY KEY (MaNhanSu),
    CONSTRAINT UQ_NhanSu_MaNguoiDung UNIQUE (MaNguoiDung),
    CONSTRAINT FK_NhanSu_NguoiDung FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung),
    CONSTRAINT CK_NhanSu_TrangThai CHECK (TrangThai IN ('DANG_LAM_VIEC', 'TAM_NGHI', 'DA_NGHI_VIEC'))
);
GO

CREATE TABLE CanBoQuanLyHoSo (
    MaCanBoCongAn CHAR(10) NOT NULL,
    MaNguoiDung INT NOT NULL,
    HoTen NVARCHAR(100) NOT NULL,
    SoHieuCAND VARCHAR(15) NOT NULL,
    DonViCongTac NVARCHAR(200) NOT NULL,
    SoDienThoai VARCHAR(15) NOT NULL,
    CONSTRAINT PK_CanBoQuanLyHoSo PRIMARY KEY (MaCanBoCongAn),
    CONSTRAINT UQ_CanBoQuanLyHoSo_MaNguoiDung UNIQUE (MaNguoiDung),
    CONSTRAINT UQ_CanBoQuanLyHoSo_SoHieuCAND UNIQUE (SoHieuCAND),
    CONSTRAINT FK_CanBoQuanLyHoSo_NguoiDung FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung)
);
GO

CREATE TABLE NguoiThan (
    MaNguoiThan INT IDENTITY(1,1) NOT NULL,
    MaNguoiDung INT NOT NULL,
    SoCCCD VARCHAR(12) NOT NULL,
    NgayCap DATE NOT NULL,
    NoiCap NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(255) NOT NULL,
    NgheNghiep NVARCHAR(100) NULL,
    AnhChanDung VARCHAR(255) NULL,
    CONSTRAINT PK_NguoiThan PRIMARY KEY (MaNguoiThan),
    CONSTRAINT UQ_NguoiThan_MaNguoiDung UNIQUE (MaNguoiDung),
    CONSTRAINT UQ_NguoiThan_SoCCCD UNIQUE (SoCCCD),
    CONSTRAINT FK_NguoiThan_NguoiDung FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung)
);
GO

/* ============================================================
   2. DANH MUC
   ============================================================ */

CREATE TABLE DanhMucThuoc (
    MaThuoc CHAR(10) NOT NULL,
    TenThuoc NVARCHAR(100) NOT NULL,
    DonViTinh NVARCHAR(30) NOT NULL,
    SoLuong INT NOT NULL,
    GhiChu NVARCHAR(255) NULL,
    CONSTRAINT PK_DanhMucThuoc PRIMARY KEY (MaThuoc),
    CONSTRAINT CK_DanhMucThuoc_SoLuong CHECK (SoLuong >= 0)
);
GO

CREATE TABLE DanhMucHoatDong (
    MaHoatDong CHAR(10) NOT NULL,
    TenHoatDong NVARCHAR(100) NOT NULL,
    LoaiHoatDong NVARCHAR(30) NOT NULL,
    ThoiGian DATE NOT NULL,
    MoTa NVARCHAR(500) NULL,
    CONSTRAINT PK_DanhMucHoatDong PRIMARY KEY (MaHoatDong),
    CONSTRAINT CK_DanhMucHoatDong_LoaiHoatDong CHECK (LoaiHoatDong IN (N'SINH_HOAT', N'TRI_LIEU', N'LAO_DONG', N'HOC_TAP', N'THE_THAO'))
);
GO

CREATE TABLE DanhMucGiaiDoan (
    MaGiaiDoan CHAR(10) NOT NULL,
    TenGiaiDoan NVARCHAR(100) NOT NULL,
    ThuTu INT NOT NULL,
    MoTa NVARCHAR(500) NULL,
    CONSTRAINT PK_DanhMucGiaiDoan PRIMARY KEY (MaGiaiDoan),
    CONSTRAINT UQ_DanhMucGiaiDoan_ThuTu UNIQUE (ThuTu),
    CONSTRAINT CK_DanhMucGiaiDoan_ThuTu CHECK (ThuTu > 0)
);
GO

/* ============================================================
   3. NGUOI THAN - DON TU NGUYEN - HO SO BAN GIAO - NGUOI CAI NGHIEN
   ============================================================ */

CREATE TABLE DonDangKyTuNguyen (
    MaDonTuNguyen INT IDENTITY(1,1) NOT NULL,
    MaNguoiThan INT NOT NULL,
    HoTenNguoiCaiNghien NVARCHAR(100) NOT NULL,
    NgaySinhNguoiCaiNghien DATE NOT NULL,
    DiaChiThuongTru NVARCHAR(255) NOT NULL,
    SoCCCDNguoiCaiNghien VARCHAR(12) NOT NULL,
    QuanHeVoiNguoiCaiNghien NVARCHAR(50) NOT NULL,
    LoaiMaTuySuDung NVARCHAR(100) NOT NULL,
    BieuHienLamSang NVARCHAR(500) NOT NULL,
    TepCCCDMatTruoc VARCHAR(255) NOT NULL,
    TepCCCDMatSau VARCHAR(255) NOT NULL,
    NgayGuiDon DATETIME NULL CONSTRAINT DF_DonDangKyTuNguyen_NgayGuiDon DEFAULT (GETDATE()),
    TrangThai VARCHAR(30) NULL CONSTRAINT DF_DonDangKyTuNguyen_TrangThai DEFAULT ('CHO_DUYET'),
    MaNhanSu CHAR(10) NULL,
    CONSTRAINT PK_DonDangKyTuNguyen PRIMARY KEY (MaDonTuNguyen),
    CONSTRAINT FK_DonDangKyTuNguyen_NguoiThan FOREIGN KEY (MaNguoiThan) REFERENCES NguoiThan(MaNguoiThan),
    CONSTRAINT FK_DonDangKyTuNguyen_NhanSu FOREIGN KEY (MaNhanSu) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_DonDangKyTuNguyen_TrangThai CHECK (TrangThai IN ('CHO_DUYET', 'DA_TIEP_NHAN', 'TU_CHOI', 'DA_NHAP_TRAI', 'GIA_DINH_HUY'))
);
GO

CREATE TABLE HoSoBanGiao (
    MaHoSoBanGiao VARCHAR(20) NOT NULL,
    MaCanBoCongAn NVARCHAR(100) NOT NULL,
    HoTenDoiTuong NVARCHAR(100) NOT NULL,
    CCCD VARCHAR(12) NULL,
    NgaySinh DATE NULL,
    QueQuan NVARCHAR(255) NULL,
    NoiO_HienTai NVARCHAR(255) NULL,
    HoTenNguoiThan NVARCHAR(100) NULL,
    SdtNguoiThan VARCHAR(15) NULL,
    QuanHeVoiDoiTuong NVARCHAR(50) NULL,
    HanhViViPham NVARCHAR(500) NOT NULL,
    FileQuyetDinh VARCHAR(255) NOT NULL,
    TrangThaiDuyet VARCHAR(30) NULL CONSTRAINT DF_HoSoBanGiao_TrangThaiDuyet DEFAULT ('ChoDuyet'),
    MaNhanSuDuyet CHAR(10) NULL,
    NgayDuyet DATETIME NULL,
    MaCBQL CHAR(10) NOT NULL,
    CONSTRAINT PK_HoSoBanGiao PRIMARY KEY (MaHoSoBanGiao),
    CONSTRAINT FK_HoSoBanGiao_NhanSuDuyet FOREIGN KEY (MaNhanSuDuyet) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT FK_HoSoBanGiao_CanBoQuanLyHoSo FOREIGN KEY (MaCBQL) REFERENCES CanBoQuanLyHoSo(MaCanBoCongAn),
    CONSTRAINT CK_HoSoBanGiao_TrangThaiDuyet CHECK (TrangThaiDuyet IN ('ChoDuyet', 'DaTiepNhan', 'TuChoi'))
);
GO

CREATE TABLE NguoiCaiNghien (
    MaNguoiCaiNghien VARCHAR(20) NOT NULL,
    MaDonTuNguyen INT NULL,
    MaHoSoBanGiao VARCHAR(20) NULL,
    MaNguoiThan INT NOT NULL,
    HoTen NVARCHAR(100) NOT NULL,
    CCCD VARCHAR(12) NULL,
    NgayVaoTrai DATETIME NOT NULL,
    MaGiaiDoanHienTai CHAR(10) NULL,
    TrangThai VARCHAR(30) NULL CONSTRAINT DF_NguoiCaiNghien_TrangThai DEFAULT ('DANG_CAI_NGHIEN'),
    CONSTRAINT PK_NguoiCaiNghien PRIMARY KEY (MaNguoiCaiNghien),
    CONSTRAINT FK_NguoiCaiNghien_DonDangKyTuNguyen FOREIGN KEY (MaDonTuNguyen) REFERENCES DonDangKyTuNguyen(MaDonTuNguyen),
    CONSTRAINT FK_NguoiCaiNghien_HoSoBanGiao FOREIGN KEY (MaHoSoBanGiao) REFERENCES HoSoBanGiao(MaHoSoBanGiao),
    CONSTRAINT FK_NguoiCaiNghien_NguoiThan FOREIGN KEY (MaNguoiThan) REFERENCES NguoiThan(MaNguoiThan),
    CONSTRAINT FK_NguoiCaiNghien_GiaiDoanHienTai FOREIGN KEY (MaGiaiDoanHienTai) REFERENCES DanhMucGiaiDoan(MaGiaiDoan),
    CONSTRAINT CK_NguoiCaiNghien_TrangThai CHECK (TrangThai IN ('DANG_KHAM_SUC_KHOE', 'DANG_CAI_NGHIEN', 'TAM_NGUNG_DIEU_TRI', 'DA_HOAN_THANH', 'TRON_TRAI', 'DA_CHUYEN_VIEN')),
    CONSTRAINT CK_NguoiCaiNghien_NguonHoSo CHECK (MaDonTuNguyen IS NOT NULL OR MaHoSoBanGiao IS NOT NULL)
);
GO

/* ============================================================
   4. THAM GAP - HO TRO - THONG BAO
   ============================================================ */

CREATE TABLE PhieuThamGap (
    MaPhieu INT IDENTITY(1,1) NOT NULL,
    MaNguoiThan INT NOT NULL,
    MaNguoiCaiNghien VARCHAR(20) NOT NULL,
    LoaiThamGap TINYINT NOT NULL,
    NgayTham DATE NOT NULL,
    CaTham TINYINT NOT NULL,
    TrangThai VARCHAR(30) NULL CONSTRAINT DF_PhieuThamGap_TrangThai DEFAULT ('CHO_DUYET'),
    NgayTao DATETIME NULL CONSTRAINT DF_PhieuThamGap_NgayTao DEFAULT (GETDATE()),
    MaNhanSu CHAR(10) NOT NULL,
    CONSTRAINT PK_PhieuThamGap PRIMARY KEY (MaPhieu),
    CONSTRAINT FK_PhieuThamGap_NguoiThan FOREIGN KEY (MaNguoiThan) REFERENCES NguoiThan(MaNguoiThan),
    CONSTRAINT FK_PhieuThamGap_NguoiCaiNghien FOREIGN KEY (MaNguoiCaiNghien) REFERENCES NguoiCaiNghien(MaNguoiCaiNghien),
    CONSTRAINT FK_PhieuThamGap_NhanSu FOREIGN KEY (MaNhanSu) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_PhieuThamGap_LoaiThamGap CHECK (LoaiThamGap IN (1, 2)),
    CONSTRAINT CK_PhieuThamGap_CaTham CHECK (CaTham IN (1, 2, 3)),
    CONSTRAINT CK_PhieuThamGap_TrangThai CHECK (TrangThai IN ('CHO_DUYET', 'DA_DONG_Y', 'TU_CHOI', 'HOAN_THANH', 'HUY'))
);
GO

CREATE TABLE NguoiDiCung (
    MaChiTiet INT IDENTITY(1,1) NOT NULL,
    MaPhieu INT NOT NULL,
    HoTen NVARCHAR(100) NOT NULL,
    LoaiGiayTo TINYINT NOT NULL,
    SoGiayTo VARCHAR(20) NOT NULL,
    QuanHe NVARCHAR(50) NOT NULL,
    TepXacMinh VARCHAR(255) NOT NULL,
    CONSTRAINT PK_NguoiDiCung PRIMARY KEY (MaChiTiet),
    CONSTRAINT FK_NguoiDiCung_PhieuThamGap FOREIGN KEY (MaPhieu) REFERENCES PhieuThamGap(MaPhieu) ON DELETE CASCADE,
    CONSTRAINT CK_NguoiDiCung_LoaiGiayTo CHECK (LoaiGiayTo IN (1, 2, 3))
);
GO

CREATE TABLE PhieuHoTro (
    MaYeuCau CHAR(10) NOT NULL,
    MaNguoiThan INT NOT NULL,
    TieuDe NVARCHAR(200) NOT NULL,
    NoiDungYeuCau NVARCHAR(MAX) NOT NULL,
    NgayGui DATETIME NOT NULL CONSTRAINT DF_PhieuHoTro_NgayGui DEFAULT (GETDATE()),
    TrangThai VARCHAR(30) NOT NULL CONSTRAINT DF_PhieuHoTro_TrangThai DEFAULT ('CHO_PHAN_HOI'),
    NoiDungPhanHoi NVARCHAR(MAX) NULL,
    MaNhanVien CHAR(10) NULL,
    NgayPhanHoi DATETIME NULL,
    CONSTRAINT PK_PhieuHoTro PRIMARY KEY (MaYeuCau),
    CONSTRAINT FK_PhieuHoTro_NguoiThan FOREIGN KEY (MaNguoiThan) REFERENCES NguoiThan(MaNguoiThan),
    CONSTRAINT FK_PhieuHoTro_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_PhieuHoTro_TrangThai CHECK (TrangThai IN ('CHO_PHAN_HOI', 'DA_PHAN_HOI'))
);
GO

CREATE TABLE ThongBao (
    MaThongBao CHAR(10) NOT NULL,
    MaNhanVien CHAR(10) NOT NULL,
    TieuDe NVARCHAR(200) NOT NULL,
    NoiDung NVARCHAR(MAX) NOT NULL,
    NgayTao DATETIME NOT NULL CONSTRAINT DF_ThongBao_NgayTao DEFAULT (GETDATE()),
    LoaiThongBao VARCHAR(30) NOT NULL,
    TrangThai VARCHAR(20) NOT NULL CONSTRAINT DF_ThongBao_TrangThai DEFAULT ('CHUA_DOC'),
    MaNguoiDungNhan INT NULL,
    CONSTRAINT PK_ThongBao PRIMARY KEY (MaThongBao),
    CONSTRAINT FK_ThongBao_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT FK_ThongBao_NguoiDungNhan FOREIGN KEY (MaNguoiDungNhan) REFERENCES NguoiDung(MaNguoiDung),
    CONSTRAINT CK_ThongBao_LoaiThongBao CHECK (LoaiThongBao IN ('TatCa', 'NoiBo', 'CaNhan')),
    CONSTRAINT CK_ThongBao_TrangThai CHECK (TrangThai IN ('CHUA_DOC', 'DA_DOC')),
    CONSTRAINT CK_ThongBao_NguoiNhan CHECK (
        (LoaiThongBao = 'CaNhan' AND MaNguoiDungNhan IS NOT NULL)
        OR (LoaiThongBao IN ('TatCa', 'NoiBo') AND MaNguoiDungNhan IS NULL)
    )
);
GO

/* ============================================================
   5. SINH HOAT - DIEM DANH
   ============================================================ */

CREATE TABLE LichSinhHoat (
    MaLich CHAR(10) NOT NULL,
    MaNhanVien CHAR(10) NOT NULL,
    MaHoatDong CHAR(10) NOT NULL,
    ThoiGianBatDau DATETIME NOT NULL,
    ThoiGianKetThuc DATETIME NOT NULL,
    DiaDiem NVARCHAR(100) NOT NULL,
    CONSTRAINT PK_LichSinhHoat PRIMARY KEY (MaLich),
    CONSTRAINT FK_LichSinhHoat_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT FK_LichSinhHoat_DanhMucHoatDong FOREIGN KEY (MaHoatDong) REFERENCES DanhMucHoatDong(MaHoatDong),
    CONSTRAINT CK_LichSinhHoat_ThoiGian CHECK (ThoiGianKetThuc > ThoiGianBatDau)
);
GO

CREATE TABLE NhatKyDiemDanh (
    MaLich CHAR(10) NOT NULL,
    MaNguoiCaiNghien VARCHAR(20) NOT NULL,
    MaNhanVien CHAR(10) NOT NULL,
    ThoiGian DATETIME NOT NULL CONSTRAINT DF_NhatKyDiemDanh_ThoiGian DEFAULT (GETDATE()),
    TrangThai VARCHAR(30) NOT NULL,
    GhiChu NVARCHAR(200) NULL,
    CONSTRAINT PK_NhatKyDiemDanh PRIMARY KEY (MaLich, MaNguoiCaiNghien),
    CONSTRAINT FK_NhatKyDiemDanh_LichSinhHoat FOREIGN KEY (MaLich) REFERENCES LichSinhHoat(MaLich),
    CONSTRAINT FK_NhatKyDiemDanh_NguoiCaiNghien FOREIGN KEY (MaNguoiCaiNghien) REFERENCES NguoiCaiNghien(MaNguoiCaiNghien),
    CONSTRAINT FK_NhatKyDiemDanh_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_NhatKyDiemDanh_TrangThai CHECK (TrangThai IN ('CO_MAT', 'VANG_MAT', 'CO_PHEP', 'TRE_GIO'))
);
GO

/* ============================================================
   6. DIEU TRI - BENH AN - PHAC DO - DE XUAT
   ============================================================ */

CREATE TABLE PhanCongPhuTrach (
    MaPhanCong CHAR(10) NOT NULL,
    MaNguoiCaiNghien VARCHAR(20) NOT NULL,
    MaBacSi CHAR(10) NOT NULL,
    MaQuanLy CHAR(10) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    TrangThai VARCHAR(30) NOT NULL CONSTRAINT DF_PhanCongPhuTrach_TrangThai DEFAULT ('DANG_PHU_TRACH'),
    CONSTRAINT PK_PhanCongPhuTrach PRIMARY KEY (MaPhanCong),
    CONSTRAINT FK_PhanCongPhuTrach_NguoiCaiNghien FOREIGN KEY (MaNguoiCaiNghien) REFERENCES NguoiCaiNghien(MaNguoiCaiNghien),
    CONSTRAINT FK_PhanCongPhuTrach_BacSi FOREIGN KEY (MaBacSi) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT FK_PhanCongPhuTrach_QuanLy FOREIGN KEY (MaQuanLy) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_PhanCongPhuTrach_TrangThai CHECK (TrangThai IN ('DANG_PHU_TRACH', 'DA_KET_THUC', 'TAM_NGUNG')),
    CONSTRAINT CK_PhanCongPhuTrach_Ngay CHECK (NgayKetThuc >= NgayBatDau)
);
GO

CREATE TABLE HoSoBenhAn (
    MaBenhAn CHAR(10) NOT NULL,
    MaNguoiCaiNghien VARCHAR(20) NULL,
    MaBacSi CHAR(10) NOT NULL,
    TienSuBenh NVARCHAR(500) NULL,
    DiUng NVARCHAR(500) NULL,
    ChieuCao DECIMAL(5,2) NULL,
    CanNang DECIMAL(5,2) NULL,
    NhomMau VARCHAR(10) NULL,
    NgayLap DATETIME NOT NULL CONSTRAINT DF_HoSoBenhAn_NgayLap DEFAULT (GETDATE()),
    NgayCapNhatCuoi DATETIME NOT NULL CONSTRAINT DF_HoSoBenhAn_NgayCapNhatCuoi DEFAULT (GETDATE()),
    CONSTRAINT PK_HoSoBenhAn PRIMARY KEY (MaBenhAn),
    CONSTRAINT FK_HoSoBenhAn_NguoiCaiNghien FOREIGN KEY (MaNguoiCaiNghien) REFERENCES NguoiCaiNghien(MaNguoiCaiNghien),
    CONSTRAINT FK_HoSoBenhAn_BacSi FOREIGN KEY (MaBacSi) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_HoSoBenhAn_ChieuCao CHECK (ChieuCao IS NULL OR ChieuCao > 0),
    CONSTRAINT CK_HoSoBenhAn_CanNang CHECK (CanNang IS NULL OR CanNang > 0)
);
GO

CREATE TABLE NhatKyDieuTri (
    MaNhatKy CHAR(10) NOT NULL,
    MaBenhAn CHAR(10) NOT NULL,
    MaBacSi CHAR(10) NOT NULL,
    MaChiTietPhacDo CHAR(15) NULL,
    NgayGhi DATETIME NOT NULL CONSTRAINT DF_NhatKyDieuTri_NgayGhi DEFAULT (GETDATE()),
    TinhTrangSucKhoe NVARCHAR(500) NOT NULL,
    TrieuChung NVARCHAR(500) NULL,
    NhietDo DECIMAL(4,1) NULL,
    HuyetAp VARCHAR(20) NULL,
    NhipTim INT NULL,
    ThuocSuDung NVARCHAR(500) NULL,
    LieuLuong NVARCHAR(200) NULL,
    MucDoNghien VARCHAR(20) NULL,
    ChanDoan NVARCHAR(500) NULL,
    HuongXuLy NVARCHAR(500) NOT NULL,
    CONSTRAINT PK_NhatKyDieuTri PRIMARY KEY (MaNhatKy),
    CONSTRAINT FK_NhatKyDieuTri_HoSoBenhAn FOREIGN KEY (MaBenhAn) REFERENCES HoSoBenhAn(MaBenhAn),
    CONSTRAINT FK_NhatKyDieuTri_BacSi FOREIGN KEY (MaBacSi) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_NhatKyDieuTri_NhipTim CHECK (NhipTim IS NULL OR NhipTim > 0),
    CONSTRAINT CK_NhatKyDieuTri_MucDoNghien CHECK (MucDoNghien IS NULL OR MucDoNghien IN ('Nhe', 'TrungBinh', 'Nang'))
);
GO

CREATE TABLE PhacDoDieuTri (
    MaPhacDoDT CHAR(10) NOT NULL,
    MaBenhAn CHAR(10) NOT NULL,
    MaBacSi CHAR(10) NOT NULL,
    LoaiMaTuy NVARCHAR(50) NOT NULL,
    TrangThai VARCHAR(30) NOT NULL CONSTRAINT DF_PhacDoDieuTri_TrangThai DEFAULT ('BAN_NHAP'),
    NgayLap DATETIME NULL CONSTRAINT DF_PhacDoDieuTri_NgayLap DEFAULT (GETDATE()),
    GhiChu NVARCHAR(500) NULL,
    CONSTRAINT PK_PhacDoDieuTri PRIMARY KEY (MaPhacDoDT),
    CONSTRAINT FK_PhacDoDieuTri_HoSoBenhAn FOREIGN KEY (MaBenhAn) REFERENCES HoSoBenhAn(MaBenhAn),
    CONSTRAINT FK_PhacDoDieuTri_BacSi FOREIGN KEY (MaBacSi) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_PhacDoDieuTri_LoaiMaTuy CHECK (LoaiMaTuy IN ('HEROIN', 'MA_TUY_DA', 'THUOC_LAC', 'CAN_SA', 'KETAMINE', 'KHAC')),
    CONSTRAINT CK_PhacDoDieuTri_TrangThai CHECK (TrangThai IN ('BAN_NHAP', 'DANG_AP_DUNG', 'DA_HOAN_THANH', 'DA_HUY'))
);
GO

CREATE TABLE ChiTietPhacDoDieuTri (
    MaChiTietPhacDo CHAR(15) NOT NULL,
    MaPhacDoDT CHAR(10) NOT NULL,
    MaGiaiDoan CHAR(10) NOT NULL,
    ThuTu INT NOT NULL,
    NoiDungPhacDoDT NVARCHAR(500) NULL,
    MucTieu NVARCHAR(500) NULL,
    NgayBatDau DATE NULL,
    NgayKetThucDuKien DATE NULL,
    TrangThai VARCHAR(30) NOT NULL CONSTRAINT DF_ChiTietPhacDoDieuTri_TrangThai DEFAULT ('CHO_PHE_DUYET'),
    MaQuanLy CHAR(10) NULL,
    NgayPheDuyet DATETIME NULL,
    GhiChuPheDuyet NVARCHAR(500) NULL,
    CONSTRAINT PK_ChiTietPhacDoDieuTri PRIMARY KEY (MaChiTietPhacDo),
    CONSTRAINT UQ_ChiTietPhacDoDieuTri_PhacDo_GiaiDoan UNIQUE (MaPhacDoDT, MaGiaiDoan),
    CONSTRAINT FK_ChiTietPhacDoDieuTri_PhacDo FOREIGN KEY (MaPhacDoDT) REFERENCES PhacDoDieuTri(MaPhacDoDT) ON DELETE CASCADE,
    CONSTRAINT FK_ChiTietPhacDoDieuTri_GiaiDoan FOREIGN KEY (MaGiaiDoan) REFERENCES DanhMucGiaiDoan(MaGiaiDoan),
    CONSTRAINT FK_ChiTietPhacDoDieuTri_QuanLy FOREIGN KEY (MaQuanLy) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_ChiTietPhacDoDieuTri_ThuTu CHECK (ThuTu > 0),
    CONSTRAINT CK_ChiTietPhacDoDieuTri_TrangThai CHECK (TrangThai IN ('CHO_PHE_DUYET', 'DANG_AP_DUNG', 'DA_HOAN_THANH', 'TAM_DUNG', 'TU_CHOI')),
    CONSTRAINT CK_ChiTietPhacDoDieuTri_Ngay CHECK (NgayKetThucDuKien IS NULL OR NgayBatDau IS NULL OR NgayKetThucDuKien >= NgayBatDau)
);
GO

ALTER TABLE NhatKyDieuTri
ADD CONSTRAINT FK_NhatKyDieuTri_ChiTietPhacDo
FOREIGN KEY (MaChiTietPhacDo) REFERENCES ChiTietPhacDoDieuTri(MaChiTietPhacDo);
GO

CREATE TABLE HoSoDeXuat (
    MaDeXuat CHAR(10) NOT NULL,
    MaNguoiCaiNghien VARCHAR(20) NOT NULL,
    MaBacSi CHAR(10) NOT NULL,
    LoaiDeXuat NVARCHAR(50) NOT NULL,
    MaGiaiDoanHienTai CHAR(10) NULL,
    MaGiaiDoanDeXuat CHAR(10) NULL,
    LyDo NVARCHAR(500) NOT NULL,
    NgayDeXuat DATETIME NOT NULL CONSTRAINT DF_HoSoDeXuat_NgayDeXuat DEFAULT (GETDATE()),
    NgayPheDuyet DATETIME NULL,
    MaQuanLy CHAR(10) NULL,
    GhiChuPheDuyet NVARCHAR(500) NULL,
    TrangThai VARCHAR(30) NOT NULL CONSTRAINT DF_HoSoDeXuat_TrangThai DEFAULT ('CHO_DUYET'),
    PhienBan BIGINT NOT NULL CONSTRAINT DF_HoSoDeXuat_PhienBan DEFAULT (0),
    CONSTRAINT PK_HoSoDeXuat PRIMARY KEY (MaDeXuat),
    CONSTRAINT FK_HoSoDeXuat_NguoiCaiNghien FOREIGN KEY (MaNguoiCaiNghien) REFERENCES NguoiCaiNghien(MaNguoiCaiNghien),
    CONSTRAINT FK_HoSoDeXuat_BacSi FOREIGN KEY (MaBacSi) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT FK_HoSoDeXuat_QuanLy FOREIGN KEY (MaQuanLy) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT FK_HoSoDeXuat_GiaiDoanHienTai FOREIGN KEY (MaGiaiDoanHienTai) REFERENCES DanhMucGiaiDoan(MaGiaiDoan),
    CONSTRAINT FK_HoSoDeXuat_GiaiDoanDeXuat FOREIGN KEY (MaGiaiDoanDeXuat) REFERENCES DanhMucGiaiDoan(MaGiaiDoan),
    CONSTRAINT CK_HoSoDeXuat_LoaiDeXuat CHECK (LoaiDeXuat IN (N'CHUYEN_GIAI_DOAN', N'GIA_HAN_CAI_NGHIEN', N'GIAM_THOI_HAN', N'RA_TRAI', N'KHAC')),
    CONSTRAINT CK_HoSoDeXuat_TrangThai CHECK (TrangThai IN ('CHO_DUYET', 'DA_PHE_DUYET', 'TU_CHOI', 'HUY'))
);
GO

/* ============================================================
   7. LICH UONG THUOC - TU VAN TAM LY
   ============================================================ */

CREATE TABLE LichUongThuoc (
    MaLichUong CHAR(10) NOT NULL,
    MaNguoiCaiNghien VARCHAR(20) NOT NULL,
    MaBacSi CHAR(10) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NULL,
    TrangThai VARCHAR(30) NOT NULL CONSTRAINT DF_LichUongThuoc_TrangThai DEFAULT ('DANG_THUC_HIEN'),
    CONSTRAINT PK_LichUongThuoc PRIMARY KEY (MaLichUong),
    CONSTRAINT FK_LichUongThuoc_NguoiCaiNghien FOREIGN KEY (MaNguoiCaiNghien) REFERENCES NguoiCaiNghien(MaNguoiCaiNghien),
    CONSTRAINT FK_LichUongThuoc_BacSi FOREIGN KEY (MaBacSi) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_LichUongThuoc_TrangThai CHECK (TrangThai IN ('DANG_THUC_HIEN', 'DA_HOAN_THANH', 'TAM_DUNG', 'HUY')),
    CONSTRAINT CK_LichUongThuoc_Ngay CHECK (NgayKetThuc IS NULL OR NgayKetThuc >= NgayBatDau)
);
GO

CREATE TABLE ChiTietLichUongThuoc (
    MaChiTiet CHAR(10) NOT NULL,
    MaLichUong CHAR(10) NOT NULL,
    MaThuoc CHAR(10) NOT NULL,
    LieuLuong NVARCHAR(100) NOT NULL,
    TanSuat NVARCHAR(50) NOT NULL,
    GioUong TIME NOT NULL,
    CONSTRAINT PK_ChiTietLichUongThuoc PRIMARY KEY (MaChiTiet),
    CONSTRAINT FK_ChiTietLichUongThuoc_LichUongThuoc FOREIGN KEY (MaLichUong) REFERENCES LichUongThuoc(MaLichUong) ON DELETE CASCADE,
    CONSTRAINT FK_ChiTietLichUongThuoc_DanhMucThuoc FOREIGN KEY (MaThuoc) REFERENCES DanhMucThuoc(MaThuoc)
);
GO

CREATE TABLE LichTuVanTamLy (
    MaLichTuVan CHAR(10) NOT NULL,
    MaNguoiCaiNghien VARCHAR(20) NOT NULL,
    MaBacSi CHAR(10) NOT NULL,
    ThoiGianBatDau DATETIME NOT NULL,
    ThoiLuong INT NOT NULL,
    ChuDe NVARCHAR(200) NOT NULL,
    KetQuaTuVan NVARCHAR(500) NULL,
    TrangThai VARCHAR(50) NOT NULL CONSTRAINT DF_LichTuVanTamLy_TrangThai DEFAULT ('CHUA_BAT_DAU'),
    CONSTRAINT PK_LichTuVanTamLy PRIMARY KEY (MaLichTuVan),
    CONSTRAINT FK_LichTuVanTamLy_NguoiCaiNghien FOREIGN KEY (MaNguoiCaiNghien) REFERENCES NguoiCaiNghien(MaNguoiCaiNghien),
    CONSTRAINT FK_LichTuVanTamLy_BacSi FOREIGN KEY (MaBacSi) REFERENCES NhanSu(MaNhanSu),
    CONSTRAINT CK_LichTuVanTamLy_ThoiLuong CHECK (ThoiLuong > 0),
    CONSTRAINT CK_LichTuVanTamLy_TrangThai CHECK (TrangThai IN ('CHUA_BAT_DAU', 'DANG_TIEN_HANH', 'DA_HOAN_THANH', 'HUY'))
);
GO

/* ============================================================
   8. INDEX CHO CAC KHOA NGOAI
   ============================================================ */

CREATE INDEX IX_NguoiDung_MaVaiTro ON NguoiDung(MaVaiTro);
CREATE INDEX IX_DonDangKyTuNguyen_MaNguoiThan ON DonDangKyTuNguyen(MaNguoiThan);
CREATE INDEX IX_DonDangKyTuNguyen_MaNhanSu ON DonDangKyTuNguyen(MaNhanSu);
CREATE INDEX IX_HoSoBanGiao_MaCBQL ON HoSoBanGiao(MaCBQL);
CREATE INDEX IX_HoSoBanGiao_MaNhanSuDuyet ON HoSoBanGiao(MaNhanSuDuyet);
CREATE INDEX IX_NguoiCaiNghien_MaNguoiThan ON NguoiCaiNghien(MaNguoiThan);
CREATE INDEX IX_NguoiCaiNghien_MaDonTuNguyen ON NguoiCaiNghien(MaDonTuNguyen);
CREATE INDEX IX_NguoiCaiNghien_MaHoSoBanGiao ON NguoiCaiNghien(MaHoSoBanGiao);
CREATE INDEX IX_NguoiCaiNghien_MaGiaiDoanHienTai ON NguoiCaiNghien(MaGiaiDoanHienTai);
CREATE UNIQUE INDEX UQ_NguoiCaiNghien_CCCD_NotNull ON NguoiCaiNghien(CCCD) WHERE CCCD IS NOT NULL;
CREATE INDEX IX_PhieuThamGap_MaNguoiThan ON PhieuThamGap(MaNguoiThan);
CREATE INDEX IX_PhieuThamGap_MaNguoiCaiNghien ON PhieuThamGap(MaNguoiCaiNghien);
CREATE INDEX IX_PhieuHoTro_MaNguoiThan ON PhieuHoTro(MaNguoiThan);
CREATE INDEX IX_HoSoBenhAn_MaNguoiCaiNghien ON HoSoBenhAn(MaNguoiCaiNghien);
CREATE INDEX IX_PhacDoDieuTri_MaBenhAn ON PhacDoDieuTri(MaBenhAn);
CREATE INDEX IX_ChiTietPhacDoDieuTri_MaPhacDoDT ON ChiTietPhacDoDieuTri(MaPhacDoDT);
CREATE INDEX IX_ChiTietPhacDoDieuTri_TrangThai ON ChiTietPhacDoDieuTri(TrangThai);
CREATE INDEX IX_HoSoDeXuat_MaNguoiCaiNghien ON HoSoDeXuat(MaNguoiCaiNghien);
CREATE INDEX IX_HoSoDeXuat_MaGiaiDoanHienTai ON HoSoDeXuat(MaGiaiDoanHienTai);
CREATE INDEX IX_HoSoDeXuat_MaGiaiDoanDeXuat ON HoSoDeXuat(MaGiaiDoanDeXuat);
GO

/* ============================================================
   9. DU LIEU MAU TOI THIEU & DU LIEU KIEM THU (MOCK DATA)
   ============================================================ */

-- 9.1 Bảng VaiTro
INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES
(1, 'NGUOI_THAN', N'Người thân của người cai nghiện'),
(2, 'CAN_BO_QUAN_LY_HO_SO', N'Cán bộ quản lý hồ sơ / Công an'),
(3, 'CAN_BO_TRUNG_TAM', N'Cán bộ trung tâm / Nhân viên'),
(4, 'CAN_BO_PHU_TRACH', N'Cán bộ phụ trách / Bác sĩ'),
(5, 'CAN_BO_QUAN_LY', N'Cán bộ quản lý'),
(6, 'NGUOI_LANH_DAO', N'Người lãnh đạo trung tâm'),
(7, 'QUANTRI_HETHONG', N'Quản trị hệ thống');
GO

-- 9.2 Bảng DanhMucGiaiDoan
INSERT INTO DanhMucGiaiDoan (MaGiaiDoan, TenGiaiDoan, ThuTu, MoTa) VALUES
('GD001', N'Giai đoạn 1 - Cai nghiện', 1, N'Cai nghiện, detox và ổn định thể chất ban đầu'),
('GD002', N'Giai đoạn 2 - Phục hồi', 2, N'Phục hồi sức khỏe, tâm lý và kỹ năng sống'),
('GD003', N'Giai đoạn 3 - Tái hòa nhập', 3, N'Chuẩn bị tái hòa nhập cộng đồng');
GO

-- 9.3 Bảng DanhMucThuoc
INSERT INTO DanhMucThuoc (MaThuoc, TenThuoc, DonViTinh, SoLuong, GhiChu) VALUES
('THUOC001', N'Vitamin B1 250mg', N'Viên', 1000, N'Hỗ trợ hệ thần kinh'),
('THUOC002', N'Paracetamol 500mg', N'Viên', 2000, N'Giảm đau hạ sốt nhanh'),
('THUOC003', N'Methadone 10mg', N'Viên', 500, N'Thuốc thay thế cai nghiện dạng thuốc phiện'),
('THUOC004', N'Diazepam 5mg (Seduxen)', N'Viên', 300, N'Hỗ trợ cắt cơn, an thần giảm giật cơ'),
('THUOC005', N'Haloperidol 2mg', N'Viên', 200, N'Chống loạn thần, kiểm soát ảo giác cấp');
GO

-- 9.4 Bảng DanhMucHoatDong (Đã sửa lỗi CHECK Constraint)
INSERT INTO DanhMucHoatDong (MaHoatDong, TenHoatDong, LoaiHoatDong, ThoiGian, MoTa) VALUES
('HD00000001', N'Tư vấn sức khỏe định kỳ', 'TRI_LIEU', '2026-06-01', N'Khám sức khỏe và theo dõi triệu chứng cai cơ bản'),
('HD00000002', N'Lao động trị liệu nông nghiệp', 'LAO_DONG', '2026-06-02', N'Trồng rau sạch và chăm sóc vườn hoa trung tâm'),
('HD00000003', N'Học tập nội quy trung tâm', 'HOC_TAP', '2026-06-03', N'Phổ biến quy chế sinh hoạt và giáo dục pháp luật'),
('HD00000004', N'Giao lưu bóng bàn, bóng chuyền', 'THE_THAO', '2026-06-04', N'Thể thao rèn luyện thể chất buổi chiều'),
('HD00000005', N'Sinh hoạt nhóm chia sẻ tâm lý', 'SINH_HOAT', '2026-06-05', N'Tọa đàm tâm lý nhóm, chia sẻ khó khăn vượt qua cơn nghiện');
GO

-- 9.5 Bảng NguoiDung (Mật khẩu mặc định: Password@123)
-- BCrypt Hash: $2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2
INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, SoDienThoai, Email, MaVaiTro, TrangThai) VALUES
('nguoi_than', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Nguyễn Văn Thân', '0987654322', 'nguoithan@rehab.com', 1, 'DANG_HOAT_DONG'),
('cb_quan_ly_ho_so', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Cán Bộ Quản Lý Hồ Sơ', '0987654323', 'cbqlhs@rehab.com', 2, 'DANG_HOAT_DONG'),
('cb_trung_tam', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Cán Bộ Trung Tâm', '0987654324', 'cbtrungtam@rehab.com', 3, 'DANG_HOAT_DONG'),
('cb_quan_ly', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Cán Bộ Quản Lý', '0987654325', 'cbquanly@rehab.com', 5, 'DANG_HOAT_DONG'),
('cb_phu_trach', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Bác Sĩ Phụ Trách', '0987654326', 'cbphutrach@rehab.com', 4, 'DANG_HOAT_DONG'),
('nguoi_lanh_dao', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Người Lãnh Đạo Trung Tâm', '0987654327', 'nguoilanhdao@rehab.com', 6, 'DANG_HOAT_DONG'),
('quantri_hethong', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Quản Trị Hệ Thống', '0987654328', 'admin@rehab.com', 7, 'DANG_HOAT_DONG'),
('nguoithan_2', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Trần Thị Mẹ', '0912345678', 'me@gmail.com', 1, 'DANG_HOAT_DONG'),
('nguoithan_3', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Lê Văn Cha', '0922345678', 'cha@gmail.com', 1, 'DANG_HOAT_DONG'),
('congan_2', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Công An Nguyễn Văn B', '0932345678', 'conganb@gmail.com', 2, 'DANG_HOAT_DONG'),
('bacsi_2', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Bác Sĩ Nguyễn Thị Bình', '0942345678', 'bsbinh@rehab.com', 4, 'DANG_HOAT_DONG'),
('nhanvien_2', '$2b$12$uMcxcPsosUQnYQUBFLJPC.96REIebfyhMoMZU1bh44RwONqmsg.B2', N'Nhân Viên Trần Văn Hùng', '0952345678', 'nvhung@rehab.com', 3, 'DANG_HOAT_DONG');
GO

-- 9.6 Bảng NhanSu
INSERT INTO NhanSu (MaNhanSu, MaNguoiDung, TrangThai, ChucVu) VALUES
('CBQL001', 4, 'DANG_LAM_VIEC', N'Cán bộ quản lý'),
('BSPT001', 5, 'DANG_LAM_VIEC', N'Bác sĩ phụ trách'),
('NV001', 3, 'DANG_LAM_VIEC', N'Cán bộ trung tâm'),
('BS002', 11, 'DANG_LAM_VIEC', N'Bác sĩ tâm lý'),
('NV002', 12, 'DANG_LAM_VIEC', N'Cán bộ tiếp nhận');
GO

-- 9.7 Bảng CanBoQuanLyHoSo
INSERT INTO CanBoQuanLyHoSo (MaCanBoCongAn, MaNguoiDung, HoTen, SoHieuCAND, DonViCongTac, SoDienThoai) VALUES
('CBQLHS001', 2, N'Cán Bộ Quản Lý Hồ Sơ', 'CAND-001', N'Đội CSĐT tội phạm về ma túy - Công an TP', '0987654323'),
('CBQLHS002', 10, N'Công An Nguyễn Văn B', 'CAND-002', N'Công an Huyện Bình Chánh', '0932345678');
GO

-- 9.8 Bảng NguoiThan
INSERT INTO NguoiThan (MaNguoiDung, SoCCCD, NgayCap, NoiCap, DiaChi, NgheNghiep) VALUES
(1, '001200012345', '2020-05-15', N'Cục Cảnh sát QLHC về trật tự xã hội', N'123 Đường Nguyễn Huệ, Quận 1, TP.HCM', N'Kinh doanh tự do'),
(8, '001200054321', '2021-09-20', N'Cục Cảnh sát QLHC về trật tự xã hội', N'456 Lê Lợi, Quận 3, TP.HCM', N'Nội trợ'),
(9, '001200098765', '2019-11-10', N'Cục Cảnh sát QLHC về trật tự xã hội', N'789 Nguyễn Trãi, Quận 5, TP.HCM', N'Hưu trí');
GO

-- 9.9 Bảng DonDangKyTuNguyen
INSERT INTO DonDangKyTuNguyen (MaNguoiThan, HoTenNguoiCaiNghien, NgaySinhNguoiCaiNghien, DiaChiThuongTru, SoCCCDNguoiCaiNghien, QuanHeVoiNguoiCaiNghien, LoaiMaTuySuDung, BieuHienLamSang, TepCCCDMatTruoc, TepCCCDMatSau, NgayGuiDon, TrangThai, MaNhanSu) VALUES
(1, N'Nguyễn Văn Test', '2000-01-15', N'123 Nguyễn Huệ, Quận 1, TP.HCM', '079200011111', N'Con trai', N'Heroin', N'Sụt cân, run rẩy, mất ngủ kéo dài', 'cccd_front_1.jpg', 'cccd_back_1.jpg', DATEADD(day, -35, GETDATE()), 'DA_NHAP_TRAI', 'NV001'),
(2, N'Trần Văn Bình', '1998-06-20', N'456 Lê Lợi, Quận 3, TP.HCM', '079200022222', N'Con trai', N'Ma túy đá', N'Ảo giác nhẹ, kích động', 'cccd_front_2.jpg', 'cccd_back_2.jpg', DATEADD(day, -45, GETDATE()), 'CHO_DUYET', NULL),
(3, N'Lê Thị Chi', '1995-11-12', N'789 Nguyễn Trãi, Quận 5, TP.HCM', '079200033333', N'Con gái', N'Thuốc lắc', N'Mất kiểm soát cảm xúc', 'cccd_front_3.jpg', 'cccd_back_3.jpg', DATEADD(day, -90, GETDATE()), 'DA_TIEP_NHAN', 'NV001'),
(1, N'Nguyễn Văn C', '1992-04-05', N'123 Nguyễn Huệ, Quận 1, TP.HCM', '079200044444', N'Em trai', N'Cần sa', N'Ngơ ngác, không tập trung', 'cccd_front_4.jpg', 'cccd_back_4.jpg', DATEADD(day, -10, GETDATE()), 'TU_CHOI', 'NV001');
GO

-- 9.10 Bảng HoSoBanGiao
INSERT INTO HoSoBanGiao (MaHoSoBanGiao, MaCanBoCongAn, HoTenDoiTuong, CCCD, NgaySinh, QueQuan, NoiO_HienTai, HoTenNguoiThan, SdtNguoiThan, QuanHeVoiDoiTuong, HanhViViPham, FileQuyetDinh, TrangThaiDuyet, MaNhanSuDuyet, NgayDuyet, MaCBQL) VALUES
('HSBG20260001', N'CBQLHS001', N'Phạm Văn Dũng', '079200055555', '1997-08-10', N'Long An', N'Quận 7, TP.HCM', N'Phạm Văn Cha', '0912345001', N'Cha', N'Sử dụng ma túy công cộng trái phép', 'quyetdinh_dung.pdf', 'DaTiepNhan', 'NV001', DATEADD(day, -60, GETDATE()), 'CBQLHS001'),
('HSBG20260002', N'CBQLHS002', N'Hoàng Thị Em', '079200066666', '1999-03-25', N'Tiền Giang', N'Quận 8, TP.HCM', N'Hoàng Văn Mẹ', '0912345002', N'Mẹ', N'Tụ tập sử dụng chất cấm', 'quyetdinh_em.pdf', 'DaTiepNhan', 'NV001', DATEADD(day, -20, GETDATE()), 'CBQLHS002'),
('HSBG20260003', N'CBQLHS001', N'Vũ Văn Phúc', '079200077777', '1994-12-05', N'Đồng Nai', N'Quận Bình Thạnh, TP.HCM', N'Vũ Thị Chị', '0912345003', N'Chị', N'Dương tính với chất kích thích nhiều lần', 'quyetdinh_phuc.pdf', 'DaTiepNhan', 'NV001', DATEADD(day, -75, GETDATE()), 'CBQLHS001'),
('HSBG20260004', N'CBQLHS002', N'Đặng Thị Giang', '079200088888', '2001-05-18', N'Bến Tre', N'Quận 12, TP.HCM', N'Đặng Văn Anh', '0912345004', N'Anh', N'Tàng trữ và sử dụng trái phép ma túy', 'quyetdinh_giang.pdf', 'DaTiepNhan', 'NV001', DATEADD(day, -25, GETDATE()), 'CBQLHS002'),
('HSBG20260005', N'CBQLHS002', N'Lê Văn Thử', '079200099099', '2002-09-15', N'Tây Ninh', N'Quận 10, TP.HCM', N'Lê Văn Ba', '0912345005', N'Cha', N'Sử dụng trái phép chất ma túy', 'quyetdinh_thu.pdf', 'ChoDuyet', NULL, NULL, 'CBQLHS002');
GO

-- 9.11 Bảng NguoiCaiNghien
INSERT INTO NguoiCaiNghien (MaNguoiCaiNghien, MaDonTuNguyen, MaHoSoBanGiao, MaNguoiThan, HoTen, CCCD, NgayVaoTrai, MaGiaiDoanHienTai, TrangThai) VALUES
('NCN-SEED001', 1, NULL, 1, N'Nguyễn Văn Test', '001234567890', DATEADD(day, -30, GETDATE()), 'GD001', 'DANG_CAI_NGHIEN'),
('NCN-SEED002', 2, NULL, 2, N'Trần Văn Bình', '001234567891', DATEADD(day, -45, GETDATE()), 'GD001', 'DANG_CAI_NGHIEN'),
('NCN-SEED003', 3, NULL, 3, N'Lê Thị Chi', '001234567892', DATEADD(day, -90, GETDATE()), 'GD002', 'DANG_CAI_NGHIEN'),
('NCN-SEED004', NULL, 'HSBG20260001', 1, N'Phạm Văn Dũng', '079200055555', DATEADD(day, -60, GETDATE()), 'GD002', 'DANG_CAI_NGHIEN'),
('NCN-SEED005', NULL, 'HSBG20260002', 2, N'Hoàng Thị Em', '079200066666', DATEADD(day, -20, GETDATE()), 'GD001', 'DANG_CAI_NGHIEN'),
('NCN-SEED006', NULL, 'HSBG20260003', 3, N'Vũ Văn Phúc', '079200077777', DATEADD(day, -75, GETDATE()), 'GD002', 'DANG_CAI_NGHIEN'),
('NCN-SEED007', NULL, 'HSBG20260004', 1, N'Đặng Thị Giang', '079200088888', DATEADD(day, -25, GETDATE()), 'GD001', 'DANG_CAI_NGHIEN');
GO

-- 9.12 Bảng PhanCongPhuTrach
INSERT INTO PhanCongPhuTrach (MaPhanCong, MaNguoiCaiNghien, MaBacSi, MaQuanLy, NgayBatDau, NgayKetThuc, TrangThai) VALUES
('PC00000001', 'NCN-SEED001', 'BSPT001', 'CBQL001', DATEADD(day, -30, GETDATE()), DATEADD(day, 365, GETDATE()), 'DANG_PHU_TRACH'),
('PC00000002', 'NCN-SEED002', 'BSPT001', 'CBQL001', DATEADD(day, -45, GETDATE()), DATEADD(day, 365, GETDATE()), 'DANG_PHU_TRACH'),
('PC00000003', 'NCN-SEED003', 'BSPT001', 'CBQL001', DATEADD(day, -90, GETDATE()), DATEADD(day, 365, GETDATE()), 'DANG_PHU_TRACH'),
('PC00000004', 'NCN-SEED004', 'BSPT001', 'CBQL001', DATEADD(day, -60, GETDATE()), DATEADD(day, 365, GETDATE()), 'DANG_PHU_TRACH'),
('PC00000005', 'NCN-SEED005', 'BSPT001', 'CBQL001', DATEADD(day, -20, GETDATE()), DATEADD(day, 365, GETDATE()), 'DANG_PHU_TRACH'),
('PC00000006', 'NCN-SEED006', 'BSPT001', 'CBQL001', DATEADD(day, -75, GETDATE()), DATEADD(day, 365, GETDATE()), 'DANG_PHU_TRACH'),
('PC00000007', 'NCN-SEED007', 'BSPT001', 'CBQL001', DATEADD(day, -25, GETDATE()), DATEADD(day, 365, GETDATE()), 'DANG_PHU_TRACH');
GO

-- 9.13 Bảng HoSoBenhAn
INSERT INTO HoSoBenhAn (MaBenhAn, MaNguoiCaiNghien, MaBacSi, TienSuBenh, DiUng, ChieuCao, CanNang, NhomMau, NgayLap, NgayCapNhatCuoi) VALUES
('BA-SEED001', 'NCN-SEED001', 'BSPT001', N'Không có tiền sử bệnh nghiêm trọng', N'Không', 170.5, 62.4, 'O+', DATEADD(day, -30, GETDATE()), GETDATE()),
('BA-SEED002', 'NCN-SEED002', 'BSPT001', N'Hen phế quản nhẹ', N'Kháng sinh Penicillin', 165.0, 55.0, 'A+', DATEADD(day, -45, GETDATE()), GETDATE()),
('BA-SEED003', 'NCN-SEED003', 'BSPT001', N'Đau dạ dày cấp', N'Không', 158.0, 48.5, 'B+', DATEADD(day, -90, GETDATE()), GETDATE()),
('BA-SEED004', 'NCN-SEED004', 'BSPT001', N'Rối loạn giấc ngủ kéo dài', N'Không', 175.2, 70.0, 'AB+', DATEADD(day, -60, GETDATE()), GETDATE()),
('BA-SEED005', 'NCN-SEED005', 'BSPT001', N'Không có tiền sử bệnh', N'Không', 162.0, 52.0, 'O+', DATEADD(day, -20, GETDATE()), GETDATE()),
('BA-SEED006', 'NCN-SEED006', 'BSPT001', N'Viêm gan B đang điều trị ổn định', N'Không', 168.0, 60.5, 'B+', DATEADD(day, -75, GETDATE()), GETDATE()),
('BA-SEED007', 'NCN-SEED007', 'BSPT001', N'Không có tiền sử bệnh', N'Hải sản', 160.0, 50.0, 'O+', DATEADD(day, -25, GETDATE()), GETDATE());
GO

-- 9.14 Bảng PhacDoDieuTri
INSERT INTO PhacDoDieuTri (MaPhacDoDT, MaBenhAn, MaBacSi, LoaiMaTuy, TrangThai, NgayLap, GhiChu) VALUES
('PDT-S001', 'BA-SEED001', 'BSPT001', 'HEROIN', 'DANG_AP_DUNG', DATEADD(day, -30, GETDATE()), N'Phác đồ điều trị cắt cơn bằng thuốc an thần'),
('PDT-S002', 'BA-SEED002', 'BSPT001', 'HEROIN', 'DANG_AP_DUNG', DATEADD(day, -45, GETDATE()), N'Phác đồ kết hợp Methadone liều thấp'),
('PDT-S003', 'BA-SEED003', 'BSPT001', 'MA_TUY_DA', 'DANG_AP_DUNG', DATEADD(day, -90, GETDATE()), N'Tập trung phục hồi nhận thức và trị liệu tâm lý'),
('PDT-S004', 'BA-SEED004', 'BSPT001', 'CAN_SA', 'DANG_AP_DUNG', DATEADD(day, -60, GETDATE()), N'Phác đồ phục hồi giấc ngủ và cân bằng cảm xúc'),
('PDT-S005', 'BA-SEED005', 'BSPT001', 'MA_TUY_DA', 'DANG_AP_DUNG', DATEADD(day, -20, GETDATE()), N'Theo dõi hội chứng cai và ảo giác cấp'),
('PDT-S006', 'BA-SEED006', 'BSPT001', 'THUOC_LAC', 'DANG_AP_DUNG', DATEADD(day, -75, GETDATE()), N'Phác đồ phục hồi thần kinh trung ương'),
('PDT-S007', 'BA-SEED007', 'BSPT001', 'HEROIN', 'DANG_AP_DUNG', DATEADD(day, -25, GETDATE()), N'Detox giải độc và tăng đề kháng');
GO

-- 9.15 Bảng ChiTietPhacDoDieuTri
INSERT INTO ChiTietPhacDoDieuTri (MaChiTietPhacDo, MaPhacDoDT, MaGiaiDoan, ThuTu, NoiDungPhacDoDT, MucTieu, NgayBatDau, NgayKetThucDuKien, TrangThai, MaQuanLy, NgayPheDuyet, GhiChuPheDuyet) VALUES
('PDT-S001-01', 'PDT-S001', 'GD001', 1, N'Cắt cơn giải độc bằng an thần', N'Cắt cơn vật vã', DATEADD(day, -30, GETDATE()), DATEADD(day, -15, GETDATE()), 'DA_HOAN_THANH', 'CBQL001', DATEADD(day, -30, GETDATE()), N'Duyệt'),
('PDT-S001-02', 'PDT-S001', 'GD002', 2, N'Tư vấn tâm lý và vật lý trị liệu', N'Phục hồi nhận thức', DATEADD(day, -14, GETDATE()), DATEADD(day, 30, GETDATE()), 'DANG_AP_DUNG', 'CBQL001', DATEADD(day, -14, GETDATE()), N'Duyệt'),
('PDT-S002-01', 'PDT-S002', 'GD001', 1, N'Cắt cơn bằng Methadone', N'Ổn định sức khỏe cơ bản', DATEADD(day, -45, GETDATE()), DATEADD(day, -30, GETDATE()), 'DA_HOAN_THANH', 'CBQL001', DATEADD(day, -45, GETDATE()), N'Duyệt'),
('PDT-S002-02', 'PDT-S002', 'GD002', 2, N'Lao động nhẹ rèn luyện thể chất', N'Phục hồi cơ bắp', DATEADD(day, -29, GETDATE()), DATEADD(day, 15, GETDATE()), 'DANG_AP_DUNG', 'CBQL001', DATEADD(day, -29, GETDATE()), N'Duyệt'),
('PDT-S003-01', 'PDT-S003', 'GD001', 1, N'Trị liệu tâm lý hành vi', N'Ổn định tinh thần', DATEADD(day, -90, GETDATE()), DATEADD(day, -60, GETDATE()), 'DA_HOAN_THANH', 'CBQL001', DATEADD(day, -90, GETDATE()), N'Duyệt'),
('PDT-S003-02', 'PDT-S003', 'GD002', 2, N'Giáo dục kỹ năng và hòa nhập', N'Nhận thức tác hại ma túy', DATEADD(day, -59, GETDATE()), DATEADD(day, -10, GETDATE()), 'DA_HOAN_THANH', 'CBQL001', DATEADD(day, -59, GETDATE()), N'Duyệt'),
('PDT-S003-03', 'PDT-S003', 'GD003', 3, N'Chuẩn bị tái hòa nhập cộng đồng', N'Lập kế hoạch cuộc sống mới', DATEADD(day, -9, GETDATE()), DATEADD(day, 20, GETDATE()), 'DANG_AP_DUNG', 'CBQL001', DATEADD(day, -9, GETDATE()), N'Duyệt');
GO

-- 9.16 Bảng NhatKyDieuTri
INSERT INTO NhatKyDieuTri (MaNhatKy, MaBenhAn, MaBacSi, MaChiTietPhacDo, NgayGhi, TinhTrangSucKhoe, TrieuChung, NhietDo, HuyetAp, NhipTim, ThuocSuDung, LieuLuong, MucDoNghien, ChanDoan, HuongXuLy) VALUES
('NK00000001', 'BA-SEED001', 'BSPT001', 'PDT-S001-02', DATEADD(day, -10, GETDATE()), N'Học viên tỉnh táo, hợp tác tốt', N'Không có biểu hiện thèm thuốc', 36.8, '120/80', 75, N'Vitamin B1', N'2 viên/ngày', 'Nhe', N'Hội chứng cai giảm đáng kể', N'Tiếp tục tham gia trị liệu tâm lý nhóm'),
('NK00000002', 'BA-SEED002', 'BSPT001', 'PDT-S002-02', DATEADD(day, -5, GETDATE()), N'Học viên mệt mỏi, đau đầu nhẹ', N'Đau đầu, thèm thuốc nhẹ', 37.2, '115/75', 80, N'Paracetamol', N'1 viên khi đau', 'TrungBinh', N'Hội chứng cai giai đoạn phục hồi', N'Nghỉ ngơi tại phòng, hạn chế lao động nặng'),
('NK00000003', 'BA-SEED003', 'BSPT001', 'PDT-S003-03', DATEADD(day, -1, GETDATE()), N'Tinh thần rất tốt, háo hức tái hòa nhập', N'Không thèm thuốc', 36.5, '120/80', 72, NULL, NULL, 'Nhe', N'Tâm lý và thể chất phục hồi hoàn toàn', N'Chuẩn bị hồ sơ đề xuất ra trại');
GO

-- 9.17 Bảng HoSoDeXuat
INSERT INTO HoSoDeXuat (MaDeXuat, MaNguoiCaiNghien, MaBacSi, LoaiDeXuat, MaGiaiDoanHienTai, MaGiaiDoanDeXuat, LyDo, NgayDeXuat, NgayPheDuyet, MaQuanLy, GhiChuPheDuyet, TrangThai, PhienBan) VALUES
('DX-SEED001', 'NCN-SEED001', 'BSPT001', 'CHUYEN_GIAI_DOAN', 'GD001', 'GD002', N'Đủ điều kiện chuyển sang giai đoạn phục hồi sau 30 ngày cai nghiện', DATEADD(day, -1, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DX-SEED002', 'NCN-SEED002', 'BSPT001', 'CHUYEN_GIAI_DOAN', 'GD001', 'GD002', N'Ổn định sức khỏe, không còn triệu chứng cai nghiện cấp tính', DATEADD(day, -2, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DX-SEED003', 'NCN-SEED003', 'BSPT001', 'CHUYEN_GIAI_DOAN', 'GD002', 'GD003', N'Hoàn thành chương trình phục hồi, sẵn sàng chuẩn bị tái hòa nhập', DATEADD(day, -3, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DX-SEED004', 'NCN-SEED004', 'BSPT001', 'CHUYEN_GIAI_DOAN', 'GD001', 'GD002', N'Đã đủ điều kiện chuyển giai đoạn theo đánh giá định kỳ', DATEADD(day, -10, GETDATE()), DATEADD(day, -9, GETDATE()), 'CBQL001', N'Đồng ý phê duyệt chuyển giai đoạn', 'DA_PHE_DUYET', 0),
('DX-SEED005', 'NCN-SEED005', 'BSPT001', 'CHUYEN_GIAI_DOAN', 'GD001', 'GD002', N'Đề xuất chuyển giai đoạn sớm hơn quy định', DATEADD(day, -5, GETDATE()), DATEADD(day, -4, GETDATE()), 'CBQL001', N'Chưa đủ thời gian tối thiểu ở giai đoạn 1 theo quy định trung tâm', 'TU_CHOI', 0),
('DX-SEED006', 'NCN-SEED006', 'BSPT001', 'CHUYEN_GIAI_DOAN', 'GD002', 'GD003', N'Có tiến bộ tốt về kỹ năng sống và tâm lý ổn định', DATEADD(day, -1, GETDATE()), NULL, NULL, NULL, 'CHO_DUYET', 0),
('DX-SEED007', 'NCN-SEED007', 'BSPT001', 'CHUYEN_GIAI_DOAN', 'GD001', 'GD002', N'Bác sĩ hủy đề xuất do cần đánh giá lại sức khỏe', DATEADD(day, -7, GETDATE()), NULL, NULL, NULL, 'HUY', 0);
GO

-- 9.18 Bảng PhieuThamGap
INSERT INTO PhieuThamGap (MaNguoiThan, MaNguoiCaiNghien, LoaiThamGap, NgayTham, CaTham, TrangThai, NgayTao, MaNhanSu) VALUES
(1, 'NCN-SEED001', 1, DATEADD(day, 1, GETDATE()), 1, 'CHO_DUYET', GETDATE(), 'NV001'),
(2, 'NCN-SEED002', 2, DATEADD(day, 2, GETDATE()), 2, 'DA_DONG_Y', GETDATE(), 'NV001');
GO

-- 9.19 Bảng NguoiDiCung
INSERT INTO NguoiDiCung (MaPhieu, HoTen, LoaiGiayTo, SoGiayTo, QuanHe, TepXacMinh) VALUES
(1, N'Nguyễn Văn Em', 1, '079200099999', N'Em trai', 'giayto_em.jpg'),
(2, N'Trần Thị Bé', 2, 'GKS-12345', N'Con gái', 'giayto_be.jpg');
GO

-- 9.20 Bảng PhieuHoTro
INSERT INTO PhieuHoTro (MaYeuCau, MaNguoiThan, TieuDe, NoiDungYeuCau, NgayGui, TrangThai, NoiDungPhanHoi, MaNhanVien, NgayPhanHoi) VALUES
('YC00000001', 1, N'Hỏi về tình hình sức khỏe học viên', N'Chào trung tâm, tôi muốn hỏi thăm sức khỏe của Nguyễn Văn Test hiện tại thế nào ạ?', DATEADD(day, -3, GETDATE()), 'DA_PHAN_HOI', N'Chào gia đình, học viên Nguyễn Văn Test hiện sức khỏe ổn định, ăn uống tốt và đang tham gia tích cực các hoạt động phục hồi.', 'NV001', DATEADD(day, -2, GETDATE())),
('YC00000002', 2, N'Yêu cầu gửi thêm quần áo ấm', N'Học viên Trần Văn Bình cần thêm quần áo ấm cho mùa lạnh, trung tâm có hỗ trợ nhận đồ gửi không ạ?', DATEADD(day, -1, GETDATE()), 'CHO_PHAN_HOI', NULL, NULL, NULL);
GO

-- 9.21 Bảng ThongBao
INSERT INTO ThongBao (MaThongBao, MaNhanVien, TieuDe, NoiDung, NgayTao, LoaiThongBao, TrangThai, MaNguoiDungNhan) VALUES
('TB00000001', 'NV001', N'Thông báo bảo trì hệ thống nội bộ', N'Hệ thống sẽ tạm ngưng hoạt động từ 23:00 tối nay đến 02:00 sáng mai để nâng cấp.', DATEADD(hour, -2, GETDATE()), 'NoiBo', 'CHUA_DOC', NULL),
('TB00000002', 'NV001', N'Hồ sơ của bạn đã được duyệt', N'Yêu cầu duyệt phác đồ điều trị cho bệnh nhân NCN-SEED001 đã được thông qua.', DATEADD(day, -1, GETDATE()), 'CaNhan', 'CHUA_DOC', 5),
('TB00000003', 'NV001', N'Thông báo lịch kiểm tra sức khỏe quý II', N'Tất cả học viên sẽ được khám sức khỏe định kỳ từ ngày 25/06.', DATEADD(day, -4, GETDATE()), 'TatCa', 'CHUA_DOC', NULL);
GO

-- 9.22 Bảng LichSinhHoat
INSERT INTO LichSinhHoat (MaLich, MaNhanVien, MaHoatDong, ThoiGianBatDau, ThoiGianKetThuc, DiaDiem) VALUES
('LSH0000001', 'NV001', 'HD00000002', DATEADD(hour, -10, GETDATE()), DATEADD(hour, -7, GETDATE()), N'Khu vườn sinh thái phía Đông'),
('LSH0000002', 'NV001', 'HD00000004', DATEADD(hour, -4, GETDATE()), DATEADD(hour, -2, GETDATE()), N'Sân thể thao đa năng'),
('LSH0000003', 'NV001', 'HD00000005', DATEADD(hour, 2, GETDATE()), DATEADD(hour, 4, GETDATE()), N'Phòng sinh hoạt chung');
GO

-- 9.23 Bảng NhatKyDiemDanh
INSERT INTO NhatKyDiemDanh (MaLich, MaNguoiCaiNghien, MaNhanVien, ThoiGian, TrangThai, GhiChu) VALUES
('LSH0000001', 'NCN-SEED001', 'NV001', DATEADD(hour, -9, GETDATE()), 'CO_MAT', NULL),
('LSH0000001', 'NCN-SEED002', 'NV001', DATEADD(hour, -9, GETDATE()), 'CO_MAT', NULL),
('LSH0000001', 'NCN-SEED003', 'NV001', DATEADD(hour, -9, GETDATE()), 'CO_MAT', NULL),
('LSH0000001', 'NCN-SEED004', 'NV001', DATEADD(hour, -9, GETDATE()), 'VANG_MAT', N'Khám bệnh ở trạm y tế');
GO

-- 9.24 Bảng LichUongThuoc
INSERT INTO LichUongThuoc (MaLichUong, MaNguoiCaiNghien, MaBacSi, NgayBatDau, NgayKetThuc, TrangThai) VALUES
('LUT0000001', 'NCN-SEED001', 'BSPT001', DATEADD(day, -30, GETDATE()), DATEADD(day, 30, GETDATE()), 'DANG_THUC_HIEN'),
('LUT0000002', 'NCN-SEED002', 'BSPT001', DATEADD(day, -45, GETDATE()), DATEADD(day, 15, GETDATE()), 'DANG_THUC_HIEN');
GO

-- 9.25 Bảng ChiTietLichUongThuoc
INSERT INTO ChiTietLichUongThuoc (MaChiTiet, MaLichUong, MaThuoc, LieuLuong, TanSuat, GioUong) VALUES
('CLUT000001', 'LUT0000001', 'THUOC001', N'1 viên', N'1 lần/ngày', '08:00:00'),
('CLUT000002', 'LUT0000001', 'THUOC002', N'1 viên', N'Khi có sốt', '12:00:00'),
('CLUT000003', 'LUT0000002', 'THUOC003', N'5ml', N'1 lần/ngày', '07:30:00');
GO

-- 9.26 Bảng LichTuVanTamLy
INSERT INTO LichTuVanTamLy (MaLichTuVan, MaNguoiCaiNghien, MaBacSi, ThoiGianBatDau, ThoiLuong, ChuDe, KetQuaTuVan, TrangThai) VALUES
('LTV0000001', 'NCN-SEED001', 'BSPT001', DATEADD(day, -1, GETDATE()), 60, N'Trị liệu tâm lý hành vi cơ bản', N'Học viên đã biết kiểm soát suy nghĩ tiêu cực, cởi mở chia sẻ.', 'DA_HOAN_THANH'),
('LTV0000002', 'NCN-SEED002', 'BSPT001', DATEADD(day, 1, GETDATE()), 45, N'Giải tỏa áp lực gia đình và xã hội', NULL, 'CHUA_BAT_DAU');
GO

-- 9.27 Du lieu mau bo sung cho giao dien lanh dao trung tam
IF NOT EXISTS (SELECT 1 FROM HoSoBanGiao WHERE MaHoSoBanGiao = 'HSBG001')
BEGIN
    INSERT INTO HoSoBanGiao (MaHoSoBanGiao, MaCanBoCongAn, HoTenDoiTuong, CCCD, NgaySinh, QueQuan, NoiO_HienTai, HoTenNguoiThan, SdtNguoiThan, QuanHeVoiDoiTuong, HanhViViPham, FileQuyetDinh, TrangThaiDuyet, MaNhanSuDuyet, NgayDuyet, MaCBQL) VALUES
    ('HSBG001', N'CBQLHS001', N'Nguyễn Văn B', '048201001234', '1998-03-12', N'Đà Nẵng', N'Quận Hải Châu, Đà Nẵng', N'Nguyễn Thị Lan', '0905123456', N'Mẹ', N'Sử dụng trái phép chất ma túy, bị phát hiện trong đợt kiểm tra hành chính.', 'seed/HSBG001.pdf', 'ChoDuyet', NULL, NULL, 'CBQLHS001'),
    ('HSBG002', N'CBQLHS001', N'Lê Văn D', '048201005678', '1995-11-05', N'Quảng Nam', N'Quận Thanh Khê, Đà Nẵng', N'Lê Thị Hoa', '0918765432', N'Vợ', N'Sử dụng ma túy đá, vi phạm trật tự công cộng.', 'seed/HSBG002.pdf', 'ChoDuyet', NULL, NULL, 'CBQLHS001'),
    ('HSBG003', N'CBQLHS001', N'Phạm Thị E', '048201009012', '2000-07-20', N'Đà Nẵng', N'Quận Sơn Trà, Đà Nẵng', N'Phạm Văn Sơn', '0934567890', N'Anh trai', N'Tái sử dụng chất gây nghiện sau cai nghiện tại gia.', 'seed/HSBG003.pdf', 'DaTiepNhan', 'NV001', DATEADD(day, -8, GETDATE()), 'CBQLHS001'),
    ('HSBG004', N'CBQLHS001', N'Hoàng Văn F', '048201003344', '1992-01-15', N'Huế', N'Quận Liên Chiểu, Đà Nẵng', N'Hoàng Thị Mai', '0978123456', N'Chị gái', N'Hồ sơ chưa đầy đủ giấy tờ xác minh, thiếu xét nghiệm y tế.', 'seed/HSBG004.pdf', 'TuChoi', 'NV001', DATEADD(day, -13, GETDATE()), 'CBQLHS001');
END
GO

PRINT N'Tao database rehab_center_db va du lieu mau thanh cong.';
GO
