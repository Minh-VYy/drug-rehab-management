package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "HoSoBenhAn")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecord {

    @Id
    @Column(name = "MaBenhAn", length = 10)
    private String id;

    @OneToOne
    @JoinColumn(name = "MaNguoiCaiNghien", unique = true)
    private RehabPatient rehabPatient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaBacSi")
    private Staff doctor;

    @Column(name = "TienSuBenh", columnDefinition = "NVARCHAR(500)")
    private String medicalHistory;

    @Column(name = "DiUng", columnDefinition = "NVARCHAR(500)")
    private String allergies;

    @Column(name = "ChieuCao", precision = 5, scale = 2)
    private BigDecimal height;

    @Column(name = "CanNang", precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(name = "NhomMau", length = 10)
    private String bloodGroup;

    @Column(name = "NgayLap")
    private LocalDateTime createdAt;

    @Column(name = "NgayCapNhatCuoi")
    private LocalDateTime lastUpdatedAt;

    @OneToMany(mappedBy = "medicalRecord")
    @Builder.Default
    private List<TreatmentProtocol> treatmentProtocols = new ArrayList<>();
}
