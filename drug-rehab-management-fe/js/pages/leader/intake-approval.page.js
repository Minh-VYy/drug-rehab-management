const IntakeApprovalPage = {
    handoverRecords: [],
    currentSearch: '',
    currentStatusFilter: 'all',
    selectedRecord: null,

    async render(containerId) {
        const success = await ViewLoader.load('views/leader/intake-approval.html', containerId);
        if (success) {
            await this.init();
        }
    },

    async init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Duyệt tiếp nhận');
        }

        this.renderDate();
        await this.loadRecords();
        this.renderStats();
        this.renderTable();
        this.bindEvents();
    },

    async loadRecords() {
        if (typeof Api === 'undefined') return;

        try {
            const data = await Api.getIntakeApprovals();
            this.handoverRecords = Array.isArray(data) ? data : [];
        } catch (error) {
            console.warn('Lỗi API Intake Approvals, dùng Mock data fallback:', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Đang dùng dữ liệu mẫu (Mock) do chưa kết nối Backend', 'warning');
            
            // Mock Fallback matching SQL data
            this.handoverRecords = [
                { code: 'HSBG-2026-001', subjectName: 'Trần Tuấn Kiệt', citizenId: '048099123456', birthDate: '1995-05-10', relativeName: 'Trần Văn Hùng', relativePhone: '0912345678', violation: 'Tổ chức và sử dụng trái phép chất ma túy tại cơ sở kinh doanh karaoke.', status: 'ChoDuyet', approvedDate: null },
                { code: 'HSBG-2026-002', subjectName: 'Lê Thị Thu', citizenId: '048099654321', birthDate: '1998-08-20', relativeName: 'Lê Văn Sang', relativePhone: '0987654321', violation: 'Bị bắt quả tang tàng trữ lượng nhỏ ma túy đá.', status: 'DaTiepNhan', approvedDate: '2026-06-15' },
                { code: 'HSBG-2026-003', subjectName: 'Phạm Minh Chí', citizenId: '048099111222', birthDate: '2001-12-05', relativeName: 'Phạm Khắc Tùng', relativePhone: '0909112233', violation: 'Gây rối trật tự công cộng sau khi sử dụng chất kích thích.', status: 'ChoDuyet', approvedDate: null }
            ];
        }
    },

    getFilteredRecords() {
        const keyword = this.currentSearch.trim().toLowerCase();

        return this.handoverRecords.filter(record => {
            const matchesStatus = this.currentStatusFilter === 'all'
                || record.status === this.currentStatusFilter;

            const matchesSearch = !keyword
                || String(record.code || '').toLowerCase().includes(keyword)
                || String(record.subjectName || '').toLowerCase().includes(keyword)
                || String(record.citizenId || '').toLowerCase().includes(keyword);

            return matchesStatus && matchesSearch;
        });
    },

    renderStats() {
        this.setText('statPending', this.countByStatus('ChoDuyet'));
        this.setText('statApproved', this.countByStatus('DaTiepNhan'));
        this.setText('statRejected', this.countByStatus('TuChoi'));
    },

    renderDate() {
        const now = new Date();
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
        const numEl = document.getElementById('intake-date-num');
        const labelEl = document.getElementById('intake-date-label');
        if (numEl) numEl.textContent = now.getDate();
        if (labelEl) labelEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getFullYear()}`;
    },

    renderTable() {
        const tbody = document.getElementById('intakeTableBody');
        const emptyState = document.getElementById('intakeEmptyState');
        if (!tbody) return;

        const records = this.getFilteredRecords();
        if (!records.length) {
            tbody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        tbody.innerHTML = records.map(record => `
            <tr>
                <td><span class="td-code">${this.escapeHtml(record.code)}</span></td>
                <td>${this.escapeHtml(record.subjectName)}</td>
                <td>${this.escapeHtml(record.citizenId)}</td>
                <td>${this.escapeHtml(record.birthDate)}</td>
                <td>${this.escapeHtml(record.relativeName)}</td>
                <td>${this.escapeHtml(record.relativePhone)}</td>
                <td title="${this.escapeHtml(record.violation)}">${this.truncateText(record.violation, 52)}</td>
                <td>${this.renderStatusBadge(record.status)}</td>
                <td>${this.escapeHtml(record.approvedDate || '-')}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline btn-icon" title="Xem chi tiết" data-action="view" data-code="${this.escapeHtml(record.code)}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${record.status === 'ChoDuyet' ? `
                            <button class="btn btn-sm btn-success btn-icon" title="Duyệt" data-action="approve" data-code="${this.escapeHtml(record.code)}">
                                <i class="fa-solid fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-icon" title="Từ chối" data-action="reject" data-code="${this.escapeHtml(record.code)}">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    renderStatusBadge(status) {
        const map = {
            ChoDuyet: { label: 'Chờ duyệt', cls: 'badge-orange' },
            DaTiepNhan: { label: 'Đã tiếp nhận', cls: 'badge-green' },
            TuChoi: { label: 'Từ chối', cls: 'badge-red' }
        };
        const item = map[status] || { label: status || '-', cls: 'badge-gray' };
        return `<span class="badge ${item.cls}">${this.escapeHtml(item.label)}</span>`;
    },

    openDetailModal(code) {
        const record = this.handoverRecords.find(item => item.code === code);
        if (!record) return;

        this.selectedRecord = record;
        const modal = document.getElementById('intakeDetailModal');
        const body = document.getElementById('intakeModalBody');
        const footer = document.getElementById('intakeModalFooter');
        if (!modal || !body || !footer) return;

        body.innerHTML = `
            ${this.renderDetailGroup('Thông tin hồ sơ', [
                ['Mã hồ sơ', record.code],
                ['Cán bộ công an', record.policeOfficer],
                ['Ngày gửi', record.sentDate]
            ])}
            ${this.renderDetailGroup('Thông tin đối tượng', [
                ['Họ tên', record.subjectName],
                ['CCCD', record.citizenId],
                ['Ngày sinh', record.birthDate],
                ['Quê quán', record.hometown],
                ['Nơi ở hiện tại', record.currentAddress]
            ])}
            ${this.renderDetailGroup('Người thân', [
                ['Họ tên', record.relativeName],
                ['SĐT', record.relativePhone],
                ['Quan hệ', record.relationship]
            ])}
            ${this.renderDetailGroup('Thông tin vi phạm', [
                ['Hành vi vi phạm', record.violation],
                ['File quyết định', record.decisionFile]
            ])}
            ${this.renderDetailGroup('Xử lý', [
                ['Trạng thái', this.renderStatusBadge(record.status)],
                ['Người duyệt', record.approvedBy || '-'],
                ['Ngày duyệt', record.approvedDate || '-']
            ], true)}
        `;

        footer.innerHTML = record.status === 'ChoDuyet'
            ? `
                <button class="btn btn-outline" data-action="reject" data-code="${this.escapeHtml(record.code)}">Từ chối</button>
                <button class="btn btn-primary" data-action="approve" data-code="${this.escapeHtml(record.code)}">Duyệt tiếp nhận</button>
            `
            : '<button class="btn btn-outline" data-action="close">Đóng</button>';

        modal.classList.add('active');
    },

    renderDetailGroup(title, rows, allowHtml = false) {
        return `
            <div style="margin-bottom: 24px;">
                <h4 style="font-size: 1.05rem; margin-bottom: 14px; color: var(--primary); font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                    <i class="fa-solid fa-layer-group" style="margin-right: 6px;"></i> ${this.escapeHtml(title)}
                </h4>
                <div class="module-detail-grid">
                    ${rows.map(([label, value]) => `
                        <div class="module-detail-item">
                            <span class="module-detail-label">${this.escapeHtml(label)}</span>
                            <span class="module-detail-value">${allowHtml && String(value).includes('<span') ? value : this.escapeHtml(value)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    closeDetailModal() {
        const modal = document.getElementById('intakeDetailModal');
        if (modal) modal.classList.remove('active');
        this.selectedRecord = null;
    },

    async approveRecord(code) {
        await this.updateRecordStatus(code, 'approve', 'Đã duyệt tiếp nhận hồ sơ.');
    },

    async rejectRecord(code) {
        await this.updateRecordStatus(code, 'reject', 'Đã từ chối hồ sơ tiếp nhận.');
    },

    async updateRecordStatus(code, action, message) {
        if (typeof Api === 'undefined') return;

        try {
            const updated = await Api.post(`/leader/intake-approvals/${code}/${action}`, {});
            const index = this.handoverRecords.findIndex(item => item.code === code);
            if (index !== -1 && updated) this.handoverRecords[index] = updated;

            this.closeDetailModal();
            this.renderStats();
            this.renderTable();
            this.showToast(message, 'success');
        } catch (error) {
            console.error('Không cập nhật được hồ sơ tiếp nhận:', error);
            this.showToast('Không cập nhật được hồ sơ tiếp nhận.', 'warning');
        }
    },

    bindEvents() {
        const searchInput = document.getElementById('intakeSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', event => {
                this.currentSearch = event.target.value;
                this.renderTable();
            });
        }

        const statusFilter = document.getElementById('intakeStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', event => {
                this.currentStatusFilter = event.target.value;
                this.renderTable();
            });
        }

        const tbody = document.getElementById('intakeTableBody');
        if (tbody) tbody.addEventListener('click', event => this.handleActionClick(event));

        const modalFooter = document.getElementById('intakeModalFooter');
        if (modalFooter) modalFooter.addEventListener('click', event => this.handleActionClick(event));

        const closeBtn = document.getElementById('intakeModalCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeDetailModal());

        const overlay = document.getElementById('intakeDetailModal');
        if (overlay) {
            overlay.addEventListener('click', event => {
                if (event.target === overlay) this.closeDetailModal();
            });
        }
    },

    handleActionClick(event) {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const code = button.dataset.code;

        if (action === 'view') this.openDetailModal(code);
        if (action === 'approve') this.approveRecord(code);
        if (action === 'reject') this.rejectRecord(code);
        if (action === 'close') this.closeDetailModal();
    },

    countByStatus(status) {
        return this.handoverRecords.filter(record => record.status === status).length;
    },

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
    },

    truncateText(value, maxLength) {
        const text = String(value ?? '');
        if (text.length <= maxLength) return this.escapeHtml(text);
        return `${this.escapeHtml(text.slice(0, maxLength))}...`;
    },

    showToast(message, type = 'success') {
        if (typeof Toast !== 'undefined' && typeof Toast.show === 'function') {
            Toast.show(message, type);
        } else if (typeof showToast === 'function') {
            showToast(message, type);
        }
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

window.IntakeApprovalPage = IntakeApprovalPage;
