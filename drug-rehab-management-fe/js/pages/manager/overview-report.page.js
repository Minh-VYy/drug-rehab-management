window.OverviewReportPage = (function () {
  // ====== ENDPOINTS ======
  const ENDPOINT_SUMMARY = "/manager/reports/summary";
  const ENDPOINT_BY_STAGE = "/manager/reports/by-stage";
  const ENDPOINT_BY_MANAGER = "/manager/reports/by-manager";

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

  // ====== MOCK FALLBACK ======
  const MOCK_SUMMARY = {
    dangDieuTri: 128,
    daHoanThanhThang: 12,
    dangChoPheDuyet: 6,
    tyLeDuyetThanhCong: 87,
  };

  const MOCK_BY_STAGE = [
    { giaiDoan: "Giai đoạn 1 - Cắt cơn", soLuong: 42 },
    { giaiDoan: "Giai đoạn 2 - Phục hồi", soLuong: 56 },
    { giaiDoan: "Giai đoạn 3 - Tái hòa nhập", soLuong: 30 },
  ];

  const MOCK_BY_MANAGER = [
    { tenCanBo: "QL. Phạm Thị Phương", daDuyet: 18, tuChoi: 3, choXuLy: 2 },
    { tenCanBo: "QL. Đỗ Văn Quang", daDuyet: 11, tuChoi: 1, choXuLy: 1 },
  ];

  // ====== STATE ======
  let summary = {};
  let byStage = [];
  let byManager = [];
  let usingFallback = false;
  let currentSearch = "";

  // ====== HELPERS ======
  function showLoading(show) {
    const loadingEl = document.getElementById("reportLoadingState");
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
  }

  function showFallbackNotice() {
    if (window.Toast && Toast.show) {
      Toast.show("Chưa có API báo cáo quản lý, đang hiển thị dữ liệu mẫu để demo giao diện.", "error");
    }
  }

  function getFilteredManagers() {
    const keyword = currentSearch.trim().toLowerCase();
    if (!keyword) return byManager;
    return byManager.filter((m) => m.tenCanBo.toLowerCase().includes(keyword));
  }

  // ====== GỌI API (fallback mock khi lỗi) ======
  function fetchReport() {
    showLoading(true);

    return Promise.all([
      Api.get(ENDPOINT_SUMMARY).catch(() => null),
      Api.get(ENDPOINT_BY_STAGE).catch(() => null),
      Api.get(ENDPOINT_BY_MANAGER).catch(() => null),
    ])
      .then(([resSummary, resStage, resManager]) => {
        const sum = extractObject(resSummary);
        const stageList = extractList(resStage);
        const managerList = extractList(resManager);

        if (sum && stageList.length && managerList.length) {
          summary = sum;
          byStage = stageList;
          byManager = managerList;
          usingFallback = false;
        } else {
          throw new Error("Thiếu dữ liệu báo cáo từ API");
        }
      })
      .catch((err) => {
        console.warn("Chưa có đủ API báo cáo quản lý, dùng mock fallback:", err);
        summary = JSON.parse(JSON.stringify(MOCK_SUMMARY));
        byStage = JSON.parse(JSON.stringify(MOCK_BY_STAGE));
        byManager = JSON.parse(JSON.stringify(MOCK_BY_MANAGER));
        usingFallback = true;
        showFallbackNotice();
      })
      .finally(() => {
        showLoading(false);
        renderSummary();
        renderStageTable();
        renderManagerTable();
      });
  }

  // ====== RENDER ======
  function renderSummary() {
    document.getElementById("statReportTotal").textContent = summary.dangDieuTri ?? 0;
    document.getElementById("statReportCompleted").textContent = summary.daHoanThanhThang ?? 0;
    document.getElementById("statReportPending").textContent = summary.dangChoPheDuyet ?? 0;
    document.getElementById("statReportRate").textContent = `${summary.tyLeDuyetThanhCong ?? 0}%`;
  }

  function renderStageTable() {
    const tbody = document.getElementById("reportStageTableBody");
    if (!tbody) return;

    const total = byStage.reduce((sum, s) => sum + s.soLuong, 0) || 1;

    tbody.innerHTML = byStage
      .map(
        (s) => `
        <tr>
          <td>${s.giaiDoan}</td>
          <td>${s.soLuong}</td>
          <td>${Math.round((s.soLuong / total) * 100)}%</td>
        </tr>
      `
      )
      .join("");
  }

  function renderManagerTable() {
    const tbody = document.getElementById("reportManagerTableBody");
    if (!tbody) return;

    const data = getFilteredManagers();

    tbody.innerHTML = data
      .map(
        (m) => `
        <tr>
          <td>${m.tenCanBo}</td>
          <td>${m.daDuyet}</td>
          <td>${m.tuChoi}</td>
          <td>${m.choXuLy}</td>
          <td>${m.daDuyet + m.tuChoi + m.choXuLy}</td>
        </tr>
      `
      )
      .join("");
  }

  // ====== EVENTS ======
  function bindEvents() {
    document.getElementById("reportSearchInput").addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderManagerTable();
    });
  }

  // ====== PUBLIC API ======
  function init() {
    bindEvents();
    fetchReport();
  }

  async function render(containerId) {
    const success = await ViewLoader.load("views/manager/overview-report.html", containerId);
    if (success) this.init();
  }

  return { render, init, bindEvents };
})();