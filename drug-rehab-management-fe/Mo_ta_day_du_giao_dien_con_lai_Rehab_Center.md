# Tien Do Va Dieu Phoi Giao Dien Rehab Center

Tai lieu nay dung de giam viec phai giai thich lai cho Claude/Gemini/Kiro. Khi giao viec cho AI khac, chi can dua file nay kem dung 2 file man hinh mau va yeu cau cu the.

## 1. Cach Lam De Tiet Kiem Token

Dung nhieu AI co hao token khong?
- Neu moi lan dua toan bo source/context dai cho tung AI thi hao rat nhieu.
- Neu chi giao prompt ngan, dua dung file lien quan, va de Codex kiem tra/sua lai thi tiet kiem hon.
- Cach toi uu: Claude/Gemini/Kiro code tung man rieng, Codex giu vai tro "reviewer + integrator": kiem tra route, import, syntax, UI, luong DB/API, roi sua loi can thiet.

Quy tac giao viec:
- Khong bat AI doc ca project.
- Chi dua: file HTML/JS cua man can lam, 1 man mau cung nhom, `dashboard.html`, `js/main.js`, `js/components/sidebar.js` neu can gan route/menu.
- Moi task chi giao 1-2 man. Khong giao ca role lon trong mot lan.
- Yeu cau AI tra ve: file da sua, route/import/menu can them, CSS can bo sung, API can co sau nay.
- Sau khi AI lam xong, Codex kiem: `node --check`, route, sidebar, modal, tieng Viet, mock/API-ready.

Nen dung AI nao:
- Claude: man kho, can UI dep, form dai, timeline, dashboard, workflow phuc tap.
- Gemini: man bang nghiep vu tam trung, search/filter/modal duyet-tu choi.
- Kiro: man don gian, history/list/profile/forbidden/notification.
- Codex: kiem tra, sua loi tich hop, sua DB/API mapping, chot ket qua.

## 2. Convention Project

| Noi dung | Quy uoc |
|---|---|
| Layout sau dang nhap | `dashboard.html` |
| Partial HTML | `views/{role}/{screen}.html` |
| Logic JS | `js/pages/{role}/{screen}.page.js` |
| CSS chinh | `css/dashboard-premium.css` |
| Router | Hash route: `dashboard.html#/path` |
| Sidebar | `js/components/sidebar.js` |
| Route | Khai bao trong `registerAppRoutes()` cua `js/main.js` |
| Dashboard 3D | `js/components/advanced-dashboard.js` |
| Mock data | Tam thoi trong page/service, phai API-ready |
| API | Sau khi UI va DB/ERD on dinh moi chuyen sang API that |

Khong mo truc tiep file partial nhu `views/staff/x.html` tren Go Live. Luon mo qua `dashboard.html#/route`.

## 3. Trang Thai Hien Tai

### Da Tuong Doi On

