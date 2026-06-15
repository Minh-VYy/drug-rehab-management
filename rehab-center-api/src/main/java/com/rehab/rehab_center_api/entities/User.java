package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.UserStatus;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "NguoiDung")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaNguoiDung")
    private Integer id;

    @Column(name = "TenDangNhap", length = 50, unique = true, nullable = false)
    private String username;

    @Column(name = "MatKhau", length = 255, nullable = false)
    private String password;

    @Column(name = "HoTen", columnDefinition = "NVARCHAR(100)", nullable = false)
    private String fullName;

    @Column(name = "SoDienThoai", length = 15, nullable = false)
    private String phoneNumber;

    @Column(name = "Email", length = 100, nullable = false)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaVaiTro", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 20, nullable = false)
    @ColumnDefault("'DANG_HOAT_DONG'")
    @Builder.Default
    private UserStatus status = UserStatus.DANG_HOAT_DONG;

    @Column(name = "NgayTao", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
