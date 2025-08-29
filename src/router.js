// Router class voor client-side navigatie
export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        
        // Luister naar browser navigatie events
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });
        
        // Onderschep alle link en button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                this.navigeren(e.target.getAttribute('data-route'));
            }
        });
    }
    
    // Registreer een route met handler
    route(path, handler) {
        this.routes.set(path, handler);
        return this;
    }
    
    // Navigeer naar een route
    navigeren(path) {
        // Update browser URL zonder page reload
        window.history.pushState({}, '', path);
        this.handleRoute(path);
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
        const currentPath = window.location.pathname || '/';
        this.handleRoute(currentPath);
    }
}