window.RoleManagementPage = (function () {
  // ====== ENDPOINTS ======
  const ENDPOINT_LIST = "/admin/roles";
  const ENDPOINT_CREATE = "/admin/roles";
  const ENDPOINT_UPDATE = (id) => `/admin/roles/${id}`;

  // ====== HELPER ĐỌC RESPONSE LINH HOẠT ======
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

  // ====== DANH SÁCH NHÓM QUYỀN (module) ======
  const PERMISSION_MODULES = [
    { key: "HoSoBenhAn", label: "Hồ sơ bệnh án" },
    { key: "PhacDoDieuTri", label: "Phác đồ điều trị" },
    { key: "HoSoBanGiao", label: "Hồ sơ bàn giao" },
    { key: "NguoiCaiNghien", label: "Người cai nghiện" },
    { key: "TaiKhoanNguoiDung", label: "Tài khoản người dùng" },
    { key: "VaiTroQuyen", label: "Vai trò và quyền" },
    { key: "DanhMucThuoc", label: "Danh mục thuốc" },
    { key: "DanhMucHoatDong", label: "Danh mục hoạt động" },
    { key: "NhanSu", label: "Nhân sự" },
    { key: "BaoCaoThongKe", label: "Báo cáo thống kê" },
  ];

  // ====== MOCK FALLBACK ======
  const MOCK_ROLES = [
    {
      maVaiTro: "ADMIN",
      tenVaiTro: "Quản trị hệ thống",
      moTa: "Toàn quyền quản lý hệ thống, tài khoản, danh mục và vai trò.",
      soTaiKhoan: 1,
      quyen: PERMISSION_MODULES.map((m) => m.key),
      trangThai: "DangDung",
      laVaiTroHeThong: true,
    },
    {
      maVaiTro: "LANHDAO",
      tenVaiTro: "Lãnh đạo trung tâm",
      moTa: "Xem báo cáo tổng quan, phê duyệt tiếp nhận và hoàn thành cai nghiện.",
      soTaiKhoan: 1,
      quyen: ["HoSoBanGiao", "NguoiCaiNghien", "BaoCaoThongKe"],
      trangThai: "DangDung",
      laVaiTroHeThong: true,
    },
    {
      maVaiTro: "BACSI",
      tenVaiTro: "Bác sĩ điều trị",
      moTa: "Lập và cập nhật hồ sơ bệnh án, phác đồ điều trị.",
      soTaiKhoan: 2,
      quyen: ["HoSoBenhAn", "PhacDoDieuTri", "NguoiCaiNghien"],
      trangThai: "DangDung",
      laVaiTroHeThong: true,
    },
    {
      maVaiTro: "CANBOQUANLY",
      tenVaiTro: "Cán bộ quản lý",
      moTa: "Phê duyệt phác đồ điều trị do bác sĩ lập.",
      soTaiKhoan: 1,
      quyen: ["PhacDoDieuTri", "BaoCaoThongKe"],
      trangThai: "DangDung",
      laVaiTroHeThong: true,
    },
    {
      maVaiTro: "CANBOTRUNGTAM",
      tenVaiTro: "Cán bộ trung tâm",
      moTa: "Xác nhận tiếp nhận, quản lý người cai nghiện, lịch sinh hoạt.",
      soTaiKhoan: 1,
      quyen: ["HoSoBanGiao", "NguoiCaiNghien"],
      trangThai: "DangDung",
      laVaiTroHeThong: true,
    },
    {
      maVaiTro: "CONGAN",
      tenVaiTro: "Công an",
      moTa: "Gửi và theo dõi hồ sơ bàn giao người cai nghiện.",
      soTaiKhoan: 1,
      quyen: ["HoSoBanGiao"],
      trangThai: "DangDung",
      laVaiTroHeThong: true,
    },
    {
      maVaiTro: "NGUOITHAN",
      tenVaiTro: "Người thân",
      moTa: "Theo dõi tình hình điều trị và gửi yêu cầu hỗ trợ.",
      soTaiKhoan: 1,
      quyen: ["NguoiCaiNghien"],
      trangThai: "DangDung",
      laVaiTroHeThong: true,
    },
    {
      maVaiTro: "KETOAN",
      tenVaiTro: "Kế toán",
      moTa: "Theo dõi chi phí và báo cáo tài chính trung tâm.",
      soTaiKhoan: 1,
      quyen: ["BaoCaoThongKe"],
      trangThai: "KhongDung",
      laVaiTroHeThong: false,
    },
  ];

  // ====== STATE ======
  let roles = [];
  let usingFallback = false;
  let activeRoleId = null;
  let formMode = "create"; // create | edit

  // ====== HELPERS ======
  function getModuleLabel(key) {
    const found = PERMISSION_MODULES.find((m) => m.key === key);
    return found ? found.label : key;
  }

  function getStatusBadge(status) {
    const map = {
      DangDung: { label: "Đang dùng", cls: "badge-green" },
      KhongDung: { label: "Không dùng", cls: "badge-gray" },
    };
    const item = map[status] || { label: status, cls: "badge-gray" };
    return `<span class="badge ${item.cls}">${item.label}</span>`;
  }

  function clearFormErrors() {
    document.querySelectorAll("#roleFormModal .form-error").forEach((el) => (el.textContent = ""));
  }

  function showLoading(show) {
    const loadingEl = document.getElementById("roleLoadingState");
    const tbody = document.getElementById("roleTableBody");
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
    if (tbody && show) tbody.innerHTML = "";
  }

  function showFallbackNotice() {
    if (window.Toast && Toast.show) {
      Toast.show("Chưa có API vai trò, đang hiển thị dữ liệu mẫu để demo giao diện.", "error");
    }
  }

  // ====== GỌI API (fallback mock khi lỗi) ======
  function fetchRoles() {
    showLoading(true);

    return Api.get(ENDPOINT_LIST)
      .then((res) => {
        roles = extractList(res);
        usingFallback = false;
      })
      .catch((err) => {
        console.warn("Chưa có API GET /admin/roles, dùng mock fallback:", err);
        roles = JSON.parse(JSON.stringify(MOCK_ROLES));
        usingFallback = true;
        showFallbackNotice();
      })
      .finally(() => {
        showLoading(false);
        renderStats();
        renderTable();
      });
  }

  function createRole(payload) {
    if (usingFallback) {
      const newRole = Object.assign({}, payload, { soTaiKhoan: 0, laVaiTroHeThong: false });
      roles.push(newRole);
      return Promise.resolve(newRole);
    }

    return Api.post(ENDPOINT_CREATE, payload).then((res) => {
      const created = extractObject(res) || payload;
      roles.push(created);
      return created;
    });
  }

  function updateRole(maVaiTro, payload) {
    if (usingFallback) {
      const idx = roles.findIndex((r) => r.maVaiTro === maVaiTro);
      if (idx !== -1) Object.assign(roles[idx], payload);
      return Promise.resolve(roles[idx]);
    }

    return Api.put(ENDPOINT_UPDATE(maVaiTro), payload).then((res) => {
      const updated = extractObject(res);
      const idx = roles.findIndex((r) => r.maVaiTro === maVaiTro);
      if (idx !== -1 && updated) roles[idx] = updated;
      else if (idx !== -1) Object.assign(roles[idx], payload);
      return roles[idx];
    });
  }

  // ====== RENDER STATS ======
  function renderStats() {
    const total = roles.length;
    const system = roles.filter((r) => r.laVaiTroHeThong).length;
    const active = roles.filter((r) => r.trangThai === "DangDung").length;
    const totalPermission = PERMISSION_MODULES.length;

    document.getElementById("statTotalRole").textContent = total;
    document.getElementById("statSystemRole").textContent = system;
    document.getElementById("statActiveRole").textContent = active;
    document.getElementById("statTotalPermission").textContent = totalPermission;
  }

  // ====== RENDER TABLE ======
  function renderTable() {
    const tbody = document.getElementById("roleTableBody");
    const emptyState = document.getElementById("roleEmptyState");
    if (!tbody) return;

    if (roles.length === 0) {
      tbody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    tbody.innerHTML = roles
      .map(
        (r) => `
        <tr>
          <td><span class="text-link">${escapeHtml(r.maVaiTro)}</span></td>
          <td>${escapeHtml(r.tenVaiTro)}</td>
          <td>${escapeHtml(r.moTa || "-")}</td>
          <td>${r.soTaiKhoan ?? 0}</td>
          <td>${(r.quyen || []).length}</td>
          <td>${getStatusBadge(r.trangThai)}</td>
          <td>
            <div class="table-actions">
              <button class="btn-icon" title="Xem chi tiết quyền" data-action="view" data-id="${escapeHtml(r.maVaiTro)}">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn-icon" title="${r.laVaiTroHeThong ? "Vai trò hệ thống không nên chỉnh sửa" : "Chỉnh sửa"}" data-action="edit" data-id="${escapeHtml(r.maVaiTro)}" ${
          r.laVaiTroHeThong ? "disabled" : ""
        }>
                <i class="fa-solid fa-pen"></i>
              </button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");
  }

  // ====== MODAL CHI TIẾT QUYỀN ======
  function openDetailModal(maVaiTro) {
    const r = roles.find((x) => x.maVaiTro === maVaiTro);
    if (!r) return;

    const grantedSet = new Set(r.quyen || []);

    document.getElementById("roleDetailBody").innerHTML = `
      <p><strong>${escapeHtml(r.tenVaiTro)}</strong> - ${escapeHtml(r.moTa || "")}</p>
      <div class="module-detail-grid">
        ${PERMISSION_MODULES.map(
          (m) => `
          <div class="module-detail-item">
            <div class="module-detail-label">${escapeHtml(m.label)}</div>
            <div class="module-detail-value">
              ${
                grantedSet.has(m.key)
                  ? '<span class="badge badge-green">Có quyền</span>'
                  : '<span class="badge badge-gray">Không có</span>'
              }
            </div>
          </div>
        `
        ).join("")}
      </div>
    `;

    document.getElementById("roleDetailModal").classList.add("active");
  }

  function closeDetailModal() {
    document.getElementById("roleDetailModal").classList.remove("active");
  }

  // ====== MODAL TẠO/CHỈNH SỬA ======
  function renderPermissionCheckboxes(selectedKeys) {
    const container = document.getElementById("permissionGroupContainer");
    const selectedSet = new Set(selectedKeys || []);

    container.innerHTML = PERMISSION_MODULES.map(
      (m) => `
      <label class="permission-checkbox-item">
        <input type="checkbox" class="permission-checkbox" value="${escapeHtml(m.key)}" ${
        selectedSet.has(m.key) ? "checked" : ""
      } />
        <span>${escapeHtml(m.label)}</span>
      </label>
    `
    ).join("");
  }

  function getCheckedPermissions() {
    return Array.from(document.querySelectorAll(".permission-checkbox:checked")).map(
      (el) => el.value
    );
  }

  function openCreateModal() {
    formMode = "create";
    activeRoleId = null;
    clearFormErrors();

    document.getElementById("roleFormTitle").textContent = "Tạo vai trò mới";
    document.getElementById("formMaVaiTro").value = "";
    document.getElementById("formMaVaiTro").disabled = false;
    document.getElementById("formTenVaiTro").value = "";
    document.getElementById("formMoTa").value = "";
    document.getElementById("formTrangThai").value = "DangDung";
    renderPermissionCheckboxes([]);

    document.getElementById("roleFormModal").classList.add("active");
  }

  function openEditModal(maVaiTro) {
    const r = roles.find((x) => x.maVaiTro === maVaiTro);
    if (!r) return;

    formMode = "edit";
    activeRoleId = maVaiTro;
    clearFormErrors();

    document.getElementById("roleFormTitle").textContent = "Chỉnh sửa vai trò";
    document.getElementById("formMaVaiTro").value = r.maVaiTro;
    document.getElementById("formMaVaiTro").disabled = true;
    document.getElementById("formTenVaiTro").value = r.tenVaiTro;
    document.getElementById("formMoTa").value = r.moTa || "";
    document.getElementById("formTrangThai").value = r.trangThai;
    renderPermissionCheckboxes(r.quyen || []);

    document.getElementById("roleFormModal").classList.add("active");
  }

  function closeFormModal() {
    document.getElementById("roleFormModal").classList.remove("active");
    activeRoleId = null;
  }

  function handleFormSave() {
    clearFormErrors();
    let valid = true;

    const maVaiTro = document.getElementById("formMaVaiTro").value.trim().toUpperCase();
    const tenVaiTro = document.getElementById("formTenVaiTro").value.trim();
    const moTa = document.getElementById("formMoTa").value.trim();
    const trangThai = document.getElementById("formTrangThai").value;
    const quyen = getCheckedPermissions();

    if (!maVaiTro) {
      document.getElementById("errMaVaiTro").textContent = "Vui lòng nhập mã vai trò";
      valid = false;
    }

    if (!tenVaiTro) {
      document.getElementById("errTenVaiTro").textContent = "Vui lòng nhập tên vai trò";
      valid = false;
    }

    if (!valid) return;

    const payload = { maVaiTro, tenVaiTro, moTa, trangThai, quyen };
    const saveBtn = document.getElementById("roleFormSaveBtn");
    saveBtn.disabled = true;

    const action = formMode === "create" ? createRole(payload) : updateRole(activeRoleId, payload);

    action
      .then(() => {
        closeFormModal();
        renderStats();
        renderTable();

        if (window.Toast && Toast.show) {
          Toast.show(
            formMode === "create" ? "Đã tạo vai trò mới." : "Đã cập nhật vai trò.",
            "success"
          );
        }
      })
      .catch((err) => {
        console.error("Lỗi lưu vai trò:", err);
        if (window.Toast && Toast.show) {
          Toast.show("Lỗi lưu vai trò, vui lòng thử lại.", "error");
        }
      })
      .finally(() => {
        saveBtn.disabled = false;
      });
  }

  // ====== EVENTS ======
  function bindEvents() {
    document.getElementById("btnCreateRole").addEventListener("click", openCreateModal);

    document.getElementById("roleTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;

      if (action === "view") openDetailModal(id);
      if (action === "edit") openEditModal(id);
    });

    document.getElementById("roleDetailCloseBtn").addEventListener("click", closeDetailModal);
    document.getElementById("roleDetailCloseBtn2").addEventListener("click", closeDetailModal);

    const detailOverlay = document.getElementById("roleDetailModal");
    detailOverlay.addEventListener("click", (e) => {
      if (e.target === detailOverlay) closeDetailModal();
    });

    document.getElementById("roleFormCloseBtn").addEventListener("click", closeFormModal);
    document.getElementById("roleFormCancelBtn").addEventListener("click", closeFormModal);
    document.getElementById("roleFormSaveBtn").addEventListener("click", handleFormSave);

    const formOverlay = document.getElementById("roleFormModal");
    formOverlay.addEventListener("click", (e) => {
      if (e.target === formOverlay) closeFormModal();
    });
  }

  // ====== PUBLIC API ======
  function init() {
    bindEvents();
    fetchRoles();
  }

  async function render(containerId) {
    const success = await ViewLoader.load("views/admin/role-management.html", containerId);
    if (success) this.init();
  }

  return { render, init, bindEvents };
})();
