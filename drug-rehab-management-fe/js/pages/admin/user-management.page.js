window.UserManagementPage = (function () {
  // ====== ENDPOINTS ======
  const ENDPOINT_LIST = "/admin/users";
  const ENDPOINT_CREATE = "/admin/users";
  const ENDPOINT_UPDATE = (id) => `/admin/users/${id}`;
  const ENDPOINT_LOCK = (id) => `/admin/users/${id}/lock`;
  const ENDPOINT_UNLOCK = (id) => `/admin/users/${id}/unlock`;

  // ====== MOCK FALLBACK (chỉ dùng khi API chưa sẵn sàng) ======
  const MOCK_USERS = [
    {
      id: "USR001",
      tenDangNhap: "admin01",
      hoTen: "Nguyễn Văn Admin",
      email: "admin01@rehabcare.vn",
      sdt: "0905111222",
      vaiTro: "Admin",
      trangThai: "HoatDong",
      ngayTao: "01/01/2026",
    },
    {
      id: "USR002",
      tenDangNhap: "ld.nguyenvana",
      hoTen: "Nguyễn Văn A",
      email: "leader.a@rehabcare.vn",
      sdt: "0905222333",
      vaiTro: "LanhDao",
      trangThai: "HoatDong",
      ngayTao: "02/01/2026",
    },
    {
      id: "USR003",
      tenDangNhap: "bspt001",
      hoTen: "BS. Trần Thị Mai",
      email: "bspt001@rehabcare.vn",
      sdt: "0905333444",
      vaiTro: "BacSi",
      trangThai: "HoatDong",
      ngayTao: "03/01/2026",
    },
    {
      id: "USR004",
      tenDangNhap: "ql.phamthiphuong",
      hoTen: "QL. Phạm Thị Phương",
      email: "manager.phuong@rehabcare.vn",
      sdt: "0905444555",
      vaiTro: "CanBoQuanLy",
      trangThai: "HoatDong",
      ngayTao: "04/01/2026",
    },
    {
      id: "USR005",
      tenDangNhap: "nv.lethihong",
      hoTen: "NV. Lê Thị Hồng",
      email: "staff.hong@rehabcare.vn",
      sdt: "0905555666",
      vaiTro: "CanBoTrungTam",
      trangThai: "TamKhoa",
      ngayTao: "05/01/2026",
    },
    {
      id: "USR006",
      tenDangNhap: "ca.nguyenvankhanh",
      hoTen: "Thiếu úy Nguyễn Văn Khánh",
      email: "police.khanh@congan.vn",
      sdt: "0905666777",
      vaiTro: "CongAn",
      trangThai: "HoatDong",
      ngayTao: "06/01/2026",
    },
    {
      id: "USR007",
      tenDangNhap: "nt.phamvanson",
      hoTen: "Phạm Văn Sơn",
      email: "family.son@gmail.com",
      sdt: "0905777888",
      vaiTro: "NguoiThan",
      trangThai: "HoatDong",
      ngayTao: "07/01/2026",
    },
  ];

  // ====== STATE ======
  let users = [];
  let usingFallback = false;
  let currentSearch = "";
  let currentRoleFilter = "all";
  let currentStatusFilter = "all";
  let activeUserId = null;
  let formMode = "create"; // create | edit
  let pendingLockAction = null; // { id, action: 'lock' | 'unlock' }

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
    return map[role] || role;
  }

  function getStatusBadge(status) {
    const map = {
      HoatDong: { label: "Đang hoạt động", cls: "badge-green" },
      TamKhoa: { label: "Tạm khóa", cls: "badge-red" },
    };
    const item = map[status] || { label: status, cls: "badge-gray" };
    return `<span class="badge ${item.cls}">${item.label}</span>`;
  }

  function getFilteredUsers() {
    return users.filter((u) => {
      const matchRole = currentRoleFilter === "all" || u.vaiTro === currentRoleFilter;
      const matchStatus = currentStatusFilter === "all" || u.trangThai === currentStatusFilter;

      const keyword = currentSearch.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        u.tenDangNhap.toLowerCase().includes(keyword) ||
        u.hoTen.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        (u.sdt || "").includes(keyword);

      return matchRole && matchStatus && matchSearch;
    });
  }

  function clearFormErrors() {
    document.querySelectorAll("#userFormModal .form-error").forEach((el) => (el.textContent = ""));
  }

  function showLoading(show) {
    const loadingEl = document.getElementById("userLoadingState");
    const tbody = document.getElementById("userTableBody");
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
    if (tbody && show) tbody.innerHTML = "";
  }

  function showFallbackNotice() {
    if (window.Toast && Toast.show) {
      Toast.show("Chưa có API tài khoản, đang hiển thị dữ liệu mẫu để demo giao diện.", "error");
    }
  }

  function readPayloadData(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  }

  function readPayloadObject(payload) {
    return payload?.data || payload || null;
  }

  // ====== GỌI API (fallback mock khi lỗi) ======
  function fetchUsers() {
    showLoading(true);

    return Api.get(ENDPOINT_LIST)
      .then((res) => {
        users = readPayloadData(res);
        usingFallback = false;
      })
      .catch((err) => {
        console.warn("Chưa có API GET /admin/users, dùng mock fallback:", err);
        users = JSON.parse(JSON.stringify(MOCK_USERS));
        usingFallback = true;
        showFallbackNotice();
      })
      .finally(() => {
        showLoading(false);
        renderStats();
        renderTable();
      });
  }

  function createUser(payload) {
    if (usingFallback) {
      const newUser = Object.assign({}, payload, {
        id: "USR" + String(users.length + 1).padStart(3, "0"),
        trangThai: "HoatDong",
        ngayTao: new Date().toLocaleDateString("vi-VN"),
      });
      users.push(newUser);
      return Promise.resolve(newUser);
    }

    return Api.post(ENDPOINT_CREATE, payload).then((res) => {
      const created = readPayloadObject(res);
      if (created) users.push(created);
      return created;
    });
  }

  function updateUser(id, payload) {
    if (usingFallback) {
      const idx = users.findIndex((u) => u.id === id);
      if (idx !== -1) Object.assign(users[idx], payload);
      return Promise.resolve(users[idx]);
    }

    return Api.put(ENDPOINT_UPDATE(id), payload).then((res) => {
      const updated = readPayloadObject(res);
      const idx = users.findIndex((u) => u.id === id);
      if (idx !== -1 && updated) users[idx] = updated;
      else if (idx !== -1) Object.assign(users[idx], payload);
      return users[idx];
    });
  }

  function lockUser(id) {
    if (usingFallback) {
      const idx = users.findIndex((u) => u.id === id);
      if (idx !== -1) users[idx].trangThai = "TamKhoa";
      return Promise.resolve(users[idx]);
    }
    return Api.put(ENDPOINT_LOCK(id)).then(() => {
      const idx = users.findIndex((u) => u.id === id);
      if (idx !== -1) users[idx].trangThai = "TamKhoa";
      return users[idx];
    });
  }

  function unlockUser(id) {
    if (usingFallback) {
      const idx = users.findIndex((u) => u.id === id);
      if (idx !== -1) users[idx].trangThai = "HoatDong";
      return Promise.resolve(users[idx]);
    }
    return Api.put(ENDPOINT_UNLOCK(id)).then(() => {
      const idx = users.findIndex((u) => u.id === id);
      if (idx !== -1) users[idx].trangThai = "HoatDong";
      return users[idx];
    });
  }

  // ====== RENDER STATS ======
  function renderStats() {
    const total = users.length;
    const active = users.filter((u) => u.trangThai === "HoatDong").length;
    const locked = users.filter((u) => u.trangThai === "TamKhoa").length;
    const admins = users.filter((u) => u.vaiTro === "Admin").length;

    document.getElementById("statTotalUsers").textContent = total;
    document.getElementById("statActiveUsers").textContent = active;
    document.getElementById("statLockedUsers").textContent = locked;
    document.getElementById("statAdminUsers").textContent = admins;
  }

  // ====== RENDER TABLE ======
  function renderTable() {
    const tbody = document.getElementById("userTableBody");
    const emptyState = document.getElementById("userEmptyState");
    if (!tbody) return;

    const data = getFilteredUsers();

    if (data.length === 0) {
      tbody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    tbody.innerHTML = data
      .map(
        (u) => `
        <tr>
          <td><span class="td-code">${u.tenDangNhap}</span></td>
          <td><strong>${u.hoTen}</strong></td>
          <td>${u.email}</td>
          <td>${u.sdt || "-"}</td>
          <td>${getRoleLabel(u.vaiTro)}</td>
          <td>${getStatusBadge(u.trangThai)}</td>
          <td>${u.ngayTao}</td>
          <td>
            <div class="action-btns">
              <button class="btn btn-sm btn-outline btn-icon" title="Xem chi tiết" data-action="view" data-id="${u.id}">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-primary btn-icon" title="Chỉnh sửa" data-action="edit" data-id="${u.id}">
                <i class="fa-solid fa-pen"></i>
              </button>
              ${u.trangThai === "HoatDong"
            ? `<button class="btn btn-sm btn-danger btn-icon" title="Khóa tài khoản" data-action="lock" data-id="${u.id}">
                      <i class="fa-solid fa-lock"></i>
                    </button>`
            : `<button class="btn btn-sm btn-success btn-icon" title="Mở khóa tài khoản" data-action="unlock" data-id="${u.id}">
                      <i class="fa-solid fa-lock-open"></i>
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
    const u = users.find((x) => x.id === id);
    if (!u) return;

    document.getElementById("userDetailBody").innerHTML = `
      <div style="display:grid; gap:20px;">
        <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
          <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Tên đăng nhập</div>
            <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${u.tenDangNhap}</div>
          </div>
          <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Họ tên</div>
            <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${u.hoTen}</div>
          </div>
          <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Email</div>
            <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${u.email}</div>
          </div>
          <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Số điện thoại</div>
            <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${u.sdt || "-"}</div>
          </div>
          <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Vai trò</div>
            <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${getRoleLabel(u.vaiTro)}</div>
          </div>
          <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Trạng thái</div>
            <div style="font-size:14px; font-weight:600;">${getStatusBadge(u.trangThai)}</div>
          </div>
        </div>
        <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
          <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Ngày tạo tài khoản</div>
          <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${u.ngayTao}</div>
        </div>
      </div>
    `;

    openModal("userDetailModal");
  }

  function closeDetailModal() {
    closeModal("userDetailModal");
  }

  // ====== MODAL TẠO/CHỈNH SỬA ======
  function openCreateModal() {
    formMode = "create";
    activeUserId = null;
    clearFormErrors();

    document.getElementById("userFormTitle").textContent = "Tạo tài khoản mới";
    const iconEl = document.getElementById("userFormModalIcon");
    if (iconEl) {
      iconEl.className = "modal-icon modal-icon-green";
      iconEl.innerHTML = '<i class="fa-solid fa-plus"></i>';
    }

    document.getElementById("formTenDangNhap").value = "";
    document.getElementById("formTenDangNhap").disabled = false;
    document.getElementById("formHoTen").value = "";
    document.getElementById("formEmail").value = "";
    document.getElementById("formSdt").value = "";
    document.getElementById("formVaiTro").value = "BacSi";
    document.getElementById("formMatKhau").value = "";
    document.getElementById("formPasswordGroup").style.display = "block";

    openModal("userFormModal");
  }

  function openEditModal(id) {
    const u = users.find((x) => x.id === id);
    if (!u) return;

    formMode = "edit";
    activeUserId = id;
    clearFormErrors();

    document.getElementById("userFormTitle").textContent = "Chỉnh sửa tài khoản";
    const iconEl = document.getElementById("userFormModalIcon");
    if (iconEl) {
      iconEl.className = "modal-icon modal-icon-blue";
      iconEl.innerHTML = '<i class="fa-solid fa-pen"></i>';
    }

    document.getElementById("formTenDangNhap").value = u.tenDangNhap;
    document.getElementById("formTenDangNhap").disabled = true;
    document.getElementById("formHoTen").value = u.hoTen;
    document.getElementById("formEmail").value = u.email;
    document.getElementById("formSdt").value = u.sdt || "";
    document.getElementById("formVaiTro").value = u.vaiTro;
    document.getElementById("formPasswordGroup").style.display = "none";

    openModal("userFormModal");
  }

  function closeFormModal() {
    closeModal("userFormModal");
    activeUserId = null;
  }

  function handleFormSave() {
    clearFormErrors();
    let valid = true;

    const tenDangNhap = document.getElementById("formTenDangNhap").value.trim();
    const hoTen = document.getElementById("formHoTen").value.trim();
    const email = document.getElementById("formEmail").value.trim();
    const sdt = document.getElementById("formSdt").value.trim();
    const vaiTro = document.getElementById("formVaiTro").value;
    const matKhau = document.getElementById("formMatKhau").value.trim();

    if (!tenDangNhap) {
      document.getElementById("errTenDangNhap").textContent = "Vui lòng nhập tên đăng nhập";
      valid = false;
    }

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

    if (formMode === "create" && !matKhau) {
      document.getElementById("errMatKhau").textContent = "Vui lòng nhập mật khẩu khởi tạo";
      valid = false;
    }

    if (!valid) return;

    const saveBtn = document.getElementById("userFormSaveBtn");
    saveBtn.disabled = true;

    const payload = { tenDangNhap, hoTen, email, sdt, vaiTro };
    if (formMode === "create") payload.matKhau = matKhau;

    const action =
      formMode === "create" ? createUser(payload) : updateUser(activeUserId, payload);

    action
      .then(() => {
        closeFormModal();
        renderStats();
        renderTable();

        if (window.Toast && Toast.show) {
          Toast.show(
            formMode === "create" ? "Đã tạo tài khoản mới." : "Đã cập nhật tài khoản.",
            "success"
          );
        }
      })
      .catch((err) => {
        console.error("Lỗi lưu tài khoản:", err);
        if (window.Toast && Toast.show) {
          Toast.show("Lưu tài khoản thất bại, vui lòng thử lại.", "error");
        }
      })
      .finally(() => {
        saveBtn.disabled = false;
      });
  }

  // ====== MODAL KHÓA / MỞ KHÓA ======
  function openLockModal(id, action) {
    const u = users.find((x) => x.id === id);
    if (!u) return;

    pendingLockAction = { id, action };

    document.getElementById("userLockTitle").textContent =
      action === "lock" ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản";

    document.getElementById("userLockMessage").textContent =
      action === "lock"
        ? `Bạn có chắc muốn khóa tài khoản "${u.tenDangNhap}" (${u.hoTen})?`
        : `Bạn có chắc muốn mở khóa tài khoản "${u.tenDangNhap}" (${u.hoTen})?`;

    openModal("userLockModal");
  }

  function closeLockModal() {
    closeModal("userLockModal");
    pendingLockAction = null;
  }

  function handleLockConfirm() {
    if (!pendingLockAction) return;

    const { id, action } = pendingLockAction;
    const okBtn = document.getElementById("userLockOkBtn");
    okBtn.disabled = true;

    const task = action === "lock" ? lockUser(id) : unlockUser(id);

    task
      .then(() => {
        closeLockModal();
        renderStats();
        renderTable();

        if (window.Toast && Toast.show) {
          Toast.show(
            action === "lock" ? "Đã khóa tài khoản." : "Đã mở khóa tài khoản.",
            "success"
          );
        }
      })
      .catch((err) => {
        console.error("Lỗi khóa/mở khóa tài khoản:", err);
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
    document.getElementById("userSearchInput").addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderTable();
    });

    document.getElementById("userRoleFilter").addEventListener("change", (e) => {
      currentRoleFilter = e.target.value;
      renderTable();
    });

    document.getElementById("userStatusFilter").addEventListener("change", (e) => {
      currentStatusFilter = e.target.value;
      renderTable();
    });

    document.getElementById("btnCreateUser").addEventListener("click", openCreateModal);

    document.getElementById("userTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;

      if (action === "view") openDetailModal(id);
      if (action === "edit") openEditModal(id);
      if (action === "lock") openLockModal(id, "lock");
      if (action === "unlock") openLockModal(id, "unlock");
    });

    document.getElementById("userDetailCloseBtn").addEventListener("click", closeDetailModal);
    document.getElementById("userDetailCloseBtn2").addEventListener("click", closeDetailModal);
    const detailOverlay = document.getElementById("userDetailModal");
    detailOverlay.addEventListener("click", (e) => {
      if (e.target === detailOverlay) closeDetailModal();
    });

    document.getElementById("userFormCloseBtn").addEventListener("click", closeFormModal);
    document.getElementById("userFormCancelBtn").addEventListener("click", closeFormModal);
    document.getElementById("userFormSaveBtn").addEventListener("click", handleFormSave);
    const formOverlay = document.getElementById("userFormModal");
    formOverlay.addEventListener("click", (e) => {
      if (e.target === formOverlay) closeFormModal();
    });

    document.getElementById("userLockCloseBtn").addEventListener("click", closeLockModal);
    document.getElementById("userLockCancelBtn").addEventListener("click", closeLockModal);
    document.getElementById("userLockOkBtn").addEventListener("click", handleLockConfirm);
    const lockOverlay = document.getElementById("userLockModal");
    lockOverlay.addEventListener("click", (e) => {
      if (e.target === lockOverlay) closeLockModal();
    });
  }

  // ====== PUBLIC API ======
  function init() {
    bindEvents();
    fetchUsers();
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("active");
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("active");
  }

  async function render(containerId) {
    const success = await ViewLoader.load("views/admin/user-management.html", containerId);
    if (success) this.init();
  }

  return {
    render,
    init,
    bindEvents,
  };
})();
