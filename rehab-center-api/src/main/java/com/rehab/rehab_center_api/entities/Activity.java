package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.ActivityType;
import java.time.LocalDate;

@Entity
@Table(name = "DanhMucHoatDong")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @Column(name = "MaHoatDong", length = 10)
    private String id;

    @Column(name = "TenHoatDong", columnDefinition = "NVARCHAR(100)")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "LoaiHoatDong", columnDefinition = "NVARCHAR(30)")
    private ActivityType activityType;

    @Column(name = "ThoiGian")
    private LocalDate date;

    @Column(name = "MoTa", columnDefinition = "NVARCHAR(500)")
    private String description;
}
