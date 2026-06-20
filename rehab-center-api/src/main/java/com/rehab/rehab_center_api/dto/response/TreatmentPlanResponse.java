package com.rehab.rehab_center_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TreatmentPlanResponse {
    private String maPhacdoDT;
    private String maPhacDoTong;
    private String maBenhAn;
    private String maBacSi;
    private String maQuanLy;
    private String loaiMaTuy;
    private String giaiDoan;
    private String noiDungPhacdoDT;
    private String mucTieu;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThucDuKien;
    private String trangThai;
    private LocalDateTime ngayPheDuyet;
    private String ghiChuPheDuyet;
}
