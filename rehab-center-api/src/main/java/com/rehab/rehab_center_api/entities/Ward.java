package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "phuong_xa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ward {

    @Id
    @Column(name = "ma_xa", length = 20)
    private String code;

    @Column(name = "ten_xa", nullable = false, columnDefinition = "NVARCHAR(100)")
    private String name;

    @Column(name = "phan_loai", columnDefinition = "NVARCHAR(50)")
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_huyen", nullable = false)
    private District district;
}
