package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NotificationSentResponse {
    private String id;
    private String tieuDe;
    private String noiDung;
    private String loaiGui;
    private List<String> nhomVaiTro;
    private String mucDo;
    private String thoiGianGui;
    private int soNguoiNhan;
}
