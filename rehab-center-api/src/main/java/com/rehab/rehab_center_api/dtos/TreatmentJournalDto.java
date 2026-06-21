package com.rehab.rehab_center_api.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TreatmentJournalDto {
    private String maNhatKy;
    private String maBenhAn;
    private String maBacSi;
    private String maChiTietPhacDo;
    private String hoTenHocVien;
    private String ngayGhi;
    private String tinhTrangSucKhoe;
    private String trieuChung;
    private String nhietDo;
    private String huyetAp;
    private String nhipTim;
    private String thuocSuDung;
    private String lieuLuong;
    private String mucDoNghien;
    private String chanDoan;
    private String huongXuLy;
}
