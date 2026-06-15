package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "DanhMucGiaiDoan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreatmentStageDefinition {

    @Id
    @Column(name = "MaGiaiDoan", length = 10)
    private String id;

    @Column(name = "TenGiaiDoan", columnDefinition = "NVARCHAR(100)", nullable = false)
    private String name;

    @Column(name = "ThuTu", nullable = false)
    private Integer sequenceOrder;

    @Column(name = "MoTa", columnDefinition = "NVARCHAR(500)")
    private String description;
}
