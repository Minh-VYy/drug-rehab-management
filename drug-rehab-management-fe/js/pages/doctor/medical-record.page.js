const MedicalRecordPage = {
    records: [],

    async render(containerId) {
        const success = await ViewLoader.load('views/doctor/medical-record.html', containerId);
        if (success) await this.init();
    },

    async init() {
        if (!this.hasDoctorAccess()) {
            this.renderNoAccess();
            return;
        }

        if (typeof Topbar !== 'undefined') Topbar.setTitle('Cập nhật hồ sơ bệnh án');
        this.records = await this.loadRecords();
        this.applyFilter();
    },

    async loadRecords() {
        if (typeof Api !== 'undefined') {
            try {
                const records = await Api.getMedicalRecords();
                if (Array.isArray(records)) return records;
            } catch (error) {
                console.warn('Lỗi API Medical Records, dùng Mock data fallback:', error);
                if (typeof window.Toast !== 'undefined') window.Toast.show('Đang dùng dữ liệu mẫu (Mock) do chưa kết nối Backend', 'warning');
            }
        }

        const now = new Date();
        const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
        const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString();

        // Mock Fallback matching SQL data
        return [
            { maBenhAn: 'BA-001', maNguoiCaiNghien: 'NCN-001', maBacSi: 'BS001', tienSuBenh: 'Rối loạn giấc ngủ', diUng: 'Không', chieuCao: 170.5, canNang: 65.0, ngayLap: '2026-05-01', ngayCapNhatCuoi: oneDayAgo },
            { maBenhAn: 'BA-002', maNguoiCaiNghien: 'NCN-002', maBacSi: 'BS001', tienSuBenh: 'Bình thường', diUng: 'Kháng sinh', chieuCao: 165.0, canNang: 58.0, ngayLap: '2026-05-15', ngayCapNhatCuoi: tenDaysAgo },
            { maBenhAn: 'BA-003', maNguoiCaiNghien: 'NCN-003', maBacSi: 'BS001', tienSuBenh: 'Viêm dạ dày', diUng: 'Hải sản', chieuCao: 168.0, canNang: 62.0, ngayLap: '2026-06-01', ngayCapNhatCuoi: tenDaysAgo },
            { maBenhAn: 'BA-004', maNguoiCaiNghien: 'NCN-004', maBacSi: 'BS001', tienSuBenh: 'Sức khoẻ ổn định', diUng: 'Không', chieuCao: 172.0, canNang: 70.0, ngayLap: '2026-06-15', ngayCapNhatCuoi: oneDayAgo }
        ];
    },

    hasDoctorAccess() {
        if (typeof Auth === 'undefined') return true;
        const user = Auth.getCurrentUser();
        return user && user.role === ROLES.DOCTOR;
    },

    renderNoAccess() {
        const container = document.getElementById('main-content');
        if (!container) return;
        container.innerHTML = `
            <div class="forbidden-page">
                <div class="forbidden-code">403</div>
                <h2 style="color:#fff;">Không có quyền truy cập</h2>
                <p style="color:rgba(255,255,255,0.65);">Chức năng cập nhật hồ sơ bệnh án chỉ dành cho Bác sĩ phụ trách.</p>
            </div>`;
    },

    getFilteredRecords() {
        const searchTerm = (document.getElementById('medicalRecordSearch')?.value || '').toLowerCase().trim();
        const statusFilter = document.getElementById('medicalRecordStatusFilter')?.value || 'all';

        return this.records.filter(record => {
            const searchableText = [
                record.maBenhAn,
                record.maNguoiCaiNghien,
                record.maBacSi
            ].join(' ').toLowerCase();

            const matchSearch = !searchTerm || searchableText.includes(searchTerm);
            const matchStatus = statusFilter === 'all' || this.getUpdateState(record) === statusFilter;
            return matchSearch && matchStatus;
        });
    },

    getUpdateState(record) {
        if (!record.ngayCapNhatCuoi) return 'Cần cập nhật';
        const updatedAt = new Date(record.ngayCapNhatCuoi);
        if (Number.isNaN(updatedAt.getTime())) return 'Cần cập nhật';
        return (new Date() - updatedAt) > 7 * 24 * 60 * 60 * 1000 ? 'Cần cập nhật' : 'Đã cập nhật';
    },

    renderRecordStatus(record) {
        const state = this.getUpdateState(record);
        if (state === 'Cần cập nhật') {
            return `<span class="badge badge-warning"><i class="fa-solid fa-clock" style="font-size:9px;"></i> Cần cập nhật</span>`;
        }
        return `<span class="badge badge-success"><i class="fa-solid fa-circle-check" style="font-size:9px;"></i> Đã cập nhật</span>`;
    },

    applyFilter() {
        this.renderTable(this.getFilteredRecords());
    },

    renderTable(data) {
        const target = document.getElementById('medicalRecordTable');
        if (!target) return;

        if (!data.length) {
            target.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                    <div class="empty-state-title">Không tìm thấy hồ sơ</div>
                    <div class="empty-state-msg">Không có hồ sơ bệnh án phù hợp với bộ lọc hiện tại.</div>
                </div>`;
            return;
        }

        const rows = data.map(record => [
            `<span class="td-code">${this.escapeHtml(record.maBenhAn)}</span>`,
            `<span style="font-weight:600;">${this.escapeHtml(record.maNguoiCaiNghien)}</span>`,
            this.escapeHtml(record.maBacSi),
            this.truncate(record.tienSuBenh, 22),
            this.truncate(record.diUng, 18),
            `${this.escapeHtml(record.chieuCao ?? '—')} cm`,
            `${this.escapeHtml(record.canNang ?? '—')} kg`,
            this.formatDateTime(record.ngayLap),
            this.formatDateTime(record.ngayCapNhatCuoi),
            this.renderRecordStatus(record),
            `<div class="action-btns">
                <button class="btn btn-sm btn-outline" onclick="MedicalRecordPage.openDetail('${record.maBenhAn}')">
                    <i class="fa-solid fa-eye"></i> Xem
                </button>
                <button class="btn btn-sm btn-primary" onclick="MedicalRecordPage.openUpdateModal('${record.maBenhAn}')">
                    <i class="fa-solid fa-pen-to-square"></i> Cập nhật
                </button>
            </div>`
        ]);

        if (typeof Table !== 'undefined') {
            target.innerHTML = Table.renderTable(
                ['Mã bệnh án', 'Mã người cai', 'Mã bác sĩ', 'Tiền sử bệnh', 'Dị ứng',
                 'Chiều cao', 'Cân nặng', 'Ngày lập', 'Cập nhật cuối', 'Trạng thái', 'Thao tác'],
                rows
            );
        }
    },

    getRecord(id) {
        return this.records.find(record => record.maBenhAn === id);
    },

    openDetail(id) {
        const record = this.getRecord(id);
        if (!record) {
            if (typeof Toast !== 'undefined') Toast.show('Không tìm thấy hồ sơ', 'warning');
            return;
        }

        const content = `
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Mã bệnh án</div>
                    <div class="detail-value code">${this.escapeHtml(record.maBenhAn)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Mã người cai nghiện</div>
                    <div class="detail-value">${this.escapeHtml(record.maNguoiCaiNghien)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Mã bác sĩ</div>
                    <div class="detail-value">${this.escapeHtml(record.maBacSi)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Trạng thái</div>
                    <div class="detail-value" style="background:transparent; border:none; padding:0;">
                        ${this.renderRecordStatus(record)}
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Chiều cao</div>
                    <div class="detail-value">${this.escapeHtml(record.chieuCao ?? '—')} cm</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Cân nặng</div>
                    <div class="detail-value">${this.escapeHtml(record.canNang ?? '—')} kg</div>
                </div>
                <div class="detail-item span-2">
                    <div class="detail-label">Tiền sử bệnh</div>
                    <div class="detail-value">${this.escapeHtml(record.tienSuBenh || 'Không ghi nhận')}</div>
                </div>
                <div class="detail-item span-2">
                    <div class="detail-label">Dị ứng</div>
                    <div class="detail-value">${this.escapeHtml(record.diUng || 'Không ghi nhận')}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Ngày lập</div>
                    <div class="detail-value">${this.formatDateTime(record.ngayLap)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Cập nhật cuối</div>
                    <div class="detail-value">${this.formatDateTime(record.ngayCapNhatCuoi)}</div>
                </div>
            </div>`;

        const footer = `
            <button class="btn btn-outline" onclick="Modal.close()">Đóng</button>
            <button class="btn btn-primary" onclick="MedicalRecordPage.openUpdateModal('${id}'); Modal.close();">
                <i class="fa-solid fa-pen-to-square"></i> Cập nhật
            </button>`;

        if (typeof Modal !== 'undefined') Modal.open(`Chi tiết hồ sơ ${this.escapeHtml(id)}`, content, footer);
    },

    openUpdateModal(id) {
        const record = this.getRecord(id);
        if (!record) {
            if (typeof Toast !== 'undefined') Toast.show('Không tìm thấy hồ sơ', 'warning');
            return;
        }

        const content = `
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Mã bệnh án <span class="required">*</span></label>
                    <input class="form-control" value="${this.escapeAttr(record.maBenhAn)}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Mã người cai nghiện <span class="required">*</span></label>
                    <input class="form-control" value="${this.escapeAttr(record.maNguoiCaiNghien)}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Mã bác sĩ <span class="required">*</span></label>
                    <input class="form-control" value="${this.escapeAttr(record.maBacSi)}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Ngày lập <span class="required">*</span></label>
                    <input class="form-control" value="${this.escapeAttr(this.formatDateTime(record.ngayLap))}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Chiều cao (cm)</label>
                    <input class="form-control" id="upd-chieucao" type="number" min="1" step="0.1"
                        value="${this.escapeAttr(record.chieuCao ?? '')}" placeholder="170">
                    <div class="form-error" id="upd-chieucao-error" style="display:none;">
                        <i class="fa-solid fa-circle-exclamation"></i> Chiều cao phải là số hợp lệ
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Cân nặng (kg)</label>
                    <input class="form-control" id="upd-cannang" type="number" min="1" step="0.1"
                        value="${this.escapeAttr(record.canNang ?? '')}" placeholder="60">
                    <div class="form-error" id="upd-cannang-error" style="display:none;">
                        <i class="fa-solid fa-circle-exclamation"></i> Cân nặng phải là số hợp lệ
                    </div>
                </div>
                <div class="form-group span-2">
                    <label class="form-label">Ngày cập nhật cuối <span class="required">*</span></label>
                    <input class="form-control" value="${this.escapeAttr(this.formatDateTime(record.ngayCapNhatCuoi))}" readonly>
                </div>
                <div class="form-group span-2">
                    <label class="form-label">Tiền sử bệnh</label>
                    <textarea class="form-control" id="upd-tiensubenh" rows="3"
                        placeholder="Nhập tiền sử bệnh...">${this.escapeHtml(record.tienSuBenh || '')}</textarea>
                </div>
                <div class="form-group span-2">
                    <label class="form-label">Dị ứng</label>
                    <textarea class="form-control" id="upd-diung" rows="2"
                        placeholder="Nhập thông tin dị ứng...">${this.escapeHtml(record.diUng || '')}</textarea>
                </div>
            </div>`;

        const footer = `
            <button class="btn btn-outline" onclick="Modal.close()">Hủy</button>
            <button class="btn btn-primary" onclick="MedicalRecordPage.saveUpdate('${id}')">
                <i class="fa-solid fa-floppy-disk"></i> Lưu thay đổi
            </button>`;

        if (typeof Modal !== 'undefined') Modal.open(`Cập nhật hồ sơ ${this.escapeHtml(id)}`, content, footer);
    },

    async saveUpdate(id) {
        const record = this.getRecord(id);
        if (!record) return;

        const heightValue = document.getElementById('upd-chieucao')?.value.trim() || '';
        const weightValue = document.getElementById('upd-cannang')?.value.trim() || '';
        const heightValid = this.validateOptionalPositiveNumber(heightValue, 'upd-chieucao-error');
        const weightValid = this.validateOptionalPositiveNumber(weightValue, 'upd-cannang-error');

        if (!heightValid || !weightValid) return;

        const payload = {
            tienSuBenh: document.getElementById('upd-tiensubenh')?.value.trim() || '',
            diUng: document.getElementById('upd-diung')?.value.trim() || '',
            chieuCao: heightValue ? Number(heightValue) : null,
            canNang: weightValue ? Number(weightValue) : null
        };

        try {
            const updated = typeof Api !== 'undefined'
                ? await Api.updateMedicalRecord(id, payload)
                : null;
            Object.assign(record, updated || {
                ...payload,
                ngayCapNhatCuoi: new Date().toISOString()
            });
        } catch (error) {
            console.warn('Falling back to local medical record update:', error);
            Object.assign(record, {
                ...payload,
                ngayCapNhatCuoi: new Date().toISOString()
            });
        }

        if (typeof Modal !== 'undefined') Modal.close();
        if (typeof Toast !== 'undefined') Toast.show(`Cập nhật hồ sơ ${id} thành công!`, 'success');
        this.applyFilter();
    },

    validateOptionalPositiveNumber(value, errorId) {
        const errorEl = document.getElementById(errorId);
        const valid = !value || (Number.isFinite(Number(value)) && Number(value) > 0);
        if (errorEl) errorEl.style.display = valid ? 'none' : 'flex';
        return valid;
    },

    formatDateTime(value) {
        if (!value) return 'Chưa cập nhật';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return this.escapeHtml(value);
        return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    },

    truncate(value, length = 25) {
        if (!value) return '<span style="color:var(--text-muted);">—</span>';
        const text = String(value);
        return this.escapeHtml(text.length > length ? `${text.slice(0, length)}...` : text);
    },

    escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    escapeAttr(value) {
        return this.escapeHtml(value);
    }
};

window.MedicalRecordPage = MedicalRecordPage;
