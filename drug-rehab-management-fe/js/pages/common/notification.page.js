const NotificationPage = {
    notifications: [],
    selectedId: null,
    currentFilter: "all",
    searchKeyword: "",
    apiConnected: false,
    loadError: "",

    async render(containerId) {
        const success = await ViewLoader.load("views/common/notification.html", containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== "undefined") {
            Topbar.setTitle("Thông báo hệ thống");
        }

        this.notifications = [];
        this.selectedId = null;
        this.currentFilter = "all";
        this.searchKeyword = "";
        this.loadError = "";

        this.bindEvents();
        this.loadData();
    },

    async loadData() {
        this.setLoadingState();

        try {
            if (typeof Api === "undefined" || typeof Api.getNotifications !== "function") {
                throw new Error("API thông báo chưa được khai báo");
            }

            const data = await Api.getNotifications();
            this.notifications = this.normalizeNotifications(data);
            this.apiConnected = true;
            this.loadError = "";
            this.setApiState("connected", "Đã kết nối API thông báo");
        } catch (error) {
            console.warn("Không tải được thông báo từ API.", error);
            this.notifications = [];
            this.selectedId = null;
            this.apiConnected = false;
            this.loadError = "Không tải được thông báo từ API. Vui lòng kiểm tra đăng nhập hoặc backend.";
            this.setApiState("fallback", "Không tải được API thông báo");
            if (window.Toast) {
                Toast.show(this.loadError, "error");
            }
        }

        if (this.notifications.length > 0) {
            const firstUnread = this.notifications.find((item) => !item.isRead);
            this.selectedId = (firstUnread || this.notifications[0]).id;
        } else {
            this.selectedId = null;
        }

        this.renderAll();
    },

    normalizeNotifications(data) {
        const items = Array.isArray(data) ? data : [];
        return items.map((item, index) => ({
            id: String(item.id || item.maThongBao || `NOTI-${index + 1}`),
            type: this.normalizeType(item.type || item.loaiThongBao),
            title: item.title || item.tieuDe || "Thông báo",
            desc: item.desc || item.content || item.noiDung || item.noiDungThongBao || "",
            time: item.time || item.ngayTaoText || item.createdAt || item.ngayTao || "Gần đây",
            isRead: Boolean(item.isRead || item.daDoc || item.status === "DA_DOC" || item.trangThai === "DA_DOC"),
        }));
    },

    normalizeType(type) {
        const value = String(type || "info").trim();
        const map = {
            success: "success",
            warning: "warning",
            info: "info",
            danger: "danger",
            CaNhan: "success",
            NoiBo: "warning",
            TatCa: "info",
            CANH_BAO: "danger",
            HE_THONG: "warning",
            CA_NHAN: "success",
            TAT_CA: "info",
        };
        return map[value] || "info";
    },

    bindEvents() {
        const searchInput = document.getElementById("notificationSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                this.searchKeyword = searchInput.value.trim().toLowerCase();
                this.renderList();
            });
        }

        document.querySelectorAll(".notification-filter").forEach((button) => {
            button.addEventListener("click", () => {
                this.currentFilter = button.dataset.filter || "all";
                document.querySelectorAll(".notification-filter").forEach((item) => item.classList.remove("active"));
                button.classList.add("active");
                this.renderList();
            });
        });

        const listEl = document.getElementById("notificationList");
        if (listEl) {
            listEl.addEventListener("click", (event) => {
                const markButton = event.target.closest("[data-action='mark-read']");
                if (markButton) {
                    event.stopPropagation();
                    this.markAsRead(markButton.dataset.id);
                    return;
                }

                const item = event.target.closest(".notification-item");
                if (item) {
                    this.selectNotification(item.dataset.id, true);
                }
            });
        }

        const btnMarkAll = document.getElementById("btnMarkAllRead");
        if (btnMarkAll) {
            btnMarkAll.addEventListener("click", () => this.markAllAsRead());
        }

        const btnDetailMarkRead = document.getElementById("btnDetailMarkRead");
        if (btnDetailMarkRead) {
            btnDetailMarkRead.addEventListener("click", () => {
                if (this.selectedId) {
                    this.markAsRead(this.selectedId);
                }
            });
        }
    },

    renderAll() {
        this.renderList();
        this.renderDetail();
        this.updateBadge();
    },

    renderList() {
        const listEl = document.getElementById("notificationList");
        const emptyEl = document.getElementById("notificationEmpty");
        if (!listEl || !emptyEl) return;

        const filtered = this.getFilteredNotifications();

        if (filtered.length === 0) {
            listEl.innerHTML = "";
            emptyEl.hidden = false;
            this.renderEmptyState();
            return;
        }

        emptyEl.hidden = true;
        listEl.innerHTML = filtered.map((item) => this.renderNotificationItem(item)).join("");
    },

    renderEmptyState() {
        if (this.loadError) {
            this.setText("notificationEmptyTitle", "Không tải được thông báo");
            this.setText("notificationEmptyText", this.loadError);
            return;
        }

        if (this.notifications.length === 0) {
            this.setText("notificationEmptyTitle", "Chưa có thông báo");
            this.setText("notificationEmptyText", "Cơ sở dữ liệu chưa có thông báo dành cho tài khoản hiện tại.");
            return;
        }

        this.setText("notificationEmptyTitle", "Không có thông báo phù hợp");
        this.setText("notificationEmptyText", "Thử đổi bộ lọc hoặc từ khóa tìm kiếm.");
    },

    renderNotificationItem(item) {
        const tone = this.getTone(item.type);
        const selected = item.id === this.selectedId ? "selected" : "";
        const unread = item.isRead ? "" : "unread";

        return `
            <button class="notification-item ${selected} ${unread}" data-id="${this.escapeAttr(item.id)}" type="button">
                <span class="notification-item-icon notification-tone-${tone.tone}">
                    <i class="fa-solid ${tone.icon}"></i>
                </span>
                <span class="notification-item-main">
                    <span class="notification-item-head">
                        <span class="notification-item-title">${this.escapeHtml(item.title)}</span>
                        <span class="notification-item-time">${this.escapeHtml(item.time)}</span>
                    </span>
                    <span class="notification-item-desc">${this.escapeHtml(item.desc)}</span>
                    <span class="notification-item-foot">
                        <span>${tone.label}</span>
                        <span>${item.isRead ? "Đã đọc" : "Chưa đọc"}</span>
                    </span>
                </span>
                ${item.isRead ? "" : `
                    <span class="notification-unread-dot" title="Chưa đọc"></span>
                    <span class="notification-item-action" data-action="mark-read" data-id="${this.escapeAttr(item.id)}" title="Đánh dấu đã đọc">
                        <i class="fa-solid fa-check"></i>
                    </span>
                `}
            </button>
        `;
    },

    renderDetail() {
        const detailEl = document.getElementById("notificationDetail");
        const emptyEl = document.getElementById("notificationDetailEmpty");
        const item = this.notifications.find((notification) => notification.id === this.selectedId);

        if (!detailEl || !emptyEl) return;

        if (!item) {
            detailEl.hidden = true;
            emptyEl.hidden = false;
            return;
        }

        const tone = this.getTone(item.type);
        detailEl.hidden = false;
        emptyEl.hidden = true;

        const iconEl = document.getElementById("notificationDetailIcon");
        if (iconEl) {
            iconEl.className = `notification-detail-icon notification-tone-${tone.tone}`;
            iconEl.innerHTML = `<i class="fa-solid ${tone.icon}"></i>`;
        }

        const statusEl = document.getElementById("notificationDetailStatus");
        if (statusEl) {
            statusEl.className = item.isRead ? "badge badge-green" : "badge badge-orange";
            statusEl.textContent = item.isRead ? "Đã đọc" : "Chưa đọc";
        }

        this.setText("notificationDetailTitle", item.title);
        this.setText("notificationDetailTime", item.time);
        this.setText("notificationDetailBody", item.desc);
        this.setText("notificationDetailId", item.id);
        this.setText("notificationDetailType", tone.label);

        const btnDetailMarkRead = document.getElementById("btnDetailMarkRead");
        if (btnDetailMarkRead) {
            btnDetailMarkRead.disabled = item.isRead;
            btnDetailMarkRead.innerHTML = item.isRead
                ? '<i class="fa-solid fa-check-double"></i> Đã đọc'
                : '<i class="fa-solid fa-check"></i> Đánh dấu đã đọc';
        }
    },

    getFilteredNotifications() {
        return this.notifications.filter((item) => {
            const matchesFilter = this.currentFilter === "all"
                || (this.currentFilter === "unread" && !item.isRead)
                || (this.currentFilter === "priority" && (item.type === "warning" || item.type === "danger"));

            const haystack = `${item.title} ${item.desc} ${item.id}`.toLowerCase();
            const matchesSearch = !this.searchKeyword || haystack.includes(this.searchKeyword);

            return matchesFilter && matchesSearch;
        });
    },

    selectNotification(id, markReadWhenOpen = false) {
        this.selectedId = id;
        this.renderList();
        this.renderDetail();

        const item = this.notifications.find((notification) => notification.id === id);
        if (markReadWhenOpen && item && !item.isRead) {
            this.markAsRead(id, { silent: true });
        }
    },

    async markAsRead(id, options = {}) {
        const item = this.notifications.find((notification) => notification.id === id);
        if (!item || item.isRead) return;
        const previousReadState = item.isRead;

        try {
            item.isRead = true;
            this.renderAll();

            if (typeof Api === "undefined" || typeof Api.markNotificationAsRead !== "function") {
                throw new Error("API đánh dấu thông báo đã đọc chưa được khai báo");
            }
            await Api.markNotificationAsRead(id);

            if (!options.silent && window.Toast) {
                Toast.show("Đã đánh dấu thông báo là đã đọc.", "success");
            }
        } catch (error) {
            item.isRead = previousReadState;
            this.renderAll();
            console.warn("Không đánh dấu được thông báo qua API.", error);
            if (window.Toast) {
                Toast.show("Chưa thể cập nhật trạng thái thông báo qua API.", "error");
            }
        }
    },

    async markAllAsRead() {
        const unreadCount = this.notifications.filter((item) => !item.isRead).length;
        if (unreadCount === 0) {
            if (window.Toast) Toast.show("Không còn thông báo chưa đọc.", "info");
            return;
        }

        const button = document.getElementById("btnMarkAllRead");
        try {
            if (button) {
                button.disabled = true;
                button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang cập nhật';
            }

            if (typeof Api === "undefined" || typeof Api.markAllNotificationsAsRead !== "function") {
                throw new Error("API đánh dấu tất cả thông báo đã đọc chưa được khai báo");
            }
            await Api.markAllNotificationsAsRead();

            this.notifications.forEach((item) => {
                item.isRead = true;
            });
            this.renderAll();

            if (window.Toast) {
                Toast.show("Đã đánh dấu tất cả thông báo là đã đọc.", "success");
            }
        } catch (error) {
            console.warn("Không đánh dấu tất cả thông báo qua API.", error);
            if (window.Toast) {
                Toast.show("Chưa thể cập nhật tất cả thông báo qua API.", "error");
            }
        } finally {
            if (button) {
                button.disabled = false;
                button.innerHTML = '<i class="fa-solid fa-check-double"></i> Đánh dấu đã đọc';
            }
        }
    },

    updateBadge() {
        const unreadCount = this.notifications.filter((item) => !item.isRead).length;
        const badge = document.getElementById("unreadCountBadge");
        if (badge) {
            badge.textContent = unreadCount;
        }

        if (typeof Topbar !== "undefined" && typeof Topbar.updateNotificationCount === "function") {
            Topbar.updateNotificationCount(unreadCount);
        }
    },

    setLoadingState() {
        const listEl = document.getElementById("notificationList");
        const emptyEl = document.getElementById("notificationEmpty");
        if (emptyEl) emptyEl.hidden = true;
        if (listEl) {
            listEl.innerHTML = `
                <div class="notification-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Đang tải thông báo...
                </div>
            `;
        }
    },

    setApiState(state, text) {
        const el = document.getElementById("notificationApiState");
        if (!el) return;

        el.className = `notification-api-state ${state}`;
        el.innerHTML = `<span class="notification-state-dot"></span>${this.escapeHtml(text)}`;
    },

    getTone(type) {
        const map = {
            success: { tone: "success", icon: "fa-circle-check", label: "Cá nhân" },
            warning: { tone: "warning", icon: "fa-triangle-exclamation", label: "Nội bộ" },
            danger: { tone: "danger", icon: "fa-shield-halved", label: "Cảnh báo" },
            info: { tone: "info", icon: "fa-circle-info", label: "Thông tin" },
        };
        return map[type] || map.info;
    },

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value ?? "";
        }
    },

    escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    escapeAttr(value) {
        return this.escapeHtml(value);
    },
};

window.NotificationPage = NotificationPage;
