// Router SPA - Sistema de Navegación
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
    }

    register(name, handler) {
        this.routes[name] = handler;
    }

    navigate(name) {
        if (this.routes[name]) {
            this.currentRoute = name;
            this.routes[name]();
        }
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}

const appRouter = new Router();
