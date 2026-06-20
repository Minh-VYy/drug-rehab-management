# Tiến độ giao diện còn lại - Rehab Center

Tài liệu này là bản cập nhật theo trạng thái thực tế trong project `drug-rehab-management-fe`.

Mục tiêu:
- Biết màn nào đã làm, màn nào còn placeholder.
- Dùng đúng route hiện tại của `dashboard.html` và `js/main.js`.
- Chia việc tiếp theo cho Claude / Gemini / Kiro hiệu quả hơn.
- Sau khi UI ổn mới chuyển từng nhóm sang gọi API thật.

---

## 1. Quy ước chung

| Nội dung | Quy ước hiện tại |
|---|---|
| Layout sau đăng nhập | Chỉ dùng `dashboard.html` |
| Partial HTML | `views/{role}/{screen}.html` |
| Logic JS | `js/pages/{role}/{screen}.page.js` |
| CSS chính | `css/dashboard-premium.css`, có thêm CSS module nếu cần |
| Router | Hash route dạng `dashboard.html#/path` |
| Sidebar | `js/components/sidebar.js` |
| Route thật | Khai báo trong `registerAppRoutes()` của `js/main.js` |
| Dữ liệu tạm | Mock data trong chính page hoặc `js/data/`, API-ready |
| Gọi API thật | Làm sau khi UI chạy ổn |

Lưu ý quan trọng: tài liệu cũ dùng route kiểu `#/leader/report`, `#/admin/users`, `#/staff/intake-confirmation`. App hiện tại đang dùng route ngắn hơn, ví dụ `#/reports`, `#/users`, `#/receive`.

---

## 2. Tổng quan tiến độ hiện tại

### 2.1. Đã làm tương đối đầy đủ

| Vai trò | Route | Màn hình | File chính | Trạng thái |
|---|---|---|---|---|
| Admin | `#/` | Dashboard quản trị | `views/admin/admin-dashboard.html` | Đã có |
| Admin | `#/users` | Quản lý tài khoản | `views/admin/user-management.html` | Đã có UI/JS |
| Admin | `#/roles` | Quản lý vai trò | `views/admin/role-management.html` | Đã có UI/JS |
| Admin | `#/medicines` | Danh mục thuốc | `views/admin/medicine-category.html` | Đã có UI/JS |
| Admin | `#/system-logs` | Hoạt động hệ thống | `views/admin/system-log.html` | Đã có UI/JS |
| Leader | `#/` | Dashboard lãnh đạo | `views/leader/leader-dashboard.html` | Đã có UI/JS |
| Leader | `#/reports` | Báo cáo tổng quan | `views/leader/leader-report.html` | Đã có UI/JS |
| Leader | `#/approvals-receive` | Phê duyệt tiếp nhận | `views/leader/intake-approval.html` | Đã có UI/JS |
| Leader | `#/approvals-complete` | Phê duyệt hoàn thành | `views/leader/completion-approval.html` | Đã có UI/JS |
| Manager | `#/` | Dashboard quản lý | `views/manager/manager-dashboard.html` | Đã có UI/JS |
| Manager | `#/treatment-approval` | Phê duyệt phác đồ | `views/manager/treatment-approval.html` | Đã có UI/JS |
| Doctor | `#/` | Dashboard bác sĩ | `views/doctor/doctor-dashboard.html` | Đã có UI/JS |
| Doctor | `#/medical-records` | Cập nhật hồ sơ bệnh án | `views/doctor/medical-record.html` | Đã có UI/JS |
| Staff | `#/receive` | Xác nhận tiếp nhận | `views/staff/intake-confirmation.html` | Đã có UI/JS |
| Police | `#/transfer` | Gửi hồ sơ bàn giao | `views/police/handover-create.html` | Đã có UI/JS, cần sửa tiếng Việt không dấu |
| Family | `#/` | Dashboard người thân | `views/family/family-dashboard.html` | Có UI đơn giản |

### 2.2. Có file tốt nhưng chưa gắn route/menu

