const NotificationPage = {
    notifications: [],
    selectedId: null,
    currentFilter: "all",
    searchKeyword: "",
    apiConnected: false,

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
            this.setApiState("connected", "Đã kết nối API thông báo");
        } catch (error) {
            console.warn("Không tải được thông báo từ API, dùng dữ liệu mẫu.", error);
            this.notifications = this.getMockNotifications();
            this.apiConnected = false;
            this.setApiState("fallback", "Đang dùng dữ liệu mẫu");
        }

        if (this.notifications.length > 0) {
            const firstUnread = this.notifications.find((item) => !item.isRead);
            this.selectedId = (firstUnread || this.notifications[0]).id;
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

    getMockNotifications() {
        return [
            {
                id: "TB00000001",
                type: "warning",
                title: "Bảo trì hệ thống nội bộ",
                desc: "Hệ thống sẽ tạm ngưng hoạt động từ 23:00 tối nay đến 02:00 sáng mai để nâng cấp. Vui lòng hoàn tất các thao tác đang làm trước thời điểm bảo trì.",
                time: "2 giờ trước",
                isRead: false,
            },
            {
                id: "TB00000002",
                type: "success",
                title: "Hồ sơ của bạn đã được duyệt",
                desc: "Yêu cầu duyệt phác đồ điều trị cho học viên NCN-SEED001 đã được thông qua. Bạn có thể tiếp tục cập nhật nhật ký điều trị theo giai đoạn đang áp dụng.",
                time: "Hôm qua",
                isRead: false,
            },
            {
                id: "TB00000003",
                type: "info",
                title: "Lịch kiểm tra sức khỏe quý II",
                desc: "Tất cả học viên sẽ được khám sức khỏe định kỳ từ ngày 25/06. Cán bộ phụ trách cần kiểm tra lại danh sách học viên trước ngày thực hiện.",
                time: "4 ngày trước",
                isRead: true,
            },
            {
                id: "TB00000004",
                type: "danger",
                title: "Cảnh báo đăng nhập bất thường",
                desc: "Hệ thống ghi nhận một phiên đăng nhập từ thiết bị lạ. Nếu không phải bạn thực hiện, hãy đổi mật khẩu và báo quản trị hệ thống.",
                time: "12/06/2026 08:20",
                isRead: true,
            },
        ];
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
        this.renderStats();
        this.renderList();
        this.renderDetail();
        this.updateBadge();
    },

    renderStats() {
        const total = this.notifications.length;
        const unread = this.notifications.filter((item) => !item.isRead).length;
        const priority = this.notifications.filter((item) => item.type === "warning" || item.type === "danger").length;

        this.setText("notificationTotalStat", total);
        this.setText("notificationUnreadStat", unread);
        this.setText("notificationReadStat", total - unread);
        this.setText("notificationPriorityStat", priority);
    },

    renderList() {
        const listEl = document.getElementById("notificationList");
        const emptyEl = document.getElementById("notificationEmpty");
        if (!listEl || !emptyEl) return;

        const filtered = this.getFilteredNotifications();

        if (filtered.length === 0) {
            listEl.innerHTML = "";
            emptyEl.hidden = false;
            return;
        }

        emptyEl.hidden = true;
        listEl.innerHTML = filtered.map((item) => this.renderNotificationItem(item)).join("");
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
                    <span class="notification-item-title">${this.escapeHtml(item.title)}</span>
                    <span class="notification-item-desc">${this.escapeHtml(item.desc)}</span>
                    <span class="notification-item-foot">
                        <i class="fa-regular fa-clock"></i>
                        ${this.escapeHtml(item.time)}
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

        try {
            if (this.apiConnected && typeof Api !== "undefined" && typeof Api.markNotificationAsRead === "function") {
                await Api.markNotificationAsRead(id);
            }

            item.isRead = true;
            this.renderAll();

            if (!options.silent && window.Toast) {
                Toast.show("Đã đánh dấu thông báo là đã đọc.", "success");
            }
        } catch (error) {
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

            if (this.apiConnected && typeof Api !== "undefined" && typeof Api.markAllNotificationsAsRead === "function") {
                await Api.markAllNotificationsAsRead();
            }

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
