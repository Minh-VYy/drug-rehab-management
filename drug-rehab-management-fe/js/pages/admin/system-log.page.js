window.SystemLogPage = (function () {
  // ====== ENDPOINT ======
  const ENDPOINT_LIST = "/admin/system-logs";

  // ====== HELPER ĐỌC RESPONSE LINH HOẠT ======
  function extractList(res) {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.items)) return res.items;
    return [];
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ====== MOCK FALLBACK ======
  const MOCK_LOGS = [
    { id: "LOG001", thoiGian: "20/06/2026 08:15:32", nguoiDung: "admin01", vaiTro: "Admin", hanhDong: "DangNhap", doiTuong: "Hệ thống", ip: "192.168.1.10", trangThai: "ThanhCong", chiTiet: "Đăng nhập thành công vào hệ thống quản trị." },
    { id: "LOG002", thoiGian: "20/06/2026 08:20:10", nguoiDung: "bspt001", vaiTro: "BacSi", hanhDong: "CapNhat", doiTuong: "Hồ sơ bệnh án BA-SEED002", ip: "192.168.1.22", trangThai: "ThanhCong", chiTiet: "Cập nhật phác đồ điều trị cho hồ sơ BA-SEED002." },
    { id: "LOG003", thoiGian: "20/06/2026 08:45:50", nguoiDung: "ld.nguyenvana", vaiTro: "LanhDao", hanhDong: "PheDuyet", doiTuong: "Đề xuất hoàn thành DXHT001", ip: "192.168.1.5", trangThai: "ThanhCong", chiTiet: "Phê duyệt hoàn thành cai nghiện cho đề xuất DXHT001." },
    { id: "LOG004", thoiGian: "20/06/2026 09:02:18", nguoiDung: "ca.nguyenvankhanh", vaiTro: "CongAn", hanhDong: "Tao", doiTuong: "Hồ sơ bàn giao HSBG008", ip: "203.162.4.91", trangThai: "ThanhCong", chiTiet: "Tạo mới hồ sơ bàn giao người cai nghiện." },
    { id: "LOG005", thoiGian: "20/06/2026 09:10:44", nguoiDung: "nv.lethihong", vaiTro: "CanBoTrungTam", hanhDong: "CapNhat", doiTuong: "Hồ sơ tiếp nhận HSBG003", ip: "192.168.1.30", trangThai: "CanhBao", chiTiet: "Cập nhật thiếu thông tin khu/phòng tiếp nhận, hệ thống tự ghi nhận cảnh báo." },
    { id: "LOG006", thoiGian: "20/06/2026 09:30:05", nguoiDung: "ql.phamthiphuong", vaiTro: "CanBoQuanLy", hanhDong: "TuChoi", doiTuong: "Phác đồ PDT-S004-01", ip: "192.168.1.18", trangThai: "ThanhCong", chiTiet: "Từ chối phác đồ điều trị do thiếu xét nghiệm kèm theo." },
    { id: "LOG007", thoiGian: "20/06/2026 09:55:27", nguoiDung: "unknown_user", vaiTro: "-", hanhDong: "DangNhap", doiTuong: "Hệ thống", ip: "45.118.20.7", trangThai: "Loi", chiTiet: "Đăng nhập thất bại: sai tên đăng nhập hoặc mật khẩu." },
    { id: "LOG008", thoiGian: "19/06/2026 17:40:12", nguoiDung: "admin01", vaiTro: "Admin", hanhDong: "Xoa", doiTuong: "Tài khoản USR099 (test)", ip: "192.168.1.10", trangThai: "ThanhCong", chiTiet: "Xóa tài khoản thử nghiệm không còn sử dụng." },
    { id: "LOG009", thoiGian: "19/06/2026 16:05:00", nguoiDung: "nt.phamvanson", vaiTro: "NguoiThan", hanhDong: "DangNhap", doiTuong: "Hệ thống", ip: "118.70.12.4", trangThai: "ThanhCong", chiTiet: "Đăng nhập vào cổng thông tin người thân." },
    { id: "LOG010", thoiGian: "19/06/2026 14:22:38", nguoiDung: "bspt003", vaiTro: "BacSi", hanhDong: "CapNhat", doiTuong: "Nhật ký điều trị NCN-RL006", ip: "192.168.1.25", trangThai: "CanhBao", chiTiet: "Cập nhật nhật ký điều trị muộn so với lịch dự kiến." },
  ];

  // ====== STATE ======
  let logs = [];
  let usingFallback = false;
  let currentSearch = "";
  let currentRoleFilter = "all";
  let currentActionFilter = "all";
  let currentStatusFilter = "all";

  // ====== HELPERS ======
  function getRoleLabel(role) {
    const map = {
      Admin: "Admin",
      LanhDao: "Lãnh đạo",
      BacSi: "Bác sĩ",
      CanBoQuanLy: "Cán bộ quản lý",
      CanBoTrungTam: "Cán bộ trung tâm",
      CongAn: "Công an",
      NguoiThan: "Người thân",
    };
    return map[role] || role || "-";
  }

  function getActionLabel(action) {
    const map = {
      DangNhap: "Đăng nhập",
      DangXuat: "Đăng xuất",
      Tao: "Tạo mới",
      CapNhat: "Cập nhật",
      Xoa: "Xóa",
      PheDuyet: "Phê duyệt",
      TuChoi: "Từ chối",
    };
    return map[action] || action;
  }

  function getStatusBadge(status) {
    const map = {
      ThanhCong: { label: "Thành công", cls: "badge-green" },
      CanhBao: { label: "Cảnh báo", cls: "badge-orange" },
      Loi: { label: "Lỗi", cls: "badge-red" },
    };
    const item = map[status] || { label: status, cls: "badge-gray" };
    return `<span class="badge ${item.cls}">${item.label}</span>`;
  }

  function isToday(thoiGian) {
    const todayStr = new Date().toLocaleDateString("vi-VN");
    return thoiGian.startsWith(todayStr);
  }

  function getFilteredLogs() {
    return logs.filter((l) => {
      const matchRole = currentRoleFilter === "all" || l.vaiTro === currentRoleFilter;
      const matchAction = currentActionFilter === "all" || l.hanhDong === currentActionFilter;
      const matchStatus = currentStatusFilter === "all" || l.trangThai === currentStatusFilter;

      const keyword = currentSearch.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        (l.nguoiDung || "").toLowerCase().includes(keyword) ||
        getActionLabel(l.hanhDong).toLowerCase().includes(keyword) ||
        (l.doiTuong || "").toLowerCase().includes(keyword) ||
        (l.ip || "").toLowerCase().includes(keyword);

      return matchRole && matchAction && matchStatus && matchSearch;
    });
  }

  function showLoading(show) {
    const loadingEl = document.getElementById("logLoadingState");
    const tbody = document.getElementById("logTableBody");
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
    if (tbody && show) tbody.innerHTML = "";
  }

  function showFallbackNotice() {
    if (window.Toast && Toast.show) {
      Toast.show("Chưa có API nhật ký hệ thống, đang hiển thị dữ liệu mẫu để demo giao diện.", "error");
    }
  }

  // ====== GỌI API (fallback mock khi lỗi) ======
  function fetchLogs() {
    showLoading(true);

    return Api.get(ENDPOINT_LIST)
      .then((res) => {
        logs = extractList(res);
        usingFallback = false;
      })
      .catch((err) => {
        console.warn("Chưa có API GET /admin/system-logs, dùng mock fallback:", err);
        logs = JSON.parse(JSON.stringify(MOCK_LOGS));
        usingFallback = true;
        showFallbackNotice();
      })
      .finally(() => {
        showLoading(false);
        renderStats();
        renderTable();
      });
  }

  // ====== RENDER STATS ======
  function renderStats() {
    const total = logs.length;
    const success = logs.filter((l) => l.trangThai === "ThanhCong").length;
    const warning = logs.filter((l) => l.trangThai === "CanhBao" || l.trangThai === "Loi").length;
    const today = logs.filter((l) => isToday(l.thoiGian)).length;

    document.getElementById("statTotalLog").textContent = total;
    document.getElementById("statSuccessLog").textContent = success;
    document.getElementById("statWarningLog").textContent = warning;
    document.getElementById("statTodayLog").textContent = today;
  }

  // ====== RENDER TABLE ======
  function renderTable() {
    const tbody = document.getElementById("logTableBody");
    const emptyState = document.getElementById("logEmptyState");
    if (!tbody) return;

    const data = getFilteredLogs();

    if (data.length === 0) {
      tbody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    tbody.innerHTML = data
      .map(
        (l) => `
        <tr>
          <td>${escapeHtml(l.thoiGian)}</td>
          <td>${escapeHtml(l.nguoiDung)}</td>
          <td>${escapeHtml(getRoleLabel(l.vaiTro))}</td>
          <td>${escapeHtml(getActionLabel(l.hanhDong))}</td>
          <td>${escapeHtml(l.doiTuong)}</td>
          <td>${escapeHtml(l.ip)}</td>
          <td>${getStatusBadge(l.trangThai)}</td>
          <td>
            <div class="table-actions">
              <button class="btn-icon" title="Xem chi tiết" data-action="view" data-id="${escapeHtml(l.id)}">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");
  }

  // ====== MODAL CHI TIẾT ======
  function openDetailModal(id) {
    const l = logs.find((x) => x.id === id);
    if (!l) return;

    document.getElementById("logDetailBody").innerHTML = `
      <div class="module-detail-grid">
        <div class="module-detail-item">
          <div class="module-detail-label">Thời gian</div>
          <div class="module-detail-value">${escapeHtml(l.thoiGian)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Người dùng</div>
          <div class="module-detail-value">${escapeHtml(l.nguoiDung)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Vai trò</div>
          <div class="module-detail-value">${escapeHtml(getRoleLabel(l.vaiTro))}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Hành động</div>
          <div class="module-detail-value">${escapeHtml(getActionLabel(l.hanhDong))}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Đối tượng</div>
          <div class="module-detail-value">${escapeHtml(l.doiTuong)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Địa chỉ IP</div>
          <div class="module-detail-value">${escapeHtml(l.ip)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Trạng thái</div>
          <div class="module-detail-value">${getStatusBadge(l.trangThai)}</div>
        </div>
        <div class="module-detail-item module-detail-item-full">
          <div class="module-detail-label">Chi tiết</div>
          <div class="module-detail-value">${escapeHtml(l.chiTiet || "-")}</div>
        </div>
      </div>
    `;

    document.getElementById("logDetailModal").classList.add("active");
  }

  function closeDetailModal() {
    document.getElementById("logDetailModal").classList.remove("active");
  }

  // ====== EVENTS ======
  function bindEvents() {
    document.getElementById("logSearchInput").addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderTable();
    });

    document.getElementById("logRoleFilter").addEventListener("change", (e) => {
      currentRoleFilter = e.target.value;
      renderTable();
    });

    document.getElementById("logActionFilter").addEventListener("change", (e) => {
      currentActionFilter = e.target.value;
      renderTable();
    });

    document.getElementById("logStatusFilter").addEventListener("change", (e) => {
      currentStatusFilter = e.target.value;
      renderTable();
    });

    document.getElementById("logTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      if (btn.dataset.action === "view") openDetailModal(btn.dataset.id);
    });

    document.getElementById("logDetailCloseBtn").addEventListener("click", closeDetailModal);
    document.getElementById("logDetailCloseBtn2").addEventListener("click", closeDetailModal);

    const overlay = document.getElementById("logDetailModal");
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeDetailModal();
    });
  }

  // ====== PUBLIC API ======
  function init() {
    bindEvents();
    fetchLogs();
  }

  async function render(containerId) {
    const success = await ViewLoader.load("views/admin/system-log.html", containerId);
    if (success) this.init();
  }

  return { render, init, bindEvents };
})();
