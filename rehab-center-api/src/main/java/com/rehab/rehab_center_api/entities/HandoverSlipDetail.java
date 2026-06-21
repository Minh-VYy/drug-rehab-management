package com.rehab.rehab_center_api.entities;

import com.rehab.rehab_center_api.enums.HandoverSlipDetailStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ChiTietPhieuBanGiao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HandoverSlipDetail {

    @Id
    @Column(name = "MaChiTietPhieuBanGiao", length = 25)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaPhieuBanGiao", nullable = false)
    private HandoverSlip handoverSlip;

    @Column(name = "HoTenDoiTuong", columnDefinition = "NVARCHAR(100)", nullable = false)
    private String fullName;

    @Column(name = "CCCD", length = 12, nullable = false)
    private String identityNumber;

    @Column(name = "NgaySinh", nullable = false)
    private LocalDate dateOfBirth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QueQuan_MaHuyen")
    private District hometownDistrict;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "streetAddress", column = @Column(name = "NoiO_Duong", columnDefinition = "NVARCHAR(255)")),
        @AttributeOverride(name = "ward", column = @Column(name = "NoiO_MaXa"))
    })
    private Address currentAddress;

    @Column(name = "HoTenNguoiThan", columnDefinition = "NVARCHAR(100)", nullable = false)
    private String relativeName;

    @Column(name = "SdtNguoiThan", length = 15, nullable = false)
    private String relativePhone;

    @Column(name = "QuanHeVoiDoiTuong", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String relativeRelationship;

    @Column(name = "HanhViViPham", columnDefinition = "NVARCHAR(500)", nullable = false)
    private String violationDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThaiChiTiet", length = 30, nullable = false)
    @ColumnDefault("'CHO_TIEP_NHAN'")
    @Builder.Default
    private HandoverSlipDetailStatus status = HandoverSlipDetailStatus.CHO_TIEP_NHAN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNhanSuTiepNhan")
    private Staff receptionStaff;

    @Column(name = "NgayTiepNhan")
    private LocalDateTime receivedAt;

    @Column(name = "LyDoTuChoi", columnDefinition = "NVARCHAR(500)")
    private String rejectionReason;
}
