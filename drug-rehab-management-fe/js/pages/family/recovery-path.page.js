const RecoveryPathPage = {
    patientId: 'NCN001', // Default mock ID for family's patient

    async render(containerId) {
        const success = await ViewLoader.load("views/family/recovery-path.html", containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Lộ trình phục hồi');
        this.loadRecoveryPath();
    },

    formatDate(dateString) {
        if (!dateString) return 'Chưa xác định';
        const d = new Date(dateString);
        return d.toLocaleDateString('vi-VN');
    },

    formatDateTime(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.toLocaleDateString('vi-VN')}`;
    },

    async loadRecoveryPath() {
        try {
            // Ideally get patientId from Auth Context/Relative profile
            const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
            // Fallback for demo
            const patientIdToLoad = this.patientId;

            const response = await API.getRecoveryPathByPatient(patientIdToLoad);
            if (response && response.success) {
                const data = response.data;
                this.renderOverview(data);
                this.renderStages(data.stages);
                this.renderLogs(data.recentLogs);
            }
        } catch (error) {
            console.error('Lỗi khi tải lộ trình phục hồi:', error);
            if (typeof Toast !== 'undefined') Toast.show('Không thể tải lộ trình phục hồi', 'error');
            
            // Fallback clear UI
            document.getElementById('progress-text').textContent = 'Lỗi';
            document.getElementById('current-stage-name').textContent = 'Không có dữ liệu';
        }
    },

    renderOverview(data) {
        document.getElementById('progress-text').textContent = data.progressPercentage + '%';
        const progressBar = document.getElementById('progress-bar-fill');
        if (progressBar) progressBar.style.width = data.progressPercentage + '%';

        document.getElementById('current-stage-name').textContent = data.currentStageName;
        document.getElementById('days-remaining').textContent = data.daysRemaining + ' ngày';
    },

    renderStages(stages) {
        const container = document.getElementById('stages-container');
        if (!container) return;
        container.innerHTML = '';

        if (!stages || stages.length === 0) {
            container.innerHTML = '<div style="color:var(--text-muted); padding:20px; text-align:center;">Chưa có lộ trình cụ thể</div>';
            return;
        }

        stages.forEach(stage => {
            const isCompleted = stage.status === 'DA_HOAN_THANH';
            const isActive = stage.status === 'DANG_AP_DUNG';

            let statusClass = '';
            let icon = 'fa-circle';
            if (isCompleted) {
                statusClass = 'completed';
                icon = 'fa-check-circle';
            } else if (isActive) {
                statusClass = 'active';
                icon = 'fa-spinner fa-spin';
            } else {
                statusClass = 'pending';
                icon = 'fa-circle-dot';
            }

            const startDateStr = this.formatDate(stage.startDate);
            const endDateStr = this.formatDate(stage.expectedEndDate);

            const html = `
                <div class="stage-item ${statusClass}">
                    <div class="stage-icon">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="stage-content">
                        <h4>Giai đoạn ${stage.sequenceOrder}: ${stage.stageName}</h4>
                        <div class="stage-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${startDateStr} - ${endDateStr}</span>
                            <span class="status-badge ${isCompleted ? 'success' : (isActive ? 'info' : 'warning')}">
                                ${isCompleted ? 'Hoàn thành' : (isActive ? 'Đang áp dụng' : 'Chờ thực hiện')}
                            </span>
                        </div>
                        <p class="stage-desc">${stage.description || 'Chưa có mô tả'}</p>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    },

    renderLogs(logs) {
        const container = document.getElementById('logs-container');
        if (!container) return;
        container.innerHTML = '';

        if (!logs || logs.length === 0) {
            container.innerHTML = '<div style="color:var(--text-muted); padding:20px; text-align:center;">Chưa có nhật ký nào</div>';
            return;
        }

        logs.forEach(log => {
            const html = `
                <div class="log-item">
                    <div class="log-time">${this.formatDateTime(log.recordedAt)}</div>
                    <div class="log-title">${log.note || 'Theo dõi định kỳ'}</div>
                    <div class="log-desc">Người phụ trách: ${log.recordedBy}</div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }
};

window.RecoveryPathPage = RecoveryPathPage;