const CompletionApprovalPage = {
    proposals: [],
    currentSearch: '',
    currentStatusFilter: 'all',
    selectedRecord: null,

    async render(containerId) {
        const success = await ViewLoader.load('views/leader/completion-approval.html', containerId);
        if (success) {
            await this.init();
        }
    },

    async init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Phê duyệt hoàn thành');
        }

        this.renderDate();
        await this.loadProposals();
        this.renderStats();
        this.renderTable();
        this.bindEvents();
    },

    async loadProposals() {
        if (typeof Api === 'undefined') return;

        try {
            const data = await Api.getCompletionApprovals();
            this.proposals = Array.isArray(data) ? data : [];
        } catch (error) {
            console.warn('Lỗi API Completion Approvals, dùng Mock data fallback:', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Đang dùng dữ liệu mẫu (Mock) do chưa kết nối Backend', 'warning');
            
            // Mock Fallback matching SQL data
            this.proposals = [
                { code: 'DXHT-001', recordCode: 'NCN-001', subjectName: 'Nguyễn Văn Trọng', currentPhase: 'Phục hồi hòa nhập', requestDate: '2026-06-15', reason: 'Học viên đã hoàn thành xuất sắc phác đồ cắt cơn và phục hồi 6 tháng. Phục hồi tâm lý tốt, đủ điều kiện tái hòa nhập.', status: 'ChoDuyet' },
                { code: 'DXHT-002', recordCode: 'NCN-002', subjectName: 'Lý Hải Nam', currentPhase: 'Cắt cơn giải độc', requestDate: '2026-06-18', reason: 'Học viên phục hồi tốt, gia đình bảo lãnh xin ra trại sớm để tiếp tục quản lý tại địa phương.', status: 'ChoDuyet' }
            ];
        }
    },

    getFilteredRecords() {
        const keyword = this.currentSearch.trim().toLowerCase();

        return this.proposals.filter(record => {
            const matchesStatus = this.currentStatusFilter === 'all'
                || record.status === this.currentStatusFilter;

            const matchesSearch = !keyword
                || String(record.code || '').toLowerCase().includes(keyword)
                || String(record.recordCode || '').toLowerCase().includes(keyword)
                || String(record.subjectName || '').toLowerCase().includes(keyword);

            return matchesStatus && matchesSearch;
        });
    },

    renderStats() {
        this.setText('completeStatPending', this.countByStatus('ChoDuyet'));
        this.setText('completeStatApproved', this.countByStatus('DaHoanThanh'));
        this.setText('completeStatRejected', this.countByStatus('TuChoi'));
    },

    renderDate() {
        const now = new Date();
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
        const numEl = document.getElementById('complete-date-num');
        const labelEl = document.getElementById('complete-date-label');
        if (numEl) numEl.textContent = now.getDate();
        if (labelEl) labelEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getFullYear()}`;
    },

    renderTable() {
        const tbody = document.getElementById('completeTableBody');
        const emptyState = document.getElementById('completeEmptyState');
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
                <td>${this.escapeHtml(record.recordCode)}</td>
                <td><strong>${this.escapeHtml(record.subjectName)}</strong></td>
                <td>${this.escapeHtml(record.currentPhase)}</td>
                <td>${this.escapeHtml(record.requestedBy)}</td>
                <td>${this.escapeHtml(record.evaluation)}</td>
                <td>${this.escapeHtml(record.requestDate)}</td>
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
            DaHoanThanh: { label: 'Đã hoàn thành', cls: 'badge-green' },
            TuChoi: { label: 'Từ chối', cls: 'badge-red' }
        };
        const item = map[status] || { label: status || '-', cls: 'badge-gray' };
        return `<span class="badge ${item.cls}">${this.escapeHtml(item.label)}</span>`;
    },

    openDetailModal(code) {
        const record = this.proposals.find(item => item.code === code);
        if (!record) return;

        this.selectedRecord = record;
        const modal = document.getElementById('completeDetailModal');
        const body = document.getElementById('completeModalBody');
        const footer = document.getElementById('completeModalFooter');
        if (!modal || !body || !footer) return;

        body.innerHTML = `
            ${this.renderDetailGroup('Thông tin đề xuất', [
                ['Mã đề xuất', record.code],
                ['Mã hồ sơ', record.recordCode],
                ['Người cai nghiện', record.subjectName],
                ['Giai đoạn hiện tại', record.currentPhase],
                ['Ngày đề xuất', record.requestDate],
                ['Cán bộ đề xuất', record.requestedBy]
            ])}
            ${this.renderDetailGroup('Nội dung đánh giá', [
                ['Kết quả đánh giá', record.evaluation],
                ['Ghi chú của cán bộ', record.notes]
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
                <button class="btn btn-primary" data-action="approve" data-code="${this.escapeHtml(record.code)}">Duyệt hoàn thành</button>
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
        const modal = document.getElementById('completeDetailModal');
        if (modal) modal.classList.remove('active');
        this.selectedRecord = null;
    },

    async approveRecord(code) {
        await this.updateRecordStatus(code, 'approve', null, 'Đã phê duyệt hoàn thành cai nghiện.');
    },

    async rejectRecord(code) {
        await this.updateRecordStatus(code, 'reject', { reason: 'Lãnh đạo trung tâm từ chối đề xuất hoàn thành.' }, 'Đã từ chối đề xuất hoàn thành.');
    },

    async updateRecordStatus(code, action, body, message) {
        if (typeof Api === 'undefined') return;

        try {
            const updated = await Api.post(`/leader/completion-approvals/${code}/${action}`, body || {});
            const index = this.proposals.findIndex(item => item.code === code);
            if (index !== -1 && updated) this.proposals[index] = updated;

            this.closeDetailModal();
            this.renderStats();
            this.renderTable();
            this.showToast(message, 'success');
        } catch (error) {
            console.error('Không cập nhật được đề xuất hoàn thành:', error);
            this.showToast('Không cập nhật được đề xuất hoàn thành.', 'warning');
        }
    },

    bindEvents() {
        const searchInput = document.getElementById('completeSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', event => {
                this.currentSearch = event.target.value;
                this.renderTable();
            });
        }

        const statusFilter = document.getElementById('completeStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', event => {
                this.currentStatusFilter = event.target.value;
                this.renderTable();
            });
        }

        const tbody = document.getElementById('completeTableBody');
        if (tbody) tbody.addEventListener('click', event => this.handleActionClick(event));

        const modalFooter = document.getElementById('completeModalFooter');
        if (modalFooter) modalFooter.addEventListener('click', event => this.handleActionClick(event));

        const closeBtn = document.getElementById('completeModalCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeDetailModal());

        const overlay = document.getElementById('completeDetailModal');
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
        return this.proposals.filter(record => record.status === status).length;
    },

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
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

window.CompletionApprovalPage = CompletionApprovalPage;
