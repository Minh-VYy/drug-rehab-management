# Website Quản lý Trung tâm Cai nghiện Ma túy Thành phố Đà Nẵng

## Mục tiêu
Dự án Frontend hiện đại (HTML, CSS, JS thuần) được thiết kế theo kiến trúc Component-based để dễ dàng mở rộng và tích hợp với Backend Java/Spring Boot sau này. Giao diện theo phong cách Modern Healthcare Dashboard.

## Cấu trúc thư mục
- `css/`: Chứa các file style chia theo module (variables, base, layout, components, pages, responsive).
- `js/`: Chứa logic xử lý (api, auth, router).
  - `js/components/`: Các UI components có thể tái sử dụng (Sidebar, Topbar, Card, Table...).
  - `js/pages/`: Các màn hình chức năng.
  - `js/data/`: Mock data tạm thời.
  - `js/services/`: Các service gọi API (sau này sẽ gọi đến Java BE).

## Hướng dẫn chạy dự án
1. Mở thư mục `drug-rehab-management-fe` bằng Visual Studio Code.
2. Cài đặt Extension **Live Server**.
3. Chuột phải vào file `index.html` hoặc `login.html` và chọn **"Open with Live Server"**.

## Tài khoản Demo
Mật khẩu cho tất cả các tài khoản là: **123456**
- `family` (Người thân)
- `police` (Công an)
- `staff` (Nhân viên)
- `doctor` (Bác sĩ)
- `manager` (Quản lý)
- `leader` (Lãnh đạo)
- `admin` (Quản trị hệ thống)

## Hướng dẫn tích hợp Backend Java / Spring Boot sau này
1. Mở file `js/config.js` và đổi `BASE_API_URL` thành URL của backend (ví dụ: `http://localhost:8080/api`).
2. Mở file `js/api.js`, bỏ comment phần `fetch()` và xóa phần code mock (Promise timeout).
3. Hệ thống đã tự động đính kèm `Authorization: Bearer <token>` vào mọi request trong `api.js`.
4. Trong `auth.js`, sửa hàm `fakeLogin` để gọi API POST `/api/auth/login` thật và lưu JWT trả về.