| Vai trò | Màn hình | File | Việc cần làm |
|---|---|---|---|
| Admin | Quản lý nhân sự | `views/admin/staff-management.html`, `js/pages/admin/staff-management.page.js` | Nếu muốn dùng: import JS, thêm route `#/staff` hoặc `#/admin-staff`, thêm menu admin |

### 2.3. Còn placeholder hoặc chưa dùng được qua route

| Vai trò | Màn còn thiếu | File hiện có | Ghi chú |
|---|---|---|---|
| Admin | Danh mục hoạt động | `views/admin/activity-category.html` | Placeholder |
| Staff | Dashboard cán bộ trung tâm | `views/staff/staff-dashboard.html` | Placeholder |
| Staff | Quản lý học viên | `views/staff/patient-management.html` | Placeholder |
| Staff | Duyệt thăm gặp | `views/staff/visit-approval.html` | Placeholder |
| Staff | Xác nhận thăm gặp | `views/staff/visit-checkin.html` | Placeholder, chưa có menu |
| Staff | Lập lịch sinh hoạt | `views/staff/activity-schedule.html` | Placeholder |
| Staff | Điểm danh | `views/staff/attendance.html` | Placeholder |
| Staff | Tạo thông báo | `views/staff/create-notification.html` | Placeholder, chưa có menu |
| Staff | Phản hồi hỗ trợ | `views/staff/support-response.html` | Placeholder, chưa có menu |
| Family | Hồ sơ cá nhân | `views/common/profile.html` | Placeholder, menu đang trỏ `#/profile` |
| Family | Đăng ký cai nghiện | `views/family/voluntary-registration.html` | Placeholder, menu đang trỏ `#/register-rehab` |
| Family | Đăng ký thăm gặp | `views/family/visit-registration.html` | Placeholder, menu đang trỏ `#/visit-register` |
| Family | Lộ trình phục hồi | `views/family/recovery-path.html` | Placeholder, menu đang trỏ `#/treatment-path` |
| Family | Yêu cầu hỗ trợ | `views/family/support-request.html` | Placeholder, menu đang trỏ `#/support` |
| Family | Lịch sử đơn tự nguyện | `views/family/voluntary-history.html` | Placeholder, chưa có menu |
| Family | Lịch sử thăm gặp | `views/family/visit-history.html` | Placeholder, chưa có menu |
| Family | Xem hồ sơ bệnh án | `views/family/medical-record-view.html` | Placeholder, chưa có menu |
| Doctor | Tạo phác đồ | `views/doctor/treatment-plan-create.html` | Placeholder, chưa có menu/route |
| Doctor | Nhật ký điều trị | `views/doctor/treatment-diary.html` | Placeholder, chưa có menu/route |
| Doctor | Lịch thuốc | `views/doctor/medicine-schedule.html` | Placeholder, chưa có menu/route |
| Doctor | Lịch tư vấn | `views/doctor/counseling-schedule.html` | Placeholder, chưa có menu/route |
| Doctor | Đề xuất chuyển giai đoạn | `views/doctor/stage-proposal.html` | Placeholder, chưa có menu/route |
| Doctor | Đề xuất hoàn thành | `views/doctor/completion-proposal.html` | Placeholder, chưa có menu/route |
| Manager | Duyệt chuyển giai đoạn | `views/manager/stage-approval.html` | Placeholder, chưa có menu/route |
| Manager | Phân công | `views/manager/assignment.html` | Placeholder, chưa có menu/route |
| Manager | Báo cáo quản lý | `views/manager/overview-report.html` | Placeholder, chưa có menu/route |
| Police | Dashboard công an | `views/police/police-dashboard.html` | Placeholder |
| Police | Danh sách hồ sơ bàn giao | `views/police/handover-management.html` | Placeholder, menu hiện đang trỏ `#/transfer-list` nhưng file tên khác |
| Police | Lịch sử bàn giao | `views/police/handover-history.html` | Placeholder |
| Common | Thông báo | `views/common/notification.html` | Placeholder |
| Common | Forbidden | `views/common/forbidden.html` | Placeholder |

---

## 3. Route thật hiện tại trong sidebar

### Family

