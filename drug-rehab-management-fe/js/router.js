const Router = {
    routes: {},
    currentRoute: null,

    init() {
        // Click intercept for [data-link]
        document.body.addEventListener('click', e => {
            const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
            if (!link) return;
            e.preventDefault();
            const href = link.getAttribute('href') || '/';
            // Strip leading '#' if present
            const path = href.startsWith('#') ? href.slice(1) : href;
            this.navigate(path);
        });

        window.addEventListener('popstate', () => {
            this.handleRoute(this._currentHash());
        });

        this.handleRoute(this._currentHash());
    },

    /** Normalize window.location.hash → path string starting with '/' */
    _currentHash() {
        let hash = window.location.hash || '';
        while (hash.startsWith('#')) hash = hash.slice(1);
        
        // Strip query parameters for routing (e.g. /profile?tab=password -> /profile)
        const qIdx = hash.indexOf('?');
        if (qIdx !== -1) {
            hash = hash.substring(0, qIdx);
        }
        
        if (!hash || hash === '') hash = '/';
        if (!hash.startsWith('/')) hash = '/' + hash;
        return hash;
    },

    addRoute(path, renderFunction) {
        this.routes[path] = renderFunction;
    },

    navigate(path) {
        window.history.pushState(null, null, `#${path}`);
        this.handleRoute(path);
    },

    handleRoute(path) {
        let routePath = path;
        if (!routePath.startsWith('/')) {
            routePath = '/' + routePath;
        }
        
        // Strip query parameters (e.g. /profile?tab=password -> /profile)
        const qIdx = routePath.indexOf('?');
        if (qIdx !== -1) {
            routePath = routePath.substring(0, qIdx);
        }

        this.currentRoute = path;
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        if (this.routes[routePath]) {
            mainContent.innerHTML = '';
            this.routes[routePath](mainContent);
        } else {
            mainContent.innerHTML = `
                <div class="card" style="margin:1rem;">
                    <div class="card-body" style="text-align:center; padding:3rem;">
                        <h2 style="font-size:3rem; margin-bottom:1rem; color:var(--primary-light);">
                            <i class="fa-solid fa-person-digging"></i>
                        </h2>
                        <h3 style="color:var(--text-primary); margin-bottom:8px;">Tính năng đang phát triển</h3>
                        <p style="color:var(--text-muted);">Chức năng cho đường dẫn "<code>${path}</code>" sẽ được cập nhật sau.</p>
                    </div>
                </div>
            `;
        }

        this.updateActiveState(routePath);
    },

    updateActiveState(path) {
        // Target all anchor tags inside sidebar-nav
        document.querySelectorAll('#sidebar-nav .nav-link, #sidebar-nav a[data-link]').forEach(link => {
            const href = link.getAttribute('href') || '';
            const linkPath = href.startsWith('#') ? href.slice(1) : href;
            // Exact match for '/', prefix match for others
            const isActive = linkPath === '/'
                ? path === '/'
                : (path === linkPath || path.startsWith(linkPath + '/'));
            link.classList.toggle('active', isActive);
        });
    }
};
