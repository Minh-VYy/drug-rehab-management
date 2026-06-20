package com.rehab.rehab_center_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordResponse {
    private String maBenhAn;
    private String maNguoiCaiNghien;
    private String maBacSi;
    private String tienSuBenh;
    private String diUng;
    private BigDecimal chieuCao;
    private BigDecimal canNang;
    private String nhomMau;
    private LocalDateTime ngayLap;
    private LocalDateTime ngayCapNhatCuoi;
}