| Menu | Route hiện tại | Tình trạng |
|---|---|---|
| Dashboard | `#/` | Có dashboard đơn giản |
| Hồ sơ cá nhân | `#/profile` | Chưa có route trong `main.js` |
| Đăng ký cai nghiện | `#/register-rehab` | Chưa có route trong `main.js` |
| Đăng ký thăm gặp | `#/visit-register` | Chưa có route trong `main.js` |
| Lộ trình phục hồi | `#/treatment-path` | Chưa có route trong `main.js` |
| Yêu cầu hỗ trợ | `#/support` | Chưa có route trong `main.js` |

### Police

| Menu | Route hiện tại | Tình trạng |
|---|---|---|
| Dashboard | `#/` | Có file nhưng chưa render theo role police |
| Gửi hồ sơ bàn giao | `#/transfer` | Đã có route |
| DS hồ sơ bàn giao | `#/transfer-list` | Chưa có route, chưa khớp file `handover-management` |

### Staff

| Menu | Route hiện tại | Tình trạng |
|---|---|---|
| Dashboard | `#/` | Chưa render `StaffDashboardPage`, fallback dashboard |
| Tiếp nhận hồ sơ | `#/receive` | Đã có route |
| Quản lý học viên | `#/patients` | Chưa có route |
| Duyệt thăm gặp | `#/visits` | Chưa có route |
| Lập lịch sinh hoạt | `#/activities` | Chưa có route |
| Điểm danh | `#/attendance` | Chưa có route |

### Doctor

| Menu | Route hiện tại | Tình trạng |
|---|---|---|
| Dashboard | `#/` | Đã render dashboard bác sĩ |
| Cập nhật hồ sơ bệnh án | `#/medical-records` | Đã có route |

### Manager

| Menu | Route hiện tại | Tình trạng |
|---|---|---|
| Dashboard | `#/` | Đã render dashboard quản lý |
| Phê duyệt phác đồ | `#/treatment-approval` | Đã có route |

### Leader

| Menu | Route hiện tại | Tình trạng |
|---|---|---|
| Dashboard | `#/` | Đã render dashboard lãnh đạo |
| Báo cáo tổng quan | `#/reports` | Đã có route |
| Phê duyệt tiếp nhận | `#/approvals-receive` | Đã có route |
| Phê duyệt hoàn thành | `#/approvals-complete` | Đã có route |

### Admin

| Menu | Route hiện tại | Tình trạng |
|---|---|---|
| Dashboard | `#/` | Đã render dashboard admin |
| Quản lý tài khoản | `#/users` | Đã có route |
| Quản lý vai trò | `#/roles` | Đã có route |
| Danh mục thuốc | `#/medicines` | Đã có route |
| Hoạt động hệ thống | `#/system-logs` | Đã có route |

---

## 4. Kế hoạch hoàn thành phần giao diện còn lại

### Giai đoạn 1 - Hoàn thiện Staff vì đây là luồng vận hành chính

Ưu tiên cao nhất sau admin/leader.

| Thứ tự | Màn | Route đề xuất | Giao AI | Lý do |
|---:|---|---|---|---|
| 1 | Quản lý học viên | `#/patients` | Claude | Màn quan trọng, cần UI đẹp, nhiều thông tin |
| 2 | Duyệt thăm gặp | `#/visits` | Gemini | Dạng bảng + modal duyệt/từ chối |
| 3 | Lập lịch sinh hoạt | `#/activities` | Gemini | Dạng lịch/bảng, tương đối chuẩn |
| 4 | Điểm danh | `#/attendance` | Gemini/Kiro | Bảng trạng thái, thao tác lặp |
| 5 | Dashboard staff | `#/` theo role staff | Claude/Gemini | Tổng hợp số liệu từ các màn staff |
| 6 | Xác nhận thăm gặp | `#/visit-checkin` | Kiro/Gemini | Dạng bảng check-in đơn giản |
| 7 | Tạo thông báo | `#/notifications-create` | Kiro | Form + bảng đơn giản |
| 8 | Phản hồi hỗ trợ | `#/support-response` | Gemini | Bảng yêu cầu + modal phản hồi |

