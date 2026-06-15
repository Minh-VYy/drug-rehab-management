package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "DanhMucThuoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Drug {

    @Id
    @Column(name = "MaThuoc", length = 10)
    private String id;

    @Column(name = "TenThuoc", columnDefinition = "NVARCHAR(100)")
    private String name;

    @Column(name = "DonViTinh", columnDefinition = "NVARCHAR(30)")
    private String unit;

    @Column(name = "SoLuong")
    private Integer quantity;

    @Column(name = "GhiChu", columnDefinition = "NVARCHAR(255)")
    private String note;
}
