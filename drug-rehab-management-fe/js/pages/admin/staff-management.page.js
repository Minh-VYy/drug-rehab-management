const StaffManagementPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/admin/staff-management.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.StaffManagementPage = StaffManagementPage;
window.StaffManagementPage = (function () {
  // ====== ENDPOINTS ======
  const ENDPOINT_LIST = "/admin/staff";
  const ENDPOINT_CREATE = "/admin/staff";
  const ENDPOINT_UPDATE = (id) => `/admin/staff/${id}`;
  const ENDPOINT_STATUS = (id) => `/admin/staff/${id}/status`;

  // ====== MOCK FALLBACK (chi dung khi API chua san sang) ======
  const MOCK_STAFF = [
    {
      id: "NS001",
      hoTen: "BS. Trần Thị Mai",
      email: "bspt001@rehabcare.vn",
      sdt: "0905333444",
      taiKhoanLienKet: "bspt001",
      chucVu: "BacSi",
      boPhan: "Khoa điều trị Giai đoạn 2",
      trangThai: "DangLamViec",
      ngayVaoLam: "01/02/2026",
    },
    {
      id: "NS002",
      hoTen: "BS. Nguyễn Văn Thành",
      email: "bspt003@rehabcare.vn",
      sdt: "0905888999",
      taiKhoanLienKet: "bspt003",
      chucVu: "BacSi",
      boPhan: "Khoa điều trị Giai đoạn 1",
      trangThai: "DangLamViec",
      ngayVaoLam: "15/02/2026",
    },
    {
      id: "NS003",
      hoTen: "QL. Phạm Thị Phương",
      email: "manager.phuong@rehabcare.vn",
      sdt: "0905444555",
      taiKhoanLienKet: "ql.phamthiphuong",
      chucVu: "CanBoQuanLy",
      boPhan: "Phòng quản lý điều trị",
      trangThai: "DangLamViec",
      ngayVaoLam: "10/01/2026",
    },
    {
      id: "NS004",
      hoTen: "NV. Lê Thị Hồng",
      email: "staff.hong@rehabcare.vn",
      sdt: "0905555666",
      taiKhoanLienKet: "nv.lethihong",
      chucVu: "CanBoTrungTam",
      boPhan: "Khu A - Tiếp nhận",
      trangThai: "DangLamViec",
      ngayVaoLam: "20/01/2026",
    },
    {
      id: "NS005",
      hoTen: "LĐ. Nguyễn Văn A",
      email: "leader.a@rehabcare.vn",
      sdt: "0905222333",
      taiKhoanLienKet: "ld.nguyenvana",
      chucVu: "LanhDao",
      boPhan: "Ban giám đốc trung tâm",
      trangThai: "DangLamViec",
      ngayVaoLam: "01/01/2025",
    },
    {
      id: "NS006",
      hoTen: "Đặng Thị Kế",
      email: "ketoan.dang@rehabcare.vn",
      sdt: "0905999111",
      taiKhoanLienKet: "kt.dangthike",
      chucVu: "KeToan",
      boPhan: "Phòng hành chính - kế toán",
      trangThai: "TamNghi",
      ngayVaoLam: "05/03/2026",
    },
    {
      id: "NS007",
      hoTen: "Hồ Văn Bảo",
      email: "baove.ho@rehabcare.vn",
      sdt: "0905112233",
      taiKhoanLienKet: "bv.hovanbao",
      chucVu: "BaoVe",
      boPhan: "Tổ bảo vệ - an ninh",
      trangThai: "DangLamViec",
      ngayVaoLam: "12/03/2026",
    },
  ];

  // ====== STATE ======
  let staffList = [];
  let usingFallback = false;
  let currentSearch = "";
  let currentRoleFilter = "all";
  let currentStatusFilter = "all";
  let activeStaffId = null;
  let formMode = "create"; // create | edit
  let pendingStatusAction = null; // { id, newStatus }
  let staffCounter = MOCK_STAFF.length;

  // ====== HELPERS ======
  function getRoleLabel(role) {
    const map = {
      BacSi: "Bác sĩ",
      CanBoQuanLy: "Cán bộ quản lý",
      CanBoTrungTam: "Cán bộ trung tâm",
      LanhDao: "Lãnh đạo",
      KeToan: "Kế toán",
      BaoVe: "Bảo vệ",
    };
    return map[role] || role;
  }

  function getStatusBadge(status) {
    const map = {
      DangLamViec: { label: "Đang làm việc", cls: "badge-green" },
      TamNghi: { label: "Tạm nghỉ", cls: "badge-orange" },
    };
    const item = map[status] || { label: status, cls: "badge-gray" };
    return `<span class="badge ${item.cls}">${item.label}</span>`;
  }

  function getFilteredStaff() {
    return staffList.filter((s) => {
      const matchRole = currentRoleFilter === "all" || s.chucVu === currentRoleFilter;
      const matchStatus = currentStatusFilter === "all" || s.trangThai === currentStatusFilter;

      const keyword = currentSearch.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        s.id.toLowerCase().includes(keyword) ||
        s.hoTen.toLowerCase().includes(keyword) ||
        s.email.toLowerCase().includes(keyword) ||
        (s.sdt || "").includes(keyword);

      return matchRole && matchStatus && matchSearch;
    });
  }

  function clearFormErrors() {
    document.querySelectorAll("#staffFormModal .form-error").forEach((el) => (el.textContent = ""));
  }

  function showLoading(show) {
    const loadingEl = document.getElementById("staffLoadingState");
    const tbody = document.getElementById("staffTableBody");
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
    if (tbody && show) tbody.innerHTML = "";
  }

  function showFallbackNotice() {
    if (window.Toast && Toast.show) {
      Toast.show("Chua co API nhan su, dang hien thi du lieu mau de demo giao dien.", "error");
    }
  }

  function generateMaNhanSu() {
    staffCounter += 1;
    return "NS" + String(staffCounter).padStart(3, "0");
  }

  // ====== GỌI API (fallback mock khi lỗi) ======
  function fetchStaff() {
    showLoading(true);

    return Api.get(ENDPOINT_LIST)
      .then((res) => {
        staffList = (res && res.data) || [];
        usingFallback = false;
      })
      .catch((err) => {
        console.warn("Chua co API GET /admin/staff, dung mock fallback:", err);
        staffList = JSON.parse(JSON.stringify(MOCK_STAFF));
        usingFallback = true;
        showFallbackNotice();
      })
      .finally(() => {
        showLoading(false);
        renderStats();
        renderTable();
      });
  }

  function createStaff(payload) {
    if (usingFallback) {
      const newStaff = Object.assign({}, payload, {
        id: generateMaNhanSu(),
        trangThai: "DangLamViec",
        ngayVaoLam: new Date().toLocaleDateString("vi-VN"),
      });
      staffList.push(newStaff);
      return Promise.resolve(newStaff);
    }

    return Api.post(ENDPOINT_CREATE, payload).then((res) => {
      const created = res && res.data;
      if (created) staffList.push(created);
      return created;
    });
  }

  function updateStaff(id, payload) {
    if (usingFallback) {
      const idx = staffList.findIndex((s) => s.id === id);
      if (idx !== -1) Object.assign(staffList[idx], payload);
      return Promise.resolve(staffList[idx]);
    }

    return Api.put(ENDPOINT_UPDATE(id), payload).then((res) => {
      const updated = res && res.data;
      const idx = staffList.findIndex((s) => s.id === id);
      if (idx !== -1 && updated) staffList[idx] = updated;
      else if (idx !== -1) Object.assign(staffList[idx], payload);
      return staffList[idx];
    });
  }

  function changeStaffStatus(id, newStatus) {
    if (usingFallback) {
      const idx = staffList.findIndex((s) => s.id === id);
      if (idx !== -1) staffList[idx].trangThai = newStatus;
      return Promise.resolve(staffList[idx]);
    }

    return Api.put(ENDPOINT_STATUS(id), { trangThai: newStatus }).then(() => {
      const idx = staffList.findIndex((s) => s.id === id);
      if (idx !== -1) staffList[idx].trangThai = newStatus;
      return staffList[idx];
    });
  }

  // ====== RENDER STATS ======
  function renderStats() {
    const total = staffList.length;
    const active = staffList.filter((s) => s.trangThai === "DangLamViec").length;
    const onLeave = staffList.filter((s) => s.trangThai === "TamNghi").length;
    const doctors = staffList.filter(
      (s) => s.chucVu === "BacSi" || s.chucVu === "CanBoQuanLy"
    ).length;

    document.getElementById("statTotalStaff").textContent = total;
    document.getElementById("statActiveStaff").textContent = active;
    document.getElementById("statOnLeaveStaff").textContent = onLeave;
    document.getElementById("statDoctorStaff").textContent = doctors;
  }

  // ====== RENDER TABLE ======
  function renderTable() {
    const tbody = document.getElementById("staffTableBody");
    const emptyState = document.getElementById("staffEmptyState");
    if (!tbody) return;

    const data = getFilteredStaff();

    if (data.length === 0) {
      tbody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    tbody.innerHTML = data
      .map(
        (s) => `
        <tr>
          <td><span class="text-link">${s.id}</span></td>
          <td>${s.hoTen}</td>
          <td>${s.taiKhoanLienKet || "-"}</td>
          <td>${getRoleLabel(s.chucVu)}</td>
          <td>${s.boPhan || "-"}</td>
          <td>${s.sdt || "-"}</td>
          <td>${getStatusBadge(s.trangThai)}</td>
          <td>
            <div class="table-actions">
              <button class="btn-icon" title="Xem chi tiết" data-action="view" data-id="${s.id}">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn-icon" title="Chỉnh sửa" data-action="edit" data-id="${s.id}">
                <i class="fa-solid fa-pen"></i>
              </button>
              ${
                s.trangThai === "DangLamViec"
                  ? `<button class="btn-icon" title="Chuyển tạm nghỉ" data-action="setLeave" data-id="${s.id}">
                      <i class="fa-solid fa-pause"></i>
                    </button>`
                  : `<button class="btn-icon" title="Chuyển đang làm việc" data-action="setActive" data-id="${s.id}">
                      <i class="fa-solid fa-play"></i>
                    </button>`
              }
            </div>
          </td>
        </tr>
      `
      )
      .join("");
  }

  // ====== MODAL CHI TIẾT ======
  function openDetailModal(id) {
    const s = staffList.find((x) => x.id === id);
    if (!s) return;

    document.getElementById("staffDetailBody").innerHTML = `
      <div class="module-detail-grid">
        <div class="module-detail-item">
          <div class="module-detail-label">Mã nhân sự</div>
          <div class="module-detail-value">${s.id}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Họ tên</div>
          <div class="module-detail-value">${s.hoTen}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Email</div>
          <div class="module-detail-value">${s.email}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Số điện thoại</div>
          <div class="module-detail-value">${s.sdt || "-"}</div>
        </div>

        <div class="module-detail-item">
          <div class="module-detail-label">Tài khoản liên kết</div>
          <div class="module-detail-value">${s.taiKhoanLienKet || "-"}</div>
        </div>

        <div class="module-detail-item">
          <div class="module-detail-label">Chức vụ</div>
          <div class="module-detail-value">${getRoleLabel(s.chucVu)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Khoa/bộ phận</div>
          <div class="module-detail-value">${s.boPhan || "-"}</div>
        </div>

        <div class="module-detail-item">
          <div class="module-detail-label">Trạng thái làm việc</div>
          <div class="module-detail-value">${getStatusBadge(s.trangThai)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Ngày vào làm</div>
          <div class="module-detail-value">${s.ngayVaoLam || "-"}</div>
        </div>
      </div>
    `;

    document.getElementById("staffDetailModal").style.display = "flex";
  }

  function closeDetailModal() {
    document.getElementById("staffDetailModal").style.display = "none";
  }

  // ====== MODAL TẠO/CHỈNH SỬA ======
  function openCreateModal() {
    formMode = "create";
    activeStaffId = null;
    clearFormErrors();

    document.getElementById("staffFormTitle").textContent = "Tạo hồ sơ nhân sự";
    document.getElementById("formMaNhanSu").value = "(Tự sinh khi lưu)";
    document.getElementById("formHoTen").value = "";
    document.getElementById("formEmail").value = "";
    document.getElementById("formSdt").value = "";
    document.getElementById("formChucVu").value = "BacSi";
    document.getElementById("formBoPhan").value = "";
    document.getElementById("formTaiKhoanLienKet").value = "";

    document.getElementById("staffFormModal").style.display = "flex";
  }

  function openEditModal(id) {
    const s = staffList.find((x) => x.id === id);
    if (!s) return;

    formMode = "edit";
    activeStaffId = id;
    clearFormErrors();

    document.getElementById("staffFormTitle").textContent = "Chỉnh sửa hồ sơ nhân sự";
    document.getElementById("formMaNhanSu").value = s.id;
    document.getElementById("formHoTen").value = s.hoTen;
    document.getElementById("formEmail").value = s.email;
    document.getElementById("formSdt").value = s.sdt || "";
    document.getElementById("formChucVu").value = s.chucVu;
    document.getElementById("formBoPhan").value = s.boPhan || "";
    document.getElementById("formTaiKhoanLienKet").value = s.taiKhoanLienKet || "";

    document.getElementById("staffFormModal").style.display = "flex";
  }

  function closeFormModal() {
    document.getElementById("staffFormModal").style.display = "none";
    activeStaffId = null;
  }

  function handleFormSave() {
    clearFormErrors();
    let valid = true;

    const hoTen = document.getElementById("formHoTen").value.trim();
    const email = document.getElementById("formEmail").value.trim();
    const sdt = document.getElementById("formSdt").value.trim();
    const chucVu = document.getElementById("formChucVu").value;
    const boPhan = document.getElementById("formBoPhan").value.trim();
    const taiKhoanLienKet = document.getElementById("formTaiKhoanLienKet").value.trim();

    if (!hoTen) {
      document.getElementById("errHoTen").textContent = "Vui lòng nhập họ tên";
      valid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById("errEmail").textContent = "Email không hợp lệ";
      valid = false;
    }

    if (sdt && !/^\d{10}$/.test(sdt)) {
      document.getElementById("errSdt").textContent = "Số điện thoại phải gồm đúng 10 số";
      valid = false;
    }

    if (!valid) return;

    const saveBtn = document.getElementById("staffFormSaveBtn");
    saveBtn.disabled = true;

    const payload = { hoTen, email, sdt, chucVu, boPhan, taiKhoanLienKet };

    const action =
      formMode === "create" ? createStaff(payload) : updateStaff(activeStaffId, payload);

    action
      .then(() => {
        closeFormModal();
        renderStats();
        renderTable();

        if (window.Toast && Toast.show) {
          Toast.show(
            formMode === "create" ? "Da tao ho so nhan su." : "Da cap nhat ho so nhan su.",
            "success"
          );
        }
      })
      .catch((err) => {
        console.error("Loi luu ho so nhan su:", err);
        if (window.Toast && Toast.show) {
          Toast.show("Luu ho so nhan su thất bại, vui lòng thử lại.", "error");
        }
      })
      .finally(() => {
        saveBtn.disabled = false;
      });
  }

  // ====== MODAL ĐỔI TRẠNG THÁI ======
  function openStatusModal(id, newStatus) {
    const s = staffList.find((x) => x.id === id);
    if (!s) return;

    pendingStatusAction = { id, newStatus };

    document.getElementById("staffStatusTitle").textContent =
      newStatus === "TamNghi" ? "Chuyển sang tạm nghỉ" : "Chuyển sang đang làm việc";

    document.getElementById("staffStatusMessage").textContent =
      newStatus === "TamNghi"
        ? `Bạn có chắc muốn chuyển "${s.hoTen}" sang trạng thái tạm nghỉ?`
        : `Bạn có chắc muốn chuyển "${s.hoTen}" sang trạng thái đang làm việc?`;

    document.getElementById("staffStatusModal").style.display = "flex";
  }

  function closeStatusModal() {
    document.getElementById("staffStatusModal").style.display = "none";
    pendingStatusAction = null;
  }

  function handleStatusConfirm() {
    if (!pendingStatusAction) return;

    const { id, newStatus } = pendingStatusAction;
    const okBtn = document.getElementById("staffStatusOkBtn");
    okBtn.disabled = true;

    changeStaffStatus(id, newStatus)
      .then(() => {
        closeStatusModal();
        renderStats();
        renderTable();

        if (window.Toast && Toast.show) {
          Toast.show("Da cap nhat trang thai lam viec.", "success");
        }
      })
      .catch((err) => {
        console.error("Loi doi trang thai nhan su:", err);
        if (window.Toast && Toast.show) {
          Toast.show("Thao tác thất bại, vui lòng thử lại.", "error");
        }
      })
      .finally(() => {
        okBtn.disabled = false;
      });
  }

  // ====== EVENTS ======
  function bindEvents() {
    document.getElementById("staffSearchInput").addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderTable();
    });

    document.getElementById("staffRoleFilter").addEventListener("change", (e) => {
      currentRoleFilter = e.target.value;
      renderTable();
    });

    document.getElementById("staffStatusFilter").addEventListener("change", (e) => {
      currentStatusFilter = e.target.value;
      renderTable();
    });

    document.getElementById("btnCreateStaff").addEventListener("click", openCreateModal);

    document.getElementById("staffTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;

      if (action === "view") openDetailModal(id);
      if (action === "edit") openEditModal(id);
      if (action === "setLeave") openStatusModal(id, "TamNghi");
      if (action === "setActive") openStatusModal(id, "DangLamViec");
    });

    document.getElementById("staffDetailCloseBtn").addEventListener("click", closeDetailModal);
    document.getElementById("staffDetailCloseBtn2").addEventListener("click", closeDetailModal);
    const detailOverlay = document.getElementById("staffDetailModal");
    detailOverlay.addEventListener("click", (e) => {
      if (e.target === detailOverlay) closeDetailModal();
    });

    document.getElementById("staffFormCloseBtn").addEventListener("click", closeFormModal);
    document.getElementById("staffFormCancelBtn").addEventListener("click", closeFormModal);
    document.getElementById("staffFormSaveBtn").addEventListener("click", handleFormSave);
    const formOverlay = document.getElementById("staffFormModal");
    formOverlay.addEventListener("click", (e) => {
      if (e.target === formOverlay) closeFormModal();
    });

    document.getElementById("staffStatusCloseBtn").addEventListener("click", closeStatusModal);
    document.getElementById("staffStatusCancelBtn").addEventListener("click", closeStatusModal);
    document.getElementById("staffStatusOkBtn").addEventListener("click", handleStatusConfirm);
    const statusOverlay = document.getElementById("staffStatusModal");
    statusOverlay.addEventListener("click", (e) => {
      if (e.target === statusOverlay) closeStatusModal();
    });
  }

  // ====== PUBLIC API ======
  function init() {
    bindEvents();
    fetchStaff();
  }

  async function render(containerId) {
    const success = await ViewLoader.load("views/admin/staff-management.html", containerId);
    if (success) this.init();
  }

  return {
    render,
    init,
    bindEvents,
  };
})();