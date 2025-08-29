// Router class voor client-side navigatie
export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        
        // Detect if we're on GitHub Pages (or use hash routing)
        this.useHashRouting = window.location.hostname.includes('github.io');
        
        if (this.useHashRouting) {
            // Hash-based routing for GitHub Pages
            window.addEventListener('hashchange', () => {
                this.handleRoute(this.getHashPath());
            });
        } else {
            // History API routing for local development
            window.addEventListener('popstate', () => {
                this.handleRoute(window.location.pathname);
            });
        }
        
        // Onderschep alle link en button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                this.navigeren(e.target.getAttribute('data-route'));
            }
        });
    }
    
    // Get path from hash or pathname
    getHashPath() {
        return window.location.hash.slice(1) || '/';
    }
    
    // Registreer een route met handler
    route(path, handler) {
        this.routes.set(path, handler);
        return this;
    }
    
    // Navigeer naar een route
    navigeren(path) {
        if (this.useHashRouting) {
            // Hash-based navigation for GitHub Pages
            window.location.hash = path;
        } else {
            // History API navigation for local development
            window.history.pushState({}, '', path);
            this.handleRoute(path);
        }
    }
    
    // Verwerk route change
    handleRoute(path) {
        this.currentRoute = path;
        
        // Zoek matching route
        let handler = this.routes.get(path);
        
        // Fallback voor dynamic routes (raadsel/1, raadsel/2, etc.)
        if (!handler && path.startsWith('/raadsel/')) {
            const riddleId = path.split('/')[2];
            handler = this.routes.get('/raadsel/:id');
            if (handler) {
                handler(riddleId);
                return;
            }
        }
        
        // Fallback naar home als route niet gevonden
        if (!handler) {
            handler = this.routes.get('/') || (() => {
                console.error(`Route niet gevonden: ${path}`);
            });
        }
        
        // Voer route handler uit
        if (typeof handler === 'function') {
            handler();
        }
    }
    
    // Start de router
    start() {
        // Handle initial route
        let currentPath;
        if (this.useHashRouting) {
            currentPath = this.getHashPath();
        } else {
            currentPath = window.location.pathname || '/';
        }
        this.handleRoute(currentPath);
    }
}