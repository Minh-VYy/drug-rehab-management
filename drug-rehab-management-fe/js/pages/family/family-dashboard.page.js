const FamilyDashboardPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/family/family-dashboard.html', containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Thông tin Người thân');

        const student = {
            name: 'Nguyễn Văn Tiến',
            id: 'BN001',
            dob: '15/08/1998',
            entry: '15/01/2023',
            stage: 'Cắt cơn - Giải độc',
            room: 'A101 - Khu A',
            status: 'Đang điều trị'
        };

        const nameEl = document.getElementById('family-student-name');
        if (nameEl) nameEl.textContent = `Thông tin Học viên: ${student.name}`;

        const badgeEl = document.getElementById('family-status-badge');
        if (badgeEl && typeof Badge !== 'undefined') badgeEl.innerHTML = Badge.renderStatusBadge(student.status);

        const idEl = document.getElementById('family-student-id');
        if (idEl) idEl.textContent = student.id;

        const dobEl = document.getElementById('family-dob');
        if (dobEl) dobEl.textContent = student.dob;

        const entryEl = document.getElementById('family-entry');
        if (entryEl) entryEl.textContent = student.entry;

        const stageEl = document.getElementById('family-stage');
        if (stageEl) stageEl.textContent = student.stage;

        const roomEl = document.getElementById('family-room');
        if (roomEl) roomEl.textContent = student.room;

        const btnVisit = document.getElementById('btn-register-visit');
        if (btnVisit) {
            btnVisit.onclick = () => {
                if (typeof Modal !== 'undefined') {
                    Modal.open('Đăng ký thăm gặp', 
                        `<p>Bạn muốn đăng ký thăm gặp học viên ${student.name}?</p>
                         <p>Ngày dự kiến: <input type=date class=form-control></p>`, 
                        `<button class="btn btn-success" onclick="if(typeof Toast !== 'undefined') Toast.show('Gửi đăng ký thành công!'); Modal.close()">Xác nhận</button>
                         <button class="btn btn-outline" onclick="Modal.close()">Hủy</button>`);
                }
            };
        }

        const btnSupport = document.getElementById('btn-support-request');
        if (btnSupport) {
            btnSupport.onclick = () => {
                if (typeof Toast !== 'undefined') Toast.show('Đã gửi yêu cầu hỗ trợ');
            };
        }
    }
};

window.FamilyDashboardPage = FamilyDashboardPage;