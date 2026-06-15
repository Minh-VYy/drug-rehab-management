package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.CounselingSessionStatus;
import java.time.LocalDateTime;

@Entity
@Table(name = "LichTuVanTamLy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounselingSession {

    @Id
    @Column(name = "MaLichTuVan", length = 10)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiCaiNghien")
    private RehabPatient rehabPatient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaBacSi")
    private Staff doctor;

    @Column(name = "ThoiGianBatDau")
    private LocalDateTime startTime;

    @Column(name = "ThoiLuong")
    private Integer durationMinutes;

    @Column(name = "ChuDe", columnDefinition = "NVARCHAR(200)")
    private String topic;

    @Column(name = "KetQuaTuVan", columnDefinition = "NVARCHAR(500)")
    private String counselingResult;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 50)
    private CounselingSessionStatus status;
}
