const NotificationPage = {
    notifications: [],
    currentFilter: 'all', // 'all' or 'unread'

    async render(containerId) {
        const success = await ViewLoader.load('views/common/notification.html', containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Thông báo hệ thống');
        }

        this.loadData();
        this.bindEvents();
    },

    async loadData() {
        try {
            const listEl = document.getElementById('notificationList');
            if (listEl) {
                listEl.innerHTML = '<div style="text-align:center; padding: 2rem; color: #64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải thông báo...</div>';
            }

            if (typeof Api !== 'undefined' && Api.getNotifications) {
                const data = await Api.getNotifications();
                this.notifications = Array.isArray(data) ? data : [];
            } else {
                throw new Error('API getNotifications not defined');
            }
        } catch (error) {
            console.warn('Failed to fetch notifications from API, using mock data.', error);
            // Mock data fallback
            this.notifications = [
                {
                    id: 'NOTI001',
                    type: 'success',
                    title: 'Hồ sơ đã được phê duyệt',
                    desc: 'Đề xuất phác đồ điều trị cho bệnh nhân NCN001 đã được duyệt thành công.',
                    time: '10 phút trước',
                    isRead: false
                },
                {
                    id: 'NOTI002',
                    type: 'warning',
                    title: 'Nhắc nhở cập nhật bệnh án',
                    desc: 'Đã quá hạn cập nhật nhật ký điều trị 2 ngày cho bệnh nhân NCN005.',
                    time: '2 giờ trước',
                    isRead: false
                },
                {
                    id: 'NOTI003',
                    type: 'info',
                    title: 'Lịch sinh hoạt thay đổi',
                    desc: 'Lịch lao động ngoài trời chiều nay chuyển sang học tập tại hội trường do thời tiết xấu.',
                    time: 'Hôm qua',
                    isRead: true
                },
                {
                    id: 'NOTI004',
                    type: 'danger',
                    title: 'Cảnh báo hệ thống',
                    desc: 'Có dấu hiệu đăng nhập bất thường từ thiết bị lạ vào tài khoản của bạn.',
                    time: '2 ngày trước',
                    isRead: true
                }
            ];
        }

        this.renderList();
        this.updateBadge();
    },

    getIconClass(type) {
        const map = {
            'success': { cls: 'noti-success', icon: 'fa-check' },
            'warning': { cls: 'noti-warning', icon: 'fa-exclamation' },
            'info': { cls: 'noti-info', icon: 'fa-info' },
            'danger': { cls: 'noti-danger', icon: 'fa-xmark' }
        };
        return map[type] || map['info'];
    },

    renderList() {
        const listEl = document.getElementById('notificationList');
        const emptyEl = document.getElementById('notificationEmpty');
        if (!listEl || !emptyEl) return;

        const filtered = this.notifications.filter(n => this.currentFilter === 'all' || !n.isRead);

        if (filtered.length === 0) {
            listEl.style.display = 'none';
            emptyEl.style.display = 'block';
            return;
        }

        emptyEl.style.display = 'none';
        listEl.style.display = 'flex';

        listEl.innerHTML = filtered.map(n => {
            const iconData = this.getIconClass(n.type);
            return `
                <div class="notification-item ${n.isRead ? '' : 'unread'}" data-id="${n.id}">
                    <div class="notification-icon ${iconData.cls}">
                        <i class="fa-solid ${iconData.icon}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${n.title}</div>
                        <div class="notification-desc">${n.desc}</div>
                        <div class="notification-time"><i class="fa-regular fa-clock"></i> ${n.time}</div>
                    </div>
                    ${!n.isRead ? `
                    <div class="notification-action">
                        <button class="btn btn-sm btn-outline btn-mark-read" data-id="${n.id}" title="Đánh dấu đã đọc">
                            <i class="fa-solid fa-check"></i> Đã đọc
                        </button>
                    </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    updateBadge() {
        const unreadCount = this.notifications.filter(n => !n.isRead).length;
        const badge = document.getElementById('unreadCountBadge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
        }

        if (typeof Topbar !== 'undefined' && Topbar.updateNotificationCount) {
            Topbar.updateNotificationCount(unreadCount);
        }
    },

    bindEvents() {
        const btnAll = document.getElementById('filterAll');
        const btnUnread = document.getElementById('filterUnread');

        if (btnAll && btnUnread) {
            btnAll.addEventListener('click', () => {
                this.currentFilter = 'all';
                btnAll.classList.add('active');
                btnUnread.classList.remove('active');
                this.renderList();
            });

            btnUnread.addEventListener('click', () => {
                this.currentFilter = 'unread';
                btnUnread.classList.add('active');
                btnAll.classList.remove('active');
                this.renderList();
            });
        }

        const btnMarkAll = document.getElementById('btnMarkAllRead');
        if (btnMarkAll) {
            btnMarkAll.addEventListener('click', async () => {
                try {
                    btnMarkAll.disabled = true;
                    if (typeof Api !== 'undefined' && Api.markAllNotificationsAsRead) {
                        await Api.markAllNotificationsAsRead();
                    } else {
                        throw new Error("API not ready");
                    }
                } catch (error) {
                    console.warn("API markAllRead failed, using mock", error);
                } finally {
                    btnMarkAll.disabled = false;
                    this.notifications.forEach(n => n.isRead = true);
                    this.renderList();
                    this.updateBadge();
                    if (window.Toast) Toast.show('Đã đánh dấu đọc tất cả.', 'success');
                }
            });
        }

        const listEl = document.getElementById('notificationList');
        if (listEl) {
            listEl.addEventListener('click', async (e) => {
                const btn = e.target.closest('.btn-mark-read');
                if (!btn) return;

                const id = btn.dataset.id;
                const noti = this.notifications.find(n => n.id === id);
                if (noti) {
                    try {
                        btn.disabled = true;
                        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                        if (typeof Api !== 'undefined' && Api.markNotificationAsRead) {
                            await Api.markNotificationAsRead(id);
                        } else {
                            throw new Error("API not ready");
                        }
                    } catch (error) {
                        console.warn("API markAsRead failed, using mock", error);
                    } finally {
                        noti.isRead = true;
                        this.renderList();
                        this.updateBadge();
                    }
                }
            });
        }
    }
};

window.NotificationPage = NotificationPage;