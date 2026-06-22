package com.rehab.rehab_center_api.entities;

import com.rehab.rehab_center_api.enums.NotificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "TrangThaiDocThongBao",
        uniqueConstraints = @UniqueConstraint(
                name = "UQ_TrangThaiDocThongBao_ThongBao_NguoiDung",
                columnNames = {"MaThongBao", "MaNguoiDung"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationReadReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaTrangThai")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaThongBao", nullable = false)
    private Notification notification;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiDung", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 20, nullable = false)
    private NotificationStatus status;

    @Column(name = "NgayDoc")
    private LocalDateTime readAt;
}
