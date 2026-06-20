package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Column(name = "so_nha_ten_duong", columnDefinition = "NVARCHAR(255)")
    private String streetAddress;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ma_xa")
    private Ward ward;

    public String getFormattedAddress() {
        StringBuilder sb = new StringBuilder();
        if (streetAddress != null && !streetAddress.isBlank()) {
            sb.append(streetAddress);
        }
        if (ward != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(ward.getName());
            if (ward.getDistrict() != null) {
                sb.append(", ").append(ward.getDistrict().getName());
                if (ward.getDistrict().getProvince() != null) {
                    sb.append(", ").append(ward.getDistrict().getProvince().getName());
                }
            }
        }
        return sb.toString().isBlank() ? null : sb.toString();
    }
}
