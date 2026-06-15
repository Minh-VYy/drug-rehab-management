package com.rehab.rehab_center_api.entities;

import lombok.*;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class AttendanceRecordId implements Serializable {
    private String scheduleId;
    private String rehabPatientId;
}