| Role | Route | Man | Ghi chu |
|---|---|---|---|
| Admin | `#/` | Dashboard admin | Da co dashboard dep/advanced |
| Admin | `#/users` | Quan ly tai khoan | Da co UI/JS |
| Admin | `#/roles` | Quan ly vai tro | Da co UI/JS |
| Admin | `#/medicines` | Danh muc thuoc | Da co UI/JS |
| Admin | `#/system-logs` | Hoat dong he thong | Da co UI/JS |
| Admin | chua chac menu | Quan ly nhan su | Da co file, can quyet dinh co gan menu khong |
| Leader | `#/` | Dashboard lanh dao | Da co dashboard dep/advanced |
| Leader | `#/reports` | Bao cao tong quan | Da co UI/JS |
| Leader | `#/approvals-receive` | Phe duyet tiep nhan | Da co UI/JS, can dong bo API theo `PhieuBanGiao` moi |
| Leader | `#/approvals-complete` | Phe duyet hoan thanh | Da co UI/JS |
| Manager | `#/` | Dashboard quan ly | Da co dashboard dep/advanced |
| Manager | `#/treatment-approval` | Phe duyet phac do | Da co UI/JS |
| Manager | `#/stage-approval` | Duyet chuyen giai doan | Da co UI/JS |
| Manager | `#/assignment` | Phan cong phu trach | Da co UI/JS |
| Manager | `#/overview-report` | Bao cao quan ly | Da co UI/JS |
| Doctor | `#/` | Dashboard bac si | Da co dashboard dep/advanced |
| Doctor | `#/medical-records` | Ho so benh an | Da co UI/JS, co API |
| Doctor | `#/treatment-plan-create` | Tao phac do | Da co UI/JS, can chinh field map DB va them API tao/luu nhap/gui duyet |
| Staff | `#/` | Dashboard staff | Da co dashboard dep/advanced |
| Staff | `#/receive` | Xac nhan tiep nhan | Da co UI/JS |
| Staff | `#/patients` | Quan ly hoc vien | Da co UI/JS |
| Staff | `#/visits` | Duyet tham gap | Da co UI/JS |
| Staff | `#/activities` | Lap lich sinh hoat | Da co UI/JS |
| Staff | `#/attendance` | Diem danh | Da co UI/JS |
| Police | `#/` | Dashboard cong an | Da co dashboard dep/advanced |
| Police | `#/transfer` | Gui phieu ban giao | Co UI, can sua tieng Viet/field theo DB moi |
| Family | `#/` | Dashboard nguoi than | Da co dashboard dep/advanced |

### Con Thieu Hoac Con Placeholder

| Uu tien | Role | Route de xuat | Man | File |
|---:|---|---|---|---|
| 1 | Doctor | `#/treatment-diary` | Nhat ky dieu tri | `views/doctor/treatment-diary.html`, `js/pages/doctor/treatment-diary.page.js` |
| 2 | Doctor | `#/medicine-schedule` | Lich thuoc | `views/doctor/medicine-schedule.html`, `js/pages/doctor/medicine-schedule.page.js` |
| 3 | Doctor | `#/counseling-schedule` | Lich tu van | `views/doctor/counseling-schedule.html`, `js/pages/doctor/counseling-schedule.page.js` |
| 4 | Doctor | `#/stage-proposal` | De xuat chuyen giai doan | `views/doctor/stage-proposal.html`, `js/pages/doctor/stage-proposal.page.js` |
| 5 | Doctor | `#/completion-proposal` | De xuat hoan thanh | `views/doctor/completion-proposal.html`, `js/pages/doctor/completion-proposal.page.js` |
| 6 | Police | `#/transfer-list` | Quan ly phieu ban giao | `views/police/handover-management.html`, `js/pages/police/handover-management.page.js` |
| 7 | Police | `#/handover-history` | Lich su ban giao | `views/police/handover-history.html`, `js/pages/police/handover-history.page.js` |
| 8 | Family | `#/medical-record-view` | Xem ho so benh an | `views/family/medical-record-view.html`, `js/pages/family/medical-record-view.page.js` |
| 9 | Family | `#/voluntary-history` | Lich su don tu nguyen | `views/family/voluntary-history.html`, `js/pages/family/voluntary-history.page.js` |
| 10 | Family | `#/visit-history` | Lich su tham gap | `views/family/visit-history.html`, `js/pages/family/visit-history.page.js` |
| 11 | Staff | `#/visit-checkin` | Xac nhan tham gap | `views/staff/visit-checkin.html`, `js/pages/staff/visit-checkin.page.js` |
| 12 | Staff | `#/notifications-create` | Tao thong bao | `views/staff/create-notification.html`, `js/pages/staff/create-notification.page.js` |
| 13 | Staff | `#/support-response` | Phan hoi ho tro | `views/staff/support-response.html`, `js/pages/staff/support-response.page.js` |
| 14 | Admin | `#/activities-category` | Danh muc hoat dong | `views/admin/activity-category.html`, `js/pages/admin/activity-category.page.js` |
| 15 | Common | `#/notifications` | Thong bao | `views/common/notification.html`, `js/pages/common/notification.page.js` |
| 16 | Common | `#/forbidden` | Forbidden | `views/common/forbidden.html`, `js/pages/common/forbidden.page.js` |

