package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "ChiTietLichUongThuoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationScheduleItem {

    @Id
    @Column(name = "MaChiTiet", length = 10)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaLichUong")
    private MedicationSchedule medicationSchedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaThuoc")
    private Drug drug;

    @Column(name = "LieuLuong", columnDefinition = "NVARCHAR(100)")
    private String dosage;

    @Column(name = "TanSuat", columnDefinition = "NVARCHAR(50)")
    private String frequency;

    @Column(name = "GioUong")
    private LocalTime administrationTime;
}
