package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.SupportRequestStatus;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import java.sql.Types;
import java.time.LocalDateTime;

@Entity
@Table(name = "PhieuHoTro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportRequest {

    @Id
    @Column(name = "MaYeuCau", length = 10)
    @JdbcTypeCode(Types.CHAR)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiThan", nullable = false)
    private Relative relative;

    @Column(name = "TieuDe", length = 200, nullable = false)
    private String title;

    @Column(name = "NoiDungYeuCau", columnDefinition = "nvarchar(max)", nullable = false)
    private String requestContent;

    @Column(name = "NgayGui", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 30, nullable = false)
    @ColumnDefault("'CHO_PHAN_HOI'")
    @Builder.Default
    private SupportRequestStatus status = SupportRequestStatus.CHO_PHAN_HOI;

    @Column(name = "NoiDungPhanHoi", columnDefinition = "nvarchar(max)")
    private String responseContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNhanVien")
    private Staff staff;

    @Column(name = "NgayPhanHoi")
    private LocalDateTime respondedAt;
}
