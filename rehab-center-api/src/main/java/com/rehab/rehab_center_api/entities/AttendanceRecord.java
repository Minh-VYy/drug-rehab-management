package com.rehab.rehab_center_api.entities;

import jakarta.persistence.*;
import lombok.*;
import com.rehab.rehab_center_api.enums.AttendanceStatus;

@Entity
@Table(name = "NhatKyDiemDanh")
@IdClass(AttendanceRecordId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRecord {

    @Id
    @Column(name = "MaLich", length = 10)
    private String scheduleId;

    @Id
    @Column(name = "MaNguoiCaiNghien", length = 20)
    private String rehabPatientId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaLich", insertable = false, updatable = false)
    private ActivitySchedule activitySchedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNguoiCaiNghien", insertable = false, updatable = false)
    private RehabPatient rehabPatient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaNhanVien")
    private Staff staff;

    @Column(name = "ThoiGian")
    private java.time.LocalDateTime recordedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", length = 30)
    private AttendanceStatus status;

    @Column(name = "GhiChu", length = 200)
    private String note;
}
