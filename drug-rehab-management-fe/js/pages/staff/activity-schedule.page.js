const ActivitySchedulePage = {
    endpoints: {
        list: '/staff/activity-schedules',
        create: '/staff/activity-schedules',
        update: (id) => `/staff/activity-schedules/${id}`,
        cancel: (id) => `/staff/activity-schedules/${id}/cancel`
    },

    activities: [],
    currentSearch: '',
    currentTypeFilter: 'all',
    currentStatusFilter: 'all',
    useApi: true,
    editingId: null,
    cancelingId: null,
    nextSeq: 11,

    typeLabels: {
        GiaoDuc: 'Giáo dục',
        LaoDong: 'Lao động',
        TheThao: 'Thể thao',
        TuVan: 'Tư vấn',
        GiaiTri: 'Giải trí'
    },

    statusMeta: {
        SapDienRa: { label: 'Sắp diễn ra', className: 'badge-blue' },
        DangDienRa: { label: 'Đang diễn ra', className: 'badge-orange' },
        HoanThanh: { label: 'Hoàn thành', className: 'badge-green' },
        Huy: { label: 'Hủy', className: 'badge-red' }
    },

    fallbackActivities: [
        {
            maLich: 'LSH001',
            tenHoatDong: 'Lớp học kỹ năng sống',
            loaiHoatDong: 'GiaoDuc',
            thoiGianBatDau: '2026-06-20T08:00',
            thoiGianKetThuc: '2026-06-20T10:00',
            diaDiem: 'Hội trường A',
            nguoiPhuTrach: 'CB. Nguyễn Văn Tâm',
            nhomThamGia: 'Khu A',
            trangThai: 'DangDienRa',
            ghiChu: 'Buổi học định kỳ thứ Bảy hàng tuần.'
        },
        {
            maLich: 'LSH002',
            tenHoatDong: 'Lao động vệ sinh khuôn viên',
            loaiHoatDong: 'LaoDong',
            thoiGianBatDau: '2026-06-20T14:00',
            thoiGianKetThuc: '2026-06-20T16:00',
            diaDiem: 'Khuôn viên trung tâm',
            nguoiPhuTrach: 'CB. Trần Văn Lực',
            nhomThamGia: 'Khu B',
            trangThai: 'SapDienRa',
            ghiChu: ''
        },
        {
            maLich: 'LSH003',
            tenHoatDong: 'Bóng chuyền giao lưu',
            loaiHoatDong: 'TheThao',
            thoiGianBatDau: '2026-06-21T15:30',
            thoiGianKetThuc: '2026-06-21T17:00',
            diaDiem: 'Sân thể thao',
            nguoiPhuTrach: 'CB. Lê Văn Hòa',
            nhomThamGia: 'Khu A, Khu B',
            trangThai: 'SapDienRa',
            ghiChu: 'Chuẩn bị thêm nước uống cho học viên.'
        },
        {
            maLich: 'LSH004',
            tenHoatDong: 'Tư vấn tâm lý nhóm',
            loaiHoatDong: 'TuVan',
            thoiGianBatDau: '2026-06-19T09:00',
            thoiGianKetThuc: '2026-06-19T10:30',
            diaDiem: 'Phòng tư vấn 1',
            nguoiPhuTrach: 'CV. Phạm Thị Ngọc',
            nhomThamGia: 'Khu C',
            trangThai: 'HoanThanh',
            ghiChu: 'Đã hoàn thành, có biên bản đính kèm.'
        },
        {
            maLich: 'LSH005',
            tenHoatDong: 'Chiếu phim cuối tuần',
            loaiHoatDong: 'GiaiTri',
            thoiGianBatDau: '2026-06-21T19:00',
            thoiGianKetThuc: '2026-06-21T21:00',
            diaDiem: 'Hội trường B',
            nguoiPhuTrach: 'CB. Đỗ Thị Hằng',
            nhomThamGia: 'Toàn trung tâm',
            trangThai: 'SapDienRa',
            ghiChu: ''
        }
    ],

    async render(containerId) {
        const success = await ViewLoader.load('views/staff/activity-schedule.html', containerId);
        if (success) await this.init();
    },

    async init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Lập lịch sinh hoạt');
        this.currentSearch = '';
        this.currentTypeFilter = 'all';
        this.currentStatusFilter = 'all';
        this.editingId = null;
        this.cancelingId = null;
        this.bindEvents();
        await this.loadActivities();
    },

    async loadActivities() {
        try {
            if (typeof Api === 'undefined' || typeof Api.getActivities === 'undefined') throw new Error('Api helper chưa sẵn sàng');
            const data = await Api.getActivities();
            const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.items) ? data.items : [];
            if (!list.length) throw new Error('Danh sách rỗng, dùng dữ liệu mẫu');
            this.activities = list;
            this.useApi = true;
        } catch (error) {
            console.warn('Đang dùng dữ liệu mẫu cho màn lập lịch sinh hoạt:', error);
            this.activities = this.fallbackActivities.map(item => ({ ...item }));
            this.useApi = false;
        }
        this.renderStats();
        this.renderTable();
    },

    bindEvents() {
        const searchInput = document.getElementById('activitySearchInput');
        const typeFilter = document.getElementById('activityTypeFilter');
        const statusFilter = document.getElementById('activityStatusFilter');
        const tableBody = document.getElementById('activityTableBody');
        const createBtn = document.getElementById('activityCreateBtn');

        const detailModal = document.getElementById('activityDetailModal');
        const detailCloseBtn = document.getElementById('activityDetailCloseBtn');
        const detailCloseBtn2 = document.getElementById('activityDetailCloseBtn2');

        const formModal = document.getElementById('activityFormModal');
        const formCloseBtn = document.getElementById('activityFormCloseBtn');
        const formCancelBtn = document.getElementById('activityFormCancelBtn');
        const formSaveBtn = document.getElementById('activityFormSaveBtn');

        const cancelModal = document.getElementById('activityCancelModal');
        const cancelCloseBtn = document.getElementById('activityCancelCloseBtn');
        const cancelDismissBtn = document.getElementById('activityCancelDismissBtn');
        const cancelConfirmBtn = document.getElementById('activityCancelConfirmBtn');

        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                this.currentSearch = event.target.value.trim().toLowerCase();
                this.renderTable();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', (event) => {
                this.currentTypeFilter = event.target.value;
                this.renderTable();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (event) => {
                this.currentStatusFilter = event.target.value;
                this.renderTable();
            });
        }

        if (createBtn) {
            createBtn.addEventListener('click', () => this.openFormModal(null));
        }

        if (tableBody) {
            tableBody.addEventListener('click', (event) => {
                const button = event.target.closest('button[data-action]');
                if (!button) return;
                const id = button.dataset.id;
                const action = button.dataset.action;
                if (action === 'view') this.openDetailModal(id);
                if (action === 'edit') this.openFormModal(id);
                if (action === 'cancel') this.openCancelModal(id);
            });
        }

        if (detailCloseBtn) detailCloseBtn.addEventListener('click', () => this.closeDetailModal());
        if (detailCloseBtn2) detailCloseBtn2.addEventListener('click', () => this.closeDetailModal());
        if (detailModal) {
            detailModal.addEventListener('click', (event) => {
                if (event.target === detailModal) this.closeDetailModal();
            });
        }

        if (formCloseBtn) formCloseBtn.addEventListener('click', () => this.closeFormModal());
        if (formCancelBtn) formCancelBtn.addEventListener('click', () => this.closeFormModal());
        if (formModal) {
            formModal.addEventListener('click', (event) => {
                if (event.target === formModal) this.closeFormModal();
            });
        }
        if (formSaveBtn) formSaveBtn.addEventListener('click', () => this.saveActivity());

        if (cancelCloseBtn) cancelCloseBtn.addEventListener('click', () => this.closeCancelModal());
        if (cancelDismissBtn) cancelDismissBtn.addEventListener('click', () => this.closeCancelModal());
        if (cancelModal) {
            cancelModal.addEventListener('click', (event) => {
                if (event.target === cancelModal) this.closeCancelModal();
            });
        }
        if (cancelConfirmBtn) cancelConfirmBtn.addEventListener('click', () => this.confirmCancel());
    },

    getFilteredActivities() {
        return this.activities.filter((activity) => {
            const matchesSearch = !this.currentSearch
                || (activity.maLich || '').toLowerCase().includes(this.currentSearch)
                || (activity.tenHoatDong || '').toLowerCase().includes(this.currentSearch)
                || (activity.diaDiem || '').toLowerCase().includes(this.currentSearch);

            const matchesType = this.currentTypeFilter === 'all' || activity.loaiHoatDong === this.currentTypeFilter;
            const matchesStatus = this.currentStatusFilter === 'all' || activity.trangThai === this.currentStatusFilter;

            return matchesSearch && matchesType && matchesStatus;
        });
    },

    renderStats() {
        const total = this.activities.length;
        const todayStr = this.getTodayDateStr();
        const today = this.activities.filter(a => (a.thoiGianBatDau || '').startsWith(todayStr)).length;
        const ongoing = this.activities.filter(a => a.trangThai === 'DangDienRa').length;
        const done = this.activities.filter(a => a.trangThai === 'HoanThanh').length;

        const totalEl = document.getElementById('statActivityTotal');
        const todayEl = document.getElementById('statActivityToday');
        const ongoingEl = document.getElementById('statActivityOngoing');
        const doneEl = document.getElementById('statActivityDone');

        if (totalEl) totalEl.textContent = total;
        if (todayEl) todayEl.textContent = today;
        if (ongoingEl) ongoingEl.textContent = ongoing;
        if (doneEl) doneEl.textContent = done;
    },

    getTodayDateStr() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    },

    renderTable() {
        const tableBody = document.getElementById('activityTableBody');
        if (!tableBody) return;

        const filtered = this.getFilteredActivities();

        if (!filtered.length) {
            tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="staff-activity-state-cell">
            <div class="staff-activity-empty">
              <i class="fa-solid fa-folder-open"></i>
              Không tìm thấy lịch sinh hoạt phù hợp.
            </div>
          </td>
        </tr>
      `;
            return;
        }

        tableBody.innerHTML = filtered.map((activity) => {
            const typeLabel = this.typeLabels[activity.loaiHoatDong] || activity.loaiHoatDong || '—';
            const statusInfo = this.statusMeta[activity.trangThai] || { label: activity.trangThai || '—', className: 'badge-gray' };
            const canEdit = activity.trangThai !== 'HoanThanh' && activity.trangThai !== 'Huy';
            const canCancel = activity.trangThai === 'SapDienRa';

            return `
        <tr>
          <td><span class="td-code">${this.escapeHtml(activity.maLich)}</span></td>
          <td>${this.escapeHtml(activity.tenHoatDong)}</td>
          <td>${this.escapeHtml(typeLabel)}</td>
          <td>${this.formatDateTime(activity.thoiGianBatDau)}</td>
          <td>${this.formatDateTime(activity.thoiGianKetThuc)}</td>
          <td>${this.escapeHtml(activity.diaDiem)}</td>
          <td>${this.escapeHtml(activity.nguoiPhuTrach)}</td>
          <td><span class="badge ${statusInfo.className}">${this.escapeHtml(statusInfo.label)}</span></td>
          <td>
            <div class="action-btns">
              <button class="btn btn-sm btn-outline btn-icon" data-action="view" data-id="${this.escapeHtml(activity.maLich)}" title="Xem chi tiết">
                <i class="fa-solid fa-eye"></i>
              </button>
              ${canEdit ? `
                <button class="btn btn-sm btn-primary btn-icon" data-action="edit" data-id="${this.escapeHtml(activity.maLich)}" title="Chỉnh sửa">
                  <i class="fa-solid fa-pen"></i>
                </button>
              ` : ''}
              ${canCancel ? `
                <button class="btn btn-sm btn-danger btn-icon" data-action="cancel" data-id="${this.escapeHtml(activity.maLich)}" title="Hủy lịch">
                  <i class="fa-solid fa-ban"></i>
                </button>
              ` : ''}
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
        const activity = this.activities.find(a => a.maLich === id);
        if (!activity) return;

        const modal = document.getElementById('activityDetailModal');
        const body = document.getElementById('activityDetailBody');
        if (!modal || !body) return;

        const typeLabel = this.typeLabels[activity.loaiHoatDong] || activity.loaiHoatDong || '—';
        const statusInfo = this.statusMeta[activity.trangThai] || { label: activity.trangThai || '—', className: 'badge-gray' };

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
              <div style="font-size:14px; font-weight:600;"><span class="td-code">${this.escapeHtml(activity.maLich)}</span></div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Loại hoạt động</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(typeLabel)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Thời gian bắt đầu</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.formatDateTime(activity.thoiGianBatDau)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Thời gian kết thúc</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.formatDateTime(activity.thoiGianKetThuc)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Trạng thái</div>
              <div style="font-size:14px; font-weight:600;"><span class="badge ${statusInfo.className}">${this.escapeHtml(statusInfo.label)}</span></div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-file-lines" style="color:var(--success); margin-right:8px;"></i>
            Nội dung hoạt động
          </h4>
          <p style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md); font-size:14px; color:var(--text-primary);">${this.escapeHtml(activity.tenHoatDong)}</p>
        </div>

        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-location-dot" style="color:var(--purple); margin-right:8px;"></i>
            Địa điểm / Người phụ trách
          </h4>
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Địa điểm</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(activity.diaDiem)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Người phụ trách</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(activity.nguoiPhuTrach)}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-users" style="color:var(--orange); margin-right:8px;"></i>
            Nhóm/khu tham gia
          </h4>
          <p style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md); font-size:14px; color:var(--text-primary);">${this.escapeHtml(activity.nhomThamGia) || 'Chưa xác định.'}</p>
        </div>

        <div style="padding:16px; background:rgba(59,130,246,0.08); border-left:4px solid var(--primary); border-radius:var(--radius-md);">
          <div style="font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            <i class="fa-solid fa-note-sticky" style="margin-right:8px;"></i>
            Ghi chú
          </div>
          <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">
            ${this.escapeHtml(activity.ghiChu) || '<em>Không có ghi chú.</em>'}
          </div>
        </div>
      </div>
    `;

        modal.classList.add('active');
    },

    closeDetailModal() {
        const modal = document.getElementById('activityDetailModal');
        if (modal) modal.classList.remove('active');
    },

    openFormModal(id) {
        this.editingId = id;
        const modal = document.getElementById('activityFormModal');
        const title = document.getElementById('activityFormTitle');
        if (!modal || !title) return;

        this.clearFormErrors();

        const idInput = document.getElementById('activityFormId');
        const nameInput = document.getElementById('activityFormName');
        const typeInput = document.getElementById('activityFormType');
        const startInput = document.getElementById('activityFormStart');
        const endInput = document.getElementById('activityFormEnd');
        const locationInput = document.getElementById('activityFormLocation');
        const ownerInput = document.getElementById('activityFormOwner');
        const groupInput = document.getElementById('activityFormGroup');
        const noteInput = document.getElementById('activityFormNote');

        if (id) {
            const activity = this.activities.find(a => a.maLich === id);
            if (!activity) return;
            title.textContent = `Chỉnh sửa lịch ${activity.maLich}`;
            idInput.value = activity.maLich;
            nameInput.value = activity.tenHoatDong || '';
            typeInput.value = activity.loaiHoatDong || 'GiaoDuc';
            startInput.value = activity.thoiGianBatDau || '';
            endInput.value = activity.thoiGianKetThuc || '';
            locationInput.value = activity.diaDiem || '';
            ownerInput.value = activity.nguoiPhuTrach || '';
            groupInput.value = activity.nhomThamGia || '';
            noteInput.value = activity.ghiChu || '';
        } else {
            title.textContent = 'Tạo lịch sinh hoạt';
            idInput.value = '';
            nameInput.value = '';
            typeInput.value = 'GiaoDuc';
            startInput.value = '';
            endInput.value = '';
            locationInput.value = '';
            ownerInput.value = '';
            groupInput.value = '';
            noteInput.value = '';
        }

        modal.classList.add('active');
    },

    closeFormModal() {
        const modal = document.getElementById('activityFormModal');
        if (modal) modal.classList.remove('active');
        this.editingId = null;
        this.clearFormErrors();
    },

    clearFormErrors() {
        const nameError = document.getElementById('activityFormNameError');
        const locationError = document.getElementById('activityFormLocationError');
        const startError = document.getElementById('activityFormStartError');
        const endError = document.getElementById('activityFormEndError');
        [nameError, locationError, startError, endError].forEach((el) => {
            if (el) el.style.display = 'none';
        });
    },

    async saveActivity() {
        const nameInput = document.getElementById('activityFormName');
        const typeInput = document.getElementById('activityFormType');
        const startInput = document.getElementById('activityFormStart');
        const endInput = document.getElementById('activityFormEnd');
        const locationInput = document.getElementById('activityFormLocation');
        const ownerInput = document.getElementById('activityFormOwner');
        const groupInput = document.getElementById('activityFormGroup');
        const noteInput = document.getElementById('activityFormNote');

        const nameError = document.getElementById('activityFormNameError');
        const locationError = document.getElementById('activityFormLocationError');
        const startError = document.getElementById('activityFormStartError');
        const endError = document.getElementById('activityFormEndError');

        this.clearFormErrors();

        const name = nameInput.value.trim();
        const location = locationInput.value.trim();
        const start = startInput.value;
        const end = endInput.value;

        let hasError = false;

        if (!name) {
            if (nameError) nameError.style.display = 'block';
            hasError = true;
        }
        if (!location) {
            if (locationError) locationError.style.display = 'block';
            hasError = true;
        }
        if (!start) {
            if (startError) startError.style.display = 'block';
            hasError = true;
        }
        if (!end) {
            if (endError) endError.style.display = 'block';
            hasError = true;
        }
        if (start && end && new Date(end).getTime() <= new Date(start).getTime()) {
            if (endError) endError.style.display = 'block';
            hasError = true;
        }

        if (hasError) return;

        const payload = {
            tenHoatDong: name,
            loaiHoatDong: typeInput.value,
            thoiGianBatDau: start,
            thoiGianKetThuc: end,
            diaDiem: location,
            nguoiPhuTrach: ownerInput.value.trim(),
            nhomThamGia: groupInput.value.trim(),
            ghiChu: noteInput.value.trim()
        };

        try {
            if (typeof Api === 'undefined' || typeof Api.createActivity === 'undefined') throw new Error('Api helper chưa sẵn sàng');
            if (this.editingId) {
                await Api.updateActivity(this.editingId, payload);
            } else {
                await Api.createActivity(payload);
            }
        } catch (error) {
            console.warn('Chưa thể gọi API lưu lịch sinh hoạt, cập nhật cục bộ:', error);
        }

        if (this.editingId) {
            const activity = this.activities.find(a => a.maLich === this.editingId);
            if (activity) Object.assign(activity, payload);
        } else {
            const newActivity = {
                maLich: `LSH${String(this.nextSeq).padStart(3, '0')}`,
                trangThai: 'SapDienRa',
                ...payload
            };
            this.nextSeq += 1;
            this.activities.unshift(newActivity);
        }

        if (typeof Toast !== 'undefined') {
            Toast.show(this.editingId ? 'Đã cập nhật lịch sinh hoạt.' : 'Đã tạo lịch sinh hoạt mới.', 'success');
        }

        this.closeFormModal();
        this.renderStats();
        this.renderTable();
    },

    openCancelModal(id) {
        const activity = this.activities.find(a => a.maLich === id);
        if (!activity) return;

        this.cancelingId = id;
        const modal = document.getElementById('activityCancelModal');
        const message = document.getElementById('activityCancelMessage');
        if (!modal || !message) return;

        message.textContent = `Hủy lịch sinh hoạt "${activity.tenHoatDong}" (${activity.maLich})?`;
        modal.classList.add('active');
    },

    closeCancelModal() {
        const modal = document.getElementById('activityCancelModal');
        if (modal) modal.classList.remove('active');
        this.cancelingId = null;
    },

    async confirmCancel() {
        if (!this.cancelingId) return;
        const activity = this.activities.find(a => a.maLich === this.cancelingId);
        if (!activity) return;

        try {
            if (typeof Api === 'undefined' || typeof Api.cancelActivity === 'undefined') throw new Error('Api helper chưa sẵn sàng');
            await Api.cancelActivity(this.cancelingId);
        } catch (error) {
            console.warn('Chưa thể gọi API hủy lịch sinh hoạt, cập nhật cục bộ:', error);
        }

        activity.trangThai = 'Huy';

        if (typeof Toast !== 'undefined') {
            Toast.show('Đã hủy lịch sinh hoạt.', 'success');
        }

        this.closeCancelModal();
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

window.ActivitySchedulePage = ActivitySchedulePage;