Family da co cac man `voluntary-registration`, `visit-registration`, `recovery-path`, `support-request`, `profile`; can test lai route/menu va polish neu can, nhung khong uu tien bang Doctor/Police.

## 4. Luong Nghiep Vu Chinh Phai Giu Dung

### 4.1. Luong ban giao tu cong an

DB/ERD chuan da tach:
- `PhieuBanGiao`: thong tin phieu, so quyet dinh, file quyet dinh, trang thai phieu.
- `ChiTietPhieuBanGiao`: tung doi tuong trong phieu.
- `NguoiCaiNghien.MaChiTietPhieuBanGiao`: lien ket hoc vien voi chi tiet phieu sau khi tiep nhan.

Trang thai phieu:
- `BAN_NHAP`: cong an luu nhap.
- `DA_GUI`: da gui cho trung tam/lanh dao cho xu ly.
- `DANG_TIEP_NHAN`: trung tam dang tiep nhan.
- `TIEP_NHAN_MOT_PHAN`: mot so doi tuong da tiep nhan, mot so chua.
- `DA_TIEP_NHAN`: tat ca da tiep nhan.
- `TU_CHOI`: bi tu choi.
- `DA_HUY`: cong an huy.

Trang thai chi tiet:
- `CHO_TIEP_NHAN`
- `DA_TIEP_NHAN`
- `TU_CHOI`
- `CHO_XAC_NHAN_GAP`
- `DA_NHAP_TRAI`

Man lien quan:
- Police `#/transfer`: tao/lap phieu ban giao.
- Police `#/transfer-list`: quan ly phieu da lap.
- Leader `#/approvals-receive`: phe duyet/tiep nhan phieu ban giao.
- Staff `#/receive`: xac nhan tiep nhan tung doi tuong.
- Staff `#/patients`: sau khi tiep nhan, hoc vien xuat hien trong danh sach.

Can tranh:
- Khong dung lai `HoSoBanGiao` vi SQL da chuyen theo ERD sang `PhieuBanGiao` va `ChiTietPhieuBanGiao`.
- Khong goi API/count theo `TrangThaiDuyet` nua. Dung `TrangThaiPhieu` va `TrangThaiChiTiet`.

### 4.2. Luong phac do dieu tri

DB da co:
- `HoSoBenhAn`: ho so y te cua hoc vien.
- `PhacDoDieuTri`: phac do tong, co `TrangThai` = `BAN_NHAP`, `DANG_AP_DUNG`, `DA_HOAN_THANH`, `DA_HUY`.
- `ChiTietPhacDoDieuTri`: chi tiet theo giai doan, co `TrangThai` = `CHO_PHE_DUYET`, `DANG_AP_DUNG`, `DA_HOAN_THANH`, `TAM_DUNG`, `TU_CHOI`.
- `NhatKyDieuTri`: nhat ky bac si ghi, co the gan voi `MaChiTietPhacDo`.
- `HoSoDeXuat`: de xuat chuyen giai doan/ra trai.

Luong dung:
1. Bac si mo `#/medical-records` de xem/cap nhat benh an.
2. Bac si tao phac do o `#/treatment-plan-create`.
3. Luu nhap: tao/cap nhat `PhacDoDieuTri.TrangThai = BAN_NHAP`.
4. Gui duyet: tao/cap nhat `ChiTietPhacDoDieuTri.TrangThai = CHO_PHE_DUYET`.
5. Quan ly duyet o `#/treatment-approval`: set chi tiet sang `DANG_AP_DUNG` hoac `TU_CHOI`.
6. Bac si ghi `#/treatment-diary`, tham chieu `MaChiTietPhacDo` dang ap dung.
7. Bac si tao `#/stage-proposal` khi can chuyen giai doan, ghi vao `HoSoDeXuat`.
8. Bac si tao `#/completion-proposal` khi hoc vien du dieu kien hoan thanh/ra trai, ghi vao `HoSoDeXuat` loai `RA_TRAI`.
9. Manager/Leader duyet de xuat tuy theo luong man hinh hien co.

