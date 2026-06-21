package com.rehab.rehab_center_api.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TreatmentPlanRequestDto {
    private String maHoSo;
    private String loaiMaTuy;
    private String giaiDoan;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private String mucTieu;
    private String noiDungPhacDo;
    private String ghiChuBacSi;
    private List<SubStageDto> cacGiaiDoanNho;
    private String trangThai;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubStageDto {
        private String tenGiaiDoan;
        private String noiDung;
        private String soNgay;
    }
}
