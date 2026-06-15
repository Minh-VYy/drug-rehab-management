const AdminDashboard = {
    render(container) {
        Topbar.setTitle('Quản trị Hệ thống');
        
        container.innerHTML = `
            <div class="dashboard-grid">
                ${Card.renderStatCard('Tài khoản', '842', 'fa-solid fa-users-gear', 'primary')}
                ${Card.renderStatCard('Roles', '8', 'fa-solid fa-shield-halved', 'warning')}
                ${Card.renderStatCard('Lượt truy cập', '1,254', 'fa-solid fa-eye', 'success')}
                ${Card.renderStatCard('Lỗi hệ thống', '0', 'fa-solid fa-bug', 'danger')}
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3>Quản lý Tài khoản (Mock)</h3>
                    <button class="btn btn-sm btn-primary" onclick="Toast.show('Tính năng đang phát triển')"><i class="fa-solid fa-plus"></i> Thêm mới</button>
                </div>
                <div class="card-body">
                    ${Table.renderTable(
                        ['Username', 'Họ tên', 'Role', 'Trạng thái', 'Hành động'],
                        [
                            ['admin', 'Admin Hệ thống', 'Quản trị HT', Badge.renderStatusBadge('Active'), '<button class="btn btn-sm btn-outline text-danger">Khóa</button>'],
                            ['doctor_nam', 'BS. Nam', 'Bác sĩ', Badge.renderStatusBadge('Active'), '<button class="btn btn-sm btn-outline text-danger">Khóa</button>'],
                            ['family_hoa', 'Hoa Nguyễn', 'Người thân', Badge.renderStatusBadge('Inactive'), '<button class="btn btn-sm btn-outline text-success">Mở</button>']
                        ]
                    )}
                </div>
            </div>
        `;
    }
};
