package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.StaffStatus;

@Entity
@Table(name = "NhanSu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

    @Id
    @Column(name = "MaNhanSu", length = 10)
    private String id;

    @OneToOne
    @JoinColumn(name = "MaNguoiDung", unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 20)
    private StaffStatus status;

    @Column(name = "ChucVu")
    private String position;
}
