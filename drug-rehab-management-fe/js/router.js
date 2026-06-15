const Router = {
    routes: {},
    currentRoute: null,
    
    init() {
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
                e.preventDefault();
                const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
                const url = link.getAttribute('href');
                this.navigate(url);
            }
        });

        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.hash.slice(1) || '/');
        });

        this.handleRoute(window.location.hash.slice(1) || '/');
    },

    addRoute(path, renderFunction) {
        this.routes[path] = renderFunction;
    },

    navigate(path) {
        window.history.pushState(null, null, `#${path}`);
        this.handleRoute(path);
        
        // Update sidebar active state
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
            el.classList.remove('active');
            if(el.getAttribute('href') === path) el.classList.add('active');
        });
    },

    handleRoute(path) {
        this.currentRoute = path;
        const mainContent = document.getElementById('main-content');
        
        if (this.routes[path]) {
            mainContent.innerHTML = '';
            this.routes[path](mainContent);
        } else {
            mainContent.innerHTML = `
                <div class="card mt-2">
                    <div class="card-body text-center">
                        <h2 class="text-primary mt-3 mb-2" style="font-size: 3rem;"><i class="fa-solid fa-person-digging"></i></h2>
                        <h3>Tính năng đang phát triển</h3>
                        <p class="text-muted mt-1">Chức năng cho đường dẫn "${path}" sẽ được cập nhật sau.</p>
                    </div>
                </div>
            `;
        }
    }
};
