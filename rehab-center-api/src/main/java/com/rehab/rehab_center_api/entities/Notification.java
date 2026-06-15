package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.NotificationType;
import com.rehab.rehab_center_api.enums.NotificationStatus;
import java.time.LocalDateTime;

@Entity
@Table(name = "ThongBao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @Column(name = "MaThongBao", length = 10)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNhanVien")
    private Staff staff;

    @Column(name = "TieuDe", columnDefinition = "NVARCHAR(200)")
    private String title;

    @Column(name = "NoiDung", columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "NgayTao")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "LoaiThongBao", length = 30)
    private NotificationType notificationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiDungNhan")
    private User recipientUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 20)
    private NotificationStatus status;
}
