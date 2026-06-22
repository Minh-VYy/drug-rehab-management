package com.rehab.rehab_center_api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class NotificationCreateRequest {

    @NotBlank(message = "Tiêu đề thông báo không được để trống")
    @Size(max = 200, message = "Tiêu đề thông báo không được vượt quá 200 ký tự")
    private String tieuDe;

    @NotBlank(message = "Nội dung thông báo không được để trống")
    private String noiDung;

    private String mucDo = "ThongTin";

    @NotBlank(message = "Loại gửi không được để trống")
    private String loaiGui;

    private List<String> nhomVaiTro = new ArrayList<>();

    private List<Integer> nguoiNhan = new ArrayList<>();
}
