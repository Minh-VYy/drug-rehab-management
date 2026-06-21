package com.rehab.rehab_center_api.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiaryPatientOptionDto {
    private String maBenhAn;
    private String hoTenHocVien;
    private String maChiTietPhacDo;
}
