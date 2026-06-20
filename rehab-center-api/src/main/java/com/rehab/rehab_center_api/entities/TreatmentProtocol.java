package com.rehab.rehab_center_api.entities;

import com.rehab.rehab_center_api.converters.DrugTypeConverter;
import com.rehab.rehab_center_api.enums.DrugType;
import com.rehab.rehab_center_api.enums.TreatmentProtocolOverallStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "PhacDoDieuTri")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreatmentProtocol {

    @Id
    @Column(name = "MaPhacDoDT", length = 10)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaBenhAn", nullable = false)
    private MedicalRecord medicalRecord;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaBacSi", nullable = false)
    private Staff doctor;

    @Convert(converter = DrugTypeConverter.class)
    @Column(name = "LoaiMaTuy", columnDefinition = "NVARCHAR(50)")
    private DrugType drugType;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 30, nullable = false)
    private TreatmentProtocolOverallStatus status;

    @Column(name = "NgayLap")
    private LocalDateTime createdAt;

    @Column(name = "GhiChu", columnDefinition = "NVARCHAR(500)")
    private String note;

    @OneToMany(mappedBy = "treatmentProtocol", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceOrder ASC")
    @Builder.Default
    private List<TreatmentProtocolStage> stages = new ArrayList<>();
}