Can chinh UI `treatment-plan-create` truoc khi goi API:
- Khong nen de "giai doan nho" tu do vi DB unique `(MaPhacDoDT, MaGiaiDoan)`.
- Field nen map DB:
  - `MaGiaiDoan`: select tu `DanhMucGiaiDoan`.
  - `ThuTu`.
  - `NoiDungPhacDoDT`.
  - `MucTieu`.
  - `NgayBatDau`.
  - `NgayKetThucDuKien`.
- Neu muon nhieu buoc nho trong 1 giai doan, DB can them bang con moi. Neu khong them DB, moi giai doan chi nen co 1 chi tiet.

API backend con thieu cho bac si tao phac do:
- `GET /api/v1/doctor/treatment-plan-create/patients`
- `POST /api/v1/doctor/treatment-plans/draft`
- `POST /api/v1/doctor/treatment-plans/submit`

Backend da co API duyet phac do:
- `GET /api/v1/treatment-plans`
- `GET /api/v1/treatment-plans/{id}`
- `PUT /api/v1/treatment-plans/{id}/approve`
- `PUT /api/v1/treatment-plans/{id}/reject`

### 4.3. Luong tham gap

DB lien quan:
- `PhieuThamGap`
- `NguoiDiCung`

Luong:
1. Family dang ky tham gap o `#/visit-register`.
2. Staff duyet/từ choi o `#/visits`.
3. Staff xac nhan check-in o `#/visit-checkin`.
4. Family xem lich su o `#/visit-history`.

Trang thai nen dung thong nhat:
- `CHO_DUYET`
- `DA_DONG_Y`
- `TU_CHOI`
- `HOAN_THANH`
- `DA_HUY`

### 4.4. Luong ho tro/thong bao

DB lien quan:
- `PhieuHoTro`
- `ThongBao`

Luong:
1. Family gui yeu cau ho tro o `#/support`.
2. Staff phan hoi o `#/support-response` hoac `#/support-management`.
3. Common notification hien thong bao theo user/role.

## 5. Kinh Nghiem Thiet Ke Giao Dien

Nguyen tac chung:
- Luon lam man dung nghiep vu, khong lam landing page.
- Dashboard co the dep/3D/dong, nhung man nghiep vu phai ro rang, de thao tac, khong qua mau me.
- Khong lap card trong card. Section lon nen la layout/band, card chi dung cho item, modal, stat.
- Dung icon Font Awesome/lucide neu project da co, button icon phai co `title`.
- Tieng Viet phai co dau, khong de text kieu "Nhap ghi chu", "ma tuy da".
- Bang nghiep vu phai co empty state, loading state, error state.
- Moi modal phai dong duoc bang nut X, nut Huy/Dong, va click overlay neu pattern hien tai co.
- Search/filter phai cap nhat bang ngay, khong reload trang.
- Action icon nen dong bo style: hover, shadow nhe, mau theo y nghia.
- Giao dien mobile: toolbar xuong dong, bang co wrapper scroll, modal gioi han chieu cao.

Man nghiep vu nen co cau truc:
1. Page header: title + subtitle + badge/ngay/he thong.
2. Stat cards: 3-4 card neu man co so lieu.
3. Toolbar: search + filter + nut tao moi neu co.
4. Bang/list: badge trang thai, action icon.
5. Modal chi tiet: chia nhom thong tin.
6. Modal xac nhan: noi dung ro, validation ro, toast sau thao tac.

Mau class/pattern nen bat chuoc:
- Staff intake: `views/staff/intake-confirmation.html`, `js/pages/staff/intake-confirmation.page.js`.
- Staff patient: `views/staff/patient-management.html`, `js/pages/staff/patient-management.page.js`.
- Doctor medical record: `views/doctor/medical-record.html`, `js/pages/doctor/medical-record.page.js`.
- Manager approval: `views/manager/treatment-approval.html`, `js/pages/manager/treatment-approval.page.js`.
- Dashboard advanced: `js/components/advanced-dashboard.js`.

