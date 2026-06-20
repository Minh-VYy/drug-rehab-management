const PatientManagementPage = {
  endpoints: {
    list: '/staff/patients'
  },

  patients: [],
  currentSearch: '',
  currentStageFilter: 'all',
  currentStatusFilter: 'all',
  useApi: true,

  stageLabels: {
    TiepNhan: 'Tiếp nhận',
    CatCon: 'Cắt cơn',
    PhucHoi: 'Phục hồi',
    TaiHoaNhap: 'Tái hòa nhập',
    HoanThanh: 'Hoàn thành'
  },

  statusMeta: {
    DangDieuTri: { label: 'Đang điều trị', className: 'badge-blue' },
    ChoPhanPhong: { label: 'Chờ phân phòng', className: 'badge-orange' },
    HoanThanh: { label: 'Hoàn thành', className: 'badge-green' },
    TamDung: { label: 'Tạm dừng', className: 'badge-red' }
  },

  fallbackPatients: [
    {
      maNguoiCaiNghien: 'NCN001',
      hoTen: 'Nguyễn Văn Bình',
      cccd: '048201001234',
      ngaySinh: '12/03/1994',
      gioiTinh: 'Nam',
      ngayVaoTrai: '10/06/2026',
      giaiDoanHienTai: 'CatCon',
      khuPhong: 'Khu A - Phòng 101',
      bacSiPhuTrach: 'BS. Trần Thị Mai',
      trangThai: 'DangDieuTri',
      nguonTiepNhan: 'Hồ sơ bàn giao từ công an',
      maHoSoBanGiao: 'HSBG003',
      nguoiThan: 'Nguyễn Thị Lan',
      quanHeNguoiThan: 'Mẹ',
      sdtNguoiThan: '0901234567',
      ghiChu: 'Sức khỏe ổn định khi tiếp nhận.'
    },
    {
      maNguoiCaiNghien: 'NCN002',
      hoTen: 'Trần Văn Cường',
      cccd: '048201001235',
      ngaySinh: '05/11/1990',
      gioiTinh: 'Nam',
      ngayVaoTrai: '12/06/2026',
      giaiDoanHienTai: 'TiepNhan',
      khuPhong: 'Chưa phân phòng',
      bacSiPhuTrach: 'BS. Lê Văn Hùng',
      trangThai: 'ChoPhanPhong',
      nguonTiepNhan: 'Tự nguyện đăng ký',
      maHoSoBanGiao: '',
      nguoiThan: 'Trần Thị Hoa',
      quanHeNguoiThan: 'Vợ',
      sdtNguoiThan: '0912345678',
      ghiChu: 'Cần khám sức khỏe tổng quát trong tuần đầu.'
    },
    {
      maNguoiCaiNghien: 'NCN003',
      hoTen: 'Phạm Thị Dung',
      cccd: '048301001236',
      ngaySinh: '20/07/1996',
      gioiTinh: 'Nữ',
      ngayVaoTrai: '01/05/2026',
      giaiDoanHienTai: 'PhucHoi',
      khuPhong: 'Khu B - Phòng 203',
      bacSiPhuTrach: 'BS. Trần Thị Mai',
      trangThai: 'DangDieuTri',
      nguonTiepNhan: 'Hồ sơ bàn giao từ công an',
      maHoSoBanGiao: 'HSBG010',
      nguoiThan: 'Phạm Văn Sơn',
      quanHeNguoiThan: 'Bố',
      sdtNguoiThan: '0987654321',
      ghiChu: 'Tiến triển tốt, hợp tác điều trị.'
    },
    {
      maNguoiCaiNghien: 'NCN004',
      hoTen: 'Hoàng Văn Đạt',
      cccd: '048201001237',
      ngaySinh: '15/01/1988',
      gioiTinh: 'Nam',
      ngayVaoTrai: '20/03/2026',
      giaiDoanHienTai: 'TaiHoaNhap',
      khuPhong: 'Khu C - Phòng 305',
      bacSiPhuTrách: 'BS. Lê Văn Hùng',
      bacSiPhuTrach: 'BS. Lê Văn Hùng',
      trangThai: 'DangDieuTri',
      nguonTiepNhan: 'Hồ sơ bàn giao từ công an',
      maHoSoBanGiao: 'HSBG002',
      nguoiThan: 'Hoàng Thị Yến',
      quanHeNguoiThan: 'Mẹ',
      sdtNguoiThan: '0934567890',
      ghiChu: 'Đã tham gia đầy đủ các buổi tư vấn tâm lý.'
    },
    {
      maNguoiCaiNghien: 'NCN005',
      hoTen: 'Vũ Thị Hằng',
      cccd: '048301001238',
      ngaySinh: '09/09/1999',
      gioiTinh: 'Nữ',
      ngayVaoTrai: '05/01/2026',
      giaiDoanHienTai: 'HoanThanh',
      khuPhong: 'Khu B - Phòng 201',
      bacSiPhuTrach: 'BS. Trần Thị Mai',
      trangThai: 'HoanThanh',
      nguonTiepNhan: 'Tự nguyện đăng ký',
      maHoSoBanGiao: '',
      nguoiThan: 'Vũ Văn Long',
      quanHeNguoiThan: 'Anh trai',
      sdtNguoiThan: '0945678901',
      ghiChu: 'Hoàn thành chương trình điều trị, tái hòa nhập tốt.'
    },
    {
      maNguoiCaiNghien: 'NCN006',
      hoTen: 'Đặng Văn Khoa',
      cccd: '048201001239',
      ngaySinh: '28/04/1993',
      gioiTinh: 'Nam',
      ngayVaoTrai: '18/06/2026',
      giaiDoanHienTai: 'TiepNhan',
      khuPhong: 'Chưa phân phòng',
      bacSiPhuTrach: 'BS. Lê Văn Hùng',
      trangThai: 'ChoPhanPhong',
      nguonTiepNhan: 'Hồ sơ bàn giao từ công an',
      maHoSoBanGiao: 'HSBG015',
      nguoiThan: 'Đặng Thị Mai',
      quanHeNguoiThan: 'Mẹ',
      sdtNguoiThan: '0956789012',
      ghiChu: 'Mới tiếp nhận, đang chờ khám sàng lọc.'
    },
    {
      maNguoiCaiNghien: 'NCN007',
      hoTen: 'Bùi Thị Linh',
      cccd: '048301001240',
      ngaySinh: '17/02/1995',
      gioiTinh: 'Nữ',
      ngayVaoTrai: '22/04/2026',
      giaiDoanHienTai: 'CatCon',
      khuPhong: 'Khu B - Phòng 205',
      bacSiPhuTrach: 'BS. Trần Thị Mai',
      trangThai: 'TamDung',
      nguonTiepNhan: 'Tự nguyện đăng ký',
      maHoSoBanGiao: '',
      nguoiThan: 'Bùi Văn Nam',
      quanHeNguoiThan: 'Chồng',
      sdtNguoiThan: '0967890123',
      ghiChu: 'Tạm dừng điều trị do vấn đề sức khỏe, đang theo dõi.'
    },
    {
      maNguoiCaiNghien: 'NCN008',
      hoTen: 'Ngô Văn Phúc',
      cccd: '048201001241',
      ngaySinh: '03/12/1991',
      gioiTinh: 'Nam',
      ngayVaoTrai: '14/02/2026',
      giaiDoanHienTai: 'PhucHoi',
      khuPhong: 'Khu A - Phòng 108',
      bacSiPhuTrach: 'BS. Lê Văn Hùng',
      trangThai: 'DangDieuTri',
      nguonTiepNhan: 'Hồ sơ bàn giao từ công an',
      maHoSoBanGiao: 'HSBG007',
      nguoiThan: 'Ngô Thị Thu',
      quanHeNguoiThan: 'Vợ',
      sdtNguoiThan: '0978901234',
      ghiChu: 'Tham gia tích cực các hoạt động sinh hoạt tập thể.'
    },
    {
      maNguoiCaiNghien: 'NCN009',
      hoTen: 'Lý Thị Quỳnh',
      cccd: '048301001242',
      ngaySinh: '30/06/1997',
      gioiTinh: 'Nữ',
      ngayVaoTrai: '08/06/2026',
      giaiDoanHienTai: 'TiepNhan',
      khuPhong: 'Chưa phân phòng',
      bacSiPhuTrach: 'BS. Trần Thị Mai',
      trangThai: 'ChoPhanPhong',
      nguonTiepNhan: 'Hồ sơ bàn giao từ công an',
      maHoSoBanGiao: 'HSBG018',
      nguoiThan: 'Lý Văn Tài',
      quanHeNguoiThan: 'Bố',
      sdtNguoiThan: '0989012345',
      ghiChu: 'Đang chờ bố trí phòng phù hợp.'
    },
    {
      maNguoiCaiNghien: 'NCN010',
      hoTen: 'Trương Văn Sơn',
      cccd: '048201001243',
      ngaySinh: '11/08/1989',
      gioiTinh: 'Nam',
      ngayVaoTrai: '02/12/2025',
      giaiDoanHienTai: 'HoanThanh',
      khuPhong: 'Khu C - Phòng 310',
      bacSiPhuTrach: 'BS. Lê Văn Hùng',
      trangThai: 'HoanThanh',
      nguonTiepNhan: 'Tự nguyện đăng ký',
      maHoSoBanGiao: '',
      nguoiThan: 'Trương Thị Hà',
      quanHeNguoiThan: 'Mẹ',
      sdtNguoiThan: '0990123456',
      ghiChu: 'Hoàn thành chương trình, theo dõi sau cai 6 tháng.'
    }
  ],

  async render(containerId) {
    const success = await ViewLoader.load('views/staff/patient-management.html', containerId);
    if (success) await this.init();
  },

  async init() {
    if (typeof Topbar !== 'undefined') Topbar.setTitle('Quản lý học viên');
    this.currentSearch = '';
    this.currentStageFilter = 'all';
    this.currentStatusFilter = 'all';
    this.bindEvents();
    await this.loadPatients();
  },

  async loadPatients() {
    try {
      if (typeof Api === 'undefined' || typeof Api.getStaffPatients === 'undefined') throw new Error('Api helper chưa sẵn sàng');
      const data = await Api.getStaffPatients();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.items)
            ? data.items
            : [];
      if (!list.length) throw new Error('Danh sách rỗng, dùng dữ liệu mẫu');
      this.patients = list;
      this.useApi = true;
    } catch (error) {
      console.warn('Đang dùng dữ liệu mẫu cho màn quản lý học viên:', error);
      this.patients = this.fallbackPatients.map(item => ({ ...item }));
      this.useApi = false;
    }
    this.renderStats();
    this.renderTable();
  },

  bindEvents() {
    const searchInput = document.getElementById('patientSearchInput');
    const stageFilter = document.getElementById('patientStageFilter');
    const statusFilter = document.getElementById('patientStatusFilter');
    const tableBody = document.getElementById('patientTableBody');
    const closeBtn = document.getElementById('patientDetailCloseBtn');
    const closeBtn2 = document.getElementById('patientDetailCloseBtn2');
    const modal = document.getElementById('patientDetailModal');

    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        this.currentSearch = event.target.value.trim().toLowerCase();
        this.renderTable();
      });
    }

    if (stageFilter) {
      stageFilter.addEventListener('change', (event) => {
        this.currentStageFilter = event.target.value;
        this.renderTable();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', (event) => {
        this.currentStatusFilter = event.target.value;
        this.renderTable();
      });
    }

    if (tableBody) {
      tableBody.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        if (button.dataset.action === 'view') {
          this.openDetailModal(button.dataset.id);
        }
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDetailModal());
    if (closeBtn2) closeBtn2.addEventListener('click', () => this.closeDetailModal());
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) this.closeDetailModal();
      });
    }
  },

  getFilteredPatients() {
    return this.patients.filter((patient) => {
      const matchesSearch = !this.currentSearch
        || (patient.maNguoiCaiNghien || '').toLowerCase().includes(this.currentSearch)
        || (patient.hoTen || '').toLowerCase().includes(this.currentSearch)
        || (patient.cccd || '').toLowerCase().includes(this.currentSearch);

      const matchesStage = this.currentStageFilter === 'all'
        || patient.giaiDoanHienTai === this.currentStageFilter;

      const matchesStatus = this.currentStatusFilter === 'all'
        || patient.trangThai === this.currentStatusFilter;

      return matchesSearch && matchesStage && matchesStatus;
    });
  },

  renderStats() {
    const total = this.patients.length;
    const treating = this.patients.filter(p => p.trangThai === 'DangDieuTri').length;
    const waitingRoom = this.patients.filter(p => p.trangThai === 'ChoPhanPhong').length;
    const completed = this.patients.filter(p => p.trangThai === 'HoanThanh').length;

    const totalEl = document.getElementById('statTotalPatients');
    const treatingEl = document.getElementById('statTreating');
    const waitingEl = document.getElementById('statWaitingRoom');
    const completedEl = document.getElementById('statCompleted');

    if (totalEl) totalEl.textContent = total;
    if (treatingEl) treatingEl.textContent = treating;
    if (waitingEl) waitingEl.textContent = waitingRoom;
    if (completedEl) completedEl.textContent = completed;
  },

  renderTable() {
    const tableBody = document.getElementById('patientTableBody');
    if (!tableBody) return;

    const filtered = this.getFilteredPatients();

    if (!filtered.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="staff-patient-state-cell">
            <div class="staff-patient-empty">
              <i class="fa-solid fa-folder-open"></i>
              Không tìm thấy học viên phù hợp.
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map((patient) => {
      const stageLabel = this.stageLabels[patient.giaiDoanHienTai] || patient.giaiDoanHienTai || '—';
      const statusInfo = this.statusMeta[patient.trangThai] || { label: patient.trangThai || '—', className: 'badge-gray' };

      return `
        <tr>
          <td><span class="text-code">${this.escapeHtml(patient.maNguoiCaiNghien)}</span></td>
          <td>${this.escapeHtml(patient.hoTen)}</td>
          <td>${this.escapeHtml(patient.cccd)}</td>
          <td>${this.escapeHtml(patient.ngayVaoTrai)}</td>
          <td>${this.escapeHtml(stageLabel)}</td>
          <td>${this.escapeHtml(patient.khuPhong)}</td>
          <td>${this.escapeHtml(patient.bacSiPhuTrach)}</td>
          <td><span class="badge ${statusInfo.className}">${this.escapeHtml(statusInfo.label)}</span></td>
          <td>
            <button class="btn-icon" data-action="view" data-id="${this.escapeHtml(patient.maNguoiCaiNghien)}" title="Xem chi tiết">
              <i class="fa-solid fa-eye"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  openDetailModal(id) {
    const patient = this.patients.find(p => p.maNguoiCaiNghien === id);
    if (!patient) return;

    const modal = document.getElementById('patientDetailModal');
    const body = document.getElementById('patientDetailBody');
    if (!modal || !body) return;

    const stageLabel = this.stageLabels[patient.giaiDoanHienTai] || patient.giaiDoanHienTai || '—';
    const statusInfo = this.statusMeta[patient.trangThai] || { label: patient.trangThai || '—', className: 'badge-gray' };

    body.innerHTML = `
      <div style="display:grid; gap:24px;">
        
        <!-- Thông tin cá nhân -->
        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-user" style="color:var(--primary); margin-right:8px;"></i>
            Thông tin cá nhân
          </h4>
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Mã học viên</div>
              <div style="font-size:14px; font-weight:600;"><span class="td-code">${this.escapeHtml(patient.maNguoiCaiNghien)}</span></div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Họ tên</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.hoTen)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">CCCD</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.cccd)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Ngày sinh</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.ngaySinh)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Giới tính</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.gioiTinh)}</div>
            </div>
          </div>
        </div>

        <!-- Tiếp nhận -->
        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-right-to-bracket" style="color:var(--success); margin-right:8px;"></i>
            Tiếp nhận
          </h4>
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Ngày vào trại</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.ngayVaoTrai)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Nguồn tiếp nhận</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.nguonTiepNhan)}</div>
            </div>
            ${patient.maHoSoBanGiao ? `
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md); grid-column:1/-1;">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Mã hồ sơ bàn giao</div>
              <div style="font-size:14px; font-weight:600;"><span class="td-code">${this.escapeHtml(patient.maHoSoBanGiao)}</span></div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Điều trị -->
        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-notes-medical" style="color:var(--primary); margin-right:8px;"></i>
            Điều trị
          </h4>
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Giai đoạn hiện tại</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(stageLabel)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Bác sĩ phụ trách</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.bacSiPhuTrach)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Khu/phòng</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.khuPhong)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Trạng thái</div>
              <div style="font-size:14px; font-weight:600;"><span class="badge ${statusInfo.className}">${this.escapeHtml(statusInfo.label)}</span></div>
            </div>
          </div>
        </div>

        <!-- Người thân -->
        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-people-roof" style="color:var(--purple); margin-right:8px;"></i>
            Người thân liên hệ
          </h4>
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Họ tên</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.nguoiThan)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Quan hệ</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.quanHeNguoiThan)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md); grid-column:1/-1;">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Số điện thoại</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(patient.sdtNguoiThan)}</div>
            </div>
          </div>
        </div>

        <!-- Ghi chú -->
        <div style="padding:16px; background:rgba(59,130,246,0.08); border-left:4px solid var(--primary); border-radius:var(--radius-md);">
          <div style="font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            <i class="fa-solid fa-note-sticky" style="margin-right:8px;"></i>
            Ghi chú
          </div>
          <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">
            ${this.escapeHtml(patient.ghiChu) || '<em>Không có ghi chú.</em>'}
          </div>
        </div>

      </div>
    `;

    modal.classList.add('active');
  },

  closeDetailModal() {
    const modal = document.getElementById('patientDetailModal');
    if (modal) modal.classList.remove('active');
  },

  escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};

window.PatientManagementPage = PatientManagementPage;
