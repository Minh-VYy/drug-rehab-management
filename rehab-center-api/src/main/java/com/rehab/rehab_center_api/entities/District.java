package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "quan_huyen")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class District {

    @Id
    @Column(name = "ma_huyen", length = 20)
    private String code;

    @Column(name = "ten_huyen", nullable = false, columnDefinition = "NVARCHAR(100)")
    private String name;

    @Column(name = "phan_loai", columnDefinition = "NVARCHAR(50)")
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tinh", nullable = false)
    private Province province;

    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ward> wards;
}
