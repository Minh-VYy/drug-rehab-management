window.AssignmentPage = (function () {
  // ====== ENDPOINTS ======
  const ENDPOINT_LIST = "/manager/assignments";
  const ENDPOINT_STAFF_OPTIONS = "/manager/staff-options";
  const ENDPOINT_ASSIGN = (maHoSo) => `/manager/assignments/${maHoSo}`;

  function extractList(res) {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.items)) return res.items;
    return [];
  }

  // ====== MOCK FALLBACK ======
  const MOCK_ASSIGNMENTS = [
    {
      maHoSo: "BA-SEED002",
      hoTenNguoiCaiNghien: "Nguyễn Văn B",
      giaiDoanHienTai: "Giai đoạn 2 - Phục hồi",
      bacSiPhuTrach: "BS. Trần Thị Mai",
      canBoPhuTrach: "NV. Lê Thị Hồng",
      khuPhong: "Khu A - Phòng 101",
      ghiChuPhanCong: "Theo dõi sát do tiền sử tái phát.",
      trangThai: "DaPhanCong",
    },
    {
      maHoSo: "BA-SEED003",
      hoTenNguoiCaiNghien: "Lê Văn D",
      giaiDoanHienTai: "Giai đoạn 3 - Tái hòa nhập",
      bacSiPhuTrach: "BS. Trần Thị Mai",
      canBoPhuTrach: "NV. Lê Thị Hồng",
      khuPhong: "Khu B - Phòng 203",
      ghiChuPhanCong: "",
      trangThai: "DaPhanCong",
    },
    {
      maHoSo: "BA-RL005",
      hoTenNguoiCaiNghien: "Phạm Thị E",
      giaiDoanHienTai: "Giai đoạn 3 - Tái hòa nhập",
      bacSiPhuTrach: "BS. Nguyễn Văn Thành",
      canBoPhuTrach: "",
      khuPhong: "Khu A - Phòng 105",
      ghiChuPhanCong: "",
      trangThai: "DaPhanCong",
    },
    {
      maHoSo: "BA-RL006",
      hoTenNguoiCaiNghien: "Hoàng Văn F",
      giaiDoanHienTai: "Giai đoạn 1 - Cắt cơn",
      bacSiPhuTrach: "",
      canBoPhuTrach: "",
      khuPhong: "",
      ghiChuPhanCong: "",
      trangThai: "ChuaPhanCong",
    },
    {
      maHoSo: "BA-RL008",
      hoTenNguoiCaiNghien: "Võ Thị G",
      giaiDoanHienTai: "Giai đoạn 1 - Cắt cơn",
      bacSiPhuTrach: "",
      canBoPhuTrach: "",
      khuPhong: "",
      ghiChuPhanCong: "",
      trangThai: "ChuaPhanCong",
    },
  ];

  const MOCK_DOCTOR_OPTIONS = ["BS. Trần Thị Mai", "BS. Nguyễn Văn Thành"];
  const MOCK_STAFF_OPTIONS = ["NV. Lê Thị Hồng", "NV. Đặng Văn Khoa"];

  // ====== STATE ======
  let assignments = [];
  let usingFallback = false;
  let currentSearch = "";
  let currentStatusFilter = "all";
  let activeMaHoSo = null;

  // ====== HELPERS ======
  function getStatusBadge(status) {
    const map = {
      DaPhanCong: { label: "Đã phân công", cls: "badge-green" },
      ChuaPhanCong: { label: "Chưa phân công", cls: "badge-orange" },
    };
    const item = map[status] || { label: status, cls: "badge-gray" };
    return `<span class="badge ${item.cls}">${item.label}</span>`;
  }

  function getFilteredAssignments() {
    return assignments.filter((a) => {
      const matchStatus = currentStatusFilter === "all" || a.trangThai === currentStatusFilter;

      const keyword = currentSearch.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        a.maHoSo.toLowerCase().includes(keyword) ||
        a.hoTenNguoiCaiNghien.toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }

  function clearFormErrors() {
    document.getElementById("errBacSiPhuTrach").textContent = "Vui lòng chọn bác sĩ phụ trách";
  }

  function showLoading(show) {
    const loadingEl = document.getElementById("assignLoadingState");
    const tbody = document.getElementById("assignTableBody");
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
    if (tbody && show) tbody.innerHTML = "";
  }

  function showFallbackNotice() {
    if (window.Toast && Toast.show) {
      Toast.show("Chưa có API phân công, đang hiển thị dữ liệu mẫu để demo giao diện.", "error");
    }
  }

  // ====== GỌI API (fallback mock khi lỗi) ======
  function fetchAssignments() {
    showLoading(true);

    return Api.get(ENDPOINT_LIST)
      .then((res) => {
        assignments = extractList(res);
        usingFallback = false;
      })
      .catch((err) => {
        console.warn("Chưa có API GET /manager/assignments, dùng mock fallback:", err);
        assignments = JSON.parse(JSON.stringify(MOCK_ASSIGNMENTS));
        usingFallback = true;
        showFallbackNotice();
      })
      .finally(() => {
        showLoading(false);
        renderStats();
        renderTable();
      });
  }

  function fetchStaffOptions() {
    return Api.get(ENDPOINT_STAFF_OPTIONS)
      .then((res) => {
        const data = res && res.data ? res.data : null;
        return {
          bacSi: (data && data.bacSi) || MOCK_DOCTOR_OPTIONS,
          canBo: (data && data.canBo) || MOCK_STAFF_OPTIONS,
        };
      })
      .catch(() => ({ bacSi: MOCK_DOCTOR_OPTIONS, canBo: MOCK_STAFF_OPTIONS }));
  }

  function saveAssignment(maHoSo, payload) {
    if (usingFallback) {
      const idx = assignments.findIndex((a) => a.maHoSo === maHoSo);
      if (idx !== -1) {
        Object.assign(assignments[idx], payload);
        assignments[idx].trangThai = payload.bacSiPhuTrach ? "DaPhanCong" : "ChuaPhanCong";
      }
      return Promise.resolve(assignments[idx]);
    }

    return Api.put(ENDPOINT_ASSIGN(maHoSo), payload).then(() => {
      const idx = assignments.findIndex((a) => a.maHoSo === maHoSo);
      if (idx !== -1) {
        Object.assign(assignments[idx], payload);
        assignments[idx].trangThai = payload.bacSiPhuTrach ? "DaPhanCong" : "ChuaPhanCong";
      }
      return assignments[idx];
    });
  }

  // ====== RENDER STATS ======
  function renderStats() {
    document.getElementById("statTotalAssign").textContent = assignments.length;
    document.getElementById("statAssigned").textContent =
      assignments.filter((a) => a.trangThai === "DaPhanCong").length;
    document.getElementById("statUnassigned").textContent =
      assignments.filter((a) => a.trangThai === "ChuaPhanCong").length;
  }

  // ====== RENDER TABLE ======
  function renderTable() {
    const tbody = document.getElementById("assignTableBody");
    const emptyState = document.getElementById("assignEmptyState");
    if (!tbody) return;

    const data = getFilteredAssignments();

    if (data.length === 0) {
      tbody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    tbody.innerHTML = data
      .map(
        (a) => `
        <tr>
          <td><span class="text-link">${a.maHoSo}</span></td>
          <td>${a.hoTenNguoiCaiNghien}</td>
          <td>${a.giaiDoanHienTai}</td>
          <td>${a.bacSiPhuTrach || "-"}</td>
          <td>${a.canBoPhuTrach || "-"}</td>
          <td>${a.khuPhong || "-"}</td>
          <td>${getStatusBadge(a.trangThai)}</td>
          <td>
            <div class="table-actions manager-action-group manager-assign-actions">
              <button class="btn btn-sm btn-primary btn-icon manager-action-btn manager-action-assign" title="Phân công" aria-label="Phân công" data-action="assign" data-id="${a.maHoSo}">
                <i class="fa-solid fa-user-pen"></i>
              </button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");
  }

  // ====== MODAL PHÂN CÔNG ======
  function fillSelectOptions(selectEl, options, selectedValue, allowEmpty) {
    const opts = allowEmpty ? ["", ...options] : options;
    selectEl.innerHTML = opts
      .map((opt) => `<option value="${opt}" ${opt === selectedValue ? "selected" : ""}>${opt || "-- Chưa chọn --"}</option>`)
      .join("");
  }

  function openAssignModal(maHoSo) {
    const a = assignments.find((x) => x.maHoSo === maHoSo);
    if (!a) return;

    activeMaHoSo = maHoSo;
    clearFormErrors();

    document.getElementById("assignInfoMaHoSo").textContent = a.maHoSo;
    document.getElementById("assignInfoHoTen").textContent = a.hoTenNguoiCaiNghien;
    document.getElementById("formKhuPhong").value = a.khuPhong || "";
    document.getElementById("formGhiChuPhanCong").value = a.ghiChuPhanCong || "";

    fetchStaffOptions().then(({ bacSi, canBo }) => {
      fillSelectOptions(document.getElementById("formBacSiPhuTrach"), bacSi, a.bacSiPhuTrach, true);
      fillSelectOptions(document.getElementById("formCanBoPhuTrach"), canBo, a.canBoPhuTrach, true);
    });

    document.getElementById("assignFormModal").classList.add("active");
  }

  function closeAssignModal() {
    document.getElementById("assignFormModal").classList.remove("active");
    activeMaHoSo = null;
  }

  function handleAssignSave() {
    clearFormErrors();

    const bacSiPhuTrach = document.getElementById("formBacSiPhuTrach").value;
    const canBoPhuTrach = document.getElementById("formCanBoPhuTrach").value;
    const khuPhong = document.getElementById("formKhuPhong").value.trim();
    const ghiChuPhanCong = document.getElementById("formGhiChuPhanCong").value.trim();

    if (!bacSiPhuTrach) {
      document.getElementById("errBacSiPhuTrach").textContent = "Vui lòng chọn bác sĩ phụ trách";
      return;
    }

    if (!activeMaHoSo) return;

    const payload = { bacSiPhuTrach, canBoPhuTrach, khuPhong, ghiChuPhanCong };

    saveAssignment(activeMaHoSo, payload).then(() => {
      closeAssignModal();
      renderStats();
      renderTable();

      if (window.Toast && Toast.show) {
        Toast.show("Đã lưu phân công phụ trách.", "success");
      }
    });
  }

  // ====== EVENTS ======
  function bindEvents() {
    document.getElementById("assignSearchInput").addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderTable();
    });

    document.getElementById("assignStatusFilter").addEventListener("change", (e) => {
      currentStatusFilter = e.target.value;
      renderTable();
    });

    document.getElementById("assignTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      if (btn.dataset.action === "assign") openAssignModal(btn.dataset.id);
    });

    document.getElementById("assignFormCloseBtn").addEventListener("click", closeAssignModal);
    document.getElementById("assignFormCancelBtn").addEventListener("click", closeAssignModal);
    document.getElementById("assignFormSaveBtn").addEventListener("click", handleAssignSave);
  }

  // ====== GỌI API (fallback mock khi lỗi) ======
  function init() {
    bindEvents();
    fetchAssignments();
  }

  async function render(containerId) {
    const success = await ViewLoader.load("views/manager/assignment.html", containerId);
    if (success) this.init();
  }

  return { render, init, bindEvents };
})();