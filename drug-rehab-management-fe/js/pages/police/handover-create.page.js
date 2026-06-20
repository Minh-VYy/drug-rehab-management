const HandoverCreatePage = {
    state: {
        status: 'Nhap',
        createdDate: null,
        pendingPayload: null,
        lastCreated: null
    },

    requiredFields: [
        'patientName',
        'citizenId',
        'birthDate',
        'relativeName',
        'relativePhone',
        'violationBehavior',
        'decisionNumber',
        'decisionDate'
    ],

    async render(containerId) {
        const success = await ViewLoader.load('views/police/handover-create.html', containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Tao ho so ban giao');
        }

        this.state.status = 'Nhap';
        this.state.createdDate = new Date();
        this.state.pendingPayload = null;
        this.updateSummary();
        this.bindEvents();
    },

    bindEvents() {
        const form = this.getForm();
        if (!form) return;

        form.addEventListener('submit', event => {
            event.preventDefault();
            this.handleSubmit();
        });

        form.addEventListener('input', event => {
            const field = event.target?.name;
            if (field) {
                this.clearFieldError(field);
                this.updateSummary();
            }
        });

        const draftBtn = document.getElementById('handoverDraftBtn');
        if (draftBtn) {
            draftBtn.addEventListener('click', () => this.saveDraft());
        }

        const resetBtn = document.getElementById('handoverResetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetForm());
        }

        const confirmBtn = document.getElementById('handoverConfirmSubmitBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmSubmit());
        }

        const cancelBtn = document.getElementById('handoverCancelSubmitBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeConfirmModal());
        }

        const closeBtn = document.getElementById('handoverConfirmCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeConfirmModal());
        }

        const overlay = document.getElementById('handoverConfirmModal');
        if (overlay) {
            overlay.addEventListener('click', event => {
                if (event.target === overlay) this.closeConfirmModal();
            });
        }
    },

    saveDraft() {
        this.state.status = 'Nhap';
        this.state.pendingPayload = this.collectPayload();
        this.updateSummary();
        this.showToast('Da luu nhap ho so.', 'success');
    },

    handleSubmit() {
        const payload = this.collectPayload();
        const isValid = this.validatePayload(payload);

        this.updateSummary();
        if (!isValid) {
            this.showToast('Vui long kiem tra cac truong bat buoc.', 'warning');
            return;
        }

        this.state.pendingPayload = payload;
        this.openConfirmModal(payload);
    },

    async confirmSubmit() {
        if (!this.state.pendingPayload) return;

        const created = await this.createHandoverRecord(this.state.pendingPayload);
        this.state.status = 'ChoDuyet';
        this.state.lastCreated = created;
        this.state.pendingPayload = null;

        this.closeConfirmModal();
        this.updateSummary();
        this.renderCreatedCard(created);
        this.showToast('Da gui ho so ban giao.', 'success');
    },

    async createHandoverRecord(payload) {
        return {
            ...payload,
            code: this.generateRecordCode(),
            status: 'ChoDuyet',
            sentDate: new Date().toLocaleDateString('vi-VN')
        };
    },

    collectPayload() {
        const form = this.getForm();
        const data = {};
        if (!form) return data;

        new FormData(form).forEach((value, key) => {
            data[key] = typeof value === 'string' ? value.trim() : value;
        });

        data.decisionFileName = form.elements.decisionFile?.files?.[0]?.name || '';
        data.violationFileName = form.elements.violationFile?.files?.[0]?.name || '';
        return data;
    },

    validatePayload(payload) {
        let valid = true;
        this.clearAllErrors();

        this.requiredFields.forEach(field => {
            if (!payload[field]) {
                this.setFieldError(field, 'Truong nay bat buoc.');
                valid = false;
            }
        });

        if (payload.citizenId && !/^\d{12}$/.test(payload.citizenId)) {
            this.setFieldError('citizenId', 'CCCD phai gom dung 12 chu so.');
            valid = false;
        }

        if (payload.relativePhone && !/^\d{10}$/.test(payload.relativePhone)) {
            this.setFieldError('relativePhone', 'So dien thoai phai gom dung 10 chu so.');
            valid = false;
        }

        return valid;
    },

    openConfirmModal(payload) {
        const modal = document.getElementById('handoverConfirmModal');
        const body = document.getElementById('handoverConfirmBody');
        if (!modal || !body) return;

        body.innerHTML = `
            <div class="module-detail-grid">
                ${this.renderDetailItem('Nguoi cai nghien', payload.patientName)}
                ${this.renderDetailItem('CCCD', payload.citizenId)}
                ${this.renderDetailItem('Nguoi than', payload.relativeName)}
                ${this.renderDetailItem('So quyet dinh', payload.decisionNumber)}
                ${this.renderDetailItem('Hanh vi vi pham', payload.violationBehavior, true)}
            </div>
        `;
        modal.classList.add('active');
    },

    closeConfirmModal() {
        const modal = document.getElementById('handoverConfirmModal');
        if (modal) modal.classList.remove('active');
    },

    resetForm() {
        const confirmed = window.confirm('Ban co chac muon lam moi form? Du lieu dang nhap se bi xoa.');
        if (!confirmed) return;

        const form = this.getForm();
        if (form) form.reset();

        this.state.status = 'Nhap';
        this.state.pendingPayload = null;
        this.state.lastCreated = null;
        this.clearAllErrors();
        this.updateSummary();

        const createdCard = document.getElementById('handoverCreatedCard');
        if (createdCard) createdCard.style.display = 'none';
    },

    updateSummary() {
        this.setText('handoverStatusValue', this.state.status);
        this.setText('handoverCreatedDate', this.state.createdDate
            ? this.state.createdDate.toLocaleDateString('vi-VN')
            : '--/--/----');
        this.setText('handoverMissingValue', this.countMissingRequiredFields());
    },

    countMissingRequiredFields() {
        const payload = this.collectPayload();
        return this.requiredFields.filter(field => !payload[field]).length;
    },

    renderCreatedCard(record) {
        const card = document.getElementById('handoverCreatedCard');
        const summary = document.getElementById('handoverCreatedSummary');
        if (!card || !summary) return;

        summary.innerHTML = `
            ${this.renderDetailItem('Ma ho so', record.code)}
            ${this.renderDetailItem('Ho ten', record.patientName)}
            ${this.renderDetailItem('Trang thai', record.status)}
            ${this.renderDetailItem('Ngay gui', record.sentDate)}
        `;
        card.style.display = 'block';
    },

    renderDetailItem(label, value, full = false) {
        return `
            <div class="module-detail-item${full ? ' full' : ''}">
                <span class="module-detail-label">${this.escapeHtml(label)}</span>
                <span class="module-detail-value">${this.escapeHtml(value || '-')}</span>
            </div>
        `;
    },

    setFieldError(field, message) {
        const errorEl = document.querySelector(`[data-error-for="${field}"]`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            errorEl.style.color = 'var(--danger)';
            errorEl.style.marginTop = '4px';
        }

        const input = this.getForm()?.elements[field];
        if (input) {
            input.style.borderColor = 'var(--danger)';
        }
    },

    clearFieldError(field) {
        const errorEl = document.querySelector(`[data-error-for="${field}"]`);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }

        const input = this.getForm()?.elements[field];
        if (input) {
            input.style.borderColor = '';
        }
    },

    clearAllErrors() {
        this.requiredFields.forEach(field => this.clearFieldError(field));
    },

    generateRecordCode() {
        const suffix = Date.now().toString().slice(-6);
        return `HSBG${suffix}`;
    },

    getForm() {
        return document.getElementById('handoverCreateForm');
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

window.HandoverCreatePage = HandoverCreatePage;
