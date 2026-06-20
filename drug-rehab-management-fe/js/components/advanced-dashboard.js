const AdvancedRoleDashboard = {
  tones: {
    blue: "#2563eb",
    green: "#10b981",
    orange: "#f59e0b",
    purple: "#8b5cf6",
    red: "#ef4444",
    cyan: "#06b6d4",
  },

  render(rootId, config) {
    const root = document.getElementById(rootId);
    if (!root || !config) return;

    root.innerHTML = `
      <section class="ard-page ard-theme-${this.escape(config.theme || "blue")}">
        ${this.renderHero(config)}
        ${this.renderMetrics(config.metrics || [])}
        <div class="ard-main-grid">
          ${this.renderVisualPanel(config.visual)}
          ${this.renderFocusPanel(config.focus)}
        </div>
        <div class="ard-secondary-grid">
          ${this.renderTimeline(config.timeline)}
          ${this.renderActions(config.actions || [])}
          ${this.renderSignalPanel(config.signals || [])}
        </div>
      </section>
    `;

    this.bindRoutes(root);
    this.bindDepthEffects(root);
  },

  async renderRole(rootId, role) {
    const fallback = this.getPreset(role);
    this.render(rootId, fallback);

    if (!window.Api || typeof Api.getRoleDashboard !== "function") return;

    try {
      const remoteConfig = await Api.getRoleDashboard(role);
      const mergedConfig = this.mergeDashboardConfig(fallback, remoteConfig);
      this.render(rootId, mergedConfig);
    } catch (error) {
      console.warn(`Không tải được dashboard ${role} từ API, giữ dữ liệu dự phòng:`, error);
    }
  },

  mergeDashboardConfig(fallback, remote = {}) {
    if (!remote || typeof remote !== "object") return fallback;

    return {
      ...fallback,
      ...remote,
      name: fallback.name,
      metrics: Array.isArray(remote.metrics) && remote.metrics.length ? remote.metrics : fallback.metrics,
      actions: Array.isArray(remote.actions) && remote.actions.length ? remote.actions : fallback.actions,
      signals: Array.isArray(remote.signals) && remote.signals.length ? remote.signals : fallback.signals,
      visual: {
        ...(fallback.visual || {}),
        ...(remote.visual || {}),
        data: remote.visual?.data?.length ? remote.visual.data : fallback.visual?.data,
      },
      focus: {
        ...(fallback.focus || {}),
        ...(remote.focus || {}),
        items: remote.focus?.items?.length ? remote.focus.items : fallback.focus?.items,
      },
      timeline: {
        ...(fallback.timeline || {}),
        ...(remote.timeline || {}),
        items: remote.timeline?.items?.length ? remote.timeline.items : fallback.timeline?.items,
      },
    };
  },

  getPreset(role) {
    const user = this.getUser();
    const name = this.getDisplayName(user);
    const presets = {
      admin: this.adminPreset(name),
      leader: this.leaderPreset(name),
      manager: this.managerPreset(name),
      doctor: this.doctorPreset(name),
      staff: this.staffPreset(name),
      family: this.familyPreset(name),
      police: this.policePreset(name),
      common: this.commonPreset(name),
    };
    return presets[role] || presets.common;
  },

  getUser() {
    try {
      if (window.Auth && Auth.getCurrentUser) return Auth.getCurrentUser();
    } catch (error) {
      console.warn("Không lấy được người dùng hiện tại:", error);
    }
    return {};
  },

  getDisplayName(user) {
    try {
      if (window.Auth && Auth.getDisplayName) return Auth.getDisplayName(user);
    } catch (error) {
      console.warn("Không lấy được tên hiển thị:", error);
    }
    return user?.fullName || user?.hoTen || user?.name || user?.username || "Người dùng";
  },

  renderHero(config) {
    const today = new Date();
    const dateLabel = today.toLocaleDateString("vi-VN", {
      weekday: "long",
      month: "short",
      year: "numeric",
    });

    return `
      <div class="ard-hero">
        <div class="ard-hero-copy">
          <div class="ard-kicker">
            <i class="fa-solid ${this.escape(config.icon || "fa-chart-line")}"></i>
            ${this.escape(config.roleLabel || "Dashboard")}
          </div>
          <h1>${this.escape(config.title || "Xin chào")}, <span>${this.escape(config.name || "Người dùng")}</span></h1>
          <p>${this.escape(config.subtitle || "")}</p>
        </div>
        <div class="ard-hero-side">
          <div class="ard-date-orb">
            <strong>${today.getDate()}</strong>
            <span>${this.escape(dateLabel)}</span>
          </div>
          <div class="ard-command-card">
            <small>${this.escape(config.commandLabel || "Trạng thái")}</small>
            <strong>${this.escape(config.commandValue || "Đang vận hành")}</strong>
            <span>${this.escape(config.commandText || "Các chỉ số chính đang được theo dõi.")}</span>
          </div>
        </div>
        <div class="ard-depth-stack" aria-hidden="true">
          <span class="ard-depth-plane plane-a"><i class="fa-solid ${this.escape(config.icon || "fa-chart-line")}"></i></span>
          <span class="ard-depth-plane plane-b"></span>
          <span class="ard-depth-plane plane-c"></span>
        </div>
      </div>
    `;
  },

  renderMetrics(metrics) {
    return `
      <div class="ard-metric-grid">
        ${metrics.map((metric, index) => `
          <article class="ard-metric-card ard-tone-${this.escape(metric.tone || "blue")}" data-ard-depth data-depth-power="10" style="animation-delay:${index * 45}ms">
            <div class="ard-metric-icon"><i class="fa-solid ${this.escape(metric.icon || "fa-circle")}"></i></div>
            <div class="ard-metric-value">${this.escape(metric.value)}</div>
            <div class="ard-metric-label">${this.escape(metric.label)}</div>
            <div class="ard-metric-trend ${metric.warn ? "is-warning" : "is-good"}">
              <i class="fa-solid ${metric.warn ? "fa-triangle-exclamation" : "fa-arrow-trend-up"}"></i>
              ${this.escape(metric.trend || "Ổn định")}
            </div>
          </article>
        `).join("")}
      </div>
    `;
  },

  renderVisualPanel(visual = {}) {
    const data = visual.data || [];
    const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0) || 1;
    const colors = data.map((item) => item.color || this.tones[item.tone] || this.tones.blue);
    let cursor = 0;
    const stops = data.map((item, index) => {
      const percent = (Number(item.value || 0) / total) * 100;
      const start = cursor;
      cursor += percent;
      return `${colors[index]} ${start}% ${cursor}%`;
    });

    return `
      <section class="ard-panel ard-visual-panel" data-ard-depth data-depth-power="5">
        <div class="ard-panel-header">
          <div>
            <h3>${this.escape(visual.title || "Phân tích nhanh")}</h3>
            <p>${this.escape(visual.subtitle || "Tổng hợp dữ liệu vận hành")}</p>
          </div>
          <span class="ard-panel-badge">${this.escape(visual.badge || "Realtime")}</span>
        </div>
        <div class="ard-visual-layout">
          <div class="ard-donut" style="background:conic-gradient(${stops.join(", ") || "#2563eb 0 100%"});">
            <div class="ard-donut-center">
              <strong>${this.escape(visual.centerValue || total)}</strong>
              <span>${this.escape(visual.centerLabel || "tổng")}</span>
            </div>
          </div>
          <div class="ard-legend-list">
            ${data.map((item, index) => {
              const percent = Math.round((Number(item.value || 0) / total) * 100);
              return `
                <div class="ard-legend-item">
                  <div>
                    <span style="background:${colors[index]}"></span>
                    <strong>${this.escape(item.label)}</strong>
                  </div>
                  <em>${this.escape(item.value)} · ${percent}%</em>
                  <div class="ard-progress"><i style="width:${percent}%; background:${colors[index]}"></i></div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </section>
    `;
  },

  renderFocusPanel(focus = {}) {
    const items = focus.items || [];
    return `
      <section class="ard-panel ard-focus-panel" data-ard-depth data-depth-power="5">
        <div class="ard-panel-header">
          <div>
            <h3>${this.escape(focus.title || "Việc cần chú ý")}</h3>
            <p>${this.escape(focus.subtitle || "Các mục ưu tiên trong ngày")}</p>
          </div>
        </div>
        <div class="ard-focus-list">
          ${items.map((item) => `
            <button class="ard-focus-item" type="button" data-route="${this.escape(item.route || "")}">
              <span class="ard-focus-icon ard-tone-${this.escape(item.tone || "blue")}"><i class="fa-solid ${this.escape(item.icon || "fa-circle")}"></i></span>
              <span>
                <strong>${this.escape(item.title)}</strong>
                <small>${this.escape(item.text || "")}</small>
              </span>
              <em>${this.escape(item.meta || "")}</em>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  },

  renderTimeline(timeline = {}) {
    const items = timeline.items || [];
    return `
      <section class="ard-panel ard-timeline-panel" data-ard-depth data-depth-power="4">
        <div class="ard-panel-header compact">
          <div>
            <h3>${this.escape(timeline.title || "Nhịp vận hành")}</h3>
            <p>${this.escape(timeline.subtitle || "Timeline trong ngày")}</p>
          </div>
        </div>
        <div class="ard-timeline">
          ${items.map((item) => `
            <div class="ard-timeline-item">
              <span>${this.escape(item.time || "")}</span>
              <div>
                <strong>${this.escape(item.title)}</strong>
                <small>${this.escape(item.text || "")}</small>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  },

  renderActions(actions) {
    return `
      <section class="ard-panel ard-actions-panel" data-ard-depth data-depth-power="4">
        <div class="ard-panel-header compact">
          <div>
            <h3>Thao tác nhanh</h3>
            <p>Mở nhanh các nghiệp vụ thường dùng</p>
          </div>
        </div>
        <div class="ard-action-grid">
          ${actions.map((item) => `
            <button class="ard-action-btn ard-tone-${this.escape(item.tone || "blue")}" type="button" data-route="${this.escape(item.route || "")}">
              <i class="fa-solid ${this.escape(item.icon || "fa-arrow-right")}"></i>
              <span>
                <strong>${this.escape(item.label)}</strong>
                <small>${this.escape(item.text || "")}</small>
              </span>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  },

  renderSignalPanel(signals) {
    return `
      <section class="ard-panel ard-signal-panel" data-ard-depth data-depth-power="4">
        <div class="ard-panel-header compact">
          <div>
            <h3>Tín hiệu hệ thống</h3>
            <p>Nhận định tự động từ dữ liệu hiện tại</p>
          </div>
        </div>
        <div class="ard-signal-list">
          ${signals.map((item) => `
            <div class="ard-signal-item ard-tone-${this.escape(item.tone || "blue")}">
              <i class="fa-solid ${this.escape(item.icon || "fa-circle-info")}"></i>
              <span>${this.escape(item.text)}</span>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  },

  bindRoutes(root) {
    root.querySelectorAll("[data-route]").forEach((el) => {
      const route = el.dataset.route;
      if (!route) return;
      el.addEventListener("click", () => {
        if (window.Router && typeof Router.navigate === "function") Router.navigate(route);
        else location.hash = `#${route}`;
      });
    });
  },

  bindDepthEffects(root) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.querySelectorAll("[data-ard-depth]").forEach((el) => {
      el.addEventListener("pointermove", (event) => {
        const rect = el.getBoundingClientRect();
        const power = Number(el.dataset.depthPower || 6);
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        el.style.setProperty("--ard-tilt-x", `${(-y * power).toFixed(2)}deg`);
        el.style.setProperty("--ard-tilt-y", `${(x * power).toFixed(2)}deg`);
        el.style.setProperty("--ard-shine-x", `${((x + 1) * 50).toFixed(0)}%`);
        el.style.setProperty("--ard-shine-y", `${((y + 1) * 50).toFixed(0)}%`);
      });

      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--ard-tilt-x", "0deg");
        el.style.setProperty("--ard-tilt-y", "0deg");
        el.style.setProperty("--ard-shine-x", "50%");
        el.style.setProperty("--ard-shine-y", "50%");
      });
    });
  },

  adminPreset(name) {
    return {
      theme: "purple",
      icon: "fa-shield-halved",
      roleLabel: "Quản trị hệ thống",
      title: "Xin chào",
      name,
      subtitle: "Kiểm soát tài khoản, vai trò, nhật ký hệ thống và các danh mục nền tảng.",
      commandLabel: "Độ ổn định",
      commandValue: "99.8%",
      commandText: "Không ghi nhận lỗi nghiêm trọng trong phiên vận hành gần nhất.",
      metrics: [
        { label: "Tài khoản", value: "842", icon: "fa-users-gear", tone: "blue", trend: "+24 tài khoản mới" },
        { label: "Vai trò", value: "8", icon: "fa-user-shield", tone: "purple", trend: "Phân quyền ổn định" },
        { label: "Truy cập hôm nay", value: "1,254", icon: "fa-eye", tone: "green", trend: "+12% so với hôm qua" },
        { label: "Cảnh báo", value: "0", icon: "fa-bug", tone: "red", trend: "Không có lỗi mới" },
      ],
      visual: {
        title: "Sức khỏe hệ thống",
        subtitle: "Phân bổ hoạt động quản trị trong ngày",
        centerValue: "98%",
        centerLabel: "ổn định",
        data: [
          { label: "Tài khoản", value: 44, tone: "blue" },
          { label: "Vai trò", value: 18, tone: "purple" },
          { label: "Nhật ký", value: 31, tone: "green" },
          { label: "Cảnh báo", value: 7, tone: "orange" },
        ],
      },
      focus: {
        title: "Cần quản trị",
        subtitle: "Ưu tiên kiểm tra trong phiên hôm nay",
        items: [
          { title: "Tài khoản mới", text: "Xác minh quyền truy cập", meta: "12 mục", icon: "fa-user-plus", tone: "blue", route: "/users" },
          { title: "Vai trò hệ thống", text: "Kiểm tra quyền nhạy cảm", meta: "8 vai trò", icon: "fa-key", tone: "purple", route: "/roles" },
          { title: "Nhật ký truy cập", text: "Theo dõi hoạt động bất thường", meta: "1.2k dòng", icon: "fa-list-check", tone: "green", route: "/system-logs" },
        ],
      },
      timeline: {
        items: [
          { time: "08:00", title: "Đồng bộ người dùng", text: "Hoàn tất kiểm tra quyền truy cập" },
          { time: "10:30", title: "Cập nhật danh mục", text: "Thuốc và hoạt động nền tảng ổn định" },
          { time: "15:00", title: "Rà soát log", text: "Không phát hiện đăng nhập bất thường" },
        ],
      },
      actions: [
        { label: "Quản lý tài khoản", text: "Tạo, khóa, phân quyền", icon: "fa-users", tone: "blue", route: "/users" },
        { label: "Quản lý vai trò", text: "Cấu hình quyền", icon: "fa-user-shield", tone: "purple", route: "/roles" },
        { label: "Nhật ký hệ thống", text: "Theo dõi hoạt động", icon: "fa-clock-rotate-left", tone: "green", route: "/system-logs" },
      ],
      signals: [
        { text: "Không có lỗi hệ thống nghiêm trọng.", icon: "fa-circle-check", tone: "green" },
        { text: "Nên rà soát các tài khoản chưa kích hoạt.", icon: "fa-user-clock", tone: "orange" },
      ],
    };
  },

  leaderPreset(name) {
    return {
      theme: "blue",
      icon: "fa-building-shield",
      roleLabel: "Lãnh đạo trung tâm",
      title: "Xin chào",
      name,
      subtitle: "Theo dõi tiếp nhận, điều trị, hoàn thành và các điểm nghẽn cần phê duyệt.",
      commandLabel: "Ưu tiên hôm nay",
      commandValue: "20 hồ sơ",
      commandText: "Tập trung duyệt tiếp nhận và hoàn thành cai nghiện.",
      metrics: [
        { label: "Đang điều trị", value: "245", icon: "fa-user-injured", tone: "blue", trend: "+8 học viên" },
        { label: "Chờ tiếp nhận", value: "12", icon: "fa-clock", tone: "orange", trend: "Cần xử lý", warn: true },
        { label: "Chờ hoàn thành", value: "8", icon: "fa-clipboard-check", tone: "purple", trend: "Đề xuất mới" },
        { label: "Đã hoàn thành", value: "156", icon: "fa-circle-check", tone: "green", trend: "+6 tháng này" },
      ],
      visual: {
        title: "Cấu trúc điều trị",
        subtitle: "Tỷ trọng học viên theo giai đoạn",
        centerValue: "245",
        centerLabel: "đang điều trị",
        data: [
          { label: "Cắt cơn", value: 45, tone: "red" },
          { label: "Phục hồi", value: 120, tone: "orange" },
          { label: "Lao động trị liệu", value: 80, tone: "blue" },
        ],
      },
      focus: {
        title: "Hồ sơ cần lãnh đạo xem xét",
        subtitle: "Các luồng nghiệp vụ có tác động lớn",
        items: [
          { title: "Duyệt tiếp nhận", text: "Hồ sơ bàn giao từ công an/người thân", meta: "12 hồ sơ", icon: "fa-user-check", tone: "orange", route: "/approvals-receive" },
          { title: "Duyệt hoàn thành", text: "Đề xuất kết thúc chương trình", meta: "8 đề xuất", icon: "fa-circle-check", tone: "green", route: "/approvals-complete" },
          { title: "Báo cáo tổng quan", text: "Xem xu hướng toàn trung tâm", meta: "Realtime", icon: "fa-chart-line", tone: "blue", route: "/reports" },
        ],
      },
      timeline: {
        items: [
          { time: "09:00", title: "Giao ban tiếp nhận", text: "Rà soát 6 hồ sơ ưu tiên" },
          { time: "11:00", title: "Duyệt hoàn thành", text: "Kiểm tra đề xuất từ bác sĩ" },
          { time: "16:00", title: "Tổng hợp báo cáo", text: "Chốt số liệu trong ngày" },
        ],
      },
      actions: [
        { label: "Duyệt tiếp nhận", text: "Xem hồ sơ chờ duyệt", icon: "fa-user-check", tone: "orange", route: "/approvals-receive" },
        { label: "Duyệt hoàn thành", text: "Chốt chương trình", icon: "fa-circle-check", tone: "green", route: "/approvals-complete" },
        { label: "Báo cáo", text: "Tổng quan trung tâm", icon: "fa-chart-line", tone: "blue", route: "/reports" },
      ],
      signals: [
        { text: "Hàng chờ tiếp nhận tăng nhẹ, cần ưu tiên xử lý buổi sáng.", icon: "fa-triangle-exclamation", tone: "orange" },
        { text: "Tỷ lệ hoàn thành chương trình đang ổn định.", icon: "fa-arrow-trend-up", tone: "green" },
      ],
    };
  },

  managerPreset(name) {
    return {
      theme: "green",
      icon: "fa-people-arrows",
      roleLabel: "Cán bộ quản lý",
      title: "Xin chào",
      name,
      subtitle: "Điều phối phác đồ, phân công phụ trách và kiểm soát chuyển giai đoạn.",
      commandLabel: "Điểm nghẽn",
      commandValue: "6 phác đồ",
      commandText: "Các phác đồ chờ duyệt cần được xử lý trong ngày.",
      metrics: [
        { label: "Phác đồ", value: "48", icon: "fa-file-medical", tone: "blue", trend: "Đang quản lý" },
        { label: "Chờ duyệt", value: "6", icon: "fa-hourglass-half", tone: "orange", trend: "Ưu tiên cao", warn: true },
        { label: "Đã phân công", value: "36", icon: "fa-user-doctor", tone: "green", trend: "+5 phân công" },
        { label: "Chuyển giai đoạn", value: "9", icon: "fa-forward-step", tone: "purple", trend: "Đang theo dõi" },
      ],
      visual: {
        title: "Tình trạng phác đồ",
        subtitle: "Luồng xử lý phác đồ điều trị",
        centerValue: "48",
        centerLabel: "phác đồ",
        data: [
          { label: "Chờ duyệt", value: 6, tone: "orange" },
          { label: "Đã duyệt", value: 24, tone: "green" },
          { label: "Đang áp dụng", value: 14, tone: "blue" },
          { label: "Từ chối", value: 4, tone: "red" },
        ],
      },
      focus: {
        title: "Điều phối cần xử lý",
        subtitle: "Các tác vụ ảnh hưởng trực tiếp đến điều trị",
        items: [
          { title: "Phê duyệt phác đồ", text: "Kiểm tra đề xuất bác sĩ", meta: "6 chờ", icon: "fa-stamp", tone: "orange", route: "/treatment-approval" },
          { title: "Phân công phụ trách", text: "Gắn bác sĩ/cán bộ theo hồ sơ", meta: "5 hồ sơ", icon: "fa-user-pen", tone: "green", route: "/assignment" },
          { title: "Duyệt chuyển giai đoạn", text: "Đảm bảo đúng điều kiện lâm sàng", meta: "9 đề xuất", icon: "fa-forward-step", tone: "purple", route: "/stage-approval" },
        ],
      },
      timeline: {
        items: [
          { time: "08:30", title: "Rà phác đồ mới", text: "Đối chiếu chẩn đoán và chỉ định" },
          { time: "13:30", title: "Phân công ca chiều", text: "Điều phối bác sĩ và cán bộ" },
          { time: "16:30", title: "Chốt chuyển giai đoạn", text: "Tổng hợp đề xuất đủ điều kiện" },
        ],
      },
      actions: [
        { label: "Duyệt phác đồ", text: "Phác đồ chờ xét", icon: "fa-stamp", tone: "orange", route: "/treatment-approval" },
        { label: "Phân công", text: "Bác sĩ/cán bộ", icon: "fa-user-pen", tone: "green", route: "/assignment" },
        { label: "Báo cáo", text: "Hiệu suất quản lý", icon: "fa-chart-simple", tone: "blue", route: "/manager-reports" },
      ],
      signals: [
        { text: "Phác đồ chờ duyệt cần xử lý trước 16:30.", icon: "fa-clock", tone: "orange" },
        { text: "Tỷ lệ phân công đang tốt, không có hồ sơ quá hạn.", icon: "fa-circle-check", tone: "green" },
      ],
    };
  },

  doctorPreset(name) {
    return {
      theme: "cyan",
      icon: "fa-stethoscope",
      roleLabel: "Bác sĩ điều trị",
      title: "Xin chào",
      name,
      subtitle: "Theo dõi hồ sơ bệnh án, cập nhật chỉ số lâm sàng và tư vấn điều trị.",
      commandLabel: "Cần cập nhật",
      commandValue: "2 hồ sơ",
      commandText: "Ưu tiên hồ sơ quá 7 ngày chưa cập nhật.",
      metrics: [
        { label: "Bệnh án", value: "42", icon: "fa-file-medical", tone: "blue", trend: "+4 hồ sơ" },
        { label: "Đã cập nhật", value: "36", icon: "fa-circle-check", tone: "green", trend: "86% hoàn tất" },
        { label: "Cần cập nhật", value: "6", icon: "fa-clock", tone: "orange", trend: "Theo dõi hôm nay", warn: true },
        { label: "Cân nặng TB", value: "63.8kg", icon: "fa-weight-scale", tone: "purple", trend: "+1.2kg" },
      ],
      visual: {
        title: "Nhịp cập nhật bệnh án",
        subtitle: "Tình trạng hồ sơ trong tuần",
        centerValue: "86%",
        centerLabel: "đúng hạn",
        data: [
          { label: "Đúng hạn", value: 36, tone: "green" },
          { label: "Cần cập nhật", value: 6, tone: "orange" },
          { label: "Theo dõi sát", value: 4, tone: "red" },
        ],
      },
      focus: {
        title: "Hồ sơ ưu tiên",
        subtitle: "Các nghiệp vụ lâm sàng cần mở nhanh",
        items: [
          { title: "Cập nhật bệnh án", text: "Chỉ số, triệu chứng, ghi chú", meta: "6 hồ sơ", icon: "fa-notes-medical", tone: "orange", route: "/medical-records" },
          { title: "Tạo phác đồ", text: "Chuẩn bị kế hoạch điều trị", meta: "Mới", icon: "fa-file-prescription", tone: "blue", route: "/treatment-plan-create" },
          { title: "Đề xuất hoàn thành", text: "Học viên đủ điều kiện", meta: "3 hồ sơ", icon: "fa-award", tone: "green", route: "/completion-proposal" },
        ],
      },
      timeline: {
        items: [
          { time: "07:45", title: "Khám buổi sáng", text: "Theo dõi dấu hiệu sinh tồn" },
          { time: "10:00", title: "Tư vấn cá nhân", text: "Lịch tư vấn phục hồi hành vi" },
          { time: "14:00", title: "Cập nhật bệnh án", text: "Hoàn thiện ghi nhận lâm sàng" },
        ],
      },
      actions: [
        { label: "Bệnh án", text: "Cập nhật hồ sơ", icon: "fa-file-medical", tone: "blue", route: "/medical-records" },
        { label: "Lịch thuốc", text: "Theo dõi dùng thuốc", icon: "fa-pills", tone: "purple", route: "/medicine-schedule" },
        { label: "Nhật ký điều trị", text: "Ghi nhận tiến triển", icon: "fa-book-medical", tone: "green", route: "/treatment-diary" },
      ],
      signals: [
        { text: "Có 2 hồ sơ cần cập nhật chỉ số trước cuối ngày.", icon: "fa-triangle-exclamation", tone: "orange" },
        { text: "Nhóm phục hồi có tiến triển cân nặng tích cực.", icon: "fa-arrow-trend-up", tone: "green" },
      ],
    };
  },

  staffPreset(name) {
    return {
      theme: "orange",
      icon: "fa-clipboard-list",
      roleLabel: "Cán bộ trung tâm",
      title: "Xin chào",
      name,
      subtitle: "Điều phối tiếp nhận, thăm gặp, sinh hoạt và điểm danh trong ngày.",
      commandLabel: "Ca vận hành",
      commandValue: "Ca sáng",
      commandText: "Các hoạt động tiếp nhận và thăm gặp cần theo dõi sát.",
      metrics: [
        { label: "Chờ tiếp nhận", value: "17", icon: "fa-file-import", tone: "orange", trend: "Ưu tiên cao", warn: true },
        { label: "Đang điều trị", value: "126", icon: "fa-users", tone: "blue", trend: "Ổn định" },
        { label: "Thăm gặp chờ duyệt", value: "5", icon: "fa-calendar-check", tone: "purple", trend: "Cần duyệt" },
        { label: "Lịch hôm nay", value: "3", icon: "fa-clipboard-list", tone: "green", trend: "Đúng tiến độ" },
      ],
      visual: {
        title: "Phân bổ công việc",
        subtitle: "Tác vụ vận hành trong ngày",
        centerValue: "31",
        centerLabel: "việc",
        data: [
          { label: "Tiếp nhận", value: 17, tone: "orange" },
          { label: "Thăm gặp", value: 5, tone: "purple" },
          { label: "Sinh hoạt", value: 3, tone: "green" },
          { label: "Điểm danh", value: 6, tone: "blue" },
        ],
      },
      focus: {
        title: "Việc cần xử lý",
        subtitle: "Tác vụ ảnh hưởng trực tiếp đến vận hành",
        items: [
          { title: "Xác nhận tiếp nhận", text: "Hồ sơ đã được lãnh đạo duyệt", meta: "17 hồ sơ", icon: "fa-file-import", tone: "orange", route: "/receive" },
          { title: "Duyệt thăm gặp", text: "Xếp lịch và kiểm tra điều kiện", meta: "5 phiếu", icon: "fa-calendar-check", tone: "purple", route: "/visits" },
          { title: "Điểm danh", text: "Ghi nhận sinh hoạt trong ngày", meta: "3 lịch", icon: "fa-user-check", tone: "blue", route: "/attendance" },
        ],
      },
      timeline: {
        items: [
          { time: "08:00", title: "Tiếp nhận hồ sơ", text: "Kiểm tra danh sách đã duyệt" },
          { time: "10:00", title: "Thăm gặp", text: "Duyệt phiếu và chuẩn bị phòng" },
          { time: "14:00", title: "Điểm danh sinh hoạt", text: "Ghi nhận tham gia hoạt động" },
        ],
      },
      actions: [
        { label: "Tiếp nhận", text: "Xác nhận hồ sơ", icon: "fa-file-import", tone: "orange", route: "/receive" },
        { label: "Học viên", text: "Quản lý danh sách", icon: "fa-users", tone: "blue", route: "/patients" },
        { label: "Lịch sinh hoạt", text: "Tạo và theo dõi", icon: "fa-calendar-days", tone: "green", route: "/activities" },
      ],
      signals: [
        { text: "Hồ sơ tiếp nhận đang là điểm nghẽn lớn nhất trong ca.", icon: "fa-triangle-exclamation", tone: "orange" },
        { text: "Lịch sinh hoạt hôm nay đã có đủ cán bộ phụ trách.", icon: "fa-circle-check", tone: "green" },
      ],
    };
  },

  familyPreset(name) {
    return {
      theme: "green",
      icon: "fa-hands-holding-heart",
      roleLabel: "Người thân",
      title: "Xin chào",
      name,
      subtitle: "Theo dõi lộ trình phục hồi, đăng ký thăm gặp và gửi yêu cầu hỗ trợ.",
      commandLabel: "Lộ trình",
      commandValue: "Đang phục hồi",
      commandText: "Thông tin được cập nhật từ hồ sơ điều trị của trung tâm.",
      metrics: [
        { label: "Đơn tự nguyện", value: "1", icon: "fa-file-signature", tone: "blue", trend: "Đang theo dõi" },
        { label: "Lịch thăm gặp", value: "2", icon: "fa-calendar-check", tone: "green", trend: "1 lịch sắp tới" },
        { label: "Yêu cầu hỗ trợ", value: "1", icon: "fa-headset", tone: "orange", trend: "Đang phản hồi" },
        { label: "Tiến độ phục hồi", value: "68%", icon: "fa-road", tone: "purple", trend: "+8% tháng này" },
      ],
      visual: {
        title: "Lộ trình phục hồi",
        subtitle: "Các mốc gia đình cần theo dõi",
        centerValue: "68%",
        centerLabel: "tiến độ",
        data: [
          { label: "Ổn định", value: 42, tone: "green" },
          { label: "Tư vấn", value: 18, tone: "blue" },
          { label: "Tái hòa nhập", value: 8, tone: "purple" },
        ],
      },
      focus: {
        title: "Việc gia đình có thể làm",
        subtitle: "Các thao tác hỗ trợ người cai nghiện",
        items: [
          { title: "Đăng ký thăm gặp", text: "Chọn ngày và người đi cùng", meta: "Mở", icon: "fa-calendar-plus", tone: "green", route: "/visit-register" },
          { title: "Xem lộ trình", text: "Theo dõi tiến trình phục hồi", meta: "68%", icon: "fa-route", tone: "purple", route: "/treatment-path" },
          { title: "Gửi hỗ trợ", text: "Trao đổi với trung tâm", meta: "Nhanh", icon: "fa-headset", tone: "orange", route: "/support" },
        ],
      },
      timeline: {
        items: [
          { time: "Tuần 1", title: "Cập nhật hồ sơ", text: "Hoàn thiện thông tin người thân" },
          { time: "Tuần 2", title: "Thăm gặp định kỳ", text: "Đặt lịch và chờ xác nhận" },
          { time: "Tuần 4", title: "Đánh giá phục hồi", text: "Theo dõi phản hồi từ bác sĩ" },
        ],
      },
      actions: [
        { label: "Đăng ký cai nghiện", text: "Tạo hồ sơ tự nguyện", icon: "fa-file-circle-plus", tone: "blue", route: "/register-rehab" },
        { label: "Đăng ký thăm", text: "Chọn ca thăm gặp", icon: "fa-calendar-plus", tone: "green", route: "/visit-register" },
        { label: "Yêu cầu hỗ trợ", text: "Gửi phản hồi", icon: "fa-headset", tone: "orange", route: "/support" },
      ],
      signals: [
        { text: "Lộ trình phục hồi đang tiến triển tích cực.", icon: "fa-heart-circle-check", tone: "green" },
        { text: "Nên đặt lịch thăm gặp trước ít nhất 48 giờ.", icon: "fa-clock", tone: "orange" },
      ],
    };
  },

  policePreset(name) {
    return {
      theme: "blue",
      icon: "fa-shield",
      roleLabel: "Cơ quan công an",
      title: "Xin chào",
      name,
      subtitle: "Lập hồ sơ bàn giao, theo dõi trạng thái tiếp nhận và lịch sử xử lý.",
      commandLabel: "Hồ sơ bàn giao",
      commandValue: "6 chờ xử lý",
      commandText: "Theo dõi phản hồi từ trung tâm để hoàn tất bàn giao.",
      metrics: [
        { label: "Đã gửi", value: "42", icon: "fa-paper-plane", tone: "blue", trend: "+5 tuần này" },
        { label: "Chờ duyệt", value: "6", icon: "fa-clock", tone: "orange", trend: "Đang theo dõi", warn: true },
        { label: "Đã tiếp nhận", value: "34", icon: "fa-circle-check", tone: "green", trend: "Ổn định" },
        { label: "Cần bổ sung", value: "2", icon: "fa-file-circle-exclamation", tone: "red", trend: "Cần xử lý" },
      ],
      visual: {
        title: "Trạng thái bàn giao",
        subtitle: "Theo dõi hồ sơ đã gửi tới trung tâm",
        centerValue: "42",
        centerLabel: "hồ sơ",
        data: [
          { label: "Chờ duyệt", value: 6, tone: "orange" },
          { label: "Đã tiếp nhận", value: 34, tone: "green" },
          { label: "Bổ sung", value: 2, tone: "red" },
        ],
      },
      focus: {
        title: "Nghiệp vụ bàn giao",
        subtitle: "Các tác vụ công an cần hoàn tất",
        items: [
          { title: "Gửi hồ sơ", text: "Lập hồ sơ bàn giao mới", meta: "Mới", icon: "fa-file-circle-plus", tone: "blue", route: "/transfer" },
          { title: "Danh sách bàn giao", text: "Theo dõi trạng thái xử lý", meta: "42 hồ sơ", icon: "fa-folder-open", tone: "green", route: "/transfer-list" },
          { title: "Cần bổ sung", text: "Hồ sơ bị yêu cầu chỉnh sửa", meta: "2 hồ sơ", icon: "fa-file-circle-exclamation", tone: "red", route: "/transfer-list" },
        ],
      },
      timeline: {
        items: [
          { time: "08:00", title: "Tạo hồ sơ mới", text: "Bổ sung quyết định và giấy tờ liên quan" },
          { time: "10:30", title: "Gửi trung tâm", text: "Chuyển hồ sơ sang hàng chờ duyệt" },
          { time: "15:30", title: "Theo dõi phản hồi", text: "Xử lý yêu cầu bổ sung nếu có" },
        ],
      },
      actions: [
        { label: "Gửi hồ sơ", text: "Tạo bàn giao", icon: "fa-file-arrow-up", tone: "blue", route: "/transfer" },
        { label: "Danh sách", text: "Theo dõi trạng thái", icon: "fa-folder-open", tone: "green", route: "/transfer-list" },
        { label: "Lịch sử", text: "Tra cứu bàn giao", icon: "fa-clock-rotate-left", tone: "purple", route: "/handover-history" },
      ],
      signals: [
        { text: "Có 2 hồ sơ cần bổ sung giấy tờ trước khi trung tâm tiếp nhận.", icon: "fa-triangle-exclamation", tone: "red" },
        { text: "Tỷ lệ tiếp nhận hồ sơ tuần này đạt mức tốt.", icon: "fa-circle-check", tone: "green" },
      ],
    };
  },

  commonPreset(name) {
    return {
      theme: "blue",
      icon: "fa-house",
      roleLabel: "Tổng quan",
      title: "Xin chào",
      name,
      subtitle: "Chọn nghiệp vụ phù hợp với vai trò của bạn trong hệ thống.",
      commandLabel: "Trạng thái",
      commandValue: "Sẵn sàng",
      commandText: "Hệ thống đã nạp các module chính.",
      metrics: [
        { label: "Thông báo", value: "3", icon: "fa-bell", tone: "orange", trend: "Cần đọc" },
        { label: "Hồ sơ", value: "12", icon: "fa-folder", tone: "blue", trend: "Đang theo dõi" },
        { label: "Tác vụ", value: "6", icon: "fa-list-check", tone: "green", trend: "Trong ngày" },
        { label: "Hỗ trợ", value: "1", icon: "fa-headset", tone: "purple", trend: "Đang mở" },
      ],
      visual: {
        title: "Hoạt động chung",
        centerValue: "22",
        centerLabel: "mục",
        data: [
          { label: "Thông báo", value: 3, tone: "orange" },
          { label: "Hồ sơ", value: 12, tone: "blue" },
          { label: "Tác vụ", value: 6, tone: "green" },
        ],
      },
      focus: { items: [] },
      timeline: { items: [] },
      actions: [],
      signals: [],
    };
  },

  escape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },
};

window.AdvancedRoleDashboard = AdvancedRoleDashboard;
