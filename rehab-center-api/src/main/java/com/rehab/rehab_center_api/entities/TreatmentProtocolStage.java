package com.rehab.rehab_center_api.entities;

import com.rehab.rehab_center_api.enums.TreatmentProtocolStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "ChiTietPhacDoDieuTri",
        uniqueConstraints = @UniqueConstraint(columnNames = {"MaPhacDoDT", "MaGiaiDoan"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreatmentProtocolStage {

    @Id
    @Column(name = "MaChiTietPhacDo", length = 15)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaPhacDoDT", nullable = false)
    private TreatmentProtocol treatmentProtocol;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaGiaiDoan", nullable = false)
    private TreatmentStageDefinition stageDefinition;

    @Column(name = "ThuTu", nullable = false)
    private Integer sequenceOrder;

    @Column(name = "NoiDungPhacDoDT", columnDefinition = "NVARCHAR(MAX)")
    private String protocolContent;

    @Column(name = "MucTieu", columnDefinition = "NVARCHAR(500)")
    private String objective;

    @Column(name = "NgayBatDau")
    private LocalDate startDate;

    @Column(name = "NgayKetThucDuKien")
    private LocalDate expectedEndDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 30, nullable = false)
    private TreatmentProtocolStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaQuanLy")
    private Staff manager;

    @Column(name = "NgayPheDuyet")
    private LocalDateTime approvedAt;

    @Column(name = "GhiChuPheDuyet", columnDefinition = "NVARCHAR(500)")
    private String approvalNote;
}
