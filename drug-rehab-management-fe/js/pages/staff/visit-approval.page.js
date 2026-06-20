const VisitApprovalPage = {
    endpoints: {
        list: '/staff/visit-approvals',
        approve: (id) => `/staff/visit-approvals/${id}/approve`,
        reject: (id) => `/staff/visit-approvals/${id}/reject`
    },

    visits: [],
    currentSearch: '',
    currentStatusFilter: 'all',
    currentShiftFilter: 'all',
    useApi: true,
    pendingDecision: null,

    statusMeta: {
        ChoDuyet: { label: 'Chờ duyệt', className: 'badge-orange' },
        DaDongY: { label: 'Đã đồng ý', className: 'badge-green' },
        TuChoi: { label: 'Từ chối', className: 'badge-red' },
        Huy: { label: 'Hủy', className: 'badge-gray' }
    },

    shiftLabels: {
        Sang: 'Sáng',
        Chieu: 'Chiều'
    },

    fallbackVisits: [
        {
            maPhieu: 'TG001',
            nguoiThan: 'Nguyễn Thị Lan',
            quanHe: 'Mẹ',
            sdtNguoiThan: '0901234567',
            nguoiCaiNghien: 'Nguyễn Văn Bình',
            maNguoiCaiNghien: 'NCN001',
            loaiThamGap: 'Thăm gặp trực tiếp',
            ngayTham: '22/06/2026',
            caTham: 'Sang',
            soNguoiDiCung: 1,
            danhSachDiCung: ['Nguyễn Văn Hải - Bố'],
            trangThai: 'ChoDuyet',
            lyDoTuChoi: '',
            ghiChu: 'Gia đình muốn gửi thêm quần áo cá nhân.'
        },
        {
            maPhieu: 'TG002',
            nguoiThan: 'Trần Thị Hoa',
            quanHe: 'Vợ',
            sdtNguoiThan: '0912345678',
            nguoiCaiNghien: 'Trần Văn Cường',
            maNguoiCaiNghien: 'NCN002',
            loaiThamGap: 'Gửi quà',
            ngayTham: '23/06/2026',
            caTham: 'Chieu',
            soNguoiDiCung: 0,
            danhSachDiCung: [],
            trangThai: 'ChoDuyet',
            lyDoTuChoi: '',
            ghiChu: ''
        },
        {
            maPhieu: 'TG003',
            nguoiThan: 'Phạm Văn Sơn',
            quanHe: 'Bố',
            sdtNguoiThan: '0987654321',
            nguoiCaiNghien: 'Phạm Thị Dung',
            maNguoiCaiNghien: 'NCN003',
            loaiThamGap: 'Thăm gặp trực tiếp',
            ngayTham: '18/06/2026',
            caTham: 'Sang',
            soNguoiDiCung: 2,
            danhSachDiCung: ['Phạm Thị Hương - Mẹ', 'Phạm Văn Nam - Em trai'],
            trangThai: 'DaDongY',
            lyDoTuChoi: '',
            ghiChu: 'Đã xác nhận lịch, đề nghị có mặt đúng giờ.'
        },
        {
            maPhieu: 'TG004',
            nguoiThan: 'Hoàng Thị Yến',
            quanHe: 'Mẹ',
            sdtNguoiThan: '0934567890',
            nguoiCaiNghien: 'Hoàng Văn Đạt',
            maNguoiCaiNghien: 'NCN004',
            loaiThamGap: 'Thăm gặp trực tiếp',
            ngayTham: '15/06/2026',
            caTham: 'Chieu',
            soNguoiDiCung: 1,
            danhSachDiCung: ['Hoàng Văn Tùng - Em trai'],
            trangThai: 'TuChoi',
            lyDoTuChoi: 'Trùng lịch tư vấn tâm lý định kỳ của học viên.',
            ghiChu: ''
        },
        {
            maPhieu: 'TG005',
            nguoiThan: 'Vũ Văn Long',
            quanHe: 'Anh trai',
            sdtNguoiThan: '0945678901',
            nguoiCaiNghien: 'Vũ Thị Hằng',
            maNguoiCaiNghien: 'NCN005',
            loaiThamGap: 'Gửi quà',
            ngayTham: '24/06/2026',
            caTham: 'Sang',
            soNguoiDiCung: 0,
            danhSachDiCung: [],
            trangThai: 'ChoDuyet',
            lyDoTuChoi: '',
            ghiChu: 'Gửi kèm thuốc bổ theo đơn của bác sĩ gia đình, cần kiểm tra trước khi giao.'
        },
        {
            maPhieu: 'TG006',
            nguoiThan: 'Đặng Thị Mai',
            quanHe: 'Mẹ',
            sdtNguoiThan: '0956789012',
            nguoiCaiNghien: 'Đặng Văn Khoa',
            maNguoiCaiNghien: 'NCN006',
            loaiThamGap: 'Thăm gặp trực tiếp',
            ngayTham: '25/06/2026',
            caTham: 'Sang',
            soNguoiDiCung: 1,
            danhSachDiCung: ['Đặng Văn Hùng - Bố'],
            trangThai: 'ChoDuyet',
            lyDoTuChoi: '',
            ghiChu: ''
        },
        {
            maPhieu: 'TG007',
            nguoiThan: 'Bùi Văn Nam',
            quanHe: 'Chồng',
            sdtNguoiThan: '0967890123',
            nguoiCaiNghien: 'Bùi Thị Linh',
            maNguoiCaiNghien: 'NCN007',
            loaiThamGap: 'Thăm gặp trực tiếp',
            ngayTham: '10/06/2026',
            caTham: 'Chieu',
            soNguoiDiCung: 2,
            danhSachDiCung: ['Bùi Văn An - Con trai', 'Bùi Thị Bích - Con gái'],
            trangThai: 'Huy',
            lyDoTuChoi: '',
            ghiChu: 'Người thân chủ động hủy lịch do bận việc đột xuất.'
        },
        {
            maPhieu: 'TG008',
            nguoiThan: 'Ngô Thị Thu',
            quanHe: 'Vợ',
            sdtNguoiThan: '0978901234',
            nguoiCaiNghien: 'Ngô Văn Phúc',
            maNguoiCaiNghien: 'NCN008',
            loaiThamGap: 'Thăm gặp trực tiếp',
            ngayTham: '20/06/2026',
            caTham: 'Sang',
            soNguoiDiCung: 1,
            danhSachDiCung: ['Ngô Thị Lệ - Mẹ'],
            trangThai: 'DaDongY',
            lyDoTuChoi: '',
            ghiChu: ''
        },
        {
            maPhieu: 'TG009',
            nguoiThan: 'Lý Văn Tài',
            quanHe: 'Bố',
            sdtNguoiThan: '0989012345',
            nguoiCaiNghien: 'Lý Thị Quỳnh',
            maNguoiCaiNghien: 'NCN009',
            loaiThamGap: 'Gửi quà',
            ngayTham: '26/06/2026',
            caTham: 'Chieu',
            soNguoiDiCung: 0,
            danhSachDiCung: [],
            trangThai: 'ChoDuyet',
            lyDoTuChoi: '',
            ghiChu: ''
        },
        {
            maPhieu: 'TG010',
            nguoiThan: 'Trương Thị Hà',
            quanHe: 'Mẹ',
            sdtNguoiThan: '0990123456',
            nguoiCaiNghien: 'Trương Văn Sơn',
            maNguoiCaiNghien: 'NCN010',
            loaiThamGap: 'Thăm gặp trực tiếp',
            ngayTham: '05/06/2026',
            caTham: 'Sang',
            soNguoiDiCung: 1,
            danhSachDiCung: ['Trương Văn Hòa - Bố'],
            trangThai: 'DaDongY',
            lyDoTuChoi: '',
            ghiChu: 'Buổi thăm gặp định kỳ theo dõi sau cai.'
        }
    ],

    async render(containerId) {
        const success = await ViewLoader.load('views/staff/visit-approval.html', containerId);
        if (success) await this.init();
    },

    async init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Duyệt thăm gặp');
        this.currentSearch = '';
        this.currentStatusFilter = 'all';
        this.currentShiftFilter = 'all';
        this.pendingDecision = null;
        this.bindEvents();
        await this.loadVisits();
    },

    async loadVisits() {
        try {
            if (typeof Api === 'undefined' || typeof Api.getVisitRequests === 'undefined') throw new Error('Api helper chưa sẵn sàng');
            const data = await Api.getVisitRequests();
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data?.items)
                        ? data.items
                        : [];
            if (!list.length) throw new Error('Danh sách rỗng, dùng dữ liệu mẫu');
            this.visits = list;
            this.useApi = true;
        } catch (error) {
            console.warn('Đang dùng dữ liệu mẫu cho màn duyệt thăm gặp:', error);
            this.visits = this.fallbackVisits.map(item => ({ ...item }));
            this.useApi = false;
        }
        this.renderStats();
        this.renderTable();
    },

    bindEvents() {
        const searchInput = document.getElementById('visitSearchInput');
        const statusFilter = document.getElementById('visitStatusFilter');
        const shiftFilter = document.getElementById('visitShiftFilter');
        const tableBody = document.getElementById('visitTableBody');

        const detailModal = document.getElementById('visitDetailModal');
        const detailCloseBtn = document.getElementById('visitDetailCloseBtn');
        const detailCloseBtn2 = document.getElementById('visitDetailCloseBtn2');

        const decisionModal = document.getElementById('visitDecisionModal');
        const decisionCloseBtn = document.getElementById('visitDecisionCloseBtn');
        const decisionCancelBtn = document.getElementById('visitDecisionCancelBtn');
        const decisionConfirmBtn = document.getElementById('visitDecisionConfirmBtn');

        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                this.currentSearch = event.target.value.trim().toLowerCase();
                this.renderTable();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (event) => {
                this.currentStatusFilter = event.target.value;
                this.renderTable();
            });
        }

        if (shiftFilter) {
            shiftFilter.addEventListener('change', (event) => {
                this.currentShiftFilter = event.target.value;
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
                if (action === 'approve') this.openDecisionModal(id, 'approve');
                if (action === 'reject') this.openDecisionModal(id, 'reject');
            });
        }

        if (detailCloseBtn) detailCloseBtn.addEventListener('click', () => this.closeDetailModal());
        if (detailCloseBtn2) detailCloseBtn2.addEventListener('click', () => this.closeDetailModal());
        if (detailModal) {
            detailModal.addEventListener('click', (event) => {
                if (event.target === detailModal) this.closeDetailModal();
            });
        }

        if (decisionCloseBtn) decisionCloseBtn.addEventListener('click', () => this.closeDecisionModal());
        if (decisionCancelBtn) decisionCancelBtn.addEventListener('click', () => this.closeDecisionModal());
        if (decisionModal) {
            decisionModal.addEventListener('click', (event) => {
                if (event.target === decisionModal) this.closeDecisionModal();
            });
        }
        if (decisionConfirmBtn) {
            decisionConfirmBtn.addEventListener('click', () => this.confirmDecision());
        }
    },

    getFilteredVisits() {
        return this.visits.filter((visit) => {
            const matchesSearch = !this.currentSearch
                || (visit.maPhieu || '').toLowerCase().includes(this.currentSearch)
                || (visit.nguoiThan || '').toLowerCase().includes(this.currentSearch)
                || (visit.nguoiCaiNghien || '').toLowerCase().includes(this.currentSearch);

            const matchesStatus = this.currentStatusFilter === 'all'
                || visit.trangThai === this.currentStatusFilter;

            const matchesShift = this.currentShiftFilter === 'all'
                || visit.caTham === this.currentShiftFilter;

            return matchesSearch && matchesStatus && matchesShift;
        });
    },

    renderStats() {
        const pending = this.visits.filter(v => v.trangThai === 'ChoDuyet').length;
        const approved = this.visits.filter(v => v.trangThai === 'DaDongY').length;
        const rejected = this.visits.filter(v => v.trangThai === 'TuChoi').length;

        const pendingEl = document.getElementById('statVisitPending');
        const approvedEl = document.getElementById('statVisitApproved');
        const rejectedEl = document.getElementById('statVisitRejected');

        if (pendingEl) pendingEl.textContent = pending;
        if (approvedEl) approvedEl.textContent = approved;
        if (rejectedEl) rejectedEl.textContent = rejected;
    },

    renderTable() {
        const tableBody = document.getElementById('visitTableBody');
        if (!tableBody) return;

        const filtered = this.getFilteredVisits();

        if (!filtered.length) {
            tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="staff-visit-state-cell">
            <div class="staff-visit-empty">
              <i class="fa-solid fa-folder-open"></i>
              Không tìm thấy phiếu thăm gặp phù hợp.
            </div>
          </td>
        </tr>
      `;
            return;
        }

        tableBody.innerHTML = filtered.map((visit) => {
            const statusInfo = this.statusMeta[visit.trangThai] || { label: visit.trangThai || '—', className: 'badge-gray' };
            const shiftLabel = this.shiftLabels[visit.caTham] || visit.caTham || '—';
            const isPending = visit.trangThai === 'ChoDuyet';

            return `
        <tr>
          <td><span class="td-code">${this.escapeHtml(visit.maPhieu)}</span></td>
          <td>${this.escapeHtml(visit.nguoiThan)}</td>
          <td>${this.escapeHtml(visit.nguoiCaiNghien)}</td>
          <td>${this.escapeHtml(visit.loaiThamGap)}</td>
          <td>${this.escapeHtml(visit.ngayTham)}</td>
          <td>${this.escapeHtml(shiftLabel)}</td>
          <td>${this.escapeHtml(visit.soNguoiDiCung)}</td>
          <td><span class="badge ${statusInfo.className}">${this.escapeHtml(statusInfo.label)}</span></td>
          <td>
            <div class="action-btns">
              <button class="btn btn-sm btn-outline btn-icon" data-action="view" data-id="${this.escapeHtml(visit.maPhieu)}" title="Xem chi tiết">
                <i class="fa-solid fa-eye"></i>
              </button>
              ${isPending ? `
                <button class="btn btn-sm btn-success btn-icon" data-action="approve" data-id="${this.escapeHtml(visit.maPhieu)}" title="Đồng ý">
                  <i class="fa-solid fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-icon" data-action="reject" data-id="${this.escapeHtml(visit.maPhieu)}" title="Từ chối">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
        }).join('');
    },

    openDetailModal(id) {
        const visit = this.visits.find(v => v.maPhieu === id);
        if (!visit) return;

        const modal = document.getElementById('visitDetailModal');
        const body = document.getElementById('visitDetailBody');
        if (!modal || !body) return;

        const statusInfo = this.statusMeta[visit.trangThai] || { label: visit.trangThai || '—', className: 'badge-gray' };
        const shiftLabel = this.shiftLabels[visit.caTham] || visit.caTham || '—';
        const companionsHtml = (visit.danhSachDiCung && visit.danhSachDiCung.length)
            ? `<ul style="margin:0; padding-left:20px;">${visit.danhSachDiCung.map(c => `<li style="margin:4px 0;">${this.escapeHtml(c)}</li>`).join('')}</ul>`
            : '<p style="color:var(--text-muted); font-style:italic;">Không có người đi cùng.</p>';

        body.innerHTML = `
      <div style="display:grid; gap:24px;">
        
        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-file-lines" style="color:var(--primary); margin-right:8px;"></i>
            Thông tin phiếu
          </h4>
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Mã phiếu</div>
              <div style="font-size:14px; font-weight:600;"><span class="td-code">${this.escapeHtml(visit.maPhieu)}</span></div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Loại thăm gặp</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(visit.loaiThamGap)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Ngày thăm</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(visit.ngayTham)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Ca thăm</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(shiftLabel)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Trạng thái</div>
              <div style="font-size:14px; font-weight:600;"><span class="badge ${statusInfo.className}">${this.escapeHtml(statusInfo.label)}</span></div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-user" style="color:var(--success); margin-right:8px;"></i>
            Thông tin người thân
          </h4>
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Họ tên</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(visit.nguoiThan)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Quan hệ</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(visit.quanHe)}</div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md); grid-column:1/-1;">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Số điện thoại</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(visit.sdtNguoiThan)}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-user-injured" style="color:var(--primary); margin-right:8px;"></i>
            Thông tin người cai nghiện
          </h4>
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Mã học viên</div>
              <div style="font-size:14px; font-weight:600;"><span class="td-code">${this.escapeHtml(visit.maNguoiCaiNghien)}</span></div>
            </div>
            <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
              <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Họ tên</div>
              <div style="font-size:14px; font-weight:600; color:var(--text-primary);">${this.escapeHtml(visit.nguoiCaiNghien)}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid var(--border);">
            <i class="fa-solid fa-users" style="color:var(--purple); margin-right:8px;"></i>
            Danh sách người đi cùng (${visit.soNguoiDiCung || 0})
          </h4>
          ${companionsHtml}
        </div>

        ${visit.trangThai === 'TuChoi' && visit.lyDoTuChoi ? `
        <div style="padding:16px; background:rgba(239,68,68,0.08); border-left:4px solid var(--danger); border-radius:var(--radius-md);">
          <div style="font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            <i class="fa-solid fa-triangle-exclamation" style="margin-right:8px;"></i>
            Lý do từ chối
          </div>
          <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">${this.escapeHtml(visit.lyDoTuChoi)}</div>
        </div>
        ` : ''}

        <div style="padding:16px; background:rgba(59,130,246,0.08); border-left:4px solid var(--primary); border-radius:var(--radius-md);">
          <div style="font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            <i class="fa-solid fa-note-sticky" style="margin-right:8px;"></i>
            Ghi chú
          </div>
          <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">
            ${this.escapeHtml(visit.ghiChu) || '<em>Không có ghi chú.</em>'}
          </div>
        </div>

      </div>
    `;

        modal.classList.add('active');
    },

    closeDetailModal() {
        const modal = document.getElementById('visitDetailModal');
        if (modal) modal.classList.remove('active');
    },

    openDecisionModal(id, type) {
        const visit = this.visits.find(v => v.maPhieu === id);
        if (!visit) return;

        this.pendingDecision = { id, type };

        const modal = document.getElementById('visitDecisionModal');
        const title = document.getElementById('visitDecisionTitle');
        const message = document.getElementById('visitDecisionMessage');
        const reasonGroup = document.getElementById('visitDecisionReasonGroup');
        const reasonInput = document.getElementById('visitDecisionReason');
        const reasonError = document.getElementById('visitDecisionReasonError');

        if (!modal || !title || !message || !reasonGroup || !reasonInput) return;

        reasonInput.value = '';
        reasonError.style.display = 'none';

        if (type === 'approve') {
            title.textContent = 'Xác nhận đồng ý';
            message.textContent = `Đồng ý phiếu thăm gặp ${visit.maPhieu} của ${visit.nguoiThan} cho học viên ${visit.nguoiCaiNghien}?`;
            reasonGroup.style.display = 'none';
        } else {
            title.textContent = 'Xác nhận từ chối';
            message.textContent = `Từ chối phiếu thăm gặp ${visit.maPhieu} của ${visit.nguoiThan} cho học viên ${visit.nguoiCaiNghien}?`;
            reasonGroup.style.display = 'block';
        }

        modal.classList.add('active');
    },

    closeDecisionModal() {
        const modal = document.getElementById('visitDecisionModal');
        if (modal) modal.classList.remove('active');
        this.pendingDecision = null;
    },

    async confirmDecision() {
        if (!this.pendingDecision) return;
        const { id, type } = this.pendingDecision;
        const visit = this.visits.find(v => v.maPhieu === id);
        if (!visit) return;

        let reason = '';
        if (type === 'reject') {
            const reasonInput = document.getElementById('visitDecisionReason');
            const reasonError = document.getElementById('visitDecisionReasonError');
            reason = reasonInput ? reasonInput.value.trim() : '';
            if (!reason) {
                if (reasonError) reasonError.style.display = 'block';
                return;
            }
        }

        try {
            if (typeof Api === 'undefined' || typeof Api.approveVisit === 'undefined') throw new Error('Api helper chưa sẵn sàng');
            if (type === 'approve') {
                await Api.approveVisit(id, {});
            } else {
                await Api.rejectVisit(id, { lyDo: reason });
            }
        } catch (error) {
            console.warn('Chưa thể gọi API xử lý phiếu thăm gặp, cập nhật cục bộ:', error);
        }

        if (type === 'approve') {
            visit.trangThai = 'DaDongY';
            visit.lyDoTuChoi = '';
        } else {
            visit.trangThai = 'TuChoi';
            visit.lyDoTuChoi = reason;
        }

        if (typeof Toast !== 'undefined') {
            Toast.show(type === 'approve' ? 'Đã đồng ý phiếu thăm gặp.' : 'Đã từ chối phiếu thăm gặp.', 'success');
        }

        this.closeDecisionModal();
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

window.VisitApprovalPage = VisitApprovalPage;
