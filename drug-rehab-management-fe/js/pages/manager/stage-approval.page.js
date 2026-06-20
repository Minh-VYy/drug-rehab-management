window.StageApprovalPage = (function () {
  // ====== ENDPOINTS ======
  const ENDPOINT_LIST = "/manager/stage-proposals";
  const ENDPOINT_APPROVE = (id) => `/manager/stage-proposals/${id}/approve`;
  const ENDPOINT_REJECT = (id) => `/manager/stage-proposals/${id}/reject`;

  function extractList(res) {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.items)) return res.items;
    return [];
  }

  // ====== MOCK FALLBACK ======
  const MOCK_PROPOSALS = [
    {
      maDeXuat: "DXCG001",
      maHoSo: "BA-SEED002",
      hoTenNguoiCaiNghien: "Nguyễn Văn B",
      giaiDoanHienTai: "Giai đoạn 1 - Cắt cơn",
      giaiDoanDeXuat: "Giai đoạn 2 - Phục hồi",
      bacSiDeXuat: "BS. Trần Thị Mai",
      ngayDeXuat: "18/06/2026",
      lyDoChuyen: "Đã ổn định thể trạng, không còn triệu chứng cắt cơn cấp tính.",
      trangThai: "ChoDuyet",
      nguoiDuyet: null,
      ngayDuyet: null,
      lyDoTuChoi: null,
    },
    {
      maDeXuat: "DXCG002",
      maHoSo: "BA-RL005",
      hoTenNguoiCaiNghien: "Phạm Thị E",
      giaiDoanHienTai: "Giai đoạn 2 - Phục hồi",
      giaiDoanDeXuat: "Giai đoạn 3 - Tái hòa nhập",
      bacSiDeXuat: "BS. Nguyễn Văn Thành",
      ngayDeXuat: "17/06/2026",
      lyDoChuyen: "Hoàn thành đầy đủ liệu trình phục hồi tâm lý.",
      trangThai: "ChoDuyet",
      nguoiDuyet: null,
      ngayDuyet: null,
      lyDoTuChoi: null,
    },
    {
      maDeXuat: "DXCG003",
      maHoSo: "BA-SEED003",
      hoTenNguoiCaiNghien: "Lê Văn D",
      giaiDoanHienTai: "Giai đoạn 2 - Phục hồi",
      giaiDoanDeXuat: "Giai đoạn 3 - Tái hòa nhập",
      bacSiDeXuat: "BS. Trần Thị Mai",
      ngayDeXuat: "10/06/2026",
      lyDoChuyen: "Sức khỏe ổn định, sẵn sàng tái hòa nhập.",
      trangThai: "DaDuyet",
      nguoiDuyet: "QL. Phạm Thị Phương",
      ngayDuyet: "12/06/2026",
      lyDoTuChoi: null,
    },
    {
      maDeXuat: "DXCG004",
      maHoSo: "BA-RL006",
      hoTenNguoiCaiNghien: "Hoàng Văn F",
      giaiDoanHienTai: "Giai đoạn 1 - Cắt cơn",
      giaiDoanDeXuat: "Giai đoạn 2 - Phục hồi",
      bacSiDeXuat: "BS. Nguyễn Văn Thành",
      ngayDeXuat: "05/06/2026",
      lyDoChuyen: "Còn dấu hiệu phụ thuộc tâm lý nhẹ.",
      trangThai: "TuChoi",
      nguoiDuyet: "QL. Phạm Thị Phương",
      ngayDuyet: "07/06/2026",
      lyDoTuChoi: "Cần theo dõi thêm 2 tuần trước khi chuyển giai đoạn.",
    },
  ];

  // ====== STATE ======
  let proposals = [];
  let usingFallback = false;
  let currentSearch = "";
  let currentStatusFilter = "all";
  let activeProposalId = null;

  // ====== HELPERS ======
  function getStatusBadge(status) {
    const map = {
      ChoDuyet: { label: "Chờ duyệt", cls: "badge-orange" },
      DaDuyet: { label: "Đã duyệt", cls: "badge-green" },
      TuChoi: { label: "Từ chối", cls: "badge-red" },
    };
    const item = map[status] || { label: status, cls: "badge-gray" };
    return `<span class="badge ${item.cls}">${item.label}</span>`;
  }

  function getCurrentManagerName() {
    try {
      if (window.Auth && Auth.getCurrentUser && Auth.getDisplayName) {
        return Auth.getDisplayName(Auth.getCurrentUser());
      }
    } catch (e) {}
    return "Cán bộ quản lý";
  }

  function getTodayString() {
    return new Date().toLocaleDateString("vi-VN");
  }

  function getFilteredProposals() {
    return proposals.filter((p) => {
      const matchStatus = currentStatusFilter === "all" || p.trangThai === currentStatusFilter;

      const keyword = currentSearch.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        p.maDeXuat.toLowerCase().includes(keyword) ||
        p.hoTenNguoiCaiNghien.toLowerCase().includes(keyword) ||
        p.maHoSo.toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }

  function clearRejectError() {
    document.getElementById("errStageRejectReason").textContent = "";
  }

  function showLoading(show) {
    const loadingEl = document.getElementById("stageLoadingState");
    const tbody = document.getElementById("stageTableBody");
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
    if (tbody && show) tbody.innerHTML = "";
  }

  function showFallbackNotice() {
    if (window.Toast && Toast.show) {
      Toast.show("Chưa có API duyệt chuyển giai đoạn, đang hiển thị dữ liệu mẫu để demo giao diện.", "error");
    }
  }

  // ====== GỌI API (fallback mock khi lỗi) ======
  function fetchProposals() {
    showLoading(true);

    return Api.get(ENDPOINT_LIST)
      .then((res) => {
        proposals = extractList(res);
        usingFallback = false;
      })
      .catch((err) => {
        console.warn("Chưa có API GET /manager/stage-proposals, dùng mock fallback:", err);
        proposals = JSON.parse(JSON.stringify(MOCK_PROPOSALS));
        usingFallback = true;
        showFallbackNotice();
      })
      .finally(() => {
        showLoading(false);
        renderStats();
        renderTable();
      });
  }

  function approveProposal(maDeXuat) {
    if (usingFallback) {
      const p = proposals.find((x) => x.maDeXuat === maDeXuat);
      if (p) {
        p.trangThai = "DaDuyet";
        p.nguoiDuyet = getCurrentManagerName();
        p.ngayDuyet = getTodayString();
      }
      return Promise.resolve(p);
    }

    return Api.put(ENDPOINT_APPROVE(maDeXuat)).then(() => {
      const p = proposals.find((x) => x.maDeXuat === maDeXuat);
      if (p) {
        p.trangThai = "DaDuyet";
        p.nguoiDuyet = getCurrentManagerName();
        p.ngayDuyet = getTodayString();
      }
      return p;
    });
  }

  function rejectProposal(maDeXuat, lyDoTuChoi) {
    if (usingFallback) {
      const p = proposals.find((x) => x.maDeXuat === maDeXuat);
      if (p) {
        p.trangThai = "TuChoi";
        p.nguoiDuyet = getCurrentManagerName();
        p.ngayDuyet = getTodayString();
        p.lyDoTuChoi = lyDoTuChoi;
      }
      return Promise.resolve(p);
    }

    return Api.put(ENDPOINT_REJECT(maDeXuat), { lyDoTuChoi }).then(() => {
      const p = proposals.find((x) => x.maDeXuat === maDeXuat);
      if (p) {
        p.trangThai = "TuChoi";
        p.nguoiDuyet = getCurrentManagerName();
        p.ngayDuyet = getTodayString();
        p.lyDoTuChoi = lyDoTuChoi;
      }
      return p;
    });
  }

  // ====== RENDER STATS ======
  function renderStats() {
    document.getElementById("statStagePending").textContent =
      proposals.filter((p) => p.trangThai === "ChoDuyet").length;
    document.getElementById("statStageApproved").textContent =
      proposals.filter((p) => p.trangThai === "DaDuyet").length;
    document.getElementById("statStageRejected").textContent =
      proposals.filter((p) => p.trangThai === "TuChoi").length;
  }

  // ====== RENDER TABLE ======
  function renderTable() {
    const tbody = document.getElementById("stageTableBody");
    const emptyState = document.getElementById("stageEmptyState");
    if (!tbody) return;

    const data = getFilteredProposals();

    if (data.length === 0) {
      tbody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    tbody.innerHTML = data
      .map(
        (p) => `
        <tr>
          <td><span class="text-link">${p.maDeXuat}</span></td>
          <td>${p.maHoSo}</td>
          <td>${p.hoTenNguoiCaiNghien}</td>
          <td>${p.giaiDoanHienTai}</td>
          <td>${p.giaiDoanDeXuat}</td>
          <td>${p.bacSiDeXuat}</td>
          <td>${p.ngayDeXuat}</td>
          <td>${getStatusBadge(p.trangThai)}</td>
          <td>
            <div class="table-actions">
              <button class="btn-icon" title="Xem chi tiết" data-action="view" data-id="${p.maDeXuat}">
                <i class="fa-solid fa-eye"></i>
              </button>
              ${
                p.trangThai === "ChoDuyet"
                  ? `
                <button class="btn-icon" title="Duyệt" data-action="approve" data-id="${p.maDeXuat}">
                  <i class="fa-solid fa-check"></i>
                </button>
                <button class="btn-icon" title="Từ chối" data-action="reject" data-id="${p.maDeXuat}">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              `
                  : ""
              }
            </div>
          </td>
        </tr>
      `
      )
      .join("");
  }

  // ====== MODAL CHI TIẾT ======
  function openDetailModal(maDeXuat) {
    const p = proposals.find((x) => x.maDeXuat === maDeXuat);
    if (!p) return;

    document.getElementById("stageDetailBody").innerHTML = `
      <div class="module-detail-grid">
        <div class="module-detail-item">
          <div class="module-detail-label">Họ tên người cai nghiện</div>
          <div class="module-detail-value">${p.hoTenNguoiCaiNghien}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Mã hồ sơ</div>
          <div class="module-detail-value">${p.maHoSo}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Giai đoạn hiện tại</div>
          <div class="module-detail-value">${p.giaiDoanHienTai}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Giai đoạn đề xuất</div>
          <div class="module-detail-value">${p.giaiDoanDeXuat}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Bác sĩ đề xuất</div>
          <div class="module-detail-value">${p.bacSiDeXuat}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Ngày đề xuất</div>
          <div class="module-detail-value">${p.ngayDeXuat}</div>
        </div>
        <div class="module-detail-item module-detail-item-full">
          <div class="module-detail-label">Lý do chuyển giai đoạn</div>
          <div class="module-detail-value">${p.lyDoChuyen}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Trạng thái</div>
          <div class="module-detail-value">${getStatusBadge(p.trangThai)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Người duyệt</div>
          <div class="module-detail-value">${p.nguoiDuyet || "-"}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Ngày duyệt</div>
          <div class="module-detail-value">${p.ngayDuyet || "-"}</div>
        </div>
        ${
          p.trangThai === "TuChoi"
            ? `
          <div class="module-detail-item module-detail-item-full">
            <div class="module-detail-label">Lý do từ chối</div>
            <div class="module-detail-value">${p.lyDoTuChoi || "-"}</div>
          </div>
        `
            : ""
        }
      </div>
    `;

    document.getElementById("stageDetailFooter").innerHTML =
      p.trangThai === "ChoDuyet"
        ? `
        <button class="btn btn-outline" data-action="reject" data-id="${p.maDeXuat}">Từ chối</button>
        <button class="btn btn-primary" data-action="approve" data-id="${p.maDeXuat}">Duyệt chuyển giai đoạn</button>
      `
        : `<button class="btn btn-outline" id="stageDetailCloseBtn2">Đóng</button>`;

    document.getElementById("stageDetailModal").classList.add("active");

    const closeBtn2 = document.getElementById("stageDetailCloseBtn2");
    if (closeBtn2) closeBtn2.addEventListener("click", closeDetailModal);
  }

  function closeDetailModal() {
    document.getElementById("stageDetailModal").classList.remove("active");
  }

  function handleApproveClick(maDeXuat) {
    approveProposal(maDeXuat).then(() => {
      closeDetailModal();
      renderStats();
      renderTable();

      if (window.Toast && Toast.show) {
        Toast.show("Đã duyệt chuyển giai đoạn điều trị.", "success");
      }
    });
  }

  // ====== MODAL TỪ CHỐI ======
  function openRejectModal(maDeXuat) {
    activeProposalId = maDeXuat;
    clearRejectError();
    document.getElementById("stageRejectReason").value = "";
    document.getElementById("stageRejectModal").classList.add("active");
  }

  function closeRejectModal() {
    document.getElementById("stageRejectModal").classList.remove("active");
    activeProposalId = null;
  }

  function handleRejectSubmit() {
    clearRejectError();
    const reason = document.getElementById("stageRejectReason").value.trim();

    if (!reason) {
      document.getElementById("errStageRejectReason").textContent = "Vui lòng nhập lý do từ chối";
      return;
    }

    if (!activeProposalId) return;

    rejectProposal(activeProposalId, reason).then(() => {
      closeRejectModal();
      closeDetailModal();
      renderStats();
      renderTable();

      if (window.Toast && Toast.show) {
        Toast.show("Đã từ chối đề xuất chuyển giai đoạn.", "success");
      }
    });
  }

  // ====== EVENTS ======
  function bindEvents() {
    document.getElementById("stageSearchInput").addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderTable();
    });

    document.getElementById("stageStatusFilter").addEventListener("change", (e) => {
      currentStatusFilter = e.target.value;
      renderTable();
    });

    document.getElementById("stageTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;

      if (action === "view") openDetailModal(id);
      if (action === "approve") handleApproveClick(id);
      if (action === "reject") openRejectModal(id);
    });

    document.getElementById("stageDetailFooter").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;

      if (action === "approve") handleApproveClick(id);
      if (action === "reject") openRejectModal(id);
    });

    document.getElementById("stageDetailCloseBtn").addEventListener("click", closeDetailModal);

    document.getElementById("stageRejectCloseBtn").addEventListener("click", closeRejectModal);
    document.getElementById("stageRejectCancelBtn").addEventListener("click", closeRejectModal);
    document.getElementById("stageRejectOkBtn").addEventListener("click", handleRejectSubmit);
  }

  // ====== PUBLIC API ======
  function init() {
    bindEvents();
    fetchProposals();
  }

  async function render(containerId) {
    const success = await ViewLoader.load("views/manager/stage-approval.html", containerId);
    if (success) this.init();
  }

  return { render, init, bindEvents };
})();