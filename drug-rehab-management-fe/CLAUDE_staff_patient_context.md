# Context cho Claude - Màn Staff Quản lý học viên

File này tóm tắt convention cần thiết để code màn `#/patients` mà không cần dán toàn bộ các file dài.

## Mục tiêu màn cần làm

Màn: **Cán bộ trung tâm - Quản lý học viên**

Route cần chạy:

```text
dashboard.html#/patients
```

File cần sửa:

```text
views/staff/patient-management.html
js/pages/staff/patient-management.page.js
dashboard.html
js/main.js
```

Không sửa backend. Chưa gọi API thật bắt buộc; chỉ làm API-ready với mock fallback.

---

## Convention layout/view

Sau đăng nhập chỉ dùng `dashboard.html`. Không tạo full HTML mới.

Partial view đặt tại:

```text
views/{role}/{screen}.html
```

Page logic đặt tại:

```text
js/pages/{role}/{screen}.page.js
```

CSS chính:

```text
css/dashboard-premium.css
```

Nếu cần class riêng cho màn này, dùng prefix:

```text
staff-patient-*
```

Không tạo style ảnh hưởng màn khác.

---

## Sidebar hiện tại

Trong `js/components/sidebar.js`, role staff đã có menu:

```js
{ path: '/',           icon: 'fa-solid fa-house',            text: 'Dashboard' },
{ path: '/receive',    icon: 'fa-solid fa-file-import',      text: 'Tiếp nhận hồ sơ' },
{ path: '/patients',   icon: 'fa-solid fa-users',            text: 'Quản lý học viên' },
{ path: '/visits',     icon: 'fa-solid fa-calendar-check',   text: 'Duyệt thăm gặp' },
{ path: '/activities', icon: 'fa-solid fa-clipboard-list',   text: 'Lập lịch sinh hoạt' },
{ path: '/attendance', icon: 'fa-solid fa-user-check',       text: 'Điểm danh' }
```

Vì vậy **không cần đổi sidebar** cho màn `#/patients`, trừ khi phát hiện đang bị thiếu trong code thực tế.

---

## Route hiện tại trong `main.js`

Hiện đã có:

```js
// Staff routes
Router.addRoute('/receive', () => {
  if (typeof IntakeConfirmationPage !== 'undefined') {
    IntakeConfirmationPage.render('main-content');
  }
});
```

Cần thêm route:

```js
Router.addRoute('/patients', () => {
  if (typeof PatientManagementPage !== 'undefined') {
    PatientManagementPage.render('main-content');
  }
});
```

---

## Import hiện tại trong `dashboard.html`

Cuối `dashboard.html` đang import staff intake:

```html
<script src="js/pages/staff/intake-confirmation.page.js"></script>
```

Cần thêm:

```html
<script src="js/pages/staff/patient-management.page.js"></script>
```

Đặt gần các script staff khác.

---

## Convention page JS nên dùng

Ưu tiên kiểu object giống `IntakeConfirmationPage` hoặc `MedicalRecordPage`.

Ví dụ structure phù hợp:

```js
const PatientManagementPage = {
  endpoints: {
    list: '/staff/patients'
  },

  patients: [],
  currentSearch: '',
  currentStageFilter: 'all',
  currentStatusFilter: 'all',
  useApi: true,

  fallbackPatients: [
    // mock data
  ],

  async render(containerId) {
    const success = await ViewLoader.load('views/staff/patient-management.html', containerId);
    if (success) await this.init();
  },

  async init() {
    if (typeof Topbar !== 'undefined') Topbar.setTitle('Quản lý học viên');
    this.currentSearch = '';
    this.currentStageFilter = 'all';
    this.currentStatusFilter = 'all';
    this.bindEvents();
    await this.loadPatients();
  },

  async loadPatients() {
    // Try Api.get(this.endpoints.list), fallback mock if error.
  }
};

window.PatientManagementPage = PatientManagementPage;
```

Không khai báo duplicate dạng:

```js
const PatientManagementPage = { ... };
window.PatientManagementPage = PatientManagementPage;
window.PatientManagementPage = (function () { ... })();
```

Chỉ dùng một kiểu duy nhất.

---

## API-ready fallback pattern

Endpoint để sẵn:

```js
list: '/staff/patients'
```

Load data:

```js
try {
  if (typeof Api === 'undefined') throw new Error('Api helper chưa sẵn sàng');
  const data = await Api.get(this.endpoints.list);
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.items)
        ? data.items
        : [];
  this.patients = this.normalizePatients(list);
  this.useApi = true;
} catch (error) {
  console.warn('Đang dùng dữ liệu mẫu cho màn quản lý học viên:', error);
  this.patients = this.fallbackPatients.map(item => ({ ...item }));
  this.useApi = false;
}
```

---

## HTML pattern nên theo màn `intake-confirmation`

Nên có wrapper riêng:

```html
<div class="staff-patient-page">
  ...
</div>
```

Header:

```html
<div class="page-header page-header-row staff-patient-header">
  <div>
    <h2 class="page-title">Quản lý <span class="text-highlight">học viên</span></h2>
    <p class="page-subtitle">Theo dõi thông tin, giai đoạn điều trị và trạng thái của người cai nghiện trong trung tâm.</p>
  </div>
</div>
```

Stat cards dùng:

```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-card-icon stat-icon-blue">
      <i class="fa-solid fa-users"></i>
    </div>
    <div class="stat-value" id="statTotalPatients">0</div>
    <div class="stat-label">Tổng học viên</div>
  </div>
</div>
```

Card danh sách:

