package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.ProposalType;
import com.rehab.rehab_center_api.enums.TreatmentProposalStatus;
import java.time.LocalDateTime;

@Entity
@Table(name = "HoSoDeXuat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreatmentProposal {

    @Id
    @Column(name = "MaDeXuat", length = 10)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiCaiNghien")
    private RehabPatient rehabPatient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaBacSi")
    private Staff doctor;

    @Enumerated(EnumType.STRING)
    @Column(name = "LoaiDeXuat", columnDefinition = "NVARCHAR(50)")
    private ProposalType proposalType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaGiaiDoanHienTai")
    private TreatmentStageDefinition currentStageDefinition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaGiaiDoanDeXuat")
    private TreatmentStageDefinition proposedStageDefinition;

    @Column(name = "LyDo", columnDefinition = "NVARCHAR(500)")
    private String reason;

    @Column(name = "NgayDeXuat")
    private LocalDateTime proposedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaQuanLy")
    private Staff manager;

    @Column(name = "NgayPheDuyet")
    private LocalDateTime approvedAt;

    @Column(name = "GhiChuPheDuyet", columnDefinition = "NVARCHAR(500)")
    private String approvalNote;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 30)
    private TreatmentProposalStatus status;

    @Version
    @Column(name = "PhienBan")
    private Long version;
}
