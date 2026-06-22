/* ============================================================
   10. Per-user read status for broadcast notifications
   Run this once after the main ERD script.
   ============================================================ */

IF OBJECT_ID('dbo.TrangThaiDocThongBao', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TrangThaiDocThongBao (
        MaTrangThai INT IDENTITY(1,1) NOT NULL,
        MaThongBao CHAR(10) NOT NULL,
        MaNguoiDung INT NOT NULL,
        TrangThai VARCHAR(20) NOT NULL CONSTRAINT DF_TrangThaiDocThongBao_TrangThai DEFAULT ('DA_DOC'),
        NgayDoc DATETIME NULL CONSTRAINT DF_TrangThaiDocThongBao_NgayDoc DEFAULT (GETDATE()),

        CONSTRAINT PK_TrangThaiDocThongBao PRIMARY KEY (MaTrangThai),
        CONSTRAINT UQ_TrangThaiDocThongBao_ThongBao_NguoiDung UNIQUE (MaThongBao, MaNguoiDung),
        CONSTRAINT FK_TrangThaiDocThongBao_ThongBao FOREIGN KEY (MaThongBao) REFERENCES dbo.ThongBao(MaThongBao),
        CONSTRAINT FK_TrangThaiDocThongBao_NguoiDung FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung),
        CONSTRAINT CK_TrangThaiDocThongBao_TrangThai CHECK (TrangThai IN ('CHUA_DOC', 'DA_DOC'))
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_TrangThaiDocThongBao_NguoiDung'
      AND object_id = OBJECT_ID('dbo.TrangThaiDocThongBao')
)
BEGIN
    CREATE INDEX IX_TrangThaiDocThongBao_NguoiDung
    ON dbo.TrangThaiDocThongBao(MaNguoiDung, MaThongBao);
END;
GO

/* Broadcast notifications must stay unread globally.
   Read state is now tracked per user in TrangThaiDocThongBao. */
UPDATE dbo.ThongBao
SET TrangThai = 'CHUA_DOC'
WHERE LoaiThongBao IN ('TatCa', 'NoiBo');
GO