Việc cần làm kèm theo:
- Import các page JS trong `dashboard.html`.
- Thêm route trong `main.js`.
- Đồng bộ route với `sidebar.js`.

### Giai đoạn 2 - Hoàn thiện Doctor

| Thứ tự | Màn | Route đề xuất | Giao AI | Lý do |
|---:|---|---|---|---|
| 1 | Tạo phác đồ điều trị | `#/treatment-plan-create` | Claude | Nhiều form, cần trải nghiệm tốt |
| 2 | Nhật ký điều trị | `#/treatment-diary` | Gemini | Bảng + modal ghi nhật ký |
| 3 | Lịch thuốc | `#/medicine-schedule` | Gemini | Bảng/lịch theo ngày |
| 4 | Lịch tư vấn | `#/counseling-schedule` | Gemini | Lịch + trạng thái |
| 5 | Đề xuất chuyển giai đoạn | `#/stage-proposal` | Gemini | Form đề xuất + bảng |
| 6 | Đề xuất hoàn thành | `#/completion-proposal` | Gemini | Tương tự stage proposal |

Việc cần làm kèm theo:
- Mở rộng sidebar bác sĩ.
- Thêm route/import cho các màn doctor mới.
- Sau UI xong, liên kết các đề xuất với màn leader phê duyệt.

### Giai đoạn 3 - Hoàn thiện Family

| Thứ tự | Màn | Route hiện tại/đề xuất | Giao AI | Lý do |
|---:|---|---|---|---|
| 1 | Đăng ký cai nghiện | `#/register-rehab` | Claude | Màn public-family quan trọng, form dài |
| 2 | Đăng ký thăm gặp | `#/visit-register` | Claude/Gemini | Form có người đi cùng, lịch/ca thăm |
| 3 | Lộ trình phục hồi | `#/treatment-path` | Claude | Cần timeline đẹp |
| 4 | Yêu cầu hỗ trợ | `#/support` | Gemini | Bảng + form gửi yêu cầu |
| 5 | Hồ sơ cá nhân | `#/profile` | Kiro | Form đơn giản |
| 6 | Lịch sử đơn tự nguyện | `#/voluntary-history` | Kiro | Bảng lịch sử |
| 7 | Lịch sử thăm gặp | `#/visit-history` | Kiro | Bảng lịch sử |
| 8 | Xem hồ sơ bệnh án | `#/medical-record-view` | Gemini | Chỉ xem, cần kiểm soát thông tin hiển thị |

Việc cần làm kèm theo:
- Thống nhất sidebar family: có thêm lịch sử hay không.
- Thêm route/import cho các màn đang có trong menu trước.

### Giai đoạn 4 - Hoàn thiện Police

| Thứ tự | Màn | Route đề xuất | Giao AI | Lý do |
|---:|---|---|---|---|
| 1 | Sửa form gửi hồ sơ bàn giao | `#/transfer` | Kiro/Gemini | Đã có UI, cần sửa tiếng Việt không dấu và polish |
| 2 | Dashboard công an | `#/` theo role police | Gemini | Stat cards + danh sách gần đây |
| 3 | Quản lý hồ sơ bàn giao | `#/transfer-list` hoặc `#/handover-management` | Gemini | Bảng + modal chi tiết |
| 4 | Lịch sử bàn giao | `#/handover-history` | Kiro | Bảng lọc theo đã xử lý |

Việc cần làm kèm theo:
- Khớp route menu `#/transfer-list` với file `handover-management`.
- Render dashboard police trong `renderRoleDashboard()`.

### Giai đoạn 5 - Hoàn thiện các phần phụ

| Màn | Giao AI | Ghi chú |
|---|---|---|
| Admin - Danh mục hoạt động | Gemini | Có thể tương tự danh mục thuốc |
| Admin - Quản lý nhân sự | Kiro/Gemini | Đã có UI, chỉ cần gắn route/menu nếu muốn |
| Common - Thông báo | Kiro | Card/list đơn giản |
| Common - Forbidden | Kiro | Màn lỗi quyền truy cập |
| Common - Dashboard Home | Có thể bỏ | Nếu mỗi role đã có dashboard riêng thì không cần |

