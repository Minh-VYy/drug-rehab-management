const IntakeConfirmationPage = {
    endpoints: {
        list: '/staff/intake-confirmation',
        confirm: id => `/staff/intake-confirmation/${encodeURIComponent(id)}/confirm`,
        supplement: id => `/staff/intake-confirmation/${encodeURIComponent(id)}/request-supplement`
    },

    records: [],
    currentSearch: '',
    currentStatusFilter: 'all',
    activeRecordId: null,
    useApi: true,

    fallbackRecords: [
        {
            code: 'HSBG003',
            patientName: 'Phạm Thị E',
            citizenId: '048201009012',
            birthDate: '20/07/2000',
            hometown: 'Đà Nẵng',
            currentAddress: 'Quận Sơn Trà, Đà Nẵng',
            relativeName: 'Phạm Văn Sơn',
            relativePhone: '0934567890',
            relationship: 'Anh trai',
            violation: 'Tái sử dụng chất gây nghiện sau cai nghiện tại gia.',
            policeOfficer: 'Thiếu úy Nguyễn Văn Khánh',
            sentDate: '10/06/2026',
            leaderApprover: 'LĐ. Nguyễn Văn A',
            leaderApprovedDate: '12/06/2026',
            status: 'ChoTiepNhan',
            intakeDate: null,
            intakeRoom: null,
            intakeStaff: null,
            intakeNote: null,
            supplementReason: null
        },
        {
            code: 'HSBG005',
            patientName: 'Võ Thị G',
            citizenId: '048201007788',
            birthDate: '02/02/1999',
            hometown: 'Quảng Ngãi',
            currentAddress: 'Quận Cẩm Lệ, Đà Nẵng',
            relativeName: 'Võ Văn Tâm',
            relativePhone: '0911223344',
            relationship: 'Cha',
            violation: 'Sử dụng trái phép chất ma túy tổng hợp.',
            policeOfficer: 'Trung úy Trần Văn Hùng',
            sentDate: '14/06/2026',
            leaderApprover: 'LĐ. Nguyễn Văn A',
            leaderApprovedDate: '15/06/2026',
            status: 'ChoTiepNhan',
            intakeDate: null,
            intakeRoom: null,
            intakeStaff: null,
            intakeNote: null,
            supplementReason: null
        },
        {
            code: 'HSBG006',
            patientName: 'Bùi Văn H',
            citizenId: '048201004455',
            birthDate: '18/09/1997',
            hometown: 'Huế',
            currentAddress: 'Quận Ngũ Hành Sơn, Đà Nẵng',
            relativeName: 'Bùi Thị Lan',
            relativePhone: '0987654321',
            relationship: 'Mẹ',
            violation: 'Sử dụng Heroin, bị phát hiện trong đợt kiểm tra.',
            policeOfficer: 'Thiếu úy Nguyễn Văn Khánh',
            sentDate: '08/06/2026',
            leaderApprover: 'LĐ. Nguyễn Văn A',
            leaderApprovedDate: '09/06/2026',
            status: 'DaTiepNhan',
            intakeDate: '10/06/2026',
            intakeRoom: 'Khu A - Phòng 101',
            intakeStaff: 'NV. Lê Thị Hồng',
            intakeNote: 'Tiếp nhận bình thường, sức khỏe ổn định.',
            supplementReason: null
        },
        {
            code: 'HSBG007',
            patientName: 'Đỗ Văn K',
            citizenId: '048201006677',
            birthDate: '30/04/1996',
            hometown: 'Đà Nẵng',
            currentAddress: 'Quận Liên Chiểu, Đà Nẵng',
            relativeName: 'Đỗ Thị Nga',
            relativePhone: '0966112233',
            relationship: 'Vợ',
            violation: 'Sử dụng ma túy đá, vi phạm trật tự công cộng.',
            policeOfficer: 'Trung úy Trần Văn Hùng',
            sentDate: '05/06/2026',
            leaderApprover: 'LĐ. Nguyễn Văn A',
            leaderApprovedDate: '06/06/2026',
            status: 'CanBoSung',
            intakeDate: null,
            intakeRoom: null,
            intakeStaff: null,
            intakeNote: null,
            supplementReason: 'Thiếu kết quả xét nghiệm y tế kèm theo hồ sơ.'
        }
    ],

    async render(containerId) {
        const success = await ViewLoader.load('views/staff/intake-confirmation.html', containerId);
        if (success) {
            await this.init();
        }
    },

    async init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Xác nhận tiếp nhận');
        }

        this.currentSearch = '';
        this.currentStatusFilter = 'all';
        this.activeRecordId = null;
        this.renderCurrentDate();
        this.bindEvents();
        await this.loadRecords();
    },

    async loadRecords() {
        this.showLoading(true);

        try {
            if (typeof Api === 'undefined' || typeof Api.getPendingIntakes === 'undefined') {
                throw new Error('Api helper chưa sẵn sàng');
            }

            const data = await Api.getPendingIntakes();
            this.records = this.normalizeRecords(Array.isArray(data) ? data : data?.items || []);
            this.useApi = true;
        } catch (error) {
            console.warn('Đang dùng dữ liệu mẫu cho màn xác nhận tiếp nhận:', error);
            this.records = this.fallbackRecords.map(item => ({ ...item }));
            this.useApi = false;
        } finally {
            this.showLoading(false);
            this.renderStats();
            this.renderTable();
        }
    },

    normalizeRecords(items) {
        return items.map(item => ({
            code: item.code || item.maHoSoBanGiao || item.id || '',
            patientName: item.patientName || item.hoTenDoiTuong || item.subjectName || '',
            citizenId: item.citizenId || item.cccd || item.identityNumber || '',
            birthDate: this.formatDate(item.birthDate || item.ngaySinh),
            hometown: item.hometown || item.queQuan || '-',
            currentAddress: item.currentAddress || item.noiOHienTai || '-',
            relativeName: item.relativeName || item.hoTenNguoiThan || '-',
            relativePhone: item.relativePhone || item.sdtNguoiThan || '-',
            relationship: item.relationship || item.quanHe || '-',
            violation: item.violation || item.hanhViViPham || '-',
            policeOfficer: item.policeOfficer || item.canBoCongAn || item.officerName || '-',
            sentDate: this.formatDate(item.sentDate || item.ngayGui),
            leaderApprover: item.leaderApprover || item.nguoiDuyetLanhDao || '-',
            leaderApprovedDate: this.formatDate(item.leaderApprovedDate || item.ngayDuyetLanhDao || item.approvedAt),
            status: item.status || item.trangThai || 'ChoTiepNhan',
            intakeDate: this.formatDate(item.intakeDate || item.ngayTiepNhan),
            intakeRoom: item.intakeRoom || item.khuTiepNhan || null,
            intakeStaff: item.intakeStaff || item.canBoTiepNhan || null,
            intakeNote: item.intakeNote || item.ghiChuTiepNhan || null,
            supplementReason: item.supplementReason || item.lyDoBoSung || null
        }));
    },

    renderCurrentDate() {
        const today = new Date();
        this.setText('intake-confirm-date-num', String(today.getDate()).padStart(2, '0'));
        this.setText('intake-confirm-date-label', today.toLocaleDateString('vi-VN', {
            month: 'long',
            year: 'numeric'
        }));
    },

    getFilteredRecords() {
        const keyword = this.normalizeText(this.currentSearch);

        return this.records.filter(record => {
            const matchesStatus = this.currentStatusFilter === 'all'
                || record.status === this.currentStatusFilter;
            const searchable = [
                record.code,
                record.patientName,
                record.citizenId,
                record.relativeName,
                record.policeOfficer
            ].map(value => this.normalizeText(value)).join(' ');

            return matchesStatus && (!keyword || searchable.includes(keyword));
        });
    },

    renderStats() {
        this.setText('statWaiting', this.countByStatus('ChoTiepNhan'));
        this.setText('statConfirmed', this.countByStatus('DaTiepNhan'));
        this.setText('statSupplement', this.countByStatus('CanBoSung'));
    },

    renderTable() {
        const tbody = document.getElementById('intakeConfirmTableBody');
        const emptyState = document.getElementById('intakeConfirmEmptyState');
        if (!tbody) return;

        const records = this.getFilteredRecords();
        if (!records.length) {
            tbody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        tbody.innerHTML = records.map(record => `
            <tr>
                <td><span class="staff-intake-code">${this.escapeHtml(record.code)}</span></td>
                <td>
                    <div class="staff-intake-person">
                        <strong>${this.escapeHtml(record.patientName || '-')}</strong>
                        <span>${this.escapeHtml(record.birthDate || '-')} • ${this.escapeHtml(record.hometown || '-')}</span>
                    </div>
                </td>
                <td>${this.escapeHtml(record.citizenId || '-')}</td>
                <td>${this.escapeHtml(record.leaderApprovedDate || '-')}</td>
                <td>${this.escapeHtml(record.policeOfficer || '-')}</td>
                <td>${this.escapeHtml(record.relativeName || '-')}</td>
                <td>${this.renderStatusBadge(record.status)}</td>
                <td>
                    <div class="table-actions staff-intake-actions">
                        <button class="btn btn-sm btn-outline btn-icon" title="Xem chi tiết" data-action="view" data-id="${this.escapeHtml(record.code)}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${record.status === 'ChoTiepNhan' ? `
                            <button class="btn btn-sm btn-success btn-icon" title="Xác nhận tiếp nhận" data-action="confirm" data-id="${this.escapeHtml(record.code)}">
                                <i class="fa-solid fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-icon" title="Yêu cầu bổ sung" data-action="supplement" data-id="${this.escapeHtml(record.code)}">
                                <i class="fa-solid fa-file-circle-exclamation"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    renderStatusBadge(status) {
        const item = this.statusMeta(status);
        return `<span class="badge ${item.cls}">${this.escapeHtml(item.label)}</span>`;
    },

    openDetailModal(code) {
        const record = this.findRecord(code);
        if (!record) return;

        const modal = document.getElementById('intakeConfirmDetailModal');
        const body = document.getElementById('intakeConfirmDetailBody');
        const footer = document.getElementById('intakeConfirmDetailFooter');
        if (!modal || !body || !footer) return;

        body.innerHTML = `
            <div class="staff-intake-detail">
                ${this.renderDetailSection('Thông tin hồ sơ', 'fa-folder-open', [
                    ['Mã hồ sơ', record.code],
                    ['Cán bộ công an bàn giao', record.policeOfficer],
                    ['Ngày gửi hồ sơ', record.sentDate],
                    ['Lãnh đạo duyệt', record.leaderApprover],
                    ['Ngày lãnh đạo duyệt', record.leaderApprovedDate],
                    ['Trạng thái', this.statusLabel(record.status)]
                ])}
                ${this.renderDetailSection('Thông tin người cai nghiện', 'fa-user-injured', [
                    ['Họ tên', record.patientName],
                    ['CCCD', record.citizenId],
                    ['Ngày sinh', record.birthDate],
                    ['Quê quán', record.hometown],
                    ['Nơi ở hiện tại', record.currentAddress, true],
                    ['Hành vi vi phạm', record.violation, true]
                ])}
                ${this.renderDetailSection('Người thân liên hệ', 'fa-people-roof', [
                    ['Họ tên người thân', record.relativeName],
                    ['Số điện thoại', record.relativePhone],
                    ['Quan hệ', record.relationship]
                ])}
                ${this.renderIntakeSection(record)}
            </div>
        `;

        footer.innerHTML = record.status === 'ChoTiepNhan'
            ? `
                <button class="btn btn-outline" data-action="supplement" data-id="${this.escapeHtml(record.code)}">
                    <i class="fa-solid fa-file-circle-exclamation"></i>
                    Yêu cầu bổ sung
                </button>
                <button class="btn btn-success" data-action="confirm" data-id="${this.escapeHtml(record.code)}">
                    <i class="fa-solid fa-check"></i>
                    Xác nhận tiếp nhận
                </button>
            `
            : '<button class="btn btn-outline" data-action="close-detail">Đóng</button>';

        modal.classList.add('active');
    },

    renderDetailSection(title, icon, items) {
        return `
            <section class="staff-intake-detail-section">
                <div class="staff-intake-detail-title">
                    <i class="fa-solid ${icon}"></i>
                    <span>${this.escapeHtml(title)}</span>
                </div>
                <div class="staff-intake-detail-grid">
                    ${items.map(([label, value, full]) => this.renderDetailItem(label, value, full)).join('')}
                </div>
            </section>
        `;
    },

    renderIntakeSection(record) {
        if (record.status === 'DaTiepNhan') {
            return this.renderDetailSection('Tiếp nhận tại trung tâm', 'fa-user-check', [
                ['Ngày tiếp nhận', record.intakeDate || '-'],
                ['Khu/phòng tiếp nhận', record.intakeRoom || '-'],
                ['Cán bộ tiếp nhận', record.intakeStaff || '-'],
                ['Ghi chú tiếp nhận', record.intakeNote || '-', true]
            ]);
        }

        if (record.status === 'CanBoSung') {
            return this.renderDetailSection('Yêu cầu bổ sung', 'fa-file-circle-exclamation', [
                ['Lý do cần bổ sung', record.supplementReason || '-', true]
            ]);
        }

        return this.renderDetailSection('Tiếp nhận tại trung tâm', 'fa-user-check', [
            ['Tình trạng xử lý', 'Đang chờ cán bộ trung tâm xác nhận tiếp nhận.', true]
        ]);
    },

    renderDetailItem(label, value, full = false) {
        return `
            <div class="staff-intake-detail-item${full ? ' full' : ''}">
                <div class="staff-intake-detail-label">${this.escapeHtml(label)}</div>
                <div class="staff-intake-detail-value">${this.escapeHtml(value || '-')}</div>
            </div>
        `;
    },

    closeDetailModal() {
        this.closeModal('intakeConfirmDetailModal');
    },

    openConfirmIntakeModal(code) {
        this.activeRecordId = code;
        this.clearFormErrors();
        this.setValue('ngayTiepNhan', new Date().toISOString().slice(0, 10));
        this.setValue('khuTiepNhan', '');
        this.setValue('canBoTiepNhan', this.getCurrentStaffName());
        this.setValue('ghiChuTiepNhan', '');
        this.openModal('confirmIntakeModal');
    },

    closeConfirmIntakeModal() {
        this.closeModal('confirmIntakeModal');
        this.activeRecordId = null;
    },

    async submitConfirmIntake() {
        this.clearFormErrors();

        const payload = {
            ngayTiepNhan: this.getValue('ngayTiepNhan'),
            khuTiepNhan: this.getValue('khuTiepNhan'),
            canBoTiepNhan: this.getValue('canBoTiepNhan') || this.getCurrentStaffName(),
            ghiChuTiepNhan: this.getValue('ghiChuTiepNhan')
        };

        let valid = true;
        if (!payload.ngayTiepNhan) {
            this.setError('errNgayTiepNhan', 'Vui lòng chọn ngày tiếp nhận');
            valid = false;
        }
        if (!payload.khuTiepNhan) {
            this.setError('errKhuTiepNhan', 'Vui lòng nhập phòng/khu tiếp nhận');
            valid = false;
        }
        if (!valid || !this.activeRecordId) return;

        const okBtn = document.getElementById('confirmIntakeOkBtn');
        if (okBtn) okBtn.disabled = true;

        try {
            await this.confirmIntake(this.activeRecordId, payload);
            this.closeConfirmIntakeModal();
            this.closeDetailModal();
            this.renderStats();
            this.renderTable();
            this.showToast('Đã xác nhận tiếp nhận hồ sơ.', 'success');
        } catch (error) {
            console.error('Lỗi xác nhận tiếp nhận:', error);
            this.showToast('Xác nhận tiếp nhận thất bại, vui lòng thử lại.', 'error');
        } finally {
            if (okBtn) okBtn.disabled = false;
        }
    },

    openSupplementModal(code) {
        this.activeRecordId = code;
        this.clearFormErrors();
        this.setValue('lyDoBoSung', '');
        this.openModal('supplementModal');
    },

    closeSupplementModal() {
        this.closeModal('supplementModal');
        this.activeRecordId = null;
    },

    async submitSupplementRequest() {
        this.clearFormErrors();

        const reason = this.getValue('lyDoBoSung');
        if (!reason) {
            this.setError('errLyDoBoSung', 'Vui lòng nhập lý do cần bổ sung');
            return;
        }
        if (!this.activeRecordId) return;

        const okBtn = document.getElementById('supplementOkBtn');
        if (okBtn) okBtn.disabled = true;

        try {
            await this.requestSupplement(this.activeRecordId, reason);
            this.closeSupplementModal();
            this.closeDetailModal();
            this.renderStats();
            this.renderTable();
            this.showToast('Đã gửi yêu cầu bổ sung thông tin.', 'success');
        } catch (error) {
            console.error('Lỗi gửi yêu cầu bổ sung:', error);
            this.showToast('Gửi yêu cầu bổ sung thất bại, vui lòng thử lại.', 'error');
        } finally {
            if (okBtn) okBtn.disabled = false;
        }
    },

    async confirmIntake(recordId, payload) {
        if (this.useApi && typeof Api !== 'undefined' && typeof Api.confirmIntake !== 'undefined') {
            const updated = await Api.confirmIntake(recordId, payload);
            this.mergeUpdatedRecord(recordId, updated, {
                status: 'DaTiepNhan',
                intakeDate: this.formatDate(payload.ngayTiepNhan),
                intakeRoom: payload.khuTiepNhan,
                intakeStaff: payload.canBoTiepNhan,
                intakeNote: payload.ghiChuTiepNhan,
                supplementReason: null
            });
            return this.findRecord(recordId);
        }

        this.mergeUpdatedRecord(recordId, null, {
            status: 'DaTiepNhan',
            intakeDate: this.formatDate(payload.ngayTiepNhan),
            intakeRoom: payload.khuTiepNhan,
            intakeStaff: payload.canBoTiepNhan,
            intakeNote: payload.ghiChuTiepNhan,
            supplementReason: null
        });
        return this.findRecord(recordId);
    },

    async requestSupplement(recordId, reason) {
        if (this.useApi && typeof Api !== 'undefined' && typeof Api.requestIntakeSupplement !== 'undefined') {
            const updated = await Api.requestIntakeSupplement(recordId, { lyDoBoSung: reason });
            this.mergeUpdatedRecord(recordId, updated, {
                status: 'CanBoSung',
                supplementReason: reason
            });
            return this.findRecord(recordId);
        }

        this.mergeUpdatedRecord(recordId, null, {
            status: 'CanBoSung',
            supplementReason: reason
        });
        return this.findRecord(recordId);
    },

    mergeUpdatedRecord(recordId, apiRecord, fallbackPatch) {
        const index = this.records.findIndex(record => record.code === recordId);
        if (index === -1) return;

        if (apiRecord) {
            const normalized = this.normalizeRecords([apiRecord])[0];
            this.records[index] = { ...this.records[index], ...normalized };
            return;
        }

        this.records[index] = { ...this.records[index], ...fallbackPatch };
    },

    bindEvents() {
        const searchInput = document.getElementById('intakeConfirmSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', event => {
                this.currentSearch = event.target.value;
                this.renderTable();
            });
        }

        const statusFilter = document.getElementById('intakeConfirmStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', event => {
                this.currentStatusFilter = event.target.value;
                this.renderTable();
            });
        }

        const tbody = document.getElementById('intakeConfirmTableBody');
        if (tbody) {
            tbody.addEventListener('click', event => this.handleActionClick(event));
        }

        const detailFooter = document.getElementById('intakeConfirmDetailFooter');
        if (detailFooter) {
            detailFooter.addEventListener('click', event => this.handleActionClick(event));
        }

        this.bindClick('intakeConfirmDetailCloseBtn', () => this.closeDetailModal());
        this.bindClick('confirmIntakeCloseBtn', () => this.closeConfirmIntakeModal());
        this.bindClick('confirmIntakeCancelBtn', () => this.closeConfirmIntakeModal());
        this.bindClick('confirmIntakeOkBtn', () => this.submitConfirmIntake());
        this.bindClick('supplementCloseBtn', () => this.closeSupplementModal());
        this.bindClick('supplementCancelBtn', () => this.closeSupplementModal());
        this.bindClick('supplementOkBtn', () => this.submitSupplementRequest());

        this.bindOverlayClose('intakeConfirmDetailModal', () => this.closeDetailModal());
        this.bindOverlayClose('confirmIntakeModal', () => this.closeConfirmIntakeModal());
        this.bindOverlayClose('supplementModal', () => this.closeSupplementModal());
    },

    handleActionClick(event) {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === 'view') this.openDetailModal(id);
        if (action === 'confirm') this.openConfirmIntakeModal(id);
        if (action === 'supplement') this.openSupplementModal(id);
        if (action === 'close-detail') this.closeDetailModal();
    },

    bindClick(id, handler) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', handler);
    },

    bindOverlayClose(id, handler) {
        const overlay = document.getElementById(id);
        if (overlay) {
            overlay.addEventListener('click', event => {
                if (event.target === overlay) handler();
            });
        }
    },

    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('active');
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('active');
    },

    showLoading(show) {
        const loadingEl = document.getElementById('intakeConfirmLoadingState');
        const tableWrapper = document.querySelector('.staff-intake-table-wrapper');
        if (loadingEl) loadingEl.style.display = show ? 'flex' : 'none';
        if (tableWrapper) tableWrapper.style.display = show ? 'none' : 'block';
    },

    clearFormErrors() {
        ['errNgayTiepNhan', 'errKhuTiepNhan', 'errLyDoBoSung'].forEach(id => this.setError(id, ''));
    },

    findRecord(code) {
        return this.records.find(record => record.code === code);
    },

    countByStatus(status) {
        return this.records.filter(record => record.status === status).length;
    },

    statusMeta(status) {
        const map = {
            ChoTiepNhan: { label: 'Chờ tiếp nhận', cls: 'badge-orange' },
            DaTiepNhan: { label: 'Đã tiếp nhận', cls: 'badge-green' },
            CanBoSung: { label: 'Cần bổ sung', cls: 'badge-red' }
        };
        return map[status] || { label: status || '-', cls: 'badge-gray' };
    },

    statusLabel(status) {
        return this.statusMeta(status).label;
    },

    getCurrentStaffName() {
        const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
        if (typeof Auth !== 'undefined' && typeof Auth.getDisplayName === 'function') {
            return Auth.getDisplayName(user);
        }
        return user?.fullName || user?.name || 'Cán bộ tiếp nhận';
    },

    getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    },

    setValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value ?? '';
    },

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
    },

    setError(id, message) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = message;
            el.style.color = 'var(--danger)';
            el.style.fontSize = '12px';
        }
    },

    showToast(message, type = 'success') {
        if (typeof Toast !== 'undefined' && typeof Toast.show === 'function') {
            Toast.show(message, type);
        } else if (typeof showToast === 'function') {
            showToast(message, type);
        }
    },

    normalizeText(value) {
        return String(value ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    },

    formatDate(value) {
        if (!value) return null;
        if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString('vi-VN');
    },

    escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

window.IntakeConfirmationPage = IntakeConfirmationPage;
