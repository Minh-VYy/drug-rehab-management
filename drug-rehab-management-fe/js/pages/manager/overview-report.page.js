window.OverviewReportPage = (function () {
  const ENDPOINT_SUMMARY = "/manager/reports/summary";
  const ENDPOINT_BY_STAGE = "/manager/reports/by-stage";
  const ENDPOINT_BY_MANAGER = "/manager/reports/by-manager";

  const STAGE_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"];

  const MOCK_SUMMARY = {
    dangDieuTri: 128,
    daHoanThanhThang: 12,
    dangChoPheDuyet: 6,
    tyLeDuyetThanhCong: 87,
    tangTruongDieuTri: 8,
    tangTruongHoanThanh: 4,
    mucTieuDuyet: 85,
  };

  const MOCK_BY_STAGE = [
    { giaiDoan: "Giai đoạn 1 - Cắt cơn", soLuong: 42, moTa: "Theo dõi y tế sát" },
    { giaiDoan: "Giai đoạn 2 - Phục hồi", soLuong: 56, moTa: "Điều trị tâm lý và hành vi" },
    { giaiDoan: "Giai đoạn 3 - Tái hòa nhập", soLuong: 30, moTa: "Chuẩn bị hòa nhập cộng đồng" },
  ];

  const MOCK_BY_MANAGER = [
    { tenCanBo: "QL. Phạm Thị Phương", daDuyet: 18, tuChoi: 3, choXuLy: 2 },
    { tenCanBo: "QL. Đỗ Văn Quang", daDuyet: 11, tuChoi: 1, choXuLy: 1 },
    { tenCanBo: "QL. Nguyễn Minh Hạnh", daDuyet: 15, tuChoi: 2, choXuLy: 4 },
  ];

  const MOCK_MONTHLY_TREND = [
    { label: "T1", value: 18 },
    { label: "T2", value: 22 },
    { label: "T3", value: 19 },
    { label: "T4", value: 27 },
    { label: "T5", value: 31 },
    { label: "T6", value: 36 },
  ];

  let summary = {};
  let byStage = [];
  let byManager = [];
  let monthlyTrend = [];
  let usingFallback = false;
  let currentSearch = "";
  let currentPeriod = "month";

  function extractList(res) {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.items)) return res.items;
    return [];
  }

  function extractObject(res) {
    if (res && res.data && typeof res.data === "object" && !Array.isArray(res.data)) return res.data;
    if (res && typeof res === "object" && !Array.isArray(res)) return res;
    return null;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getEl(id) {
    return document.getElementById(id);
  }

  function getNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  function getInitials(name) {
    const cleanName = String(name || "").replace(/^QL\.\s*/i, "").trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (!parts.length) return "QL";
    return parts.slice(-2).map((part) => part.charAt(0).toUpperCase()).join("");
  }

  function getManagerTotals(list = byManager) {
    return list.reduce(
      (acc, item) => {
        acc.daDuyet += getNumber(item.daDuyet);
        acc.tuChoi += getNumber(item.tuChoi);
        acc.choXuLy += getNumber(item.choXuLy);
        return acc;
      },
      { daDuyet: 0, tuChoi: 0, choXuLy: 0 }
    );
  }

  function getManagerTotal(item) {
    return getNumber(item.daDuyet) + getNumber(item.tuChoi) + getNumber(item.choXuLy);
  }

  function getManagerScore(item) {
    const total = getManagerTotal(item);
    if (!total) return 0;
    return Math.round((getNumber(item.daDuyet) / total) * 100);
  }

  function showLoading(show) {
    const loadingEl = getEl("reportLoadingState");
    if (loadingEl) loadingEl.style.display = show ? "flex" : "none";
  }

  function showToast(message, type = "success") {
    if (window.Toast && Toast.show) Toast.show(message, type);
  }

  function showFallbackNotice() {
    showToast("Chưa có API báo cáo quản lý, đang hiển thị dữ liệu mẫu để demo giao diện.", "error");
  }

  function getFilteredManagers() {
    const keyword = currentSearch.trim().toLowerCase();
    if (!keyword) return byManager;
    return byManager.filter((item) => String(item.tenCanBo || "").toLowerCase().includes(keyword));
  }

  function setText(id, value) {
    const el = getEl(id);
    if (el) el.textContent = value;
  }

  function fetchReport() {
    showLoading(true);

    const apiReady = window.Api && typeof Api.get === "function";
    const request = apiReady
      ? Promise.all([
          Api.get(ENDPOINT_SUMMARY).catch(() => null),
          Api.get(ENDPOINT_BY_STAGE).catch(() => null),
          Api.get(ENDPOINT_BY_MANAGER).catch(() => null),
        ])
      : Promise.reject(new Error("Api helper chưa sẵn sàng"));

    return request
      .then(([resSummary, resStage, resManager]) => {
        const nextSummary = extractObject(resSummary);
        const nextStage = extractList(resStage);
        const nextManager = extractList(resManager);

        if (!nextSummary || !nextStage.length || !nextManager.length) {
          throw new Error("Thiếu dữ liệu báo cáo từ API");
        }

        summary = nextSummary;
        byStage = nextStage;
        byManager = nextManager;
        monthlyTrend = Array.isArray(nextSummary.monthlyTrend) ? nextSummary.monthlyTrend : MOCK_MONTHLY_TREND;
        usingFallback = false;
      })
      .catch((err) => {
        console.warn("Chưa có đủ API báo cáo quản lý, dùng mock fallback:", err);
        summary = JSON.parse(JSON.stringify(MOCK_SUMMARY));
        byStage = JSON.parse(JSON.stringify(MOCK_BY_STAGE));
        byManager = JSON.parse(JSON.stringify(MOCK_BY_MANAGER));
        monthlyTrend = JSON.parse(JSON.stringify(MOCK_MONTHLY_TREND));
        usingFallback = true;
        showFallbackNotice();
      })
      .finally(() => {
        showLoading(false);
        renderAll();
      });
  }

  function renderAll() {
    renderSummary();
    renderStageAnalytics();
    renderPipeline();
    renderMonthlyTrend();
    renderManagerCards();
    renderManagerTable();
  }

  function renderSummary() {
    const total = getNumber(summary.dangDieuTri);
    const completed = getNumber(summary.daHoanThanhThang);
    const pending = getNumber(summary.dangChoPheDuyet);
    const rate = getNumber(summary.tyLeDuyetThanhCong);
    const growth = getNumber(summary.tangTruongDieuTri);
    const completedGrowth = getNumber(summary.tangTruongHoanThanh);
    const target = getNumber(summary.mucTieuDuyet) || 85;

    setText("statReportTotal", total);
    setText("statReportCompleted", completed);
    setText("statReportPending", pending);
    setText("statReportRate", `${rate}%`);
    setText("statReportTotalTrend", `${growth >= 0 ? "+" : ""}${growth} học viên so với kỳ trước`);
    setText("statReportCompletedTrend", `${completedGrowth >= 0 ? "+" : ""}${completedGrowth} hồ sơ hoàn thành`);
    setText("statReportPendingTrend", pending > 5 ? "Cần ưu tiên xử lý" : "Trong ngưỡng kiểm soát");
    setText("statReportRateTrend", rate >= target ? `Vượt mục tiêu ${target}%` : `Còn thiếu ${target - rate}% so với mục tiêu`);
    setText("reportUpdatedAt", new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
    setText("reportDataSource", usingFallback ? "Dữ liệu mẫu" : "Backend API");
    setText("reportInsightText", pending > 5 ? "Có điểm nghẽn ở hàng chờ phê duyệt" : "Luồng phê duyệt đang ổn định");
  }

  function renderStageAnalytics() {
    const total = byStage.reduce((sum, item) => sum + getNumber(item.soLuong), 0) || 1;
    const donut = getEl("reportStageDonut");
    const listEl = getEl("reportStageTableBody");

    setText("reportStageTotal", total);

    if (donut) {
      let cursor = 0;
      const stops = byStage.map((item, index) => {
        const percent = (getNumber(item.soLuong) / total) * 100;
        const start = cursor;
        cursor += percent;
        const color = STAGE_COLORS[index % STAGE_COLORS.length];
        return `${color} ${start}% ${cursor}%`;
      });
      donut.style.background = `conic-gradient(${stops.join(", ")})`;
    }

    const largest = byStage.slice().sort((a, b) => getNumber(b.soLuong) - getNumber(a.soLuong))[0];
    setText(
      "reportStageSummary",
      largest ? `${largest.giaiDoan} đang chiếm tỷ trọng cao nhất trong kỳ.` : "Chưa có dữ liệu giai đoạn."
    );

    if (!listEl) return;
    listEl.innerHTML = byStage
      .map((item, index) => {
        const value = getNumber(item.soLuong);
        const percent = Math.round((value / total) * 100);
        const color = STAGE_COLORS[index % STAGE_COLORS.length];
        return `
          <div class="manager-report-stage-item">
            <div class="manager-report-stage-meta">
              <span class="manager-report-stage-dot" style="background:${color}"></span>
              <div>
                <strong>${escapeHtml(item.giaiDoan)}</strong>
                <small>${escapeHtml(item.moTa || "Đang theo dõi tiến độ")}</small>
              </div>
            </div>
            <div class="manager-report-stage-value">
              <strong>${value}</strong>
              <span>${percent}%</span>
            </div>
            <div class="manager-report-progress">
              <span style="width:${percent}%; background:${color}"></span>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderPipeline() {
    const totals = getManagerTotals();
    const processed = totals.daDuyet + totals.tuChoi + totals.choXuLy || 1;
    const approvedPercent = Math.round((totals.daDuyet / processed) * 100);
    const rejectedPercent = Math.round((totals.tuChoi / processed) * 100);
    const pendingPercent = Math.max(0, 100 - approvedPercent - rejectedPercent);
    const summaryEl = getEl("reportPipelineSummary");
    const barsEl = getEl("reportPipelineBars");

    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="manager-report-pipeline-item is-approved">
          <span>Đã duyệt</span>
          <strong>${totals.daDuyet}</strong>
        </div>
        <div class="manager-report-pipeline-item is-rejected">
          <span>Từ chối</span>
          <strong>${totals.tuChoi}</strong>
        </div>
        <div class="manager-report-pipeline-item is-pending">
          <span>Chờ xử lý</span>
          <strong>${totals.choXuLy}</strong>
        </div>
      `;
    }

    if (barsEl) {
      barsEl.innerHTML = `
        <span class="is-approved" style="width:${approvedPercent}%"></span>
        <span class="is-rejected" style="width:${rejectedPercent}%"></span>
        <span class="is-pending" style="width:${pendingPercent}%"></span>
      `;
    }
  }

  function renderMonthlyTrend() {
    const trendEl = getEl("reportMonthlyTrend");
    if (!trendEl) return;
    const maxValue = monthlyTrend.reduce((max, item) => Math.max(max, getNumber(item.value)), 1);

    trendEl.innerHTML = monthlyTrend
      .map((item) => {
        const height = Math.max(16, Math.round((getNumber(item.value) / maxValue) * 100));
        return `
          <div class="manager-report-trend-col">
            <span class="manager-report-trend-value">${getNumber(item.value)}</span>
            <div class="manager-report-trend-bar" style="height:${height}%"></div>
            <small>${escapeHtml(item.label)}</small>
          </div>
        `;
      })
      .join("");
  }

  function renderManagerCards() {
    const container = getEl("reportManagerCards");
    if (!container) return;

    const topManagers = getFilteredManagers()
      .slice()
      .sort((a, b) => getManagerScore(b) - getManagerScore(a))
      .slice(0, 3);

    container.innerHTML = topManagers
      .map((item, index) => {
        const total = getManagerTotal(item);
        const score = getManagerScore(item);
        return `
          <article class="manager-report-person-card">
            <div class="manager-report-rank">#${index + 1}</div>
            <div class="manager-report-avatar">${escapeHtml(getInitials(item.tenCanBo))}</div>
            <div class="manager-report-person-main">
              <strong>${escapeHtml(item.tenCanBo)}</strong>
              <span>${total} đề xuất đã xử lý</span>
            </div>
            <div class="manager-report-person-score">
              <strong>${score}%</strong>
              <span>hiệu suất</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderManagerTable() {
    const tbody = getEl("reportManagerTableBody");
    if (!tbody) return;

    const data = getFilteredManagers();
    if (!data.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="manager-report-empty">Không tìm thấy cán bộ phù hợp.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data
      .map((item) => {
        const total = getManagerTotal(item);
        const score = getManagerScore(item);
        return `
          <tr>
            <td>
              <div class="manager-report-person-cell">
                <span class="manager-report-avatar mini">${escapeHtml(getInitials(item.tenCanBo))}</span>
                <div>
                  <strong>${escapeHtml(item.tenCanBo)}</strong>
                  <small>Cán bộ quản lý</small>
                </div>
              </div>
            </td>
            <td><span class="manager-report-count is-approved">${getNumber(item.daDuyet)}</span></td>
            <td><span class="manager-report-count is-rejected">${getNumber(item.tuChoi)}</span></td>
            <td><span class="manager-report-count is-pending">${getNumber(item.choXuLy)}</span></td>
            <td><strong>${total}</strong></td>
            <td>
              <div class="manager-report-score-bar">
                <span style="width:${score}%"></span>
              </div>
              <small>${score}% duyệt thành công</small>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function bindEvents() {
    const searchInput = getEl("reportSearchInput");
    const timeFilter = getEl("reportTimeFilter");
    const refreshBtn = getEl("reportRefreshBtn");
    const exportBtn = getEl("reportExportBtn");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentSearch = e.target.value;
        renderManagerCards();
        renderManagerTable();
      });
    }

    if (timeFilter) {
      timeFilter.addEventListener("change", (e) => {
        currentPeriod = e.target.value;
        renderAll();
        showToast("Đã đổi kỳ báo cáo. Dữ liệu API thật sẽ được gắn ở bước sau.");
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        fetchReport();
        showToast("Đã làm mới báo cáo.");
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        showToast("Chức năng xuất báo cáo đang dùng mock UI, sẽ nối API/tải file sau.");
      });
    }
  }

  function init() {
    currentSearch = "";
    currentPeriod = "month";
    bindEvents();
    fetchReport();
  }

  async function render(containerId) {
    const success = await ViewLoader.load("views/manager/overview-report.html", containerId);
    if (success) this.init();
  }

  return { render, init, bindEvents };
})();
