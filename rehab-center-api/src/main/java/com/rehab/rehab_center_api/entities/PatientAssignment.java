package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.AssignmentStatus;
import java.time.LocalDate;

@Entity
@Table(name = "PhanCongPhuTrach")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientAssignment {

    @Id
    @Column(name = "MaPhanCong", length = 10)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiCaiNghien")
    private RehabPatient rehabPatient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaBacSi")
    private Staff doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaQuanLy")
    private Staff manager;

    @Column(name = "NgayBatDau")
    private LocalDate startDate;

    @Column(name = "NgayKetThuc")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 30)
    private AssignmentStatus status;
}
