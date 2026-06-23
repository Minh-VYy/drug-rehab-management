const FamilyDashboardPage = {
  async render(containerId) {
    const success = await ViewLoader.load("views/family/family-dashboard.html", containerId);
    if (success) await this.init();
  },

  async init() {
    if (typeof Topbar !== "undefined") Topbar.setTitle("Tổng quan");
    if (!window.AdvancedRoleDashboard) return;

    const preset = AdvancedRoleDashboard.getPreset("family");

    // Hiển thị loading trước
    AdvancedRoleDashboard.renderLoading("familyAdvancedDashboard", preset);

    try {
      const data = await Api.getFamilyDashboard();
      const merged = this.buildConfig(preset, data);
      AdvancedRoleDashboard.render("familyAdvancedDashboard", merged);
    } catch (error) {
      console.warn("Không tải được family dashboard từ API:", error);
      AdvancedRoleDashboard.render(
        "familyAdvancedDashboard",
        AdvancedRoleDashboard.withApiFallback(preset, error)
      );
    }
  },

  /**
   * Map response từ API /family/dashboard vào cấu hình dashboard.
   * Chỉ hiển thị những thông tin người thân được phép thấy:
   *   - Số đơn tự nguyện, lịch thăm gặp, yêu cầu hỗ trợ, lần thăm gần nhất
   *   - Giai đoạn điều trị (tên giai đoạn, dự kiến kết thúc) — không hiển thị % tiến độ
   *   - Lịch sử thăm gặp theo trạng thái (chart)
   *   - Timeline hoạt động gần đây của chính người thân
   *
   * API response kỳ vọng (backend cần trả về):
   * {
   *   giaoDoanDieuTri: string,          // tên giai đoạn hiện tại, vd: "Điều trị tích cực"
   *   ngayKetThucDuKien: string,         // ISO date hoặc dd/MM/yyyy
   *   sodonTuNguyen: number,
   *   soLichThamGap: number,
   *   lichThamGapSapToi: number,
   *   soYeuCauHoTro: number,
   *   trangThaiYeuCauMoiNhat: string,    // vd: "Đang phản hồi"
   *   lanThamGanNhat: string,            // vd: "3 ngày trước"
   *   visitStats: {
   *     choDuyet: number,
   *     daXacNhan: number,
   *     daHoanThanh: number,
   *   },
   *   timeline: [{ time, title, text }],  // hoạt động gần đây của người thân
   *   signals: [{ text, icon, tone }],    // thông báo quan trọng từ trung tâm
   * }
   */
  buildConfig(preset, data) {
    if (!data || typeof data !== "object") return preset;

    return {
      ...preset,

      commandLabel: "Giai đoạn phục hồi",
      commandValue: data.giaiDoanPhucHoiHienTai || "Chưa điều trị",
      commandText: "Thông tin tiến trình phục hồi được cập nhật bởi bác sĩ chuyên trách.",

      // 4 metrics cards người thân được xem
      metrics: [
        {
          label: "Trạng thái đơn đăng ký gần nhất",
          value: data.trangThaiDonDangKyGanNhat || "Không có đơn",
          icon: "fa-file-signature",
          tone: "orange",
          trend: "Đăng ký tự nguyện",
          warn: data.trangThaiDonDangKyGanNhat === "Chờ duyệt",
        },
        {
          label: "Lịch thăm gặp sắp tới",
          value: data.lichThamGapSapToi || "Chưa có lịch",
          icon: "fa-calendar-check",
          tone: "green",
          trend: data.lichThamGapSapToiTrend || "Không có lịch sắp tới",
          warn: data.lichThamGapSapToiWarn || false,
        },
        {
          label: "Thông báo chưa đọc",
          value: data.thongBaoChuaDoc !== undefined ? String(data.thongBaoChuaDoc) : "0",
          icon: "fa-bell",
          tone: "red",
          trend: "Tin mới",
          warn: data.thongBaoChuaDoc > 0,
        },
        {
          label: "Giai đoạn phục hồi hiện tại",
          value: data.giaiDoanPhucHoiHienTai || "Chưa điều trị",
          icon: "fa-route",
          tone: "blue",
          trend: "Tiến trình",
          warn: false,
        },
      ],

      // Timeline tiến trình phục hồi học viên
      timeline: {
        title: "Tiến trình phục hồi của người cai nghiện",
        subtitle: "Các mốc lịch sử phát triển thể trạng học viên",
        items: Array.isArray(data.timeline) && data.timeline.length
          ? data.timeline
          : [
            {
              time: "Hệ thống",
              title: "Chưa có cập nhật",
              text: "Đang đợi thông tin tiến trình từ bác sĩ trung tâm.",
            },
          ],
      },

      // Danh sách ngắn: 3 thông báo mới nhất
      focus: {
        title: "3 thông báo mới nhất",
        subtitle: "Cập nhật từ Ban quản lý trung tâm",
        items: Array.isArray(data.thongBaoMoiNhat) && data.thongBaoMoiNhat.length
          ? data.thongBaoMoiNhat.map(item => ({
            title: item.title,
            text: item.contentSnippet || item.content,
            meta: item.date,
            icon: "fa-bell",
            tone: "blue",
            route: "/notifications",
          }))
          : [
            {
              title: "Không có thông báo mới",
              text: "Bạn chưa nhận được thông báo nào từ trung tâm.",
              meta: "Hiện tại",
              icon: "fa-bell-slash",
              tone: "gray",
              route: "/notifications",
            },
          ],
      },

      // Thao tác nhanh
      actions: [
        {
          label: "Đăng ký thăm gặp",
          text: "Đặt lịch hẹn thăm gặp người thân",
          icon: "fa-calendar-plus",
          tone: "green",
          route: "/visit-register",
        },
        {
          label: "Gửi yêu cầu hỗ trợ",
          text: "Gửi phản hồi, câu hỏi tới trung tâm",
          icon: "fa-headset",
          tone: "orange",
          route: "/support",
        },
      ],

      // Ẩn panel visual và signals
      visual: null,
      signals: null,
    };
  },
};

window.FamilyDashboardPage = FamilyDashboardPage;
