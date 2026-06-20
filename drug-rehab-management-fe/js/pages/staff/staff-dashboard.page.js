const StaffDashboardPage = {
  endpoints: {
    summary: '/staff/dashboard'
  },

  summary: null,
  tasks: [],
  useApi: true,

  taskTypeMeta: {
    Tiepnhan: { label: 'Tiếp nhận hồ sơ', icon: 'fa-file-import', route: '/receive' },
    ThamGap: { label: 'Duyệt thăm gặp', icon: 'fa-calendar-check', route: '/visits' },
    SinhHoat: { label: 'Lịch sinh hoạt', icon: 'fa-clipboard-list', route: '/activities' },
    DiemDanh: { label: 'Điểm danh', icon: 'fa-user-check', route: '/attendance' }
  },

  statusMeta: {
    ChoXuLy: { label: 'Chờ xử lý', className: 'badge-orange' },
    DangXuLy: { label: 'Đang xử lý', className: 'badge-blue' },
    HoanThanh: { label: 'Hoàn thành', className: 'badge-green' }
  },

  fallbackSummary: {
    hoSoChoTiepNhan: 17,
    hocVienDangDieuTri: 6,
    phieuThamChoDuyet: 5,
    lichSinhHoatHomNay: 3
  },

  fallbackTasks: [
    {
      id: 'TASK001',
      loaiViec: 'Tiepnhan',
      doiTuong: 'NCN011 - Lê Văn Khải',
      thoiGian: '08:30 hôm nay',
      trangThai: 'ChoXuLy'
    },
    {
      id: 'TASK002',
      loaiViec: 'ThamGap',
      doiTuong: 'TG006 - Đặng Thị Mai (gặp NCN006)',
      thoiGian: '09:15 hôm nay',
      trangThai: 'ChoXuLy'
    },
    {
      id: 'TASK003',
      loaiViec: 'SinhHoat',
      doiTuong: 'LSH001 - Lớp học kỹ năng sống',
      thoiGian: '08:00 - 10:00 hôm nay',
      trangThai: 'DangXuLy'
    },
    {
      id: 'TASK004',
      loaiViec: 'DiemDanh',
      doiTuong: 'LSH002 - Lao động vệ sinh khuôn viên',
      thoiGian: '14:00 hôm nay',
      trangThai: 'ChoXuLy'
    },
    {
      id: 'TASK005',
      loaiViec: 'ThamGap',
      doiTuong: 'TG009 - Lý Văn Tài (gặp NCN009)',
      thoiGian: '10:00 hôm nay',
      trangThai: 'ChoXuLy'
    },
    {
      id: 'TASK006',
      loaiViec: 'Tiepnhan',
      doiTuong: 'NCN012 - Phan Thị Yến',
      thoiGian: '11:00 hôm nay',
      trangThai: 'ChoXuLy'
    }
  ],

  async render(containerId) {
    const success = await ViewLoader.load('views/staff/staff-dashboard.html', containerId);
    if (success) await this.init();
  },

  async init() {
    if (typeof Topbar !== 'undefined') Topbar.setTitle('Dashboard Cán bộ trung tâm');
    this.setUserName();
    this.setDateCard();
    this.bindEvents();
    await this.loadDashboard();
  },

  setUserName() {
    const nameEl = document.getElementById('staffDashboardUserName');
    if (!nameEl) return;
    try {
      if (typeof Auth !== 'undefined' && Auth.getCurrentUser) {
        const user = Auth.getCurrentUser();
        if (user) {
          const displayName = user.fullName || user.hoTen || user.username;
          if (displayName) {
            nameEl.textContent = displayName;
          }
        }
      }
    } catch (error) {
      console.warn('Không lấy được thông tin người dùng hiện tại:', error);
    }
  },

  setDateCard() {
    const dayEl = document.getElementById('staffDashboardDateDay');
    const labelEl = document.getElementById('staffDashboardDateLabel');
    if (!dayEl || !labelEl) return;

    const now = new Date();
    const weekdays = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    dayEl.textContent = String(now.getDate());
    labelEl.textContent = `${weekdays[now.getDay()]}, Th${now.getMonth() + 1} ${now.getFullYear()}`;
  },

  async loadDashboard() {
    try {
      if (typeof Api === 'undefined' || typeof Api.getStaffDashboard === 'undefined') throw new Error('Api helper chưa sẵn sàng');
      const data = await Api.getStaffDashboard();
      const payload = data?.data || data;
      if (!payload || !payload.tasks) throw new Error('Dữ liệu dashboard rỗng, dùng dữ liệu mẫu');
      this.summary = payload.summary || this.fallbackSummary;
      this.tasks = Array.isArray(payload.tasks) ? payload.tasks : [];
      this.useApi = true;
    } catch (error) {
      console.warn('Đang dùng dữ liệu mẫu cho dashboard cán bộ trung tâm:', error);
      this.summary = { ...this.fallbackSummary };
      this.tasks = this.fallbackTasks.map(item => ({ ...item }));
      this.useApi = false;
    }
    this.renderStats();
    this.renderTasks();
  },

  bindEvents() {
    const quickActions = document.getElementById('staffDashboardQuickActions');
    const taskList = document.getElementById('staffDashboardTaskList');

    if (quickActions) {
      quickActions.addEventListener('click', (event) => {
        const item = event.target.closest('[data-route]');
        if (!item) return;
        this.navigateTo(item.dataset.route);
      });
    }

    if (taskList) {
      taskList.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-route]');
        if (!button) return;
        this.navigateTo(button.dataset.route);
      });
    }
  },

  navigateTo(route) {
    if (typeof Router !== 'undefined' && typeof Router.navigate === 'function') {
      Router.navigate(route);
    } else {
      location.hash = `#${route}`;
    }
  },

  renderStats() {
    const totalIntake = document.getElementById('statDashPendingIntake');
    const treating = document.getElementById('statDashTreatingPatients');
    const visits = document.getElementById('statDashPendingVisits');
    const activities = document.getElementById('statDashActivitiesToday');

    if (totalIntake) totalIntake.textContent = this.summary?.hoSoChoTiepNhan ?? 0;
    if (treating) treating.textContent = this.summary?.hocVienDangDieuTri ?? 0;
    if (visits) visits.textContent = this.summary?.phieuThamChoDuyet ?? 0;
    if (activities) activities.textContent = this.summary?.lichSinhHoatHomNay ?? 0;
  },

  renderTasks() {
    const taskList = document.getElementById('staffDashboardTaskList');
    if (!taskList) return;

    if (!this.tasks.length) {
      taskList.innerHTML = `
        <div class="staff-dashboard-empty">
          <i class="fa-solid fa-circle-check"></i>
          Không có việc cần xử lý hôm nay.
        </div>
      `;
      return;
    }

    taskList.innerHTML = this.tasks.map((task) => {
      const typeInfo = this.taskTypeMeta[task.loaiViec] || { label: task.loaiViec || '—', icon: 'fa-circle', route: '/' };
      const statusInfo = this.statusMeta[task.trangThai] || { label: task.trangThai || '—', className: 'badge-gray' };

      return `
        <div class="recent-item">
          <div class="recent-avatar" style="background:rgba(59,130,246,0.12);color:#3b82f6;">
            <i class="fa-solid ${typeInfo.icon}"></i>
          </div>
          <div class="recent-info">
            <div class="recent-name">${this.escapeHtml(typeInfo.label)}</div>
            <div class="recent-sub">${this.escapeHtml(task.doiTuong)} &nbsp;·&nbsp; ${this.escapeHtml(task.thoiGian)}</div>
          </div>
          <div style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
            <span class="badge ${statusInfo.className}">${this.escapeHtml(statusInfo.label)}</span>
            <button class="btn btn-sm btn-outline" data-route="${this.escapeHtml(typeInfo.route)}" title="Đi tới màn xử lý">
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
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

window.StaffDashboardPage = StaffDashboardPage;