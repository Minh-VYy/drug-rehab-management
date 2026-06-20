const StageApprovalPage = {
    proposals: [],

    async render(containerId) {
        const success = await ViewLoader.load('views/manager/stage-approval.html', containerId);
        if (success) await this.init();
    },

    async init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Duyệt đề xuất chuyển giai đoạn');
        await this.loadData();
        this.applyFilter();
    },

    async refresh() {
        await this.loadData();
        this.applyFilter();
        if (typeof window.Toast !== 'undefined') window.Toast.show('Đã làm mới dữ liệu', 'success');
    },

    async loadData() {
        if (typeof Api !== 'undefined' && typeof Api.getStageProposals !== 'undefined') {
            try {
                const res = await Api.getStageProposals();
                this.proposals = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
                return;
            } catch (err) {
                console.warn('Lỗi API getStageProposals:', err);
            }
        }

        // Mock Fallback
        this.proposals = [
            { maDeXuat: 'DX-001', maBenhAn: 'BA-001', hoTen: 'Nguyễn Văn Trọng', loaiDeXuat: 'CHUYEN_GIAI_DOAN', giaiDoanCu: 'Cắt cơn giải độc', giaiDoanMoi: 'Phục hồi hành vi', lyDo: 'Học viên đã cắt cơn ổn định, sức khỏe thể chất tốt.', nguoiDeXuat: 'BS. Mai Hoàng Yến', ngayDeXuat: '2026-06-15', trangThai: 'ChoDuyet' },
            { maDeXuat: 'DX-002', maBenhAn: 'BA-002', hoTen: 'Lý Hải Nam', loaiDeXuat: 'CHUYEN_GIAI_DOAN', giaiDoanCu: 'Phục hồi hành vi', giaiDoanMoi: 'Lao động trị liệu', lyDo: 'Tiến triển tâm lý rất tốt, sẵn sàng lao động.', nguoiDeXuat: 'BS. Trần Văn Hùng', ngayDeXuat: '2026-06-10', trangThai: 'DaDuyet' },
            { maDeXuat: 'DX-003', maBenhAn: 'BA-003', hoTen: 'Phạm Thị Dung', loaiDeXuat: 'RA_TRAI', giaiDoanCu: 'Tái hòa nhập cộng đồng', giaiDoanMoi: 'Hoàn thành', lyDo: 'Đã hoàn thành xuất sắc chương trình cai nghiện.', nguoiDeXuat: 'BS. Mai Hoàng Yến', ngayDeXuat: '2026-06-12', trangThai: 'ChoDuyet' }
        ];
    },

    applyFilter() {
        const search = (document.getElementById('stage-search')?.value || '').toLowerCase().trim();
        const status = document.getElementById('stage-status-filter')?.value || 'ChoDuyet';

        const filtered = this.proposals.filter(p => {
            const matchesSearch = !search || p.hoTen.toLowerCase().includes(search) || p.maBenhAn.toLowerCase().includes(search) || p.nguoiDeXuat.toLowerCase().includes(search);
            const matchesStatus = status === 'all' || p.trangThai === status;
            return matchesSearch && matchesStatus;
        });

        this.renderTable(filtered);
    },

    renderTable(data) {
        const target = document.getElementById('stage-table');
        if (!target) return;

        if (!data.length) {
            target.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-file-signature"></i></div>
                    <div class="empty-state-title">Không có đề xuất nào</div>
                    <div class="empty-state-msg">Không có đề xuất nào phù hợp với bộ lọc.</div>
                </div>`;
            return;
        }

        const rows = data.map(p => {
            let statusBadge = '';
            let actionBtn = `<button class="btn btn-sm btn-outline" onclick="StageApprovalPage.openDetail('${p.maDeXuat}')"><i class="fa-solid fa-eye"></i> Xem</button>`;

            if (p.trangThai === 'ChoDuyet') {
                statusBadge = '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Chờ duyệt</span>';
                actionBtn += ` <button class="btn btn-sm btn-primary" onclick="StageApprovalPage.openDetail('${p.maDeXuat}')"><i class="fa-solid fa-pen-to-square"></i> Xử lý</button>`;
            } else if (p.trangThai === 'DaDuyet') {
                statusBadge = '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Đã duyệt</span>';
            } else {
                statusBadge = '<span class="badge badge-danger"><i class="fa-solid fa-xmark"></i> Đã từ chối</span>';
            }

            const loaiLabel = p.loaiDeXuat === 'RA_TRAI' 
                ? '<span class="badge" style="background:#8b5cf6;color:#fff;">Hoàn thành (Ra trại)</span>' 
                : '<span class="badge badge-blue">Chuyển giai đoạn</span>';

            return [
                `<span class="td-code">${this.escapeHtml(p.maDeXuat)}</span>`,
                this.escapeHtml(p.hoTen),
                loaiLabel,
                `${this.escapeHtml(p.giaiDoanCu)} <i class="fa-solid fa-arrow-right" style="margin:0 5px;color:var(--text-light);font-size:10px;"></i> <strong>${this.escapeHtml(p.giaiDoanMoi)}</strong>`,
                this.escapeHtml(p.nguoiDeXuat),
                this.formatDate(p.ngayDeXuat),
                statusBadge,
                `<div class="action-btns">${actionBtn}</div>`
            ];
        });

        if (typeof Table !== 'undefined') {
            target.innerHTML = Table.renderTable(
                ['Mã đề xuất', 'Học viên', 'Loại đề xuất', 'Thay đổi giai đoạn', 'Người đề xuất', 'Ngày đề xuất', 'Trạng thái', 'Thao tác'],
                rows
            );
        }
    },

    openDetail(id) {
        const p = this.proposals.find(x => x.maDeXuat === id);
        if (!p) return;

        const isPending = p.trangThai === 'ChoDuyet';

        const html = `
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Học viên</div>
                    <div class="detail-value"><strong>${this.escapeHtml(p.hoTen)}</strong> (${this.escapeHtml(p.maBenhAn)})</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Người đề xuất</div>
                    <div class="detail-value">${this.escapeHtml(p.nguoiDeXuat)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Ngày đề xuất</div>
                    <div class="detail-value">${this.formatDate(p.ngayDeXuat)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Loại đề xuất</div>
                    <div class="detail-value">${p.loaiDeXuat === 'RA_TRAI' ? 'Hoàn thành / Ra trại' : 'Chuyển giai đoạn'}</div>
                </div>
                <div class="detail-item span-2" style="background:rgba(21,94,239,0.05); padding:12px; border-radius:8px; border:1px solid rgba(21,94,239,0.1);">
                    <div class="detail-label">Thay đổi giai đoạn</div>
                    <div class="detail-value" style="display:flex; align-items:center; gap:12px;">
                        <span style="color:var(--text-muted); text-decoration:line-through;">${this.escapeHtml(p.giaiDoanCu)}</span>
                        <i class="fa-solid fa-arrow-right" style="color:var(--primary);"></i>
                        <strong style="color:var(--primary); font-size:1.1em;">${this.escapeHtml(p.giaiDoanMoi)}</strong>
                    </div>
                </div>
                <div class="detail-item span-2">
                    <div class="detail-label">Lý do đề xuất</div>
                    <div class="detail-value" style="font-style:italic;">"${this.escapeHtml(p.lyDo)}"</div>
                </div>
                
                ${isPending ? `
                <div class="detail-item span-2" style="margin-top:16px;">
                    <label class="form-label">Ghi chú phản hồi (Dành cho Cán bộ quản lý)</label>
                    <textarea class="form-control" id="stage-reply-note" rows="3" placeholder="Nhập lý do từ chối hoặc lời dặn dò..."></textarea>
                    <div class="form-error" id="stage-reply-error" style="display:none;"><i class="fa-solid fa-circle-exclamation"></i> Vui lòng nhập lý do nếu từ chối</div>
                </div>
                ` : `
                <div class="detail-item span-2">
                    <div class="detail-label">Trạng thái</div>
                    <div class="detail-value">${p.trangThai === 'DaDuyet' ? '<span style="color:var(--success);"><i class="fa-solid fa-check"></i> Đã phê duyệt</span>' : '<span style="color:var(--danger);"><i class="fa-solid fa-xmark"></i> Đã từ chối</span>'}</div>
                </div>
                `}
            </div>
        `;

        document.getElementById('stageModalBody').innerHTML = html;

        let footer = `<button class="btn btn-outline" onclick="Modal.close('stageModal')">Đóng</button>`;
        if (isPending) {
            footer = `
                <button class="btn btn-outline" onclick="Modal.close('stageModal')">Hủy</button>
                <button class="btn btn-danger" onclick="StageApprovalPage.handleReject('${id}')"><i class="fa-solid fa-xmark"></i> Từ chối</button>
                <button class="btn btn-success" onclick="StageApprovalPage.handleApprove('${id}')"><i class="fa-solid fa-check"></i> Phê duyệt</button>
            `;
        }
        document.getElementById('stageModalFooter').innerHTML = footer;

        if (typeof Modal !== 'undefined') Modal.open('stageModal');
    },

    async handleApprove(id) {
        const note = document.getElementById('stage-reply-note')?.value.trim() || '';
        try {
            if (typeof Api !== 'undefined' && typeof Api.approveStageProposal !== 'undefined') {
                await Api.approveStageProposal(id, { ghiChu: note });
            }
            const p = this.proposals.find(x => x.maDeXuat === id);
            if (p) p.trangThai = 'DaDuyet';

            if (typeof Modal !== 'undefined') Modal.close('stageModal');
            if (typeof window.Toast !== 'undefined') window.Toast.show('Đã phê duyệt đề xuất!', 'success');
            this.applyFilter();
        } catch (err) {
            console.error(err);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Lỗi khi phê duyệt.', 'error');
        }
    },

    async handleReject(id) {
        const note = document.getElementById('stage-reply-note')?.value.trim() || '';
        if (!note) {
            document.getElementById('stage-reply-error').style.display = 'flex';
            return;
        }

        try {
            if (typeof Api !== 'undefined' && typeof Api.rejectStageProposal !== 'undefined') {
                await Api.rejectStageProposal(id, { ghiChu: note });
            }
            const p = this.proposals.find(x => x.maDeXuat === id);
            if (p) p.trangThai = 'TuChoi';

            if (typeof Modal !== 'undefined') Modal.close('stageModal');
            if (typeof window.Toast !== 'undefined') window.Toast.show('Đã từ chối đề xuất.', 'warning');
            this.applyFilter();
        } catch (err) {
            console.error(err);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Lỗi khi từ chối.', 'error');
        }
    },

    formatDate(value) {
        if (!value) return '';
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('vi-VN');
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

window.StageApprovalPage = StageApprovalPage;