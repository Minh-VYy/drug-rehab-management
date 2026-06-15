const Modal = {
    open(title, contentHtml, actionsHtml = '') {
        const container = document.getElementById('modal-container');
        
        let footerHtml = '';
        if (actionsHtml) {
            footerHtml = `<div class="modal-footer">${actionsHtml}</div>`;
        } else {
            footerHtml = `
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="Modal.close()">Đóng</button>
            </div>`;
        }

        container.innerHTML = `
            <div class="modal-overlay active" id="current-modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        ${contentHtml}
                    </div>
                    ${footerHtml}
                </div>
            </div>
        `;
    },
    
    close() {
        const overlay = document.getElementById('current-modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                document.getElementById('modal-container').innerHTML = '';
            }, 300);
        }
    }
};
