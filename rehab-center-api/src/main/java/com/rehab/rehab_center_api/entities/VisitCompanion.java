package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.DocumentType;

@Entity
@Table(name = "NguoiDiCung")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitCompanion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaChiTiet")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaPhieu", nullable = false)
    private VisitRequest visitRequest;

    @Column(name = "HoTen", columnDefinition = "NVARCHAR(100)", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "LoaiGiayTo", length = 30, nullable = false)
    private DocumentType documentType;

    @Column(name = "SoGiayTo", length = 20, nullable = false)
    private String documentNumber;

    @Column(name = "QuanHe", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String relationship;

    @Column(name = "TepXacMinh", length = 255)
    private String verificationFile;
}
