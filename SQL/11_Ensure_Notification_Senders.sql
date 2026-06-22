/*
  Ensure users who can create notifications have a NhanSu profile.

  Why:
  - Backend creates ThongBao.MaNhanSuGui from NhanSu.
  - If the logged-in sender has a valid NguoiDung account but no NhanSu row,
    POST /api/v1/notifications fails with STAFF_PROFILE_NOT_FOUND.

  Run this after the main seed data when notification sending fails for
  admin/leader/manager/doctor/staff accounts.
*/

SET NOCOUNT ON;

;WITH SenderCandidates AS (
    SELECT
        nd.MaNguoiDung,
        vt.TenVaiTro,
        'NS' + RIGHT('00000000' + CAST(nd.MaNguoiDung AS VARCHAR(8)), 8) AS MaNhanSuAuto,
        CASE
            WHEN vt.TenVaiTro IN ('ADMIN', 'QUANTRI_HETHONG') THEN N'Quản trị hệ thống'
            WHEN vt.TenVaiTro IN ('LEADER', 'LANH_DAO', 'NGUOI_LANH_DAO') THEN N'Lãnh đạo trung tâm'
            WHEN vt.TenVaiTro IN ('MANAGER', 'CAN_BO_QUAN_LY') THEN N'Cán bộ quản lý'
            WHEN vt.TenVaiTro IN ('DOCTOR', 'BAC_SI') THEN N'Bác sĩ phụ trách'
            WHEN vt.TenVaiTro IN ('STAFF', 'CAN_BO_TRUNG_TAM', 'CAN_BO_PHU_TRACH') THEN N'Cán bộ trung tâm'
            ELSE N'Nhân sự trung tâm'
        END AS ChucVu
    FROM NguoiDung nd
    INNER JOIN VaiTro vt ON vt.MaVaiTro = nd.MaVaiTro
    LEFT JOIN NhanSu ns ON ns.MaNguoiDung = nd.MaNguoiDung
    WHERE ns.MaNguoiDung IS NULL
      AND nd.TrangThai = 'DANG_HOAT_DONG'
      AND vt.TenVaiTro IN (
          'ADMIN',
          'QUANTRI_HETHONG',
          'LEADER',
          'LANH_DAO',
          'NGUOI_LANH_DAO',
          'MANAGER',
          'CAN_BO_QUAN_LY',
          'DOCTOR',
          'BAC_SI',
          'STAFF',
          'CAN_BO_TRUNG_TAM',
          'CAN_BO_PHU_TRACH'
      )
)
INSERT INTO NhanSu (
    MaNhanSu,
    MaNguoiDung,
    ChucVu,
    TrangThai,
    NgayVaoLam
)
SELECT
    sc.MaNhanSuAuto,
    sc.MaNguoiDung,
    sc.ChucVu,
    'DANG_LAM_VIEC',
    CAST(GETDATE() AS DATE)
FROM SenderCandidates sc
WHERE NOT EXISTS (
    SELECT 1
    FROM NhanSu ns
    WHERE ns.MaNhanSu = sc.MaNhanSuAuto
);

PRINT N'Done: ensured notification sender staff profiles.';
