window.CreateNotificationPage = (function () {
  // ====== ENDPOINTS (API thật theo chuẩn project) ======
  const ENDPOINT_SUBMIT = "/notifications";
  const ENDPOINT_USERS = "/users";
  const ENDPOINT_SENT = "/notifications/sent";

  // ====== HELPER ĐỌC RESPONSE LINH HOẠT ======
  function extractList(res) {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.items)) return res.items;
    return [];
  }

  function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function stripHtml(value) {
    const div = document.createElement("div");
    div.innerHTML = value || "";
    return div.textContent || div.innerText || "";
  }

  function sanitizeRichHtml(value) {
    const template = document.createElement("template");
    template.innerHTML = value || "";
    const allowedTags = new Set(["H1", "H2", "H3", "P", "BR", "STRONG", "B", "EM", "I", "U", "MARK", "UL", "OL", "LI", "BLOCKQUOTE", "SPAN", "FONT", "DIV"]);
    const allowedStyles = new Set(["background-color", "color"]);

    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType !== Node.ELEMENT_NODE) return;

        if (!allowedTags.has(child.tagName)) {
          child.replaceWith(document.createTextNode(child.textContent || ""));
          return;
        }

        Array.from(child.attributes).forEach((attr) => {
          if (child.tagName === "FONT" && attr.name === "color") {
            return;
          }

          if (attr.name !== "style") {
            child.removeAttribute(attr.name);
            return;
          }

          const keptStyles = child
            .getAttribute("style")
            .split(";")
            .map((rule) => rule.trim())
            .filter((rule) => {
              const [name, value] = rule.split(":");
              const cleanValue = (value || "").trim();
              return allowedStyles.has(name?.trim().toLowerCase()) && (/^#[0-9a-fA-F]{3,6}$/.test(cleanValue) || /^rgb\(/.test(cleanValue));
            });

          if (keptStyles.length) {
            child.setAttribute("style", keptStyles.join("; "));
          } else {
            child.removeAttribute("style");
          }
        });

        walk(child);
      });
    };

    walk(template.content);
    template.content.querySelectorAll("font[color]").forEach((font) => {
      const span = document.createElement("span");
      span.style.color = font.getAttribute("color");
      span.innerHTML = font.innerHTML;
      font.replaceWith(span);
    });
    return template.innerHTML.trim();
  }

  function renderRichHtml(value) {
    return sanitizeRichHtml(value || "").replace(/\n/g, "<br/>");
  }

  // ====== MOCK FALLBACK (chỉ dùng khi chưa có API) ======
  const MOCK_USERS = [
    { id: "USR003", hoTen: "BS. Trần Thị Mai", tenDangNhap: "bspt001", vaiTro: "BacSi" },
    { id: "USR004", hoTen: "QL. Phạm Thị Phương", tenDangNhap: "ql.phamthiphuong", vaiTro: "CanBoQuanLy" },
    { id: "USR005", hoTen: "NV. Lê Thị Hồng", tenDangNhap: "nv.lethihong", vaiTro: "CanBoTrungTam" },
    { id: "USR002", hoTen: "LĐ. Nguyễn Văn A", tenDangNhap: "ld.nguyenvana", vaiTro: "LanhDao" },
    { id: "USR006", hoTen: "Thiếu úy Nguyễn Văn Khánh", tenDangNhap: "ca.nguyenvankhanh", vaiTro: "CongAn" },
  ];

  const MOCK_SENT_NOTIFICATIONS = [
    {
      id: "TB001",
      tieuDe: "Thông báo lịch trực cuối tuần",
      noiDung: "Đề nghị các cán bộ trực ca cuối tuần đăng ký trước 17h thứ Sáu.",
      loaiGui: "NoiBo",
      nhomVaiTro: ["CanBoTrungTam"],
      mucDo: "ThongTin",
      thoiGianGui: "20/06/2026 09:00",
      soNguoiNhan: 4,
    },
    {
      id: "TB002",
      tieuDe: "Nhắc kiểm tra kho thuốc định kỳ",
      noiDung: "Yêu cầu bác sĩ phối hợp cán bộ quản lý kiểm tra kho thuốc trước cuối tháng.",
      loaiGui: "NoiBo",
      nhomVaiTro: ["BacSi", "CanBoQuanLy"],
      mucDo: "CanhBao",
      thoiGianGui: "19/06/2026 14:30",
      soNguoiNhan: 3,
    },
  ];

  // ====== STATE ======
  let allUsers = [];
  let sentNotifications = [];
  let usingUserFallback = false;
  let usingSentFallback = false;
  let selectedRecipients = []; // [{id, hoTen, tenDangNhap}]
  let currentSentSearch = "";
  let editingNotificationId = null;
  let savedEditorRange = null;

  // ====== HELPERS HIỂN THỊ ======
  function getTypeLabel(type) {
    const map = { TatCa: "Tất cả", NoiBo: "Nội bộ", CaNhan: "Cá nhân" };
    return map[type] || type;
  }

  function getLevelBadge(level) {
    const map = {
      ThongTin: { label: "Thông tin", cls: "badge-blue" },
      CanhBao: { label: "Cảnh báo", cls: "badge-orange" },
      QuanTrong: { label: "Quan trọng", cls: "badge-red" },
    };
    const item = map[level] || { label: level, cls: "badge-gray" };
    return `<span class="badge ${item.cls}">${escapeHtml(item.label)}</span>`;
  }

  function getRoleLabel(role) {
    const map = {
      BacSi: "Bác sĩ",
      CanBoQuanLy: "Cán bộ quản lý",
      CanBoTrungTam: "Cán bộ trung tâm",
      LanhDao: "Lãnh đạo",
      CongAn: "Công an",
      DOCTOR: "Bác sĩ",
      MANAGER: "Cán bộ quản lý",
      STAFF: "Cán bộ trung tâm",
      LEADER: "Lãnh đạo",
      DIRECTOR: "Lãnh đạo",
      POLICE: "Công an",
      FAMILY: "Người thân",
    };
    return map[role] || role;
  }

  function normalizeUser(user) {
    return {
      id: user.id ?? user.maNguoiDung ?? user.userId,
      hoTen: user.hoTen || user.fullName || user.name || "Người dùng",
      tenDangNhap: user.tenDangNhap || user.username || "",
      vaiTro: user.vaiTro || user.role || "",
    };
  }

  function normalizeSentNotification(item) {
    return {
      id: item.id || item.maThongBao,
      tieuDe: item.tieuDe || item.title || "",
      noiDung: item.noiDung || item.desc || item.content || "",
      loaiGui: item.loaiGui || item.notificationType || item.type || "TatCa",
      nhomVaiTro: item.nhomVaiTro || [],
      mucDo: item.mucDo || "ThongTin",
      thoiGianGui: item.thoiGianGui || item.time || item.createdAt || "",
      soNguoiNhan: item.soNguoiNhan || item.recipientCount || 0,
    };
  }

  function getEditor() {
    return document.getElementById("notiContentEditor");
  }

  function saveEditorSelection() {
    const editor = getEditor();
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      savedEditorRange = range.cloneRange();
    }
  }

  function restoreEditorSelection() {
    const editor = getEditor();
    const selection = window.getSelection();
    if (!editor || !selection) return;

    editor.focus();
    if (savedEditorRange) {
      selection.removeAllRanges();
      selection.addRange(savedEditorRange);
    }
  }

  function applyEditorCommand(command, value) {
    restoreEditorSelection();
    document.execCommand(command, false, value || null);
    saveEditorSelection();
    syncEditorToTextarea();
  }

  function syncEditorToTextarea() {
    const editor = getEditor();
    const textarea = document.getElementById("notiContent");
    if (editor && textarea) {
      textarea.value = sanitizeRichHtml(editor.innerHTML);
    }
  }

  function setEditorContent(value) {
    const html = sanitizeRichHtml(value || "");
    const editor = getEditor();
    const textarea = document.getElementById("notiContent");
    if (editor) editor.innerHTML = html;
    if (textarea) textarea.value = html;
  }

  function setEditMode(notification) {
    editingNotificationId = notification ? notification.id : null;
    const isEditing = Boolean(notification);

    document.getElementById("notiFormTitle").textContent = isEditing ? "Chỉnh sửa thông báo" : "Soạn thông báo mới";
    document.getElementById("notiFormSubtitle").textContent = isEditing
      ? "Cập nhật tiêu đề và nội dung thông báo đã gửi"
      : "Nhập nội dung, định dạng và chọn đối tượng nhận thông báo";
    document.getElementById("notiEditBanner").style.display = isEditing ? "flex" : "none";
    document.getElementById("btnNotiSubmit").innerHTML = isEditing
      ? '<i class="fa-solid fa-floppy-disk"></i> Cập nhật thông báo'
      : '<i class="fa-solid fa-paper-plane"></i> Gửi thông báo';

    document.querySelectorAll('input[name="notiType"], #notiRoleCheckboxes input').forEach((el) => {
      el.disabled = isEditing;
    });
    const recipientSearch = document.getElementById("notiRecipientSearch");
    if (recipientSearch) recipientSearch.disabled = isEditing;
  }

  function getCurrentSenderName() {
    try {
      if (window.Auth && Auth.getCurrentUser && Auth.getDisplayName) {
        return Auth.getDisplayName(Auth.getCurrentUser());
      }
    } catch (e) {}
    return "Cán bộ trung tâm";
  }

  function showFallbackNotice(message) {
    if (window.Toast && Toast.show) {
      Toast.show(message, "error");
    }
  }

  // ====== LOAD NGƯỜI NHẬN (API thật trước, fallback mock khi lỗi) ======
  function loadRecipients() {
    return Api.get(ENDPOINT_USERS)
      .then((res) => {
        allUsers = extractList(res).map(normalizeUser).filter((u) => u.id);
        usingUserFallback = false;
      })
      .catch((err) => {
        console.warn("Chưa có API GET /users, dùng mock fallback:", err);
        allUsers = JSON.parse(JSON.stringify(MOCK_USERS));
        usingUserFallback = true;
      });
  }

  // ====== RENDER LỰA CHỌN NGƯỜI NHẬN ======
  function renderRecipientOptions(keyword) {
    const container = document.getElementById("notiRecipientOptions");
    const kw = (keyword || "").trim().toLowerCase();

    const filtered = allUsers.filter((u) => {
      const selected = selectedRecipients.some((r) => r.id === u.id);
      if (selected) return false;
      if (!kw) return true;
      return (
        (u.hoTen || "").toLowerCase().includes(kw) || (u.tenDangNhap || "").toLowerCase().includes(kw)
      );
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="noti-option-empty">Không tìm thấy người dùng phù hợp.</div>`;
      return;
    }

    container.innerHTML = filtered
      .slice(0, 8)
      .map(
        (u) => `
        <div class="noti-recipient-option" data-action="pick-recipient" data-id="${escapeHtml(u.id)}">
          <i class="fa-solid fa-user"></i>
          <div>
            <div class="noti-recipient-name">${escapeHtml(u.hoTen)}</div>
            <div class="noti-recipient-meta">${escapeHtml(u.tenDangNhap)} · ${escapeHtml(getRoleLabel(u.vaiTro))}</div>
          </div>
        </div>
      `
      )
      .join("");
  }

  function renderSelectedRecipients() {
    const container = document.getElementById("notiSelectedRecipients");

    if (selectedRecipients.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = selectedRecipients
      .map(
        (r) => `
        <span class="noti-recipient-chip">
          ${escapeHtml(r.hoTen)}
          <button type="button" data-action="remove-recipient" data-id="${escapeHtml(r.id)}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </span>
      `
      )
      .join("");
  }

  function pickRecipient(userId) {
    const user = allUsers.find((u) => u.id === userId);
    if (!user) return;
    if (selectedRecipients.some((r) => r.id === userId)) return;

    selectedRecipients.push({ id: user.id, hoTen: user.hoTen, tenDangNhap: user.tenDangNhap });
    renderSelectedRecipients();
    renderRecipientOptions(document.getElementById("notiRecipientSearch").value);
  }

  function removeRecipient(userId) {
    selectedRecipients = selectedRecipients.filter((r) => r.id !== userId);
    renderSelectedRecipients();
    renderRecipientOptions(document.getElementById("notiRecipientSearch").value);
  }

  // ====== XỬ LÝ ĐỔI LOẠI GỬI ======
  function handleTypeChange() {
    const type = document.querySelector('input[name="notiType"]:checked').value;

    document.getElementById("notiGroupBlock").style.display = type === "NoiBo" ? "block" : "none";
    document.getElementById("notiPersonalBlock").style.display = type === "CaNhan" ? "block" : "none";

    if (type === "CaNhan" && allUsers.length === 0) {
      loadRecipients().then(() => renderRecipientOptions(""));
    } else if (type === "CaNhan") {
      renderRecipientOptions(document.getElementById("notiRecipientSearch").value);
    }
  }

  function getSelectedRoleGroups() {
    return Array.from(document.querySelectorAll("#notiRoleCheckboxes input:checked")).map(
      (el) => el.value
    );
  }

  // ====== VALIDATE FORM ======
  function clearFormErrors() {
    document.getElementById("errNotiTitle").textContent = "";
    document.getElementById("errNotiContent").textContent = "";
    document.getElementById("errNotiRecipients").textContent = "";
  }

  function validateForm() {
    clearFormErrors();
    let valid = true;

    const title = document.getElementById("notiTitle").value.trim();
    syncEditorToTextarea();
    const content = stripHtml(document.getElementById("notiContent").value).trim();
    const type = document.querySelector('input[name="notiType"]:checked').value;

    if (!title) {
      document.getElementById("errNotiTitle").textContent = "Tiêu đề thông báo không được để trống";
      valid = false;
    }

    if (!content) {
      document.getElementById("errNotiContent").textContent = "Nội dung thông báo không được để trống";
      valid = false;
    }

    if (type === "CaNhan" && selectedRecipients.length === 0) {
      document.getElementById("errNotiRecipients").textContent = "Vui lòng chọn ít nhất một người nhận";
      valid = false;
    }

    return valid;
  }

  function buildPayload() {
    const type = document.querySelector('input[name="notiType"]:checked').value;
    syncEditorToTextarea();

    return {
      tieuDe: document.getElementById("notiTitle").value.trim(),
      noiDung: document.getElementById("notiContent").value.trim(),
      mucDo: document.getElementById("notiLevel").value,
      loaiGui: type,
      nhomVaiTro: type === "NoiBo" ? getSelectedRoleGroups() : [],
      nguoiNhan: type === "CaNhan" ? selectedRecipients.map((r) => r.id) : [],
      nguoiGui: getCurrentSenderName(),
    };
  }

  // ====== PREVIEW ======
  function previewNotification() {
    if (!validateForm()) return;

    const payload = buildPayload();
    const recipientSummary =
      payload.loaiGui === "TatCa"
        ? "Tất cả người dùng trong hệ thống"
        : payload.loaiGui === "NoiBo"
        ? payload.nhomVaiTro.length > 0
          ? payload.nhomVaiTro.map(getRoleLabel).join(", ")
          : "Toàn bộ nhân sự nội bộ"
        : selectedRecipients.map((r) => r.hoTen).join(", ");

    document.getElementById("notiPreviewBody").innerHTML = `
      <div class="noti-preview-card">
        <div class="noti-preview-top">
          ${getLevelBadge(payload.mucDo)}
          <span class="badge badge-gray">${escapeHtml(getTypeLabel(payload.loaiGui))}</span>
        </div>
        <h3 class="noti-preview-title">${escapeHtml(payload.tieuDe)}</h3>
        <div class="noti-preview-content rich-notification-content">${renderRichHtml(payload.noiDung)}</div>
        <div class="noti-preview-meta">
          <div><i class="fa-solid fa-users"></i> Người nhận: ${escapeHtml(recipientSummary)}</div>
          <div><i class="fa-solid fa-user-pen"></i> Người gửi: ${escapeHtml(payload.nguoiGui)}</div>
        </div>
      </div>
    `;

    document.getElementById("notiPreviewModal").classList.add("active");
  }

  function closePreviewModal() {
    document.getElementById("notiPreviewModal").classList.remove("active");
  }

  // ====== SUBMIT ======
  function submitNotification() {
    if (!validateForm()) return;

    const payload = buildPayload();
    const submitBtn = document.getElementById("btnNotiSubmit");
    const previewSendBtn = document.getElementById("notiPreviewSendBtn");
    const wasEditing = Boolean(editingNotificationId);
    if (submitBtn) submitBtn.disabled = true;
    if (previewSendBtn) previewSendBtn.disabled = true;

    const request = editingNotificationId
      ? Api.put(`${ENDPOINT_SENT}/${encodeURIComponent(editingNotificationId)}`, {
          tieuDe: payload.tieuDe,
          noiDung: payload.noiDung,
          mucDo: payload.mucDo,
        })
      : Api.post(ENDPOINT_SUBMIT, payload);

    request
      .then((res) => {
        const created = normalizeSentNotification((res && (res.data || res)) || payload);
        if (editingNotificationId) {
          sentNotifications = sentNotifications.map((item) =>
            item.id === editingNotificationId ? Object.assign({}, item, created, payload) : item
          );
        } else {
          sentNotifications.unshift(
            Object.assign(
              {
                id: created.id || "TB" + String(sentNotifications.length + 1).padStart(3, "0"),
                tieuDe: payload.tieuDe,
                noiDung: payload.noiDung,
                loaiGui: payload.loaiGui,
                nhomVaiTro: payload.nhomVaiTro,
                mucDo: payload.mucDo,
                thoiGianGui: new Date().toLocaleString("vi-VN"),
                soNguoiNhan:
                  payload.loaiGui === "CaNhan" ? selectedRecipients.length : payload.nhomVaiTro.length || 0,
              },
              created.id ? created : {}
            )
          );
        }

        closePreviewModal();
        resetForm();
        renderSentNotifications();

        if (window.Toast && Toast.show) {
          Toast.show(wasEditing ? "Đã cập nhật thông báo thành công." : "Đã gửi thông báo thành công.", "success");
        }
      })
      .catch((err) => {
        console.error("Lỗi gửi thông báo:", err);
        if (window.Toast && Toast.show) {
          const detail = err?.message ? `: ${err.message}` : "";
          Toast.show(wasEditing ? `Cập nhật thông báo thất bại${detail}` : `Gửi thông báo thất bại${detail}`, "error");
        }
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
        if (previewSendBtn) previewSendBtn.disabled = false;
      });
  }

  // ====== RESET FORM ======
  function resetForm() {
    document.getElementById("notiTitle").value = "";
    setEditorContent("");
    document.getElementById("notiLevel").value = "ThongTin";
    document.querySelector('input[name="notiType"][value="TatCa"]').checked = true;
    document.querySelectorAll("#notiRoleCheckboxes input").forEach((cb) => (cb.checked = false));
    document.getElementById("notiRecipientSearch").value = "";
    selectedRecipients = [];
    renderSelectedRecipients();
    clearFormErrors();
    setEditMode(null);
    handleTypeChange();
  }

  // ====== DANH SÁCH THÔNG BÁO ĐÃ GỬI ======
  function showSentLoading(show) {
    const loadingEl = document.getElementById("sentNotiLoadingState");
    const tbody = document.getElementById("sentNotiTableBody");
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
    if (tbody && show) tbody.innerHTML = "";
  }

  function fetchSentNotifications() {
    showSentLoading(true);

    return Api.get(ENDPOINT_SENT)
      .then((res) => {
        sentNotifications = extractList(res).map(normalizeSentNotification);
        usingSentFallback = false;
      })
      .catch((err) => {
        console.warn("Chưa có API GET /notifications/sent, dùng mock fallback:", err);
        sentNotifications = JSON.parse(JSON.stringify(MOCK_SENT_NOTIFICATIONS));
        usingSentFallback = true;
        showFallbackNotice("Chưa có API lịch sử thông báo, đang hiển thị dữ liệu mẫu để demo giao diện.");
      })
      .finally(() => {
        showSentLoading(false);
        renderStats();
        renderSentNotifications();
      });
  }

  function renderStats() {
    return;
  }

  function getFilteredSent() {
    const kw = currentSentSearch.trim().toLowerCase();
    if (!kw) return sentNotifications;
    return sentNotifications.filter((n) => (n.tieuDe || "").toLowerCase().includes(kw));
  }

  function renderSentNotifications() {
    const tbody = document.getElementById("sentNotiTableBody");
    const emptyState = document.getElementById("sentNotiEmptyState");
    if (!tbody) return;

    const data = getFilteredSent();

    if (data.length === 0) {
      tbody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    tbody.innerHTML = data
      .map(
        (n) => `
        <tr>
          <td>
            <span class="text-link">${escapeHtml(n.tieuDe)}</span>
            <div class="noti-sent-snippet">${escapeHtml(stripHtml(n.noiDung)).slice(0, 80)}</div>
          </td>
          <td>${escapeHtml(getTypeLabel(n.loaiGui))}</td>
          <td>${getLevelBadge(n.mucDo)}</td>
          <td>${escapeHtml(n.thoiGianGui)}</td>
          <td>
            <div class="table-actions">
              <button class="btn-icon" title="Xem chi tiết" data-action="view-sent" data-id="${escapeHtml(n.id)}">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn-icon btn-icon-primary" title="Chỉnh sửa" data-action="edit-sent" data-id="${escapeHtml(n.id)}">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-icon btn-icon-danger" title="Gỡ thông báo" data-action="delete-sent" data-id="${escapeHtml(n.id)}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");
  }

  function openSentDetailModal(id) {
    const n = sentNotifications.find((x) => x.id === id);
    if (!n) return;

    const recipientSummary =
      n.loaiGui === "TatCa"
        ? "Tất cả người dùng"
        : n.loaiGui === "NoiBo"
        ? (n.nhomVaiTro || []).map(getRoleLabel).join(", ") || "Nội bộ"
        : `${n.soNguoiNhan || 0} người nhận cụ thể`;

    document.getElementById("sentNotiDetailBody").innerHTML = `
      <div class="module-detail-grid">
        <div class="module-detail-item module-detail-item-full">
          <div class="module-detail-label">Tiêu đề</div>
          <div class="module-detail-value">${escapeHtml(n.tieuDe)}</div>
        </div>
        <div class="module-detail-item module-detail-item-full">
          <div class="module-detail-label">Nội dung</div>
          <div class="module-detail-value rich-notification-content">${renderRichHtml(n.noiDung)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Loại gửi</div>
          <div class="module-detail-value">${escapeHtml(getTypeLabel(n.loaiGui))}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Mức độ</div>
          <div class="module-detail-value">${getLevelBadge(n.mucDo)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Đối tượng nhận</div>
          <div class="module-detail-value">${escapeHtml(recipientSummary)}</div>
        </div>
        <div class="module-detail-item">
          <div class="module-detail-label">Thời gian gửi</div>
          <div class="module-detail-value">${escapeHtml(n.thoiGianGui)}</div>
        </div>
      </div>
    `;

    document.getElementById("sentNotiDetailModal").classList.add("active");
  }

  function closeSentDetailModal() {
    document.getElementById("sentNotiDetailModal").classList.remove("active");
  }

  function editSentNotification(id) {
    const notification = sentNotifications.find((item) => item.id === id);
    if (!notification) return;

    document.getElementById("notiTitle").value = notification.tieuDe || "";
    document.getElementById("notiLevel").value = notification.mucDo || "ThongTin";
    const typeInput = document.querySelector(`input[name="notiType"][value="${notification.loaiGui || "TatCa"}"]`);
    if (typeInput) typeInput.checked = true;
    handleTypeChange();
    setEditorContent(notification.noiDung || "");
    setEditMode(notification);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteSentNotification(id) {
    const notification = sentNotifications.find((item) => item.id === id);
    if (!notification) return;

    const ok = window.confirm(`Gỡ thông báo "${notification.tieuDe}"? Người nhận sẽ không còn thấy thông báo này.`);
    if (!ok) return;

    try {
      await Api.delete(`${ENDPOINT_SENT}/${encodeURIComponent(id)}`);
      sentNotifications = sentNotifications.filter((item) => item.id !== id);
      renderSentNotifications();
      if (editingNotificationId === id) {
        resetForm();
      }
      if (window.Toast && Toast.show) {
        Toast.show("Đã gỡ thông báo.", "success");
      }
    } catch (error) {
      console.error("Lỗi gỡ thông báo:", error);
      if (window.Toast && Toast.show) {
        Toast.show("Chưa thể gỡ thông báo, vui lòng thử lại.", "error");
      }
    }
  }

  // ====== EVENTS ======
  function bindEvents() {
    document.querySelectorAll('input[name="notiType"]').forEach((radio) => {
      radio.addEventListener("change", handleTypeChange);
    });

    document.getElementById("notiRecipientSearch").addEventListener("input", (e) => {
      renderRecipientOptions(e.target.value);
    });

    document.getElementById("notiRecipientOptions").addEventListener("click", (e) => {
      const item = e.target.closest('[data-action="pick-recipient"]');
      if (!item) return;
      pickRecipient(item.dataset.id);
    });

    document.getElementById("notiSelectedRecipients").addEventListener("click", (e) => {
      const btn = e.target.closest('[data-action="remove-recipient"]');
      if (!btn) return;
      removeRecipient(btn.dataset.id);
    });

    document.getElementById("btnNotiReset").addEventListener("click", resetForm);
    document.getElementById("btnNotiPreview").addEventListener("click", previewNotification);
    document.getElementById("btnNotiSubmit").addEventListener("click", submitNotification);

    const editor = getEditor();
    if (editor) {
      editor.addEventListener("input", syncEditorToTextarea);
      editor.addEventListener("keyup", saveEditorSelection);
      editor.addEventListener("mouseup", saveEditorSelection);
      editor.addEventListener("focus", saveEditorSelection);
    }

    document.querySelectorAll("[data-format]").forEach((button) => {
      button.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });
      button.addEventListener("click", () => {
        const command = button.dataset.format;
        const value = button.dataset.value || null;
        applyEditorCommand(command, value);
      });
    });

    document.getElementById("notiPreviewCloseBtn").addEventListener("click", closePreviewModal);
    document.getElementById("notiPreviewBackBtn").addEventListener("click", closePreviewModal);
    document.getElementById("notiPreviewSendBtn").addEventListener("click", submitNotification);

    document.getElementById("sentNotiSearchInput").addEventListener("input", (e) => {
      currentSentSearch = e.target.value;
      renderSentNotifications();
    });

    document.getElementById("sentNotiTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === "view-sent") openSentDetailModal(btn.dataset.id);
      if (action === "edit-sent") editSentNotification(btn.dataset.id);
      if (action === "delete-sent") deleteSentNotification(btn.dataset.id);
    });

    document.getElementById("sentNotiDetailCloseBtn").addEventListener("click", closeSentDetailModal);
    document.getElementById("sentNotiDetailCloseBtn2").addEventListener("click", closeSentDetailModal);
  }

  // ====== PUBLIC API ======
  function init() {
    bindEvents();
    fetchSentNotifications();
  }

  async function render(containerId) {
    const success = await ViewLoader.load("views/staff/create-notification.html", containerId);
    if (success) this.init();
  }

  return { render, init, bindEvents };
})();
