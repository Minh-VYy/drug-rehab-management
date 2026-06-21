package com.rehab.rehab_center_api.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientTreatmentPlanDto {
    private String maHoSo;
    private String hoTenHocVien;
    private String loaiMaTuy;
    private String giaiDoanHienTai;
    private String phacDoGanNhat;
    private String trangThai;
}
