package com.rehab.rehab_center_api.entities;

import com.rehab.rehab_center_api.enums.HandoverSlipStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "PhieuBanGiao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HandoverSlip {

    @Id
    @Column(name = "MaPhieuBanGiao", length = 20)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaCanBoCongAn", nullable = false)
    private PoliceRecordOfficer policeOfficer;

    @Column(name = "SoQuyetDinh", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String decisionNumber;

    @Column(name = "NgayQuyetDinh", nullable = false)
    private LocalDate decisionDate;

    @Column(name = "FileQuyetDinh", length = 255, nullable = false)
    private String decisionFileUrl;

    @Column(name = "NgayGui")
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThaiPhieu", length = 30, nullable = false)
    @ColumnDefault("'BAN_NHAP'")
    @Builder.Default
    private HandoverSlipStatus status = HandoverSlipStatus.BAN_NHAP;

    @Column(name = "TongSoDoiTuong", nullable = false)
    @Builder.Default
    private Integer subjectCount = 0;

    @Column(name = "GhiChu", columnDefinition = "NVARCHAR(500)")
    private String note;

    @CreationTimestamp
    @Column(name = "NgayTao", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "NgayCapNhat")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "handoverSlip", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<HandoverSlipDetail> subjects = new ArrayList<>();
}
