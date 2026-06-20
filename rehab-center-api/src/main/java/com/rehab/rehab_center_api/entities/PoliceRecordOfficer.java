package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CanBoQuanLyHoSo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PoliceRecordOfficer {

    @Id
    @Column(name = "MaCanBoCongAn", columnDefinition = "CHAR(10)")
    private String id;

    @OneToOne
    @JoinColumn(name = "MaNguoiDung", unique = true)
    private User user;

    @Column(name = "HoTen", columnDefinition = "NVARCHAR(100)")
    private String fullName;

    @Column(name = "SoHieuCAND")
    private String policeBadgeNumber;

    @Column(name = "DonViCongTac", columnDefinition = "NVARCHAR(200)")
    private String workUnit;

    @Column(name = "SoDienThoai")
    private String phoneNumber;
}
