const FamilyDashboard = {
    render(container) {
        Topbar.setTitle('Thông tin Người thân');
        
        container.innerHTML = `
            <div class="card mt-2">
                <div class="card-header">
                    <h3>Thông tin Học viên: Nguyễn Văn Tiến</h3>
                    ${Badge.renderStatusBadge('Đang điều trị')}
                </div>
                <div class="card-body">
                    <div class="detail-row">
                        <div class="detail-label">Mã học viên:</div>
                        <div class="detail-value">BN001</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Ngày sinh:</div>
                        <div class="detail-value">15/08/1998</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Ngày tiếp nhận:</div>
                        <div class="detail-value">15/01/2023</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Giai đoạn:</div>
                        <div class="detail-value">Cắt cơn - Giải độc</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Phòng:</div>
                        <div class="detail-value">A101 - Khu A</div>
                    </div>
                    
                    <div class="mt-3">
                        <button class="btn btn-primary" onclick="Modal.open('Đăng ký thăm gặp', '<p>Bạn muốn đăng ký thăm gặp học viên Nguyễn Văn Tiến?</p><p>Ngày dự kiến: <input type=date class=form-control></p>', '<button class=\\'btn btn-success\\' onclick=\\'Toast.show(\\'Gửi đăng ký thành công!\\'); Modal.close()\\'>Xác nhận</button><button class=\\'btn btn-outline\\' onclick=\\'Modal.close()\\'>Hủy</button>')">
                            <i class="fa-solid fa-calendar-plus"></i> Đăng ký thăm gặp
                        </button>
                        <button class="btn btn-outline ml-2" onclick="Toast.show('Đã gửi yêu cầu hỗ trợ')">
                            <i class="fa-solid fa-headset"></i> Gửi yêu cầu hỗ trợ
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};
