package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.RehabPatientStatus;
import java.time.LocalDateTime;

@Entity
@Table(name = "NguoiCaiNghien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RehabPatient {

    @Id
    @Column(name = "MaNguoiCaiNghien", length = 20)
    private String id;

    @OneToOne
    @JoinColumn(name = "MaDonTuNguyen", unique = true)
    private VoluntaryAdmissionApplication voluntaryApplication;

    @Column(name = "MaHoSoBanGiao")
    private String handoverSlipId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiThan")
    private Relative relative;

    @Column(name = "HoTen", columnDefinition = "NVARCHAR(100)")
    private String fullName;

    @Column(name = "CCCD", length = 12, unique = true)
    private String identityNumber;

    @Column(name = "NgayVaoTrai")
    private LocalDateTime admissionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaGiaiDoanHienTai")
    private TreatmentStageDefinition currentStageDefinition;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 30)
    private RehabPatientStatus status;
}
