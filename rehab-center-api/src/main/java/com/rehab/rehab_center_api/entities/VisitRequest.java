package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.VisitRequestStatus;
import com.rehab.rehab_center_api.enums.VisitType;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "PhieuThamGap")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaPhieu")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiThan", nullable = false)
    private Relative relative;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiCaiNghien", nullable = false)
    private RehabPatient rehabPatient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNhanSu")
    private Staff staff;

    @Enumerated(EnumType.STRING)
    @Column(name = "LoaiThamGap", length = 30, nullable = false)
    private VisitType visitType;

    @Column(name = "NgayTham", nullable = false)
    private LocalDate visitDate;

    @Column(name = "CaTham", nullable = false)
    private Byte visitShift;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 30, nullable = false)
    @ColumnDefault("'CHO_DUYET'")
    @Builder.Default
    private VisitRequestStatus status = VisitRequestStatus.CHO_DUYET;

    @Column(name = "NgayTao", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
