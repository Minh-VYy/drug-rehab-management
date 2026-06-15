# Cấu trúc Dự án Frontend - Quản lý Trung tâm Cai nghiện Đà Nẵng

Tài liệu này mô tả chi tiết cấu trúc kiến trúc của dự án. **(Dành cho AI hỗ trợ thiết kế giao diện/code tính năng)**

Dự án này sử dụng **HTML, CSS, JS thuần**, không dùng framework (React/Vue/Angular), nhưng được tổ chức theo mô hình **Component-based** và phân lớp rõ ràng để chuẩn bị tích hợp REST API bằng Java/Spring Boot sau này.

---

## 1. Cấu trúc thư mục tổng quan

```text
drug-rehab-management-fe/
├── index.html               # Trang điều hướng ban đầu
├── login.html               # Giao diện Đăng nhập
├── register.html            # Giao diện Đăng ký
├── dashboard.html           # Layout chính của hệ thống (Sidebar + Topbar + Main)
│
├── css/
│   ├── variables.css        # Biến màu sắc, font, spacing, shadow...
│   ├── base.css             # Reset CSS, typography cơ bản
│   ├── layout.css           # Layout Sidebar, Topbar, Main Wrapper
│   ├── components.css       # Style cho Card, Button, Table, Modal, Toast, Badge
│   ├── pages.css            # Style đặc thù cho từng trang (Login, Dashboard grid)
│   ├── responsive.css       # Media queries cho Mobile/Tablet
│   └── style.css            # File tổng (đã gom tất cả code mới nhất vào đây theo yêu cầu người dùng)
│
└── js/
    ├── config.js            # Cấu hình BASE_API_URL
    ├── api.js               # Wrapper gọi API (fetch), tự động đính kèm Token
    ├── auth.js              # Xử lý login, phân quyền (role), localStorage
    ├── router.js            # Định tuyến SPA (Vanilla JS) thay đổi nội dung thẻ <main>
    ├── utils.js             # Hàm tiện ích (format ngày, tiền tệ)
    ├── main.js              # Điểm khởi chạy (Check Auth, init Router, render Layout)
    │
    ├── components/          # UI Components (Render HTML string)
    │   ├── sidebar.js       # Render menu dựa theo Role người dùng
    │   ├── topbar.js        # Render header
    │   ├── card.js          # Render StatCard
    │   ├── table.js         # Render Data Table
    │   ├── badge.js         # Render Status Badge (Màu sắc theo trạng thái)
    │   ├── modal.js         # Hàm Open/Close Modal
    │   ├── toast.js         # Hàm hiển thị thông báo góc màn hình
    │   └── chart.js         # Component render biểu đồ (DOM based)
    │
    ├── data/                # Mock Data (JSON arrays)
    │   ├── mock-patients.js
    │   ├── mock-users.js
    │   └── mock-treatment.js
    │
    ├── pages/               # Logic cho từng màn hình
    │   ├── admin-dashboard.js
    │   ├── doctor-dashboard.js
    │   ├── family-dashboard.js
    │   └── common-pages.js
    │
    └── services/            # Chứa các file Service gọi qua api.js (sẽ phát triển sau)
```

---

## 2. Quy ước CSS & Design Tokens (Lưu ý quan trọng khi thiết kế)

Toàn bộ CSS đã được tập trung trong file `css/style.css` với các biến CSS quy chuẩn. **KHÔNG** dùng mã màu HEX trực tiếp (hardcode) trong HTML/JS, luôn sử dụng CSS Variables.

### Biến Màu sắc chính (`:root`)
- `var(--primary)`: Xanh dương (#2563EB)
- `var(--success)`: Xanh lá (#10B981)
- `var(--warning)`: Cam (#F59E0B)
- `var(--danger)`: Đỏ (#EF4444)
- `var(--bg)`: Background nền nhạt (#F8FAFC)
- `var(--surface)`: Màu nền thẻ/khối (#FFFFFF)
- `var(--text)`: Chữ chính (#1E293B)
- `var(--text-muted)`: Chữ phụ (#64748B)
- `var(--border)`: Viền (#E2E8F0)

### Các Class Utilities có sẵn
- Nút bấm: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-warning`, `.btn-danger`, `.btn-outline-primary`, `.btn-sm`, `.btn-block`
- Thẻ nội dung: `.card`, `.card-header`, `.card-body`
- Layout: `.dashboard-grid`, `.content-grid`, `.stats-grid`
- Text: `.text-muted`, `.text-danger`, `.text-success`, `.text-primary`, `.fw-600`
- Margin/Padding: `.mt-1`, `.mt-2`, `.mb-1`, `.mb-2`, `.mb-3`
- Form: `.form-group`, `.form-label`, `.form-control`, `.form-row`

---

## 3. Kiến trúc Layout (`dashboard.html`)

Hệ thống hoạt động theo cơ chế Single Page Application (SPA) đơn giản:
1. `dashboard.html` chứa bộ khung (Layout Wrapper).
2. Có 3 container cố định:
   - `<aside id="sidebar-container">`: Render bởi `Sidebar.render()`
   - `<header id="topbar-container">`: Render bởi `Topbar.render()`
   - `<main id="main-content">`: Nơi `Router` nạp mã HTML động dựa theo URL.
3. Popup/Thông báo:
   - `<div id="modal-container">`: Container cho Popup.
   - `<div id="toast-container">`: Container cho Toast Notification.

---

## 4. Hướng dẫn dành cho AI hỗ trợ viết Code

Khi User yêu cầu làm thêm 1 tính năng mới (Ví dụ: "Làm màn hình Quản lý Thuốc"), AI thực hiện theo quy trình sau:

1. **Tạo/Sửa file Page**:
   - Viết logic tạo HTML string tại file `js/pages/ten-page.js` (VD: `MedicinePage.render(container)`).
   - Tận dụng các Component có sẵn: `Table.renderTable`, `Card.renderStatCard`, `Badge.renderStatusBadge`.
   
2. **Khai báo Router**:
   - Nếu là route mới, bổ sung vào hàm đăng ký route trong `js/main.js` (Gọi `Router.addRoute('/url', Component.render)`).
   
3. **Cập nhật Menu (nếu cần)**:
   - Mở `js/components/sidebar.js`, thêm link `{ path: '/url', icon: 'fa-...', text: 'Tên menu' }` vào Role tương ứng. Link phải có class `nav-item` và attribute `data-link`.

4. **Tương tác Backend**:
   - Xử lý click/submit thông qua gọi hàm `Api.post(...)` hoặc `Api.get(...)` thay vì fetch trực tiếp.
   - Hiển thị phản hồi bằng `Toast.show('Thành công', 'success')` hoặc `Modal.open(...)`.
