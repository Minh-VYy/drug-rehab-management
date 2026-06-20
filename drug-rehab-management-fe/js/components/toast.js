const Toast = {
    show(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'danger' ? 'fa-circle-xmark' : 
                     type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info';

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${icon} toast-icon"></i>
            <span class="toast-msg" style="color: #fff; font-weight: 500;">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};
