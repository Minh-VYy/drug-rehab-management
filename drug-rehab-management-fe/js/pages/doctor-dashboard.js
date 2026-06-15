const DoctorDashboard = {
    render(container) {
        Topbar.setTitle('Dashboard Bác sĩ');
        
        const statsHtml = `
            <div class="dashboard-grid">
                ${Card.renderStatCard('Tổng Bệnh Nhân', '125', 'fa-solid fa-users', 'primary')}
                ${Card.renderStatCard('Đang Điều Trị', '98', 'fa-solid fa-procedures', 'warning')}
                ${Card.renderStatCard('Hoàn Thành', '27', 'fa-solid fa-user-check', 'success')}
                ${Card.renderStatCard('Cần Chú Ý', '5', 'fa-solid fa-triangle-exclamation', 'danger')}
            </div>
        `;

        const recentPatients = typeof MockPatients !== 'undefined' ? MockPatients.slice(0, 4) : [];
        const patientsTableHtml = Table.renderTable(
            ['Mã BN', 'Họ tên', 'Giai đoạn', 'Phòng', 'Trạng thái', 'Hành động'],
            recentPatients.map(p => [
                p.id, 
                p.name, 
                p.phase, 
                p.room, 
                Badge.renderStatusBadge(p.status),
                `<button class="btn btn-sm btn-outline text-primary" onclick="Toast.show('Xem bệnh án ${p.id}')"><i class="fa-solid fa-eye"></i> Xem</button>`
            ])
        );

        const chartData = [
            { label: 'Tháng 1', value: 45 },
            { label: 'Tháng 2', value: 52 },
            { label: 'Tháng 3', value: 38 },
            { label: 'Tháng 4', value: 65 },
            { label: 'Tháng 5', value: 48 },
            { label: 'Tháng 6', value: 70 }
        ];

        container.innerHTML = `
            ${statsHtml}
            <div class="dashboard-content-grid">
                <div class="card">
                    <div class="card-header">
                        <h3>Bệnh nhân đang theo dõi</h3>
                        <button class="btn btn-sm btn-primary" onclick="Router.navigate('/patients')">Xem tất cả</button>
                    </div>
                    <div class="card-body">
                        ${patientsTableHtml}
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3>Biểu đồ tiếp nhận theo tháng</h3>
                    </div>
                    <div class="card-body">
                        ${Chart.renderBarChart(chartData)}
                    </div>
                </div>
            </div>
        `;
    }
};
