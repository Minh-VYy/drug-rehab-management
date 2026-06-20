const AttendancePage = {
    endpoints: {
        list: '/staff/attendance',
        update: (id) => `/staff/attendance/${id}`
    },

    records: [],
    currentSearch: '',
    currentScheduleFilter: 'all',
    currentStatusFilter: 'all',
    currentDateFilter: '',
    useApi: true,
    updatingId: null,

    statusMeta: {
        CoMat: { label: 'Có mặt', className: 'badge-green' },
        VangMatCoPhep: { label: 'Vắng có phép', className: 'badge-orange' },
        VangMatKhongPhep: { label: 'Vắng không phép', className: 'badge-red' }
    },

    fallbackRecords: [
        {
            id: 'DD001',
            maLich: 'LSH001',
            tenHoatDong: 'Lớp học kỹ năng sống',
            maNguoiCaiNghien: 'NCN001',
            hoTen: 'Nguyễn Văn Bình',
            thoiGian: '2026-06-20T08:00',
            trangThai: 'CoMat',
            ghiChu: ''
        },
        {
            id: 'DD002',
            maLich: 'LSH001',
            tenHoatDong: 'Lớp học kỹ năng sống',
            maNguoiCaiNghien: 'NCN003',
            hoTen: 'Phạm Thị Dung',
            thoiGian: '2026-06-20T08:00',
            trangThai: 'CoMat',
            ghiChu: ''
        },
        {
            id: 'DD003',
            maLich: 'LSH001',
            tenHoatDong: 'Lớp học kỹ năng sống',
            maNguoiCaiNghien: 'NCN007',
            hoTen: 'Bùi Thị Linh',
            thoiGian: '2026-06-20T08:00',
            trangThai: 'VangMatCoPhep',
            ghiChu: 'Đang điều trị y tế tại phòng khám trung tâm.'
        },
        {
            id: 'DD004',
            maLich: 'LSH002',
            tenHoatDong: 'Lao động vệ sinh khuôn viên',
            maNguoiCaiNghien: 'NCN002',
            hoTen: 'Trần Văn Cường',
            thoiGian: '2026-06-20T14:00',
            trangThai: 'CoMat',
            ghiChu: ''
        },
        {
            id: 'DD005',
            maLich: 'LSH002',
            tenHoatDong: 'Lao động vệ sinh khuôn viên',
            maNguoiCaiNghien: 'NCN006',
            hoTen: 'Đặng Văn Khoa',
            thoiGian: '2026-06-20T14:00',
            trangThai: 'VangMatKhongPhep',
            ghiChu: 'Không có mặt, chưa rõ lý do, cần xác minh.'
        }
    ],

    async render(containerId) {
        const success = await ViewLoader.load('views/staff/attendance.html', containerId);
        if (success) await this.init();
    },

    async init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Điểm danh học viên');
        this.currentSearch = '';
        this.currentScheduleFilter = 'all';
        this.currentStatusFilter = 'all';
        this.currentDateFilter = '';
        this.updatingId = null;
        this.bindEvents();
        await this.loadRecords();
    },

    async loadRecords() {
        try {
            if (typeof Api === 'undefined' || typeof Api.getAttendances === 'undefined') throw new Error('Api helper chưa sẵn sàng');
            const data = await Api.getAttendances();
            const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.items) ? data.items : [];
            if (!list.length) throw new Error('Danh sách rỗng, dùng dữ liệu mẫu');
            this.records = list;
            this.useApi = true;
        } catch (error) {
            console.warn('Đang dùng dữ liệu mẫu cho màn điểm danh học viên:', error);
            this.records = this.fallbackRecords.map(item => ({ ...item }));
            this.useApi = false;
        }
        this.populateScheduleFilter();
        this.renderStats();
        this.renderTable();
    },

    populateScheduleFilter() {
        const select = document.getElementById('attendanceScheduleFilter');
        if (!select) return;

        const schedules = [];
        const seen = new Set();
        this.records.forEach((record) => {
            if (record.maLich && !seen.has(record.maLich)) {
                seen.add(record.maLich);
                schedules.push({ maLich: record.maLich, tenHoatDong: record.tenHoatDong });
            }
        });

        const currentValue = select.value || 'all';
        select.innerHTML = '<option value="all">Tất cả lịch sinh hoạt</option>'
            + schedules.map(s => `<option value="${this.escapeHtml(s.maLich)}">${this.escapeHtml(s.maLich)} - ${this.escapeHtml(s.tenHoatDong)}</option>`).join('');
        select.value = schedules.some(s => s.maLich === currentValue) ? currentValue : 'all';
        this.currentScheduleFilter = select.value;
    },

    bindEvents() {
        const searchInput = document.getElementById('attendanceSearchInput');
        const scheduleFilter = document.getElementById('attendanceScheduleFilter');
        const statusFilter = document.getElementById('attendanceStatusFilter');
        const dateFilter = document.getElementById('attendanceDateFilter');
        const tableBody = document.getElementById('attendanceTableBody');

        const detailModal = document.getElementById('attendanceDetailModal');
        const detailCloseBtn = document.getElementById('attendanceDetailCloseBtn');
        const detailCloseBtn2 = document.getElementById('attendanceDetailCloseBtn2');

        const updateModal = document.getElementById('attendanceUpdateModal');
        const updateCloseBtn = document.getElementById('attendanceUpdateCloseBtn');
        const updateCancelBtn = document.getElementById('attendanceUpdateCancelBtn');
        const updateSaveBtn = document.getElementById('attendanceUpdateSaveBtn');
        const updateStatus = document.getElementById('attendanceUpdateStatus');

        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                this.currentSearch = event.target.value.trim().toLowerCase();
                this.renderTable();
            });
        }

        if (scheduleFilter) {
            scheduleFilter.addEventListener('change', (event) => {
                this.currentScheduleFilter = event.target.value;
                this.renderTable();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (event) => {
                this.currentStatusFilter = event.target.value;
                this.renderTable();
            });
        }

        if (dateFilter) {
            dateFilter.addEventListener('change', (event) => {
                this.currentDateFilter = event.target.value;
                this.renderTable();
            });
        }

        if (tableBody) {
            tableBody.addEventListener('click', (event) => {
                const button = event.target.closest('button[data-action]');
                if (!button) return;
                const id = button.dataset.id;
                const action = button.dataset.action;
                if (action === 'view') this.openDetailModal(id);
                if (action === 'update') this.openUpdateModal(id);
            });
        }

        if (detailCloseBtn) detailCloseBtn.addEventListener('click', () => this.closeDetailModal());
        if (detailCloseBtn2) detailCloseBtn2.addEventListener('click', () => this.closeDetailModal());
        if (detailModal) {
            detailModal.addEventListener('click', (event) => {
                if (event.target === detailModal) this.closeDetailModal();
            });
        }

        if (updateCloseBtn) updateCloseBtn.addEventListener('click', () => this.closeUpdateModal());
        if (updateCancelBtn) updateCancelBtn.addEventListener('click', () => this.closeUpdateModal());
        if (updateModal) {
            updateModal.addEventListener('click', (event) => {
                if (event.target === updateModal) this.closeUpdateModal();
            });
        }
        if (updateSaveBtn) updateSaveBtn.addEventListener('click', () => this.saveUpdate());
        if (updateStatus) {
            updateStatus.addEventListener('change', () => this.toggleNoteRequirement());
        }
    },

    getFilteredRecords() {
        return this.records.filter((record) => {
            const matchesSearch = !this.currentSearch
                || (record.maNguoiCaiNghien || '').toLowerCase().includes(this.currentSearch)
                || (record.hoTen || '').toLowerCase().includes(this.currentSearch)
                || (record.maLich || '').toLowerCase().includes(this.currentSearch);

            const matchesSchedule = this.currentScheduleFilter === 'all' || record.maLich === this.currentScheduleFilter;
            const matchesStatus = this.currentStatusFilter === 'all' || record.trangThai === this.currentStatusFilter;
            const matchesDate = !this.currentDateFilter || (record.thoiGian || '').startsWith(this.currentDateFilter);

            return matchesSearch && matchesSchedule && matchesStatus && matchesDate;
        });
    },

    renderStats() {
        const total = this.records.length;
        const present = this.records.filter(r => r.trangThai === 'CoMat').length;
        const excused = this.records.filter(r => r.trangThai === 'VangMatCoPhep').length;
        const unexcused = this.records.filter(r => r.trangThai === 'VangMatKhongPhep').length;

        const totalEl = document.getElementById('statAttendanceTotal');
        const presentEl = document.getElementById('statAttendancePresent');
        const excusedEl = document.getElementById('statAttendanceExcused');
        const unexcusedEl = document.getElementById('statAttendanceUnexcused');

        if (totalEl) totalEl.textContent = total;
        if (presentEl) presentEl.textContent = present;
        if (excusedEl) excusedEl.textContent = excused;
        if (unexcusedEl) unexcusedEl.textContent = unexcused;
    },

    renderTable() {
        const tableBody = document.getElementById('attendanceTableBody');
        if (!tableBody) return;

        const filtered = this.getFilteredRecords();

        if (!filtered.length) {
            tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="staff-attendance-state-cell">
            <div class="staff-attendance-empty">
              <i class="fa-solid fa-folder-open"></i>
              Không tìm thấy lượt điểm danh phù hợp.
            </div>
          </td>
        </tr>
      `;
            return;
        }

        tableBody.innerHTML = filtered.map((record) => {
            const statusInfo = this.statusMeta[record.trangThai] || { label: record.trangThai || '—', className: 'badge-gray' };

            return `
        <tr>
          <td><span class="td-code">${this.escapeHtml(record.maLich)}</span></td>
          <td>${this.escapeHtml(record.tenHoatDong)}</td>
          <td><span class="td-code">${this.escapeHtml(record.maNguoiCaiNghien)}</span></td>
          <td>${this.escapeHtml(record.hoTen)}</td>
          <td>${this.formatDateTime(record.thoiGian)}</td>
          <td><span class="badge ${statusInfo.className}">${this.escapeHtml(statusInfo.label)}</span></td>
          <td>${this.escapeHtml(record.ghiChu) || '—'}</td>
          <td>
            <div class="action-btns">
              <button class="btn btn-sm btn-outline btn-icon" data-action="view" data-id="${this.escapeHtml(record.id)}" title="Xem chi tiết">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-primary btn-icon" data-action="update" data-id="${this.escapeHtml(record.id)}" title="Cập nhật điểm danh">
                <i class="fa-solid fa-pen"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
        }).join('');
    },

    formatDateTime(value) {
        if (!value) return '—';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return this.escapeHtml(value);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${hh}:${min} ${dd}/${mm}/${yyyy}`;
    },

    openDetailModal(id) {
        const record = this.records.find(r => r.id === id);
        if (!record) return;

        const modal = document.getElementById('attendanceDetailModal');
        const body = document.getElementById('attendanceDetailBody');
        if (!modal || !body) return;

        const statusInfo = this.statusMeta[record.trangThai] || { label: record.trangThai || '—', className: 'badge-gray' };

        body.innerHTML = `
      <div style="display:grid; gap:24px;">
        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-calendar-days" style="color:var(--primary); margin-right:8px;"></i>
            Thông tin lịch
          </h4>
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Mã lịch</div>
              <div style="font-size:14px; font-weight:600;"><span class="td-code">${this.escapeHtml(record.maLich)}</span></div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Hoạt động</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(record.tenHoatDong)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md); grid-column:1/-1;">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Thời gian</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.formatDateTime(record.thoiGian)}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-user" style="color:var(--success); margin-right:8px;"></i>
            Thông tin học viên
          </h4>
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Mã học viên</div>
              <div style="font-size:14px; font-weight:600;"><span class="td-code">${this.escapeHtml(record.maNguoiCaiNghien)}</span></div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Họ tên</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(record.hoTen)}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-circle-check" style="color:var(--primary); margin-right:8px;"></i>
            Trạng thái điểm danh
          </h4>
          <span class="badge ${statusInfo.className}">${this.escapeHtml(statusInfo.label)}</span>
        </div>

        <div style="padding:16px; background:rgba(59,130,246,0.08); border-left:4px solid var(--primary); border-radius:var(--radius-md);">
          <div style="font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            <i class="fa-solid fa-note-sticky" style="margin-right:8px;"></i>
            Ghi chú
          </div>
          <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">
            ${this.escapeHtml(record.ghiChu) || '<em>Không có ghi chú.</em>'}
          </div>
        </div>
      </div>
    `;

        modal.classList.add('active');
    },

    closeDetailModal() {
        const modal = document.getElementById('attendanceDetailModal');
        if (modal) modal.classList.remove('active');
    },

    openUpdateModal(id) {
        const record = this.records.find(r => r.id === id);
        if (!record) return;

        this.updatingId = id;

        const modal = document.getElementById('attendanceUpdateModal');
        const title = document.getElementById('attendanceUpdateTitle');
        const summary = document.getElementById('attendanceUpdateSummary');
        const idInput = document.getElementById('attendanceUpdateId');
        const statusInput = document.getElementById('attendanceUpdateStatus');
        const noteInput = document.getElementById('attendanceUpdateNote');
        const noteError = document.getElementById('attendanceUpdateNoteError');

        if (!modal || !title || !summary || !statusInput || !noteInput) return;

        title.textContent = `Cập nhật điểm danh - ${record.hoTen}`;
        summary.textContent = `${record.maLich} - ${record.tenHoatDong} (${this.formatDateTime(record.thoiGian)})`;
        idInput.value = record.id;
        statusInput.value = record.trangThai;
        noteInput.value = record.ghiChu || '';
        if (noteError) noteError.style.display = 'none';

        this.toggleNoteRequirement();
        modal.classList.add('active');
    },

    closeUpdateModal() {
        const modal = document.getElementById('attendanceUpdateModal');
        if (modal) modal.classList.remove('active');
        this.updatingId = null;
    },

    toggleNoteRequirement() {
        const statusInput = document.getElementById('attendanceUpdateStatus');
        const requiredMark = document.getElementById('attendanceUpdateNoteRequired');
        if (!statusInput || !requiredMark) return;

        const needsNote = statusInput.value === 'VangMatCoPhep' || statusInput.value === 'VangMatKhongPhep';
        requiredMark.style.display = needsNote ? 'inline' : 'none';
    },

    async saveUpdate() {
        if (!this.updatingId) return;
        const record = this.records.find(r => r.id === this.updatingId);
        if (!record) return;

        const statusInput = document.getElementById('attendanceUpdateStatus');
        const noteInput = document.getElementById('attendanceUpdateNote');
        const noteError = document.getElementById('attendanceUpdateNoteError');

        const status = statusInput.value;
        const note = noteInput.value.trim();
        const needsNote = status === 'VangMatCoPhep' || status === 'VangMatKhongPhep';

        if (needsNote && !note) {
            if (noteError) noteError.style.display = 'block';
            return;
        }
        if (noteError) noteError.style.display = 'none';

        const payload = { trangThai: status, ghiChu: note };

        try {
            if (typeof Api === 'undefined' || typeof Api.updateAttendance === 'undefined') throw new Error('Api helper chưa sẵn sàng');
            await Api.updateAttendance(this.updatingId, payload);
        } catch (error) {
            console.warn('Chưa thể gọi API cập nhật điểm danh, cập nhật cục bộ:', error);
        }

        record.trangThai = status;
        record.ghiChu = note;

        if (typeof Toast !== 'undefined') {
            Toast.show('Đã cập nhật điểm danh.', 'success');
        }

        this.closeUpdateModal();
        this.renderStats();
        this.renderTable();
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

window.AttendancePage = AttendancePage;
