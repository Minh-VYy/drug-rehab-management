package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.VoluntaryApplicationStatus;
import com.rehab.rehab_center_api.enums.DrugType;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "DonDangKyTuNguyen")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoluntaryAdmissionApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaDonTuNguyen")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiThan", nullable = false)
    private Relative relative;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNhanSu")
    private Staff staff;

    @Column(name = "HoTenNguoiCaiNghien", columnDefinition = "NVARCHAR(100)", nullable = false)
    private String patientFullName;

    @Column(name = "NgaySinhNguoiCaiNghien", nullable = false)
    private LocalDate patientDateOfBirth;

    @Column(name = "DiaChiThuongTru", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String permanentAddress;

    @Column(name = "SoCCCDNguoiCaiNghien", length = 12, nullable = false)
    private String patientIdentityNumber;

    @Column(name = "QuanHeVoiNguoiCaiNghien", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String relationshipToPatient;

    @Enumerated(EnumType.STRING)
    @Column(name = "LoaiMaTuySuDung", columnDefinition = "NVARCHAR(100)", nullable = false)
    private DrugType drugTypeUsed;

    @Column(name = "BieuHienLamSang", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String clinicalSymptoms;

    @Column(name = "TepCCCDMatTruoc", length = 255, nullable = false)
    private String identityCardFrontFile;

    @Column(name = "TepCCCDMatSau", length = 255, nullable = false)
    private String identityCardBackFile;

    @Column(name = "NgayGuiDon", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 30, nullable = false)
    @ColumnDefault("'CHO_DUYET'")
    @Builder.Default
    private VoluntaryApplicationStatus status = VoluntaryApplicationStatus.CHO_DUYET;
}
