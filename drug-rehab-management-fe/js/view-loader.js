const ViewLoader = {
    async load(path, containerId = 'main-content') {
        try {
            const container = document.getElementById(containerId);
            if (!container) return false;
            
            // Show loading state
            container.innerHTML = `
                <div class="loading-state" style="display: flex; justify-content: center; align-items: center; height: 100%; min-height: 400px;">
                    <div style="text-align: center;">
                        <i class="fa-solid fa-circle-notch fa-spin fa-2x text-primary" style="margin-bottom: 1rem;"></i>
                        <div>Đang tải giao diện...</div>
                    </div>
                </div>
            `;
            
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }
            
            const html = await response.text();
            container.innerHTML = html;
            return true;
        } catch (error) {
            console.error("Error loading view:", error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="card module-no-access">
                        <div class="card-body" style="text-align: center; padding: 3rem;">
                            <p class="text-danger" style="font-size:2.5rem; margin:0 0 16px;"><i class="fa-solid fa-triangle-exclamation"></i></p>
                            <h3 style="margin-bottom: 8px;">Lỗi tải giao diện</h3>
                            <p class="text-muted" style="margin-bottom: 24px;">Không thể tải dữ liệu từ <code>${path}</code>. Vui lòng kiểm tra lại đường dẫn hoặc kết nối mạng.</p>
                            <button class="btn btn-primary" onclick="window.location.reload()">
                                <i class="fa-solid fa-rotate-right"></i> Tải lại trang
                            </button>
                        </div>
                    </div>
                `;
            }
            return false;
        }
    }
};

window.ViewLoader = ViewLoader;
