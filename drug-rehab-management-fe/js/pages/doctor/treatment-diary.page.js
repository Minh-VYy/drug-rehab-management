const TreatmentDiaryPage = {
  ENDPOINT_LIST: "/doctor/treatment-diary",
  ENDPOINT_CREATE: "/doctor/treatment-diary",
  ENDPOINT_UPDATE: (maNhatKy) => `/doctor/treatment-diary/${maNhatKy}`,

  diaries: [],
  currentSearch: "",
  currentLevelFilter: "all",
  currentDateFilter: "",
  activeDiaryId: null,
  formMode: "create",
  diaryCounter: 0,

  MOCK_DIARIES: [],
  MOCK_PATIENT_OPTIONS: [],

  escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  getTodayInputValue() {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
  },

  getCurrentDoctorCode() {
    const user = typeof Auth !== "undefined" ? Auth.getCurrentUser() : null;
    return user?.doctorCode || user?.username || "BSPT001";
  },

  getLevelLabel(level) {
    const map = {
      Nhe: "Nhẹ",
      TrungBinh: "Trung bình",
      Nang: "Nặng",
    };
    return map[level] || level || "-";
  },

  getLevelBadge(level) {
    const map = {
      Nhe: { label: "Nhẹ", cls: "badge-green" },
      TrungBinh: { label: "Trung bình", cls: "badge-orange" },
      Nang: { label: "Nặng", cls: "badge-red" },
    };
    const item = map[level] || { label: level || "Chưa rõ", cls: "badge-gray" };
    return `<span class="badge ${item.cls}">${this.escapeHtml(item.label)}</span>`;
  },

  formatDateDisplay(isoDate) {
    if (!isoDate) return "-";
    const date = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) return this.escapeHtml(isoDate);
    return date.toLocaleDateString("vi-VN");
  },

  extractList(res) {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.items)) return res.items;
    return [];
  },

  normalizeDiary(item) {
    return {
      maNhatKy: item.maNhatKy || "",
      maBenhAn: item.maBenhAn || "",
      maBacSi: item.maBacSi || "",
      maChiTietPhacDo: item.maChiTietPhacDo || "",
      hoTenHocVien: item.hoTenHocVien || "",
      ngayGhi: item.ngayGhi || "",
      tinhTrangSucKhoe: item.tinhTrangSucKhoe || "",
      trieuChung: item.trieuChung || "",
      nhietDo: item.nhietDo || "",
      huyetAp: item.huyetAp || "",
      nhipTim: item.nhipTim || "",
      thuocSuDung: item.thuocSuDung || "",
      lieuLuong: item.lieuLuong || "",
      mucDoNghien: item.mucDoNghien || "Nhe",
      chanDoan: item.chanDoan || "",
      huongXuLy: item.huongXuLy || "",
    };
  },

  getFilteredDiaries() {
    const keyword = this.currentSearch.trim().toLowerCase();

    return this.diaries.filter((diary) => {
      const matchLevel = this.currentLevelFilter === "all" || diary.mucDoNghien === this.currentLevelFilter;
      const matchDate = !this.currentDateFilter || diary.ngayGhi === this.currentDateFilter;
      const searchSource = [
        diary.maNhatKy,
        diary.maBenhAn,
        diary.maChiTietPhacDo,
        diary.hoTenHocVien,
        diary.tinhTrangSucKhoe,
        diary.chanDoan,
      ]
        .join(" ")
        .toLowerCase();

      return matchLevel && matchDate && (!keyword || searchSource.includes(keyword));
    });
  },

  showLoading(show) {
    const loadingEl = document.getElementById("diaryLoadingState");
    const tbody = document.getElementById("diaryTableBody");
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
    if (tbody && show) tbody.innerHTML = "";
  },

  async loadData() {
    this.showLoading(true);
    try {
      if (typeof Api !== 'undefined' && Api.getTreatmentDiaries) {
        const [diariesRes, patientsRes] = await Promise.all([
            Api.getTreatmentDiaries(),
            Api.getPatientsForDiary()
        ]);
        this.MOCK_DIARIES = this.extractList(diariesRes);
        this.MOCK_PATIENT_OPTIONS = this.extractList(patientsRes);
      }
      this.diaries = this.MOCK_DIARIES.map((item) => this.normalizeDiary(item));
      this.diaryCounter = this.diaries.length;
    } catch (error) {
      console.error("Failed to load treatment diaries", error);
      this.showToast("Lỗi khi tải dữ liệu nhật ký điều trị", "error");
    } finally {
      this.showLoading(false);
      this.renderStats();
      this.renderTable();
    }
  },

  renderStats() {
    const today = this.getTodayInputValue();
    const todayCount = this.diaries.filter((diary) => diary.ngayGhi === today).length;
    const patientCount = new Set(this.diaries.map((diary) => diary.maBenhAn)).size;
    const followUpCount = this.diaries.filter((diary) => (diary.huongXuLy || "").toLowerCase().includes("tái khám")).length;
    const severeCount = this.diaries.filter((diary) => diary.mucDoNghien === "Nang").length;

    this.setText("statDiaryToday", todayCount);
    this.setText("statDiaryPatients", patientCount);
    this.setText("statDiaryFollowUp", followUpCount);
    this.setText("statDiarySevere", severeCount);
  },

  setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },

  renderTable() {
    const tbody = document.getElementById("diaryTableBody");
    const emptyState = document.getElementById("diaryEmptyState");
    if (!tbody) return;

    const data = this.getFilteredDiaries();
    if (data.length === 0) {
      tbody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    tbody.innerHTML = data
      .map((diary) => {
        const id = this.escapeHtml(diary.maNhatKy);
        return `
          <tr>
            <td><span class="text-link">${id}</span></td>
            <td>${this.escapeHtml(diary.maBenhAn)}</td>
            <td>${this.escapeHtml(diary.hoTenHocVien)}</td>
            <td><span class="td-code">${this.escapeHtml(diary.maChiTietPhacDo || "-")}</span></td>
            <td>${this.formatDateDisplay(diary.ngayGhi)}</td>
            <td class="doctor-diary-cell-truncate" title="${this.escapeHtml(diary.tinhTrangSucKhoe)}">
              ${this.escapeHtml(diary.tinhTrangSucKhoe)}
            </td>
            <td>${this.getLevelBadge(diary.mucDoNghien)}</td>
            <td class="doctor-diary-cell-truncate" title="${this.escapeHtml(diary.chanDoan || "-")}">
              ${this.escapeHtml(diary.chanDoan || "-")}
            </td>
            <td>
              <div class="table-actions">
                <button class="btn btn-icon btn-outline" title="Xem chi tiết" data-action="view" data-id="${id}">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn btn-icon btn-outline btn-icon-primary" title="Cập nhật nhật ký" data-action="edit" data-id="${id}">
                  <i class="fa-solid fa-pen"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  },

  getDiary(id) {
    return this.diaries.find((diary) => diary.maNhatKy === id);
  },

  openDetailModal(id) {
    const diary = this.getDiary(id);
    if (!diary) return;

    const body = document.getElementById("diaryDetailBody");
    if (!body) return;

    body.innerHTML = `
      <div class="module-detail-grid">
        ${this.renderDetailItem("Mã nhật ký", diary.maNhatKy)}
        ${this.renderDetailItem("Mã bệnh án", diary.maBenhAn)}
        ${this.renderDetailItem("Họ tên học viên", diary.hoTenHocVien)}
        ${this.renderDetailItem("Mã bác sĩ", diary.maBacSi || "-")}
        ${this.renderDetailItem("Mã chi tiết phác đồ", diary.maChiTietPhacDo || "-")}
        ${this.renderDetailItem("Ngày ghi", this.formatDateDisplay(diary.ngayGhi))}
        ${this.renderDetailItem("Mức độ nghiện", this.getLevelBadge(diary.mucDoNghien), true)}
        ${this.renderDetailItem("Nhiệt độ", diary.nhietDo ? `${diary.nhietDo} °C` : "-")}
        ${this.renderDetailItem("Huyết áp", diary.huyetAp || "-")}
        ${this.renderDetailItem("Nhịp tim", diary.nhipTim ? `${diary.nhipTim} lần/phút` : "-")}
        ${this.renderDetailItem("Thuốc sử dụng", diary.thuocSuDung || "-")}
        ${this.renderDetailItem("Liều lượng", diary.lieuLuong || "-")}
        ${this.renderDetailItem("Tình trạng sức khỏe", diary.tinhTrangSucKhoe, false, true)}
        ${this.renderDetailItem("Triệu chứng", diary.trieuChung || "-", false, true)}
        ${this.renderDetailItem("Chẩn đoán", diary.chanDoan || "-", false, true)}
        ${this.renderDetailItem("Hướng xử lý", diary.huongXuLy || "-", false, true)}
      </div>
    `;

    this.openModal("diaryDetailModal");
  },

  renderDetailItem(label, value, rawValue, fullWidth) {
    return `
      <div class="module-detail-item ${fullWidth ? "module-detail-full" : ""}">
        <div class="module-detail-label">${this.escapeHtml(label)}</div>
        <div class="module-detail-value">${rawValue ? value : this.escapeHtml(value)}</div>
      </div>
    `;
  },

  fillPatientOptions(selectedMaBenhAn) {
    const select = document.getElementById("formMaBenhAn");
    if (!select) return;

    select.innerHTML = this.MOCK_PATIENT_OPTIONS.map((patient) => {
      const selected = patient.maBenhAn === selectedMaBenhAn ? "selected" : "";
      return `
        <option value="${this.escapeHtml(patient.maBenhAn)}" ${selected}>
          ${this.escapeHtml(patient.maBenhAn)} - ${this.escapeHtml(patient.hoTenHocVien)}
        </option>
      `;
    }).join("");

    this.syncSelectedPatientProtocol();
  },

  getSelectedPatientOption() {
    const maBenhAn = document.getElementById("formMaBenhAn")?.value || "";
    return this.MOCK_PATIENT_OPTIONS.find((patient) => patient.maBenhAn === maBenhAn) || null;
  },

  syncSelectedPatientProtocol() {
    const patient = this.getSelectedPatientOption();
    const protocolEl = document.getElementById("formMaChiTietPhacDo");
    if (protocolEl) protocolEl.value = patient?.maChiTietPhacDo || "";
  },

  clearFormErrors() {
    document.querySelectorAll("#diaryFormModal .form-error").forEach((el) => {
      el.textContent = "";
    });
  },

  resetForm() {
    this.clearFormErrors();
    this.fillPatientOptions(null);
    this.setValue("formNgayGhi", this.getTodayInputValue());
    this.setValue("formMucDoNghien", "");
    this.setValue("formNhietDo", "");
    this.setValue("formHuyetAp", "");
    this.setValue("formNhipTim", "");
    this.setValue("formThuocSuDung", "");
    this.setValue("formLieuLuong", "");
    this.setValue("formTinhTrangSucKhoe", "");
    this.setValue("formTrieuChung", "");
    this.setValue("formChanDoan", "");
    this.setValue("formHuongXuLy", "");
  },

  setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || "";
  },

  openCreateModal() {
    this.formMode = "create";
    this.activeDiaryId = null;
    this.resetForm();
    this.setText("diaryFormTitle", "Ghi nhật ký điều trị mới");

    const maBenhAnEl = document.getElementById("formMaBenhAn");
    if (maBenhAnEl) maBenhAnEl.disabled = false;

    this.openModal("diaryFormModal");
  },

  openEditModal(id) {
    const diary = this.getDiary(id);
    if (!diary) return;

    this.formMode = "edit";
    this.activeDiaryId = id;
    this.clearFormErrors();
    this.setText("diaryFormTitle", "Cập nhật nhật ký điều trị");
    this.fillPatientOptions(diary.maBenhAn);

    const maBenhAnEl = document.getElementById("formMaBenhAn");
    if (maBenhAnEl) maBenhAnEl.disabled = true;

    this.setValue("formNgayGhi", diary.ngayGhi);
    this.setValue("formMucDoNghien", diary.mucDoNghien);
    this.setValue("formNhietDo", diary.nhietDo);
    this.setValue("formHuyetAp", diary.huyetAp);
    this.setValue("formNhipTim", diary.nhipTim);
    this.setValue("formThuocSuDung", diary.thuocSuDung);
    this.setValue("formLieuLuong", diary.lieuLuong);
    this.setValue("formTinhTrangSucKhoe", diary.tinhTrangSucKhoe);
    this.setValue("formTrieuChung", diary.trieuChung);
    this.setValue("formChanDoan", diary.chanDoan);
    this.setValue("formHuongXuLy", diary.huongXuLy);

    this.openModal("diaryFormModal");
  },

  isValidNumber(value) {
    if (!value) return true;
    return /^[0-9]+(\.[0-9]+)?$/.test(value.trim());
  },

  validateForm() {
    this.clearFormErrors();
    let valid = true;

    const maBenhAn = document.getElementById("formMaBenhAn")?.value || "";
    const ngayGhi = document.getElementById("formNgayGhi")?.value || "";
    const mucDoNghien = document.getElementById("formMucDoNghien")?.value || "";
    const tinhTrangSucKhoe = document.getElementById("formTinhTrangSucKhoe")?.value.trim() || "";
    const nhietDo = document.getElementById("formNhietDo")?.value.trim() || "";
    const nhipTim = document.getElementById("formNhipTim")?.value.trim() || "";

    if (!maBenhAn) {
      this.setText("errMaBenhAn", "Vui lòng chọn mã bệnh án");
      valid = false;
    }

    if (!ngayGhi) {
      this.setText("errNgayGhi", "Vui lòng chọn ngày ghi");
      valid = false;
    }

    if (!mucDoNghien) {
      this.setText("errMucDoNghien", "Vui lòng chọn mức độ nghiện");
      valid = false;
    }

    if (!tinhTrangSucKhoe) {
      this.setText("errTinhTrangSucKhoe", "Vui lòng nhập tình trạng sức khỏe");
      valid = false;
    }

    if (!this.isValidNumber(nhietDo)) {
      this.setText("errNhietDo", "Nhiệt độ phải là số hợp lệ");
      valid = false;
    }

    if (!this.isValidNumber(nhipTim)) {
      this.setText("errNhipTim", "Nhịp tim phải là số hợp lệ");
      valid = false;
    }

    return valid;
  },

  buildPayload() {
    const patient = this.getSelectedPatientOption();

    return {
      maBenhAn: document.getElementById("formMaBenhAn")?.value || "",
      maBacSi: this.getCurrentDoctorCode(),
      maChiTietPhacDo: document.getElementById("formMaChiTietPhacDo")?.value || patient?.maChiTietPhacDo || "",
      hoTenHocVien: patient?.hoTenHocVien || "",
      ngayGhi: document.getElementById("formNgayGhi")?.value || "",
      tinhTrangSucKhoe: document.getElementById("formTinhTrangSucKhoe")?.value.trim() || "",
      trieuChung: document.getElementById("formTrieuChung")?.value.trim() || "",
      nhietDo: document.getElementById("formNhietDo")?.value.trim() || "",
      huyetAp: document.getElementById("formHuyetAp")?.value.trim() || "",
      nhipTim: document.getElementById("formNhipTim")?.value.trim() || "",
      thuocSuDung: document.getElementById("formThuocSuDung")?.value.trim() || "",
      lieuLuong: document.getElementById("formLieuLuong")?.value.trim() || "",
      mucDoNghien: document.getElementById("formMucDoNghien")?.value || "",
      chanDoan: document.getElementById("formChanDoan")?.value.trim() || "",
      huongXuLy: document.getElementById("formHuongXuLy")?.value.trim() || "",
    };
  },

  async handleSaveForm() {
    if (!this.validateForm()) return;

    const payload = this.buildPayload();
    const saveBtn = document.getElementById("diaryFormSaveBtn");
    if (saveBtn) saveBtn.disabled = true;

    try {
      if (typeof Api !== 'undefined' && Api.createTreatmentDiary) {
        if (this.formMode === "create") {
          await Api.createTreatmentDiary(payload);
        } else {
          await Api.updateTreatmentDiary(this.activeDiaryId, payload);
        }
      } else {
        throw new Error("API not ready");
      }

      this.closeModal("diaryFormModal");
      this.showToast(this.formMode === "create" ? "Đã ghi nhật ký điều trị mới." : "Đã cập nhật nhật ký điều trị.", "success");
      await this.loadData();
    } catch (error) {
      console.error("Failed to save diary", error);
      this.showToast("Lỗi khi lưu nhật ký điều trị", "error");
    } finally {
      if (saveBtn) saveBtn.disabled = false;
    }
  },

  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("active");
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("active");
    if (id === "diaryFormModal") this.activeDiaryId = null;
  },

  showToast(message, type = "success") {
    if (typeof Toast !== "undefined" && typeof Toast.show === "function") {
      Toast.show(message, type);
    } else if (typeof showToast === "function") {
      showToast(message, type);
    }
  },

  bindEvents() {
    const btnCreate = document.getElementById("btnCreateDiary");
    const searchInput = document.getElementById("diarySearchInput");
    const levelFilter = document.getElementById("diaryLevelFilter");
    const dateFilter = document.getElementById("diaryDateFilter");
    const tableBody = document.getElementById("diaryTableBody");
    const patientSelect = document.getElementById("formMaBenhAn");

    btnCreate?.addEventListener("click", () => this.openCreateModal());

    searchInput?.addEventListener("input", (event) => {
      this.currentSearch = event.target.value;
      this.renderTable();
    });

    levelFilter?.addEventListener("change", (event) => {
      this.currentLevelFilter = event.target.value;
      this.renderTable();
    });

    dateFilter?.addEventListener("change", (event) => {
      this.currentDateFilter = event.target.value;
      this.renderTable();
    });

    tableBody?.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-action]");
      if (!btn) return;

      if (btn.dataset.action === "view") this.openDetailModal(btn.dataset.id);
      if (btn.dataset.action === "edit") this.openEditModal(btn.dataset.id);
    });

    patientSelect?.addEventListener("change", () => this.syncSelectedPatientProtocol());

    document.getElementById("diaryDetailCloseBtn")?.addEventListener("click", () => this.closeModal("diaryDetailModal"));
    document.getElementById("diaryDetailCloseBtn2")?.addEventListener("click", () => this.closeModal("diaryDetailModal"));
    document.getElementById("diaryFormCloseBtn")?.addEventListener("click", () => this.closeModal("diaryFormModal"));
    document.getElementById("diaryFormCancelBtn")?.addEventListener("click", () => this.closeModal("diaryFormModal"));
    document.getElementById("diaryFormSaveBtn")?.addEventListener("click", () => this.handleSaveForm());

    ["diaryDetailModal", "diaryFormModal"].forEach((id) => {
      const overlay = document.getElementById(id);
      overlay?.addEventListener("click", (event) => {
        if (event.target === overlay) this.closeModal(id);
      });
    });
  },

  init() {
    this.currentSearch = "";
    this.currentLevelFilter = "all";
    this.currentDateFilter = "";
    this.activeDiaryId = null;
    this.formMode = "create";
    this.bindEvents();
    this.loadData();
  },

  async render(containerId) {
    const success = await ViewLoader.load("views/doctor/treatment-diary.html", containerId);
    if (success) this.init();
  },
};

window.TreatmentDiaryPage = TreatmentDiaryPage;
