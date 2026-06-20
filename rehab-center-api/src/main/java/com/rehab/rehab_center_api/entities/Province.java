package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "tinh_thanh_pho")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Province {

    @Id
    @Column(name = "ma_tinh", length = 20)
    private String code;

    @Column(name = "ten_tinh", nullable = false, columnDefinition = "NVARCHAR(100)")
    private String name;

    @Column(name = "phan_loai", columnDefinition = "NVARCHAR(50)")
    private String type;

    @OneToMany(mappedBy = "province", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<District> districts;
}
