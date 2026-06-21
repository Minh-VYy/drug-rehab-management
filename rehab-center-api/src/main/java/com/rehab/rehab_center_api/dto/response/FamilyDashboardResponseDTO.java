package com.rehab.rehab_center_api.dto.response;

import java.util.List;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyDashboardResponseDTO {
    private String trangThaiDonDangKyGanNhat;
    private String lichThamGapSapToi;
    private String lichThamGapSapToiTrend;
    private boolean lichThamGapSapToiWarn;
    private long thongBaoChuaDoc;
    private String giaiDoanPhucHoiHienTai;
    private List<TimelineItemDTO> timeline;
    private List<NotificationItemDTO> thongBaoMoiNhat;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimelineItemDTO {
        private String time;
        private String title;
        private String text;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationItemDTO {
        private String title;
        private String content;
        private String contentSnippet;
        private String date;
    }
}
