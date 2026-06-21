const SupportManagementPage = {
    tickets: [],
    activeTicketId: null,

    async render(containerId) {
        const success = await ViewLoader.load("views/staff/support-management.html", containerId);
        if (success) {
            if (typeof Topbar !== 'undefined') Topbar.setTitle('Quản lý Yêu cầu hỗ trợ');
            this.activeTicketId = null;
            this.loadTickets();
        }
    },

    formatDate(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.toLocaleDateString('vi-VN')}`;
    },

    async loadTickets() {
        try {
            const response = await API.getAllSupportRequests();
            if (response && response.success) {
                this.tickets = response.data;
                if (this.tickets.length > 0 && !this.activeTicketId) {
                    // Try to select the first CHO_PHAN_HOI ticket
                    const firstOpen = this.tickets.find(t => t.status === 'CHO_PHAN_HOI');
                    this.activeTicketId = firstOpen ? firstOpen.id : this.tickets[0].id;
                }
                this.renderTicketList();
                this.renderTicketDetail();
            }
        } catch (error) {
            console.error('Lỗi khi tải yêu cầu hỗ trợ (Staff):', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Không thể tải yêu cầu hỗ trợ', 'error');
        }
    },

    renderTicketList() {
        const listBody = document.getElementById('staff-ticket-list');
        const filterStatus = document.getElementById('filterStatus').value;
        const countBadge = document.getElementById('ticket-count');
        
        if (!listBody) return;

        listBody.innerHTML = '';
        let count = 0;

        // Lọc
        let filteredTickets = this.tickets.filter(t => filterStatus === 'ALL' || t.status === filterStatus);

        // Sort: CHO_PHAN_HOI first, then newest first
        filteredTickets.sort((a, b) => {
            if (a.status === 'CHO_PHAN_HOI' && b.status !== 'CHO_PHAN_HOI') return -1;
            if (a.status !== 'CHO_PHAN_HOI' && b.status === 'CHO_PHAN_HOI') return 1;
            return new Date(b.submittedAt) - new Date(a.submittedAt);
        });

        filteredTickets.forEach(ticket => {
            count++;

            const statusClass = ticket.status === 'CHO_PHAN_HOI' ? 'open' : 'closed';
            const statusLabel = ticket.status === 'CHO_PHAN_HOI' ? 'Chờ phản hồi' : 'Đã phản hồi';
            const isActive = this.activeTicketId === ticket.id ? 'active' : '';

            const div = document.createElement('div');
            div.className = `ticket-item ${isActive}`;
            div.onclick = () => this.selectTicket(ticket.id);
            div.innerHTML = `
                <div class="ticket-title">${ticket.title}</div>
                <div style="font-size: 0.85em; color: var(--text-dark); margin-bottom: 8px;">
                    <i class="fa-solid fa-user"></i> ${ticket.relativeName || 'Khách'}
                </div>
                <div class="ticket-meta">
                    <span>${this.formatDate(ticket.submittedAt)}</span>
                    <span class="ticket-status ${statusClass}">${statusLabel}</span>
                </div>
            `;
            listBody.appendChild(div);
        });

        if (countBadge) countBadge.textContent = count;

        if (count === 0) {
            listBody.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">Không có phiếu yêu cầu nào.</div>';
        }
    },

    selectTicket(id) {
        this.activeTicketId = id;
        this.renderTicketList();
        this.renderTicketDetail();
    },

    renderTicketDetail() {
        const detailCol = document.getElementById('staff-ticket-detail');
        const emptyCol = document.getElementById('staff-ticket-empty');
        if (!detailCol || !emptyCol) return;

        const ticket = this.tickets.find(t => t.id === this.activeTicketId);

        if (!ticket) {
            detailCol.style.display = 'none';
            emptyCol.style.display = 'flex';
            return;
        }

        emptyCol.style.display = 'none';
        detailCol.style.display = 'flex';

        document.getElementById('detail-title').textContent = ticket.title;
        document.getElementById('detail-sender').textContent = ticket.relativeName || 'Khách';
        document.getElementById('detail-date').textContent = this.formatDate(ticket.submittedAt);
        document.getElementById('detail-content').textContent = ticket.requestContent;

        const statusBadge = document.getElementById('detail-status');
        if (ticket.status === 'CHO_PHAN_HOI') {
            statusBadge.className = 'ticket-status open';
            statusBadge.textContent = 'Chờ phản hồi';
            
            document.getElementById('reply-section').style.display = 'none';
            document.getElementById('reply-form-section').style.display = 'flex';
            document.getElementById('reply-input').value = '';
        } else {
            statusBadge.className = 'ticket-status closed';
            statusBadge.textContent = 'Đã phản hồi';
            
            document.getElementById('reply-section').style.display = 'block';
            document.getElementById('reply-form-section').style.display = 'none';
            
            document.getElementById('detail-reply').textContent = ticket.responseContent;
            document.getElementById('detail-replier').textContent = ticket.staffName || 'Nhân viên';
            document.getElementById('detail-reply-date').textContent = this.formatDate(ticket.respondedAt);
        }
    },

    async submitReply() {
        const input = document.getElementById('reply-input');
        if (!input) return;
        const text = input.value.trim();
        
        if (!text) {
            if (typeof Toast !== 'undefined') Toast.show('Vui lòng nhập nội dung phản hồi', 'warning');
            return;
        }

        const ticket = this.tickets.find(t => t.id === this.activeTicketId);
        if (ticket && ticket.status === 'CHO_PHAN_HOI') {
            
            const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
            // Fake staffId for testing if API doesn't throw on missing staff
            const staffId = user && user.staffId ? user.staffId : 'NS00000001'; 

            try {
                const data = {
                    staffId: staffId,
                    responseContent: text
                };

                const response = await API.replyToSupportRequest(ticket.id, data);
                if (response && response.success) {
                    if (typeof window.Toast !== 'undefined') window.Toast.show('Đã gửi phản hồi thành công', 'success');
                    
                    // Reload the list from the server to get updated data
                    this.loadTickets();
                }
            } catch (error) {
                console.error('Lỗi khi phản hồi:', error);
                if (typeof window.Toast !== 'undefined') window.Toast.show('Không thể gửi phản hồi', 'error');
            }
        }
    }
};

window.SupportManagementPage = SupportManagementPage;
