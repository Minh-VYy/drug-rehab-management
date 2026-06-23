const TreatmentApprovalPage = {
    plans: [],

    async render(containerId) {
        const success = await ViewLoader.load('views/manager/treatment-approval.html', containerId);
        if (success) await this.init();
    },

    async init() {
        if (!this.hasManagerAccess()) {
            this.renderNoAccess();
            return;
        }

        if (typeof Topbar !== 'undefined') Topbar.setTitle('Phê duyệt phác đồ điều trị');
        this.plans = await this.loadPlans();
        this.applyFilter();
    },

    async loadPlans() {
        if (typeof Api === 'undefined' || typeof Api.getTreatmentPlans === 'undefined') {
            console.warn('Api helper chưa sẵn sàng');
            return [];
        }

        try {
            const data = await Api.getTreatmentPlans();
            return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.items) ? data.items : [];
        } catch (error) {
            console.error('Lỗi API Treatment Approvals:', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Không thể tải dữ liệu phác đồ', 'error');
            return [];
        }
    },

    hasManagerAccess() {
        if (typeof Auth === 'undefined') return true;
        const user = Auth.getCurrentUser();
        return user && user.role === ROLES.MANAGER;
    },

    renderNoAccess() {
        const container = document.getElementById('main-content');
        if (!container) return;
        container.innerHTML = `
            <div class="forbidden-page">
                <div class="forbidden-code">403</div>
                <h2 style="color:#fff;">Không có quyền truy cập</h2>
                <p style="color:rgba(255,255,255,0.65);">Chức năng phê duyệt phác đồ chỉ dành cho Cán bộ quản lý.</p>
            </div>`;
    },

    getFilteredPlans() {
        const search = (document.getElementById('ta-search')?.value || '').toLowerCase().trim();
        const status = document.getElementById('ta-status-filter')?.value || 'ChoPheDuyet';

        return this.plans.filter(plan => {
            const text = [
                plan.maPhacdoDT,
                plan.maBenhAn,
                plan.maBacSi,
                plan.maQuanLy,
                plan.loaiMaTuy,
                plan.giaiDoan
            ].join(' ').toLowerCase();

            const matchesSearch = !search || text.includes(search);
            const matchesStatus = status === 'all' || plan.trangThai === status;
            return matchesSearch && matchesStatus;
        });
    },

    applyFilter() {
        this.renderSummary();
        this.renderTable(this.getFilteredPlans());
    },

    async refresh() {
        this.plans = await this.loadPlans();
        this.applyFilter();
        if (typeof Toast !== 'undefined') Toast.show('Đã làm mới danh sách phác đồ.', 'success');
    },

    renderSummary() {
        const target = document.getElementById('ta-summary');
        if (!target) return;

        const pending = this.countByStatus('ChoPheDuyet');
        const approved = this.plans.filter(plan => ['DaPheDuyet', 'DangApDung'].includes(plan.trangThai)).length;
        const rejected = this.countByStatus('TuChoi');
        const total = this.plans.length;

        target.innerHTML = `
            <div class="stat-card">
                <div class="stat-card-icon stat-icon-blue"><i class="fa-solid fa-file-medical"></i></div>
                <div class="stat-value">${total}</div>
                <div class="stat-label">Tổng phác đồ</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-icon stat-icon-orange"><i class="fa-solid fa-clock"></i></div>
                <div class="stat-value">${pending}</div>
                <div class="stat-label">Chờ phê duyệt</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-icon stat-icon-green"><i class="fa-solid fa-circle-check"></i></div>
                <div class="stat-value">${approved}</div>
                <div class="stat-label">Đã phê duyệt</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-icon stat-icon-red"><i class="fa-solid fa-circle-xmark"></i></div>
                <div class="stat-value">${rejected}</div>
                <div class="stat-label">Từ chối</div>
            </div>`;
    },

    countByStatus(status) {
        return this.plans.filter(plan => plan.trangThai === status).length;
    },

    renderTable(data) {
        const target = document.getElementById('ta-table');
        if (!target) return;

        if (!data.length) {
            target.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                    <div class="empty-state-title">Không tìm thấy phác đồ</div>
                    <div class="empty-state-msg">Không có phác đồ nào phù hợp với bộ lọc hiện tại.</div>
                </div>`;
            return;
        }

        const rows = data.map(plan => {
            const canProcess = plan.trangThai === 'ChoPheDuyet';
            const canClose = this.canCloseTreatment(plan);
            let actionButtons = `
                    <div class="action-btns">
                        <button class="btn btn-sm btn-outline" onclick="TreatmentApprovalPage.openDetail('${plan.maPhacdoDT}')">
                            <i class="fa-solid fa-eye"></i> Xem
                        </button>
                    </div>`;

            if (canProcess) {
                actionButtons = `
                    <div class="action-btns">
                        <button class="btn btn-sm btn-outline" onclick="TreatmentApprovalPage.openDetail('${plan.maPhacdoDT}')">
                            <i class="fa-solid fa-eye"></i> Xem
                        </button>
                        <button class="btn btn-sm btn-success" onclick="TreatmentApprovalPage.openApproveModal('${plan.maPhacdoDT}')">
                            <i class="fa-solid fa-check"></i> Duyệt
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="TreatmentApprovalPage.openRejectModal('${plan.maPhacdoDT}')">
                            <i class="fa-solid fa-xmark"></i> Từ chối
                        </button>
                    </div>`;
            } else if (canClose) {
                actionButtons = `
                    <div class="action-btns">
                        <button class="btn btn-sm btn-outline" onclick="TreatmentApprovalPage.openDetail('${plan.maPhacdoDT}')">
                            <i class="fa-solid fa-eye"></i> Xem
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="TreatmentApprovalPage.openPauseModal('${plan.maPhacdoDT}')">
                            <i class="fa-solid fa-pause"></i> Tạm dừng
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="TreatmentApprovalPage.openCompleteModal('${plan.maPhacdoDT}')">
                            <i class="fa-solid fa-flag-checkered"></i> Hoàn thành
                        </button>
                    </div>`;
            }

            return [
                `<span class="td-code">${this.escapeHtml(plan.maPhacdoDT)}</span>`,
                this.escapeHtml(plan.maBenhAn),
                this.escapeHtml(plan.maBacSi || 'Chưa rõ'),
                this.escapeHtml(plan.loaiMaTuy),
                this.escapeHtml(plan.giaiDoan),
                this.formatDate(plan.ngayBatDau),
                this.formatDate(plan.ngayKetThucDuKien),
                this.renderStatusBadge(plan.trangThai),
                actionButtons
            ];
        });

        if (typeof Table !== 'undefined') {
            target.innerHTML = Table.renderTable(
                ['Mã phác đồ', 'Mã bệnh án', 'Bác sĩ', 'Loại ma túy', 'Giai đoạn', 'Ngày bắt đầu', 'Kết thúc dự kiến', 'Trạng thái', 'Thao tác'],
                rows
            );
        }
    },

    getPlan(id) {
        return this.plans.find(plan => plan.maPhacdoDT === id);
    },

    canCloseTreatment(plan) {
        return ['DaPheDuyet', 'DangApDung'].includes(plan?.trangThai);
    },

    openDetail(id) {
        const plan = this.getPlan(id);
        if (!plan || typeof Modal === 'undefined') return;

        const content = `
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Mã phác đồ</div>
                    <div class="detail-value code">${this.escapeHtml(plan.maPhacdoDT)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Mã bệnh án</div>
                    <div class="detail-value">${this.escapeHtml(plan.maBenhAn)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Bác sĩ lập</div>
                    <div class="detail-value">${this.escapeHtml(plan.maBacSi || 'Chưa rõ')}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Mã quản lý</div>
                    <div class="detail-value">${this.escapeHtml(plan.maQuanLy || 'Chưa xử lý')}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Trạng thái</div>
                    <div class="detail-value" style="background:transparent;border:none;padding:0;">
                        ${this.renderStatusBadge(plan.trangThai)}
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Loại ma túy</div>
                    <div class="detail-value">${this.escapeHtml(plan.loaiMaTuy)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Giai đoạn</div>
                    <div class="detail-value">${this.escapeHtml(plan.giaiDoan)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Ngày bắt đầu</div>
                    <div class="detail-value">${this.formatDate(plan.ngayBatDau)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Kết thúc dự kiến</div>
                    <div class="detail-value">${this.formatDate(plan.ngayKetThucDuKien)}</div>
                </div>
                <div class="detail-item span-2">
                    <div class="detail-label">Ngày phê duyệt</div>
                    <div class="detail-value">${this.formatDateTime(plan.ngayPheDuyet)}</div>
                </div>
                <div class="detail-item span-2">
                    <div class="detail-label">Nội dung phác đồ</div>
                    <div class="detail-value">${this.escapeHtml(plan.noiDungPhacdoDT)}</div>
                </div>
                <div class="detail-item span-2">
                    <div class="detail-label">Mục tiêu điều trị</div>
                    <div class="detail-value">${this.escapeHtml(plan.mucTieu)}</div>
                </div>
                <div class="detail-item span-2">
                    <div class="detail-label">Ghi chú phê duyệt</div>
                    <div class="detail-value">${this.escapeHtml(plan.ghiChuPheDuyet || 'Chưa có ghi chú')}</div>
                </div>
            </div>`;

        let footer = '<button class="btn btn-outline" onclick="Modal.close()">Đóng</button>';
        if (plan.trangThai === 'ChoPheDuyet') {
            footer = `
                <button class="btn btn-outline" onclick="Modal.close()">Đóng</button>
                <button class="btn btn-success" onclick="TreatmentApprovalPage.openApproveModal('${id}')">
                    <i class="fa-solid fa-check"></i> Phê duyệt
                </button>
                <button class="btn btn-danger" onclick="TreatmentApprovalPage.openRejectModal('${id}')">
                    <i class="fa-solid fa-xmark"></i> Từ chối
                </button>`;
        } else if (this.canCloseTreatment(plan)) {
            footer = `
                <button class="btn btn-outline" onclick="Modal.close()">Đóng</button>
                <button class="btn btn-outline" onclick="TreatmentApprovalPage.openPauseModal('${id}')">
                    <i class="fa-solid fa-pause"></i> Tạm dừng
                </button>
                <button class="btn btn-primary" onclick="TreatmentApprovalPage.openCompleteModal('${id}')">
                    <i class="fa-solid fa-flag-checkered"></i> Hoàn thành
                </button>`;
        }

        Modal.open(`Chi tiết phác đồ ${this.escapeHtml(id)}`, content, footer);
    },

    openApproveModal(id) {
        const plan = this.getPlan(id);
        if (!plan || plan.trangThai !== 'ChoPheDuyet' || typeof Modal === 'undefined') return;

        const content = `
            <div class="confirm-box">
                <div class="confirm-box-icon" style="color:var(--success);">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <div class="confirm-box-text">
                    <p>Bạn sắp <strong>phê duyệt</strong> phác đồ <strong>${this.escapeHtml(id)}</strong>.
                    Trạng thái sẽ được cập nhật thành <strong>Đã phê duyệt</strong>.</p>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Ghi chú phê duyệt</label>
                <textarea class="form-control" id="approve-note" rows="3"
                    placeholder="Nhập ghi chú nếu có..."></textarea>
            </div>`;

        const footer = `
            <button class="btn btn-outline" onclick="Modal.close()">Hủy</button>
            <button class="btn btn-success" onclick="TreatmentApprovalPage.doApprove('${id}')">
                <i class="fa-solid fa-check"></i> Xác nhận phê duyệt
            </button>`;

        Modal.open('Phê duyệt phác đồ', content, footer);
    },

    openRejectModal(id) {
        const plan = this.getPlan(id);
        if (!plan || plan.trangThai !== 'ChoPheDuyet' || typeof Modal === 'undefined') return;

        const content = `
            <div class="confirm-box" style="border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.05);">
                <div class="confirm-box-icon" style="color:var(--danger);">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div class="confirm-box-text">
                    <p>Bạn sắp <strong>từ chối</strong> phác đồ <strong>${this.escapeHtml(id)}</strong>.
                    Vui lòng nhập lý do để bác sĩ có căn cứ bổ sung.</p>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Lý do từ chối <span class="required">*</span></label>
                <textarea class="form-control" id="reject-reason" rows="3"
                    placeholder="Nhập lý do từ chối..."></textarea>
                <div class="form-error" id="reject-error" style="display:none;">
                    <i class="fa-solid fa-circle-exclamation"></i> Vui lòng nhập lý do từ chối
                </div>
            </div>`;

        const footer = `
            <button class="btn btn-outline" onclick="Modal.close()">Hủy</button>
            <button class="btn btn-danger" onclick="TreatmentApprovalPage.doReject('${id}')">
                <i class="fa-solid fa-xmark"></i> Xác nhận từ chối
            </button>`;

        Modal.open('Từ chối phác đồ', content, footer);
    },

    openPauseModal(id) {
        const plan = this.getPlan(id);
        if (!this.canCloseTreatment(plan) || typeof Modal === 'undefined') return;

        const content = `
            <div class="confirm-box">
                <div class="confirm-box-icon" style="color:var(--warning);">
                    <i class="fa-solid fa-pause"></i>
                </div>
                <div class="confirm-box-text">
                    <p>Bạn sắp <strong>tạm dừng</strong> phác đồ <strong>${this.escapeHtml(id)}</strong>.
                    Trạng thái trong CSDL sẽ chuyển sang <strong>TAM_DUNG</strong>.</p>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Ghi chú tạm dừng</label>
                <textarea class="form-control" id="pause-note" rows="3"
                    placeholder="Nhập lý do hoặc ghi chú tạm dừng..."></textarea>
            </div>`;

        const footer = `
            <button class="btn btn-outline" onclick="Modal.close()">Hủy</button>
            <button class="btn btn-outline" onclick="TreatmentApprovalPage.doPause('${id}')">
                <i class="fa-solid fa-pause"></i> Xác nhận tạm dừng
            </button>`;

        Modal.open('Tạm dừng phác đồ', content, footer);
    },

    openCompleteModal(id) {
        const plan = this.getPlan(id);
        if (!this.canCloseTreatment(plan) || typeof Modal === 'undefined') return;

        const content = `
            <div class="confirm-box">
                <div class="confirm-box-icon" style="color:var(--success);">
                    <i class="fa-solid fa-flag-checkered"></i>
                </div>
                <div class="confirm-box-text">
                    <p>Bạn sắp đánh dấu <strong>hoàn thành</strong> phác đồ <strong>${this.escapeHtml(id)}</strong>.
                    Trạng thái trong CSDL sẽ chuyển sang <strong>DA_HOAN_THANH</strong>.</p>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Ghi chú hoàn thành</label>
                <textarea class="form-control" id="complete-note" rows="3"
                    placeholder="Nhập ghi chú kết quả điều trị..."></textarea>
            </div>`;

        const footer = `
            <button class="btn btn-outline" onclick="Modal.close()">Hủy</button>
            <button class="btn btn-primary" onclick="TreatmentApprovalPage.doComplete('${id}')">
                <i class="fa-solid fa-flag-checkered"></i> Xác nhận hoàn thành
            </button>`;

        Modal.open('Hoàn thành phác đồ', content, footer);
    },

    async doApprove(id) {
        const plan = this.getPlan(id);
        if (!plan || plan.trangThai !== 'ChoPheDuyet') return;

        const note = document.getElementById('approve-note')?.value.trim() || '';
        const payload = {
            maQuanLy: this.getCurrentManagerCode(),
            ghiChuPheDuyet: note
        };

        try {
            if (typeof Api === 'undefined' || typeof Api.approveTreatmentPlan === 'undefined') throw new Error('Api helper chưa sẵn sàng');
            const updated = await Api.approveTreatmentPlan(id, payload);
            Object.assign(plan, updated || {
                trangThai: 'DaPheDuyet',
                maQuanLy: payload.maQuanLy,
                ngayPheDuyet: new Date().toISOString(),
                ghiChuPheDuyet: note || 'Phác đồ phù hợp, đồng ý áp dụng.'
            });
        } catch (error) {
            console.error('Lỗi API khi phê duyệt phác đồ:', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Phê duyệt thất bại. Vui lòng thử lại.', 'error');
            return;
        }

        if (typeof Modal !== 'undefined') Modal.close();
        if (typeof Toast !== 'undefined') Toast.show(`Phê duyệt phác đồ ${id} thành công.`, 'success');
        this.plans = await this.loadPlans();
        this.applyFilter();
    },

    async doReject(id) {
        const reason = document.getElementById('reject-reason')?.value.trim() || '';
        const errEl = document.getElementById('reject-error');
        if (!reason) {
            if (errEl) errEl.style.display = 'flex';
            return;
        }

        const plan = this.getPlan(id);
        if (!plan || plan.trangThai !== 'ChoPheDuyet') return;

        const payload = {
            maQuanLy: this.getCurrentManagerCode(),
            ghiChuPheDuyet: reason
        };

        try {
            if (typeof Api === 'undefined' || typeof Api.rejectTreatmentPlan === 'undefined') throw new Error('Api helper chưa sẵn sàng');
            const updated = await Api.rejectTreatmentPlan(id, payload);
            Object.assign(plan, updated || {
                trangThai: 'TuChoi',
                maQuanLy: payload.maQuanLy,
                ngayPheDuyet: new Date().toISOString(),
                ghiChuPheDuyet: reason
            });
        } catch (error) {
            console.error('Lỗi API khi từ chối phác đồ:', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Từ chối thất bại. Vui lòng thử lại.', 'error');
            return;
        }

        if (typeof Modal !== 'undefined') Modal.close();
        if (typeof Toast !== 'undefined') Toast.show(`Đã từ chối phác đồ ${id}.`, 'warning');
        this.plans = await this.loadPlans();
        this.applyFilter();
    },

    async doPause(id) {
        const note = document.getElementById('pause-note')?.value.trim() || '';
        await this.updateFinalStatus(id, 'pause', {
            ghiChuPheDuyet: note || 'Tạm dừng phác đồ để theo dõi thêm.'
        }, 'Đã tạm dừng phác đồ');
    },

    async doComplete(id) {
        const note = document.getElementById('complete-note')?.value.trim() || '';
        await this.updateFinalStatus(id, 'complete', {
            ghiChuPheDuyet: note || 'Hoàn thành phác đồ theo đánh giá điều trị.'
        }, 'Đã hoàn thành phác đồ');
    },

    async updateFinalStatus(id, action, payload, successMessage) {
        const plan = this.getPlan(id);
        if (!this.canCloseTreatment(plan)) return;

        const requestPayload = {
            maQuanLy: this.getCurrentManagerCode(),
            ...payload
        };

        try {
            if (typeof Api === 'undefined') throw new Error('Api helper chưa sẵn sàng');
            if (action === 'pause') {
                await Api.pauseTreatmentPlan(id, requestPayload);
            } else {
                await Api.completeTreatmentPlan(id, requestPayload);
            }
        } catch (error) {
            console.error(`Lỗi API khi ${action} phác đồ:`, error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Cập nhật trạng thái thất bại. Vui lòng thử lại.', 'error');
            return;
        }

        if (typeof Modal !== 'undefined') Modal.close();
        if (typeof Toast !== 'undefined') Toast.show(`${successMessage} ${id}.`, 'success');
        this.plans = await this.loadPlans();
        this.applyFilter();
    },

    renderStatusBadge(status) {
        const map = {
            ChoPheDuyet: '<span class="badge badge-warning"><i class="fa-solid fa-clock" style="font-size:9px;"></i> Chờ phê duyệt</span>',
            DaPheDuyet: '<span class="badge badge-success"><i class="fa-solid fa-circle-check" style="font-size:9px;"></i> Đã phê duyệt</span>',
            TuChoi: '<span class="badge badge-danger"><i class="fa-solid fa-circle-xmark" style="font-size:9px;"></i> Từ chối</span>',
            DangApDung: '<span class="badge badge-success"><i class="fa-solid fa-circle-check" style="font-size:9px;"></i> Đã phê duyệt</span>',
            HoanThanh: '<span class="badge badge-gray"><i class="fa-solid fa-check" style="font-size:9px;"></i> Hoàn thành</span>',
            TamDung: '<span class="badge badge-gray"><i class="fa-solid fa-pause" style="font-size:9px;"></i> Tạm dừng</span>'
        };
        return map[status] || `<span class="badge badge-gray">${this.escapeHtml(status)}</span>`;
    },

    formatDate(value) {
        if (!value) return 'Chưa xử lý';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return this.escapeHtml(value);
        return date.toLocaleDateString('vi-VN');
    },

    formatDateTime(value) {
        if (!value) return 'Chưa xử lý';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return this.escapeHtml(value);
        return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    },

    getCurrentManagerCode() {
        const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
        const managerMap = {
            manager: 'CBQL001',
            'ql.phuong': 'CBQL001',
            cb_quan_ly: 'CBQL001'
        };
        return managerMap[user?.username] || user?.username || 'CBQL001';
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

window.TreatmentApprovalPage = TreatmentApprovalPage;
