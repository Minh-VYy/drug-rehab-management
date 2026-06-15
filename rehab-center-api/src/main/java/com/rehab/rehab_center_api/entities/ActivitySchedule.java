package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "LichSinhHoat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivitySchedule {

    @Id
    @Column(name = "MaLich", length = 10)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNhanVien")
    private Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaHoatDong")
    private Activity activity;

    @Column(name = "ThoiGianBatDau")
    private LocalDateTime startTime;

    @Column(name = "ThoiGianKetThuc")
    private LocalDateTime endTime;

    @Column(name = "DiaDiem", columnDefinition = "NVARCHAR(100)")
    private String location;
}
