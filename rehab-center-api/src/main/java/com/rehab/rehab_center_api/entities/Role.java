package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "VaiTro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaVaiTro")
    private Integer id;

    @Column(name = "TenVaiTro", length = 50, nullable = false)
    private String name;

    @Column(name = "MoTa", columnDefinition = "NVARCHAR(100)")
    private String description;
}
