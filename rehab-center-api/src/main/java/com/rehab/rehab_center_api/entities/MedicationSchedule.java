package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.MedicationScheduleStatus;
import java.time.LocalDate;

@Entity
@Table(name = "LichUongThuoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationSchedule {

    @Id
    @Column(name = "MaLichUong", length = 10)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiCaiNghien")
    private RehabPatient rehabPatient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaBacSi")
    private Staff doctor;

    @Column(name = "NgayBatDau")
    private LocalDate startDate;

    @Column(name = "NgayKetThuc")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 30)
    private MedicationScheduleStatus status;
}