```html
<div class="card">
  <div class="card-header">
    <div>
      <span class="card-title">Danh sách học viên</span>
      <p class="card-subtitle">Danh sách người cai nghiện đang được trung tâm quản lý.</p>
    </div>
    <div class="toolbar">
      <div class="search-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input id="patientSearchInput" type="text" placeholder="Tìm mã học viên, họ tên, CCCD..." />
      </div>
      <select id="patientStageFilter" class="filter-select">...</select>
      <select id="patientStatusFilter" class="filter-select">...</select>
    </div>
  </div>
  ...
</div>
```

Modal dùng `.modal-overlay` và bật/tắt bằng class `.active`.

```html
<div class="modal-overlay" id="patientDetailModal">
  <div class="modal modal-lg">
    <div class="modal-header">
      <h3>Chi tiết học viên</h3>
      <button class="modal-close" id="patientDetailCloseBtn">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="modal-body" id="patientDetailBody"></div>
    <div class="modal-footer">
      <button class="btn btn-outline" id="patientDetailCloseBtn2">Đóng</button>
    </div>
  </div>
</div>
```

---

## Nội dung màn `#/patients`

### Header

- Tiêu đề: `Quản lý học viên`
- Subtitle: `Theo dõi thông tin, giai đoạn điều trị và trạng thái của người cai nghiện trong trung tâm.`

### Stat cards

Nên có 4 card:

| Card | Field tính |
|---|---|
| Tổng học viên | Tổng records |
| Đang điều trị | `trangThai === 'DangDieuTri'` |
| Chờ phân phòng | `trangThai === 'ChoPhanPhong'` |
| Hoàn thành | `trangThai === 'HoanThanh'` |

### Toolbar

Search:

```text
Tìm mã học viên, họ tên, CCCD...
```

Filter giai đoạn:

```text
all, TiepNhan, CatCon, PhucHoi, TaiHoaNhap, HoanThanh
```

Filter trạng thái:

```text
all, DangDieuTri, ChoPhanPhong, HoanThanh, TamDung
```

### Table columns

| Cột | Field |
|---|---|
| Mã học viên | `maNguoiCaiNghien` |
| Họ tên | `hoTen` |
| CCCD | `cccd` |
| Ngày vào trại | `ngayVaoTrai` |
| Giai đoạn hiện tại | `giaiDoanHienTai` |
| Khu/phòng | `khuPhong` |
| Bác sĩ phụ trách | `bacSiPhuTrach` |
| Trạng thái | `trangThai` |
| Thao tác | icon xem chi tiết |

### Modal chi tiết

Chia nhóm:

1. Thông tin cá nhân
   - Mã học viên
   - Họ tên
   - CCCD
   - Ngày sinh
   - Giới tính

2. Tiếp nhận
   - Ngày vào trại
   - Nguồn tiếp nhận
   - Mã hồ sơ bàn giao

3. Điều trị
   - Giai đoạn hiện tại
   - Bác sĩ phụ trách
   - Khu/phòng
   - Trạng thái

4. Người thân liên hệ
   - Họ tên người thân
   - Quan hệ
   - Số điện thoại

5. Ghi chú
   - Ghi chú tiếp nhận hoặc điều trị

---

## Mock data field chuẩn

Dùng khoảng 8-10 records:

```js
{
  maNguoiCaiNghien: 'NCN001',
  hoTen: 'Nguyễn Văn Bình',
  cccd: '048201001234',
  ngaySinh: '12/03/1994',
  gioiTinh: 'Nam',
  ngayVaoTrai: '10/06/2026',
  giaiDoanHienTai: 'CatCon',
  khuPhong: 'Khu A - Phòng 101',
  bacSiPhuTrach: 'BS. Trần Thị Mai',
  trangThai: 'DangDieuTri',
  nguonTiepNhan: 'Hồ sơ bàn giao từ công an',
  maHoSoBanGiao: 'HSBG003',
  nguoiThan: 'Nguyễn Thị Lan',
  quanHeNguoiThan: 'Mẹ',
  sdtNguoiThan: '0901234567',
  ghiChu: 'Sức khỏe ổn định khi tiếp nhận.'
}
```

---

## Badge label/màu

Giai đoạn:

| Value | Label |
|---|---|
| `TiepNhan` | Tiếp nhận |
| `CatCon` | Cắt cơn |
| `PhucHoi` | Phục hồi |
| `TaiHoaNhap` | Tái hòa nhập |
| `HoanThanh` | Hoàn thành |

Trạng thái:

| Value | Label | Class gợi ý |
|---|---|---|
| `DangDieuTri` | Đang điều trị | `badge-blue` hoặc `badge-green` |
| `ChoPhanPhong` | Chờ phân phòng | `badge-orange` |
| `HoanThanh` | Hoàn thành | `badge-green` |
| `TamDung` | Tạm dừng | `badge-red` hoặc `badge-gray` |

---

## JS helpers bắt buộc

Cần có:

```js
escapeHtml(value)
renderStats()
getFilteredPatients()
renderTable()
openDetailModal(id)
closeDetailModal()
bindEvents()
```

Render dữ liệu vào `innerHTML` phải qua `escapeHtml`.

Click action nên dùng event delegation:

```js
document.getElementById('patientTableBody').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  if (button.dataset.action === 'view') this.openDetailModal(button.dataset.id);
});
```

---

## Test bắt buộc sau khi code

Chạy:

```powershell
node --check drug-rehab-management-fe\js\pages\staff\patient-management.page.js
node --check drug-rehab-management-fe\js\main.js
```

Tự kiểm bằng browser:

```text
dashboard.html#/patients
```

Checklist:

- Không còn text `đang được xây dựng`.
- Sidebar staff bấm `Quản lý học viên` mở đúng màn.
- Search hoạt động.
- Filter giai đoạn hoạt động.
- Filter trạng thái hoạt động.
- Modal chi tiết mở/đóng được.
- Không phá màn `dashboard.html#/receive`.
