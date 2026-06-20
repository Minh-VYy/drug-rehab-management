const MedicineCategoryPage = {
    medicines: [
        {
            id: 'MED001',
            code: 'MED001',
            name: 'Methadone',
            activeIngredient: 'Methadone HCl',
            category: 'detox',
            unit: 'Vien',
            dosage: '10mg',
            route: 'Uong',
            status: 'active',
            indications: 'Dieu tri thay the opioid va giam con them ma tuy.',
            notes: 'Can theo doi lieu luong chat che.',
            createdAt: '2026-01-15',
            updatedAt: '2026-06-10'
        },
        {
            id: 'MED002',
            code: 'MED002',
            name: 'Buprenorphine',
            activeIngredient: 'Buprenorphine',
            category: 'detox',
            unit: 'Vien',
            dosage: '8mg',
            route: 'Ngam',
            status: 'active',
            indications: 'Ho tro dieu tri cai nghien opioid.',
            notes: 'Dung theo chi dinh cua bac si.',
            createdAt: '2026-01-20',
            updatedAt: '2026-05-22'
        },
        {
            id: 'MED003',
            code: 'MED003',
            name: 'Diazepam',
            activeIngredient: 'Diazepam',
            category: 'psychiatric',
            unit: 'Vien',
            dosage: '5mg',
            route: 'Uong',
            status: 'active',
            indications: 'Giam lo au va co giat do hoi chung cai.',
            notes: 'Chi dung ngan han.',
            createdAt: '2026-02-05',
            updatedAt: '2026-06-12'
        },
        {
            id: 'MED004',
            code: 'MED004',
            name: 'Naloxone',
            activeIngredient: 'Naloxone HCl',
            category: 'detox',
            unit: 'Ong',
            dosage: '0.4mg/ml',
            route: 'Tiem',
            status: 'active',
            indications: 'Cap cuu qua lieu opioid.',
            notes: 'Thuoc cap cuu can san sang.',
            createdAt: '2026-02-10',
            updatedAt: '2026-06-01'
        },
        {
            id: 'MED005',
            code: 'MED005',
            name: 'Loperamide',
            activeIngredient: 'Loperamide',
            category: 'other',
            unit: 'Vien',
            dosage: '2mg',
            route: 'Uong',
            status: 'inactive',
            indications: 'Dieu tri tieu chay.',
            notes: 'Tam ngung do thay the bang thuoc khac.',
            createdAt: '2026-02-28',
            updatedAt: '2026-06-18'
        }
    ],
    currentSearch: '',
    currentStatusFilter: 'all',
    currentCategoryFilter: 'all',
    selectedMedicine: null,
    editMode: false,

    async render(containerId) {
        const success = await ViewLoader.load('views/admin/medicine-category.html', containerId);
        if (success) {
            await this.init();
        }
    },

    async init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Danh muc thuoc');
        }

        this.currentSearch = '';
        this.currentStatusFilter = 'all';
        this.currentCategoryFilter = 'all';
        
        await this.fetchMedicines();

        this.renderStats();
        this.renderTable();
        this.bindEvents();
    },

    async fetchMedicines() {
        if (typeof Api !== 'undefined') {
            try {
                const res = await Api.get('/admin/medicines');
                if (Array.isArray(res)) {
                    this.medicines = res;
                    return;
                }
            } catch (error) {
                console.warn('Chưa có API Thuốc, dùng mock fallback:', error);
                if (typeof window.Toast !== 'undefined') window.Toast.show('Đang dùng dữ liệu mẫu (Mock)', 'warning');
            }
        }
        // Dùng mock mặc định đã khởi tạo ở this.medicines
        if (!this.medicines || this.medicines.length === 0) {
            this.medicines = [
                { id: 'MED001', code: 'MED001', name: 'Methadone', activeIngredient: 'Methadone HCl', category: 'detox', unit: 'Vien', dosage: '10mg', route: 'Uong', status: 'active', indications: 'Dieu tri thay the opioid va giam con them ma tuy.', notes: 'Can theo doi lieu luong chat che.', createdAt: '2026-01-15', updatedAt: '2026-06-10' },
                { id: 'MED002', code: 'MED002', name: 'Buprenorphine', activeIngredient: 'Buprenorphine', category: 'detox', unit: 'Vien', dosage: '8mg', route: 'Ngam', status: 'active', indications: 'Ho tro dieu tri cai nghien opioid.', notes: 'Dung theo chi dinh cua bac si.', createdAt: '2026-01-20', updatedAt: '2026-05-22' }
            ];
        }
    },

    getFilteredMedicines() {
        const keyword = this.currentSearch.trim().toLowerCase();

        return this.medicines.filter(medicine => {
            const matchesStatus = this.currentStatusFilter === 'all'
                || medicine.status === this.currentStatusFilter;
            const matchesCategory = this.currentCategoryFilter === 'all'
                || medicine.category === this.currentCategoryFilter;
            const matchesSearch = !keyword
                || medicine.code.toLowerCase().includes(keyword)
                || medicine.name.toLowerCase().includes(keyword)
                || medicine.activeIngredient.toLowerCase().includes(keyword);

            return matchesStatus && matchesCategory && matchesSearch;
        });
    },

    renderStats() {
        this.setText('statTotalMeds', this.medicines.length);
        this.setText('statActiveMeds', this.countByStatus('active'));
        this.setText('statInactiveMeds', this.countByStatus('inactive'));
        this.setText('statCategories', new Set(this.medicines.map(item => item.category)).size);
    },

    renderTable() {
        const tbody = document.getElementById('medicineTableBody');
        const emptyState = document.getElementById('medicineEmptyState');
        if (!tbody) return;

        const medicines = this.getFilteredMedicines();
        if (!medicines.length) {
            tbody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        tbody.innerHTML = medicines.map(medicine => `
            <tr>
                <td><span class="td-code">${this.escapeHtml(medicine.code)}</span></td>
                <td><strong>${this.escapeHtml(medicine.name)}</strong></td>
                <td>${this.escapeHtml(medicine.activeIngredient)}</td>
                <td>${this.renderCategoryBadge(medicine.category)}</td>
                <td>${this.escapeHtml(medicine.unit)}</td>
                <td>${this.escapeHtml(medicine.dosage || '-')}</td>
                <td>${this.escapeHtml(medicine.route)}</td>
                <td>${this.renderStatusBadge(medicine.status)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline btn-icon" title="Xem" data-action="view" data-id="${this.escapeHtml(medicine.id)}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary btn-icon" title="Sua" data-action="edit" data-id="${this.escapeHtml(medicine.id)}">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-sm ${medicine.status === 'active' ? 'btn-danger' : 'btn-success'} btn-icon" title="Doi trang thai" data-action="toggle" data-id="${this.escapeHtml(medicine.id)}">
                            <i class="fa-solid ${medicine.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    renderCategoryBadge(category) {
        const map = {
            detox: { label: 'Giai doc', cls: 'badge-blue' },
            psychiatric: { label: 'Tam than', cls: 'badge-purple' },
            pain: { label: 'Giam dau', cls: 'badge-orange' },
            vitamin: { label: 'Vitamin', cls: 'badge-green' },
            other: { label: 'Khac', cls: 'badge-gray' }
        };
        const item = map[category] || { label: category, cls: 'badge-gray' };
        return `<span class="badge ${item.cls}">${this.escapeHtml(item.label)}</span>`;
    },

    renderStatusBadge(status) {
        const map = {
            active: { label: 'Dang su dung', cls: 'badge-green' },
            inactive: { label: 'Ngung su dung', cls: 'badge-red' }
        };
        const item = map[status] || { label: status, cls: 'badge-gray' };
        return `<span class="badge ${item.cls}">${this.escapeHtml(item.label)}</span>`;
    },

    openDetailModal(id) {
        const medicine = this.findMedicine(id);
        if (!medicine) return;

        const modal = document.getElementById('medicineDetailModal');
        const body = document.getElementById('medicineDetailBody');
        if (!modal || !body) return;

        body.innerHTML = `
            <div class="module-detail-grid">
                ${this.renderDetailItem('Ma thuoc', medicine.code)}
                ${this.renderDetailItem('Ten thuoc', medicine.name)}
                ${this.renderDetailItem('Hoat chat', medicine.activeIngredient)}
                ${this.renderDetailItem('Nhom thuoc', this.categoryLabel(medicine.category))}
                ${this.renderDetailItem('Don vi', medicine.unit)}
                ${this.renderDetailItem('Lieu luong', medicine.dosage || '-')}
                ${this.renderDetailItem('Duong dung', medicine.route)}
                ${this.renderDetailItem('Trang thai', medicine.status === 'active' ? 'Dang su dung' : 'Ngung su dung')}
                ${this.renderDetailItem('Chi dinh', medicine.indications || '-', true)}
                ${this.renderDetailItem('Luu y', medicine.notes || '-', true)}
                ${this.renderDetailItem('Ngay tao', medicine.createdAt || '-')}
                ${this.renderDetailItem('Cap nhat', medicine.updatedAt || '-')}
            </div>
        `;
        modal.classList.add('active');
    },

    renderDetailItem(label, value, full = false) {
        return `
            <div class="module-detail-item${full ? ' full' : ''}">
                <span class="module-detail-label">${this.escapeHtml(label)}</span>
                <span class="module-detail-value">${this.escapeHtml(value)}</span>
            </div>
        `;
    },

    closeDetailModal() {
        const modal = document.getElementById('medicineDetailModal');
        if (modal) modal.classList.remove('active');
    },

    openFormModal(id = null) {
        this.editMode = Boolean(id);
        this.selectedMedicine = id ? this.findMedicine(id) : null;

        if (this.editMode && !this.selectedMedicine) return;

        const modal = document.getElementById('medicineFormModal');
        const title = document.getElementById('formModalTitle');
        const icon = document.getElementById('formModalIcon');
        if (!modal) return;

        if (title) title.textContent = this.editMode ? 'Sua thuoc' : 'Them thuoc';
        if (icon) {
            icon.innerHTML = this.editMode
                ? '<i class="fa-solid fa-pen"></i>'
                : '<i class="fa-solid fa-plus"></i>';
        }

        this.resetForm();
        if (this.editMode) {
            this.populateForm(this.selectedMedicine);
        }

        modal.classList.add('active');
    },

    populateForm(medicine) {
        this.setFormValue('formMedicineId', medicine.id);
        this.setFormValue('formMedicineCode', medicine.code);
        this.setFormValue('formMedicineName', medicine.name);
        this.setFormValue('formActiveIngredient', medicine.activeIngredient);
        this.setFormValue('formCategory', medicine.category);
        this.setFormValue('formUnit', medicine.unit);
        this.setFormValue('formDosage', medicine.dosage);
        this.setFormValue('formRoute', medicine.route);
        this.setFormValue('formStatus', medicine.status);
        this.setFormValue('formIndications', medicine.indications);
        this.setFormValue('formNotes', medicine.notes);
    },

    closeFormModal() {
        const modal = document.getElementById('medicineFormModal');
        if (modal) modal.classList.remove('active');
        this.selectedMedicine = null;
        this.editMode = false;
    },

    saveMedicine() {
        const form = document.getElementById('medicineForm');
        if (!form || !form.checkValidity()) {
            form?.reportValidity();
            return;
        }

        const today = this.getCurrentDate();
        const data = {
            id: this.getFormValue('formMedicineId') || this.generateId(),
            code: this.getFormValue('formMedicineCode'),
            name: this.getFormValue('formMedicineName'),
            activeIngredient: this.getFormValue('formActiveIngredient'),
            category: this.getFormValue('formCategory'),
            unit: this.getFormValue('formUnit'),
            dosage: this.getFormValue('formDosage'),
            route: this.getFormValue('formRoute'),
            status: this.getFormValue('formStatus') || 'active',
            indications: this.getFormValue('formIndications'),
            notes: this.getFormValue('formNotes'),
            createdAt: this.editMode ? this.selectedMedicine.createdAt : today,
            updatedAt: today
        };

        if (this.editMode) {
            const index = this.medicines.findIndex(item => item.id === data.id);
            if (index !== -1) this.medicines[index] = data;
            this.showToast('Da cap nhat thuoc.', 'success');
        } else {
            this.medicines.unshift(data);
            this.showToast('Da them thuoc moi.', 'success');
        }

        this.closeFormModal();
        this.renderStats();
        this.renderTable();
    },

    toggleMedicineStatus(id) {
        const medicine = this.findMedicine(id);
        if (!medicine) return;

        medicine.status = medicine.status === 'active' ? 'inactive' : 'active';
        medicine.updatedAt = this.getCurrentDate();
        this.renderStats();
        this.renderTable();
        this.showToast('Da cap nhat trang thai thuoc.', 'success');
    },

    bindEvents() {
        const searchInput = document.getElementById('medicineSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', event => {
                this.currentSearch = event.target.value;
                this.renderTable();
            });
        }

        const statusFilter = document.getElementById('medicineStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', event => {
                this.currentStatusFilter = event.target.value;
                this.renderTable();
            });
        }

        const categoryFilter = document.getElementById('medicineCategoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', event => {
                this.currentCategoryFilter = event.target.value;
                this.renderTable();
            });
        }

        this.bindClick('btnAddMedicine', () => this.openFormModal());
        this.bindClick('btnExportMedicine', () => this.showToast('Chuc nang xuat bao cao dang duoc phat trien.', 'warning'));
        this.bindClick('detailModalCloseBtn', () => this.closeDetailModal());
        this.bindClick('formModalCloseBtn', () => this.closeFormModal());
        this.bindClick('btnSaveMedicine', () => this.saveMedicine());

        const tbody = document.getElementById('medicineTableBody');
        if (tbody) {
            tbody.addEventListener('click', event => this.handleTableAction(event));
        }

        const detailModal = document.getElementById('medicineDetailModal');
        if (detailModal) {
            detailModal.addEventListener('click', event => {
                if (event.target === detailModal || event.target.closest('[data-action="close-detail"]')) {
                    this.closeDetailModal();
                }
            });
        }

        const formModal = document.getElementById('medicineFormModal');
        if (formModal) {
            formModal.addEventListener('click', event => {
                if (event.target === formModal || event.target.closest('[data-action="close-form"]')) {
                    this.closeFormModal();
                }
            });
        }
    },

    handleTableAction(event) {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === 'view') this.openDetailModal(id);
        if (action === 'edit') this.openFormModal(id);
        if (action === 'toggle') this.toggleMedicineStatus(id);
    },

    bindClick(id, handler) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', handler);
    },

    resetForm() {
        const form = document.getElementById('medicineForm');
        if (form) form.reset();
        this.setFormValue('formStatus', 'active');
    },

    findMedicine(id) {
        return this.medicines.find(item => item.id === id);
    },

    countByStatus(status) {
        return this.medicines.filter(item => item.status === status).length;
    },

    categoryLabel(category) {
        const map = {
            detox: 'Giai doc',
            psychiatric: 'Tam than',
            pain: 'Giam dau',
            vitamin: 'Vitamin',
            other: 'Khac'
        };
        return map[category] || category;
    },

    generateId() {
        return `MED${Date.now().toString().slice(-6)}`;
    },

    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    },

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
    },

    getFormValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    },

    setFormValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value ?? '';
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

window.MedicineCategoryPage = MedicineCategoryPage;
