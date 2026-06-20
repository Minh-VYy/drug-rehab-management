package com.rehab.rehab_center_api.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMedicalRecordRequest {

    @Size(max = 500)
    private String tienSuBenh;

    @Size(max = 500)
    private String diUng;

    @DecimalMin(value = "0.01", message = "Chieu cao phai lon hon 0")
    private BigDecimal chieuCao;

    @DecimalMin(value = "0.01", message = "Can nang phai lon hon 0")
    private BigDecimal canNang;

    @Size(max = 10)
    private String nhomMau;
}