---

## 5. Prompt mẫu cho từng AI

### Claude - màn khó, cần UI đẹp

```text
Tiếp tục làm giao diện theo tài liệu tiến độ mới.

Ưu tiên màn: [TÊN MÀN]
File cần sửa:
- [views/...html]
- [js/pages/...page.js]
- nếu cần thì thêm import vào dashboard.html, route vào js/main.js, menu vào js/components/sidebar.js

Yêu cầu:
- Giữ style dashboard-premium hiện tại.
- Không tạo full HTML mới.
- UI phải đẹp, có header, stat cards nếu phù hợp, bảng/card, search/filter, modal chi tiết.
- Dữ liệu dùng mock API-ready, chưa gọi API thật.
- Tiếng Việt đầy đủ dấu.
- Không phá các màn đã hoàn thiện.
- Sau khi xong chạy node --check file JS.
```

### Gemini - màn bảng nghiệp vụ tầm trung

```text
Làm màn nghiệp vụ dạng bảng + modal theo cấu trúc hiện tại.

Màn: [TÊN MÀN]
Route: [#/route]
File:
- [views/...html]
- [js/pages/...page.js]

Yêu cầu:
- Header + subtitle.
- Toolbar gồm search/filter.
- Bảng dữ liệu có badge trạng thái và action icon.
- Modal xem chi tiết, modal xác nhận nếu có thao tác duyệt/từ chối.
- Mock data trong JS, API-ready.
- Thêm route/import/menu nếu màn nằm trong sidebar.
- Chạy node --check sau khi xong.
```

### Kiro - màn đơn giản

```text
Làm màn đơn giản theo style dashboard hiện tại.

Màn: [TÊN MÀN]
File:
- [views/...html]
- [js/pages/...page.js]

Yêu cầu:
- Không placeholder.
- Có header, card hoặc bảng đơn giản.
- Dữ liệu mock.
- Tiếng Việt đầy đủ dấu.
- Không sửa layout chung nếu không cần.
```

---

## 6. Checklist kiểm thử sau mỗi màn

Sau khi một AI làm xong một màn, cần kiểm:

| Việc kiểm | Cách kiểm |
|---|---|
| JS không lỗi cú pháp | `node --check drug-rehab-management-fe/js/pages/...page.js` |
| Route mở được | `dashboard.html#/route` |
| Không mở trực tiếp partial | Không dùng link `views/...html` trên Go Live |
| Menu đúng | Bấm sidebar thấy màn tương ứng |
| Không còn placeholder | Không có câu “đang được xây dựng” |
| Tiếng Việt có dấu | Kiểm tra title, placeholder, toast, modal |
| Modal hoạt động | Mở/đóng bằng nút và click overlay |
| Search/filter hoạt động | Nhập keyword, đổi filter |
| Không phá màn khác | Vào lại dashboard và màn vừa làm trước đó |

---

## 7. Thứ tự làm khuyến nghị từ bây giờ

| Ưu tiên | Nhóm | Màn |
|---:|---|---|
| 1 | Staff | Quản lý học viên |
| 2 | Staff | Duyệt thăm gặp |
| 3 | Staff | Lập lịch sinh hoạt |
| 4 | Staff | Điểm danh |
| 5 | Staff | Dashboard staff |
| 6 | Doctor | Tạo phác đồ điều trị |
| 7 | Doctor | Nhật ký điều trị |
| 8 | Doctor | Đề xuất chuyển giai đoạn / hoàn thành |
| 9 | Family | Đăng ký cai nghiện |
| 10 | Family | Đăng ký thăm gặp |
| 11 | Family | Lộ trình phục hồi |
| 12 | Police | Sửa gửi hồ sơ bàn giao + danh sách hồ sơ |
| 13 | Admin phụ | Danh mục hoạt động |
| 14 | Common | Profile / Notification / Forbidden |

Khi các màn trên đã có UI ổn, bước tiếp theo là chuyển từng nhóm sang gọi API thật, bắt đầu từ các màn đang nằm trong demo chính: Leader, Admin, Staff, Doctor.
