const CommonPages = {
    renderPatients(container) {
        Topbar.setTitle('Danh sách Học viên');
        
        const patientsList = typeof MockPatients !== 'undefined' ? MockPatients : [];
        const patientsTableHtml = Table.renderTable(
            ['Mã BN', 'Họ tên', 'Tuổi', 'Giai đoạn', 'Ngày tiếp nhận', 'Trạng thái', 'Hành động'],
            patientsList.map(p => [
                p.id, 
                p.name, 
                p.age,
                p.phase, 
                Utils.formatDate(p.admissionDate), 
                Badge.renderStatusBadge(p.status),
                `<button class="btn btn-sm btn-outline text-primary" onclick="Toast.show('Xem hồ sơ ${p.name}')">Chi tiết</button>`
            ])
        );

        container.innerHTML = `
            <div class="card mt-2">
                <div class="card-header">
                    <div style="display: flex; gap: 10px;">
                        <input type="text" class="form-control" placeholder="Tìm kiếm theo tên, mã BN..." style="width: 250px;">
                        <button class="btn btn-primary" onclick="Toast.show('Đã lọc danh sách')"><i class="fa-solid fa-search"></i> Tìm kiếm</button>
                    </div>
                </div>
                <div class="card-body">
                    ${patientsTableHtml}
                </div>
            </div>
        `;
    }
};
