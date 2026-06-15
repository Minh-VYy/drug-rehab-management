package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.AddictionLevel;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "NhatKyDieuTri")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreatmentJournal {

    @Id
    @Column(name = "MaNhatKy", length = 10)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaBenhAn")
    private MedicalRecord medicalRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaBacSi")
    private Staff doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaChiTietPhacDo")
    private TreatmentProtocolStage treatmentProtocolStage;

    @Column(name = "NgayGhi")
    private LocalDateTime recordedAt;

    @Column(name = "TinhTrangSucKhoe", columnDefinition = "NVARCHAR(500)")
    private String healthCondition;

    @Column(name = "TrieuChung", columnDefinition = "NVARCHAR(500)")
    private String symptoms;

    @Column(name = "NhietDo", precision = 4, scale = 1)
    private BigDecimal temperature;

    @Column(name = "HuyetAp", length = 20)
    private String bloodPressure;

    @Column(name = "NhipTim")
    private Integer heartRate;

    @Column(name = "ThuocSuDung", columnDefinition = "NVARCHAR(500)")
    private String medicationUsed;

    @Column(name = "LieuLuong", columnDefinition = "NVARCHAR(200)")
    private String dosage;

    @Enumerated(EnumType.STRING)
    @Column(name = "MucDoNghien", length = 20)
    private AddictionLevel addictionLevel;

    @Column(name = "ChanDoan", columnDefinition = "NVARCHAR(500)")
    private String diagnosis;

    @Column(name = "HuongXuLy", columnDefinition = "NVARCHAR(500)")
    private String treatmentApproach;
}