## 6. Prompt Mau Cho AI Khac

### Claude - man kho/UI dep

```text
Lam tiep man [TEN_MAN] theo file dieu phoi `Mo_ta_day_du_giao_dien_con_lai_Rehab_Center.md`.

File can sua:
- [views/...html]
- [js/pages/...page.js]
- neu can: `dashboard.html`, `js/main.js`, `js/components/sidebar.js`

Doc mau style:
- [file mau HTML]
- [file mau JS]

Yeu cau:
- Giu style `dashboard-premium.css`.
- UI phai nhin kho va dep nhung van de thao tac: header, stat cards neu hop ly, toolbar search/filter, bang/list, modal chi tiet, modal xac nhan.
- Dung tieng Viet co dau.
- Mock data API-ready, dat ten field gan DB/API.
- Khong sua layout chung neu khong can.
- Khong tao full HTML doc lap, chi lam partial view.
- Neu can CSS, them prefix rieng theo man.
- Cuoi cung bao cao: file da sua, route/import/menu can them, API can co, va ket qua `node --check`.
```

### Gemini - bang nghiep vu tam trung

```text
Lam man [TEN_MAN] route [#/route].

File:
- [views/...html]
- [js/pages/...page.js]

Yeu cau:
- Bang + modal theo pattern cac man Staff/Manager hien co.
- Co search/filter, badge trang thai, action icon dep.
- Co empty/loading state.
- Mock data API-ready.
- Neu thao tac duyet/tu choi/cap nhat thi co modal xac nhan va validation.
- Them route/import/menu neu con thieu.
- Chay `node --check` file JS.
```

### Kiro - man don gian

```text
Lam man don gian [TEN_MAN].

File:
- [views/...html]
- [js/pages/...page.js]

Yeu cau:
- Xoa placeholder.
- Co header, card/list/bang don gian.
- Tieng Viet co dau.
- Dung class san co trong dashboard.
- Khong sua file chung neu khong can.
```

## 7. Checklist Codex Kiem Sau Khi AI Code

Lenh can chay:
- `node --check drug-rehab-management-fe/js/pages/{role}/{screen}.page.js`
- Neu sua backend: `mvn -DskipTests compile` trong `rehab-center-api`

Can kiem bang mat:
- Route mo qua `dashboard.html#/route`.
- Sidebar bam dung man.
- Khong con placeholder.
- Khong loi font/tieng Viet.
- Search/filter dung.
- Modal mo/dong dung.
- Nut thao tac dep va co hover/title.
- Bang khong tran mobile.
- Mock field dat ten gan DB/API.
- Khong dung bang/cot DB da bo, vi du `HoSoBanGiao`.

## 8. Thu Tu Lam Tiep Khuyen Nghi

1. Chot lai Doctor `treatment-plan-create`: sua field map DB, sau do moi goi API.
2. Lam Doctor `treatment-diary`.
3. Lam Doctor `medicine-schedule`.
4. Lam Doctor `counseling-schedule`.
5. Lam Doctor `stage-proposal` va `completion-proposal`.
6. Lam Police `handover-management` theo DB moi `PhieuBanGiao` / `ChiTietPhieuBanGiao`.
7. Sua Police `handover-create` tieng Viet va field theo DB moi.
8. Lam Staff `visit-checkin`, `create-notification`, `support-response`.
9. Lam Family history/view con thieu.
10. Lam Admin `activity-category` va Common notification/forbidden.

Sau khi UI on, chuyen API theo thu tu:
1. Dashboard da co API tong quan, tiep tuc sua cac count/API theo DB moi neu can.
2. Leader/Staff tiep nhan theo `PhieuBanGiao`.
3. Doctor phac do/nhat ky/lich thuoc.
4. Police ban giao.
5. Family dang ky/tham gap/ho tro.
