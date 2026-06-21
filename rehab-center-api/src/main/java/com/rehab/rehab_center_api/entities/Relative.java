package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "NguoiThan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Relative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaNguoiThan")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "MaNguoiDung", unique = true, nullable = false)
    private User user;

    @Column(name = "SoCCCD", length = 12, unique = true, nullable = false)
    private String identityNumber;

    @Column(name = "NgayCap", nullable = false)
    private LocalDate issueDate;

    @Column(name = "NoiCap", columnDefinition = "NVARCHAR(100)", nullable = false)
    private String issuePlace;

    @Column(name = "DiaChi", columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "NgheNghiep", columnDefinition = "NVARCHAR(100)")
    private String occupation;

    @Column(name = "AnhChanDung", length = 255)
    private String portraitPhoto;
}
