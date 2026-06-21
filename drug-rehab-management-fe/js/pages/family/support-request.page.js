const SupportRequestPage = {
    tickets: [],
    activeTicketId: null,

    async render(containerId) {
        const success = await ViewLoader.load('views/family/support-request.html', containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Yêu cầu hỗ trợ');
        this.loadTickets();
    },

    formatDate(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.toLocaleDateString('vi-VN')}`;
    },

    async loadTickets() {
        try {
            // Assume family relativeId = 1 for mock API purposes, or get from Auth
            const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
            const relativeId = user && user.relativeId ? user.relativeId : 1; 

            const response = await API.getSupportRequestsByRelative(relativeId);
            if (response && response.success) {
                this.tickets = response.data;
                if (this.tickets.length > 0 && !this.activeTicketId) {
                    this.activeTicketId = this.tickets[0].id;
                }
                this.renderTicketList();
                this.renderTicketDetail();
            }
        } catch (error) {
            console.error('Lỗi khi tải yêu cầu hỗ trợ:', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Không thể tải yêu cầu hỗ trợ', 'error');
        }
    },

    renderTicketList() {
        const container = document.getElementById('ticket-list-container');
        if (!container) return;

        if (this.tickets.length === 0) {
            container.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">Chưa có yêu cầu nào.</div>`;
            return;
        }

        const html = this.tickets.map(t => {
            const isActive = t.id === this.activeTicketId ? 'active' : '';
            const statusHtml = t.status === 'CHO_PHAN_HOI' 
                ? '<span class="ticket-status open">Chờ phản hồi</span>' 
                : '<span class="ticket-status closed">Đã phản hồi</span>';
            const dateStr = new Date(t.submittedAt).toLocaleDateString('vi-VN');

            return `
                <div class="ticket-item ${isActive}" onclick="SupportRequestPage.selectTicket('${t.id}')">
                    <div class="ticket-title">${t.title}</div>
                    <div class="ticket-meta">
                        <span>${dateStr}</span>
                        ${statusHtml}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    },

    selectTicket(id) {
        this.activeTicketId = id;
        this.renderTicketList();
        this.renderTicketDetail();
    },

    renderTicketDetail() {
        const container = document.getElementById('ticket-detail-container');
        if (!container) return;

        const ticket = this.tickets.find(t => t.id === this.activeTicketId);

        if (!ticket) {
            container.innerHTML = `
                <div style="flex:1; display:flex; align-items:center; justify-content:center; flex-direction:column; color:var(--text-muted);">
                    <i class="fa-solid fa-headset" style="font-size:48px; opacity:0.2; margin-bottom:16px;"></i>
                    <p>Chọn một yêu cầu để xem chi tiết</p>
                </div>`;
            return;
        }

        let msgsHtml = `
            <div class="chat-message me">
                <div class="chat-bubble">
                    ${ticket.requestContent}
                    <div class="chat-time">${this.formatDate(ticket.submittedAt)}</div>
                </div>
            </div>
        `;

        if (ticket.status === 'DA_PHAN_HOI' && ticket.responseContent) {
            msgsHtml += `
                <div class="chat-message center">
                    <div class="chat-avatar"><i class="fa-solid fa-user-shield"></i></div>
                    <div class="chat-bubble">
                        <div style="font-weight:bold; margin-bottom:4px; font-size:0.85em; color:var(--primary);">${ticket.staffName || 'Trung tâm'}</div>
                        ${ticket.responseContent}
                        <div class="chat-time" style="text-align:left;">${this.formatDate(ticket.respondedAt)}</div>
                    </div>
                </div>
            `;
        }

        const inputHtml = `
            <div class="ticket-detail-footer" style="justify-content:center; color:var(--text-muted); background:rgba(0,0,0,0.02);">
                <i class="fa-solid fa-info-circle" style="margin-right:8px;"></i> ${ticket.status === 'CHO_PHAN_HOI' ? 'Đang chờ trung tâm phản hồi...' : 'Yêu cầu này đã được trả lời.'}
            </div>
        `;

        container.innerHTML = `
            <div class="ticket-detail-header">
                <h3>${ticket.title}</h3>
                <span style="color:var(--text-muted); font-size:0.9em;">Mã: ${ticket.id}</span>
            </div>
            <div class="ticket-detail-body" id="chat-body">
                ${msgsHtml}
            </div>
            ${inputHtml}
        `;

        // Scroll to bottom
        const body = document.getElementById('chat-body');
        if (body) body.scrollTop = body.scrollHeight;
    },

    openNewTicketModal() {
        document.getElementById('new-ticket-title').value = '';
        document.getElementById('new-ticket-content').value = '';
        if (typeof Modal !== 'undefined') Modal.open('newTicketModal');
    },

    async submitNewTicket() {
        const title = document.getElementById('new-ticket-title').value.trim();
        const content = document.getElementById('new-ticket-content').value.trim();

        if (!title || !content) {
            if (typeof window.Toast !== 'undefined') window.Toast.show('Vui lòng nhập đủ thông tin', 'warning');
            return;
        }

        const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
        const relativeId = user && user.relativeId ? user.relativeId : 1;

        try {
            const data = {
                relativeId: relativeId,
                title: title,
                requestContent: content
            };

            const response = await API.createSupportRequest(data);
            if (response && response.success) {
                if (typeof window.Toast !== 'undefined') window.Toast.show('Đã gửi yêu cầu thành công', 'success');
                if (typeof Modal !== 'undefined') Modal.close('newTicketModal');
                
                // Set the active ticket to the newly created one
                this.activeTicketId = response.data.id;
                this.loadTickets(); // Reload from server
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Không thể gửi yêu cầu', 'error');
        }
    }
};

window.SupportRequestPage = SupportRequestPage;