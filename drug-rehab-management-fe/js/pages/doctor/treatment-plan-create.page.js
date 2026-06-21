const TreatmentPlanCreatePage = {
  // ====== ENDPOINTS ======
  ENDPOINT_LIST: "/doctor/treatment-plan-create/patients",
  ENDPOINT_PLAN_DETAIL: (maHoSo) => `/doctor/treatment-plans/${maHoSo}`,
  ENDPOINT_SAVE_DRAFT: "/doctor/treatment-plans/draft",
  ENDPOINT_SUBMIT: "/doctor/treatment-plans/submit",

  // ====== STATE ======
  patients: [],
  usingFallback: false,
  currentSearch: "",
  currentStageFilter: "all",
  currentStatusFilter: "all",
  activePatient: null,
  stepCounter: 0,

  // ====== MOCK FALLBACK (API-ready: thay bằng dữ liệu từ Api.get) ======
  MOCK_PATIENTS: [
    {
      maHoSo: "BA-RL008",
      hoTenHocVien: "Võ Thị Giang",
      loaiMaTuy: "MaTuyDa",
      giaiDoanHienTai: "GiaiDoan1",
      phacDoGanNhat: null,
      trangThai: "ChuaLap",
    },
    {
      maHoSo: "BA-RL006",
      hoTenHocVien: "Hoàng Văn Phúc",
      loaiMaTuy: "Heroin",
      giaiDoanHienTai: "GiaiDoan2",
      phacDoGanNhat: "PDT-RL006-01",
      trangThai: "Nhap",
    },
    {
      maHoSo: "BA-SEED002",
      hoTenHocVien: "Nguyễn Văn Bình",
      loaiMaTuy: "Heroin",
      giaiDoanHienTai: "GiaiDoan2",
      phacDoGanNhat: "PDT-S002-02",
      trangThai: "ChoDuyet",
    },
    {
      maHoSo: "BA-SEED003",
      hoTenHocVien: "Lê Văn Dũng",
      loaiMaTuy: "MaTuyDa",
      giaiDoanHienTai: "GiaiDoan3",
      phacDoGanNhat: "PDT-S003-02",
      trangThai: "DangApDung",
    },
    {
      maHoSo: "BA-RL005",
      hoTenHocVien: "Phạm Thị Em",
      loaiMaTuy: "ThuocPhien",
      giaiDoanHienTai: "GiaiDoan3",
      phacDoGanNhat: "PDT-RL005-01",
      trangThai: "DangApDung",
    },
  ],

  // ====== HELPERS ======
  escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  getDrugLabel(code) {
    const map = {
      Heroin: "Heroin",
      MaTuyDa: "Ma túy đá",
      CanSa: "Cần sa",
      ThuocPhien: "Thuốc phiện",
      Khac: "Khác",
    };
    return map[code] || code;
  },

  getStageLabel(code) {
    const map = {
      GiaiDoan1: "Giai đoạn 1 - Cắt cơn",
      GiaiDoan2: "Giai đoạn 2 - Phục hồi",
      GiaiDoan3: "Giai đoạn 3 - Tái hòa nhập",
    };
    return map[code] || code;
  },

  getStatusBadge(status) {
    const map = {
      ChuaLap: { label: "Chưa lập phác đồ", cls: "badge-gray" },
      Nhap: { label: "Nháp", cls: "badge-blue" },
      ChoDuyet: { label: "Chờ duyệt", cls: "badge-orange" },
      DangApDung: { label: "Đang áp dụng", cls: "badge-green" },
    };
    const item = map[status] || { label: status, cls: "badge-gray" };
    return `<span class="badge ${item.cls}">${this.escapeHtml(item.label)}</span>`;
  },

  // ====== NORMALIZE DATA (chuẩn hóa dữ liệu từ API hoặc mock) ======
  normalizeData(rawList) {
    return (rawList || []).map((item) => ({
      maHoSo: item.maHoSo || "",
      hoTenHocVien: item.hoTenHocVien || "",
      loaiMaTuy: item.loaiMaTuy || "Khac",
      giaiDoanHienTai: item.giaiDoanHienTai || "GiaiDoan1",
      phacDoGanNhat: item.phacDoGanNhat || null,
      trangThai: item.trangThai || "ChuaLap",
    }));
  },

  extractList(res) {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.items)) return res.items;
    return [];
  },

  getFilteredPatients() {
    return this.patients.filter((p) => {
      const matchStage = this.currentStageFilter === "all" || p.giaiDoanHienTai === this.currentStageFilter;
      const matchStatus = this.currentStatusFilter === "all" || p.trangThai === this.currentStatusFilter;

      const keyword = this.currentSearch.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        p.maHoSo.toLowerCase().includes(keyword) ||
        p.hoTenHocVien.toLowerCase().includes(keyword);

      return matchStage && matchStatus && matchSearch;
    });
  },

  // ====== LOAD DATA ======
  loadData() {
    this.showLoading(true);

    return Api.get(this.ENDPOINT_LIST)
      .then((res) => {
        this.patients = this.normalizeData(this.extractList(res));
        this.usingFallback = false;
      })
      .catch((err) => {
        console.warn("Chưa có API GET treatment-plan-create/patients, dùng mock fallback:", err);
        this.patients = this.normalizeData(JSON.parse(JSON.stringify(this.MOCK_PATIENTS)));
        this.usingFallback = true;
        this.showFallbackNotice();
      })
      .finally(() => {
        this.showLoading(false);
        this.renderStats();
        this.renderTable();
      });
  },

  showLoading(show) {
    const loadingEl = document.getElementById("planLoadingState");
    const tbody = document.getElementById("planTableBody");
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
    if (tbody && show) tbody.innerHTML = "";
  },

  showFallbackNotice() {
    if (window.Toast && Toast.show) {
      Toast.show("Chưa có API danh sách hồ sơ lập phác đồ, đang hiển thị dữ liệu mẫu để demo giao diện.", "error");
    }
  },

  // ====== RENDER STATS ======
  renderStats() {
    const waiting = this.patients.filter((p) => p.trangThai === "ChuaLap").length;
    const draft = this.patients.filter((p) => p.trangThai === "Nhap").length;
    const pending = this.patients.filter((p) => p.trangThai === "ChoDuyet").length;
    const active = this.patients.filter((p) => p.trangThai === "DangApDung").length;

    document.getElementById("statPlanWaiting").textContent = waiting;
    document.getElementById("statPlanDraft").textContent = draft;
    document.getElementById("statPlanPending").textContent = pending;
    document.getElementById("statPlanActive").textContent = active;
  },

  // ====== RENDER TABLE ======
  renderTable() {
    const tbody = document.getElementById("planTableBody");
    const emptyState = document.getElementById("planEmptyState");
    if (!tbody) return;

    const data = this.getFilteredPatients();

    if (data.length === 0) {
      tbody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    const self = this;
    tbody.innerHTML = data
      .map((p) => {
        const maHoSoSafe = self.escapeHtml(p.maHoSo);
        return `
        <tr>
          <td><span class="text-link">${maHoSoSafe}</span></td>
          <td>${self.escapeHtml(p.hoTenHocVien)}</td>
          <td>${self.escapeHtml(self.getDrugLabel(p.loaiMaTuy))}</td>
          <td>${self.escapeHtml(self.getStageLabel(p.giaiDoanHienTai))}</td>
          <td>${p.phacDoGanNhat ? `<span class="text-link">${self.escapeHtml(p.phacDoGanNhat)}</span>` : "-"}</td>
          <td>${self.getStatusBadge(p.trangThai)}</td>
          <td>
            <div class="table-actions">
              ${
                p.phacDoGanNhat
                  ? `<button class="btn-icon" title="Xem chi tiết phác đồ" data-action="view" data-id="${maHoSoSafe}">
                      <i class="fa-solid fa-eye"></i>
                    </button>`
                  : ""
              }
              ${
                p.trangThai === "ChuaLap" || p.trangThai === "Nhap"
                  ? `<button class="btn-icon btn-icon-primary" title="Lập/Chỉnh sửa phác đồ" data-action="create" data-id="${maHoSoSafe}">
                      <i class="fa-solid fa-file-pen"></i>
                    </button>`
                  : ""
              }
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  },

  // ====== MODAL CHI TIẾT ======
  openDetailModal(maHoSo) {
    const p = this.patients.find((x) => x.maHoSo === maHoSo);
    if (!p) return;
    const self = this;

    document.getElementById("planDetailBody").innerHTML = `
      <div class="module-detail-grid">
        <div class="module-detail-item">
          <div class="module-detail-label">Mã hồ sơ</div>
          <div class="module-detail-value">${self.escapeHtml(p.maHoSo)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Họ tên học viên</div>
          <div class="module-detail-value">${self.escapeHtml(p.hoTenHocVien)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Loại ma túy</div>
          <div class="module-detail-value">${self.escapeHtml(self.getDrugLabel(p.loaiMaTuy))}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Giai đoạn hiện tại</div>
          <div class="module-detail-value">${self.escapeHtml(self.getStageLabel(p.giaiDoanHienTai))}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Mã phác đồ gần nhất</div>
          <div class="module-detail-value">${self.escapeHtml(p.phacDoGanNhat || "-")}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Trạng thái</div>
          <div class="module-detail-value">${self.getStatusBadge(p.trangThai)}</div>
        </div>
      </div>
      <p class="doctor-plan-detail-note">
        <i class="fa-solid fa-circle-info"></i>
        Nội dung phác đồ chi tiết sẽ được tải khi tích hợp API <code>GET /doctor/treatment-plans/{maHoSo}</code>.
      </p>
    `;

    document.getElementById("planDetailModal").classList.add("active");
  },

  closeDetailModal() {
    document.getElementById("planDetailModal").classList.remove("active");
  },

  // ====== FORM TẠO PHÁC ĐỒ ======
  openCreateModal(maHoSo) {
    const p = this.patients.find((x) => x.maHoSo === maHoSo);
    if (!p) return;

    this.activePatient = p;
    this.clearFormErrors();
    this.stepCounter = 0;

    document.getElementById("planPatientSummary").innerHTML = `
      <div class="doctor-plan-patient-summary-inner">
        <div class="doctor-plan-patient-avatar"><i class="fa-solid fa-user"></i></div>
        <div>
          <div class="doctor-plan-patient-name">${this.escapeHtml(p.hoTenHocVien)}</div>
          <div class="doctor-plan-patient-meta">
            Mã hồ sơ: <strong>${this.escapeHtml(p.maHoSo)}</strong> &middot;
            ${this.escapeHtml(this.getStageLabel(p.giaiDoanHienTai))}
          </div>
        </div>
      </div>
    `;

    document.getElementById("formLoaiMaTuy").value = p.loaiMaTuy;
    document.getElementById("formGiaiDoan").value = p.giaiDoanHienTai;
    document.getElementById("formNgayBatDau").value = new Date().toISOString().slice(0, 10);
    document.getElementById("formNgayKetThuc").value = "";
    document.getElementById("formMucTieu").value = "";
    document.getElementById("formNoiDungPhacDo").value = "";
    document.getElementById("formGhiChuBacSi").value = "";

    document.getElementById("planStepsContainer").innerHTML = "";
    this.addPlanStep();

    document.getElementById("planFormModal").classList.add("active");
  },

  closeFormModal() {
    document.getElementById("planFormModal").classList.remove("active");
    this.activePatient = null;
  },

  clearFormErrors() {
    document.querySelectorAll("#planFormModal .form-error").forEach((el) => (el.textContent = ""));
  },

  // ====== REPEATER GIAI ĐOẠN NHỎ TRONG PHÁC ĐỒ ======
  addPlanStep(data) {
    this.stepCounter += 1;
    const stepId = `planStep_${this.stepCounter}`;
    const container = document.getElementById("planStepsContainer");

    const wrapper = document.createElement("div");
    wrapper.className = "doctor-plan-step-item";
    wrapper.dataset.stepId = stepId;

    wrapper.innerHTML = `
      <div class="doctor-plan-step-index">${this.stepCounter}</div>
      <div class="doctor-plan-step-fields">
        <div class="form-group">
          <label>Tên giai đoạn nhỏ</label>
          <input type="text" class="form-control plan-step-name" placeholder="VD: Tuần 1 - Theo dõi sinh hiệu" value="${this.escapeHtml((data && data.tenGiaiDoan) || "")}" />
        </div>
        <div class="form-group">
          <label>Nội dung thực hiện</label>
          <textarea class="form-control plan-step-content" rows="2" placeholder="Mô tả nội dung điều trị trong giai đoạn nhỏ này">${this.escapeHtml((data && data.noiDung) || "")}</textarea>
        </div>
        <div class="form-group">
          <label>Số ngày dự kiến</label>
          <input type="number" min="1" class="form-control plan-step-days" placeholder="VD: 7" value="${this.escapeHtml((data && data.soNgay) || "")}" />
        </div>
      </div>
      <button type="button" class="btn-icon btn-icon-danger doctor-plan-step-remove" title="Xóa giai đoạn này">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    container.appendChild(wrapper);
  },

  removePlanStep(stepEl) {
    const container = document.getElementById("planStepsContainer");
    if (container.children.length <= 1) {
      if (window.Toast && Toast.show) {
        Toast.show("Phác đồ cần có ít nhất một giai đoạn.", "error");
      }
      return;
    }
    stepEl.remove();
  },

  collectPlanSteps() {
    const items = document.querySelectorAll("#planStepsContainer .doctor-plan-step-item");
    return Array.from(items).map((el) => ({
      tenGiaiDoan: el.querySelector(".plan-step-name").value.trim(),
      noiDung: el.querySelector(".plan-step-content").value.trim(),
      soNgay: el.querySelector(".plan-step-days").value.trim(),
    }));
  },

  // ====== VALIDATE ======
  validateForm() {
    this.clearFormErrors();
    let valid = true;

    const ngayBatDau = document.getElementById("formNgayBatDau").value;
    const ngayKetThuc = document.getElementById("formNgayKetThuc").value;
    const mucTieu = document.getElementById("formMucTieu").value.trim();
    const noiDungPhacDo = document.getElementById("formNoiDungPhacDo").value.trim();

    if (!ngayBatDau) {
      document.getElementById("errNgayBatDau").textContent = "Vui lòng chọn ngày bắt đầu";
      valid = false;
    }

    if (!ngayKetThuc) {
      document.getElementById("errNgayKetThuc").textContent = "Vui lòng chọn ngày kết thúc dự kiến";
      valid = false;
    } else if (ngayBatDau && ngayKetThuc <= ngayBatDau) {
      document.getElementById("errNgayKetThuc").textContent = "Ngày kết thúc phải sau ngày bắt đầu";
      valid = false;
    }

    if (!mucTieu) {
      document.getElementById("errMucTieu").textContent = "Vui lòng nhập mục tiêu điều trị";
      valid = false;
    }

    if (!noiDungPhacDo) {
      document.getElementById("errNoiDungPhacDo").textContent = "Vui lòng nhập nội dung phác đồ";
      valid = false;
    }

    const steps = this.collectPlanSteps();
    const hasEmptyStep = steps.some((s) => !s.tenGiaiDoan || !s.noiDung);
    if (steps.length === 0 || hasEmptyStep) {
      document.getElementById("errPlanSteps").textContent =
        "Vui lòng nhập đầy đủ tên và nội dung cho từng giai đoạn trong phác đồ";
      valid = false;
    }

    return valid;
  },

  buildPayload(trangThai) {
    return {
      maHoSo: this.activePatient.maHoSo,
      loaiMaTuy: document.getElementById("formLoaiMaTuy").value,
      giaiDoan: document.getElementById("formGiaiDoan").value,
      ngayBatDau: document.getElementById("formNgayBatDau").value,
      ngayKetThuc: document.getElementById("formNgayKetThuc").value,
      mucTieu: document.getElementById("formMucTieu").value.trim(),
      noiDungPhacDo: document.getElementById("formNoiDungPhacDo").value.trim(),
      ghiChuBacSi: document.getElementById("formGhiChuBacSi").value.trim(),
      cacGiaiDoanNho: this.collectPlanSteps(),
      trangThai: trangThai,
    };
  },

  // ====== LƯU NHÁP / GỬI DUYỆT ======
  handleSaveDraft() {
    if (!this.activePatient) return;

    const payload = this.buildPayload("Nhap");
    const btn = document.getElementById("planFormDraftBtn");
    btn.disabled = true;

    const request = this.usingFallback
      ? Promise.resolve(payload)
      : Api.post(this.ENDPOINT_SAVE_DRAFT, payload);

    request
      .then(() => {
        this.applyLocalUpdate(payload.maHoSo, "Nhap", payload);
        this.closeFormModal();
        this.renderStats();
        this.renderTable();

        if (window.Toast && Toast.show) {
          Toast.show("Đã lưu nháp phác đồ điều trị.", "success");
        }
      })
      .catch((err) => {
        console.error("Lỗi lưu nháp phác đồ:", err);
        if (window.Toast && Toast.show) {
          Toast.show("Lỗi lưu nháp phác đồ, vui lòng thử lại.", "error");
        }
      })
      .finally(() => {
        btn.disabled = false;
      });
  },

  handleSubmitForApproval() {
    if (!this.activePatient) return;
    if (!this.validateForm()) return;

    const payload = this.buildPayload("ChoDuyet");
    const btn = document.getElementById("planFormSubmitBtn");
    btn.disabled = true;

    const request = this.usingFallback
      ? Promise.resolve(payload)
      : Api.post(this.ENDPOINT_SUBMIT, payload);

    request
      .then(() => {
        this.applyLocalUpdate(payload.maHoSo, "ChoDuyet", payload);
        this.closeFormModal();
        this.renderStats();
        this.renderTable();

        if (window.Toast && Toast.show) {
          Toast.show("Đã gửi phác đồ điều trị cho quản lý duyệt.", "success");
        }
      })
      .catch((err) => {
        console.error("Lỗi gửi phác đồ duyệt:", err);
        if (window.Toast && Toast.show) {
          Toast.show("Lỗi gửi phác đồ duyệt, vui lòng thử lại.", "error");
        }
      })
      .finally(() => {
        btn.disabled = false;
      });
  },

  applyLocalUpdate(maHoSo, trangThai, payload) {
    const idx = this.patients.findIndex((x) => x.maHoSo === maHoSo);
    if (idx === -1) return;
    this.patients[idx].trangThai = trangThai;
    if (!this.patients[idx].phacDoGanNhat) {
      this.patients[idx].phacDoGanNhat = `PDT-${maHoSo.replace("BA-", "")}-DRAFT`;
    }
  },

  // ====== BIND EVENTS ======
  bindEvents() {
    const self = this;

    document.getElementById("planSearchInput").addEventListener("input", (e) => {
      self.currentSearch = e.target.value;
      self.renderTable();
    });

    document.getElementById("planStageFilter").addEventListener("change", (e) => {
      self.currentStageFilter = e.target.value;
      self.renderTable();
    });

    document.getElementById("planStatusFilter").addEventListener("change", (e) => {
      self.currentStatusFilter = e.target.value;
      self.renderTable();
    });

    document.getElementById("planTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (action === "view") self.openDetailModal(id);
      if (action === "create") self.openCreateModal(id);
    });

    document.getElementById("planDetailCloseBtn").addEventListener("click", () => self.closeDetailModal());
    document.getElementById("planDetailCloseBtn2").addEventListener("click", () => self.closeDetailModal());

    document.getElementById("planFormCloseBtn").addEventListener("click", () => self.closeFormModal());
    document.getElementById("planFormCancelBtn").addEventListener("click", () => self.closeFormModal());
    document.getElementById("planFormDraftBtn").addEventListener("click", () => self.handleSaveDraft());
    document.getElementById("planFormSubmitBtn").addEventListener("click", () => self.handleSubmitForApproval());

    document.getElementById("btnAddPlanStep").addEventListener("click", () => self.addPlanStep());

    document.getElementById("planStepsContainer").addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".doctor-plan-step-remove");
      if (!removeBtn) return;
      const stepEl = removeBtn.closest(".doctor-plan-step-item");
      self.removePlanStep(stepEl);
    });
  },

  // ====== PUBLIC API ======
  init() {
    this.bindEvents();
    this.loadData();
  },

  async render(containerId) {
    const success = await ViewLoader.load("views/doctor/treatment-plan-create.html", containerId);
    if (success) this.init();
  },
};

window.TreatmentPlanCreatePage = TreatmentPlanCreatePage;
