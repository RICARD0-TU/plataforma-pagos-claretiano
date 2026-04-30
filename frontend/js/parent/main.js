// ============================================
// MAIN - CONTROLADOR PRINCIPAL PARENT
// ============================================

// Función de formateo global
window.cargarDeudasPendientes = cargarDeudasPendientes;
window.formatearMoneda = function (monto) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(monto || 0);
};

window.formatearFecha = function (fecha) {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-PE');
};

// Función global de loading
window.mostrarLoading = function () {
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
        contentArea.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Cargando información...</p>
            </div>
        `;
    }
};

window.mostrarError = function (mensaje) {
    // Crear toast de error
    const toast = document.createElement('div');
    toast.className = 'toast-error';
    toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensaje}`;
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #ef4444; color: white; padding: 12px 20px; border-radius: 12px; z-index: 9999;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

let currentPage = 'dashboard';

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-menu .nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (!page) return;

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            currentPage = page;
            const pageTitle = item.querySelector('span').textContent;
            const titleElement = document.getElementById('pageTitle');
            const subtitleElement = document.getElementById('pageSubtitle');

            titleElement.textContent = pageTitle;

            const subtitles = {
                dashboard: 'Bienvenido de vuelta',
                estudiantes: 'Gestiona la información de tus hijos',
                deudas: 'Consulta y gestiona las deudas pendientes',
                pagos: 'Realiza pagos de manera rápida y segura',
                reportes: 'Visualiza reportes detallados',
                notificaciones: 'Mantente informado de todo'
            };

            if (subtitleElement) {
                subtitleElement.textContent = subtitles[page] || 'Gestión de pagos escolares';
            }

            // Llamar a la función correspondiente
            switch (page) {
                case 'dashboard':
                    window.cargarDashboard();
                    break;
                case 'estudiantes':
                    if (typeof cargarEstudiantes === 'function') cargarEstudiantes();
                    else console.error('cargarEstudiantes no está definida');
                    break;
                case 'deudas':
                    if (typeof cargarDeudasPendientes === 'function') cargarDeudasPendientes();
                    else console.error('cargarDeudasPendientes no está definida');
                    break;
                case 'pagos':
                    if (typeof cargarDeudasPendientes === 'function') cargarDeudasPendientes();
                    else console.error('cargarDeudasPendientes no está definida');
                    break;
                case 'reportes':
                    if (typeof cargarEstudiantes === 'function') cargarEstudiantes();
                    else console.error('cargarEstudiantes no está definida');
                    break;
                case 'notificaciones':
                    if (typeof cargarNotificaciones === 'function') cargarNotificaciones();
                    else console.error('cargarNotificaciones no está definida');
                    break;
            }
        });
    });
}

window.cargarDashboard = async function () {
    if (typeof window.mostrarLoading === 'function') window.mostrarLoading();
    else mostrarLoading();

    try {
        const session = obtenerSesion();
        const usuarioId = session?.id;

        if (!usuarioId) {
            if (typeof window.mostrarError === 'function') window.mostrarError('Sesión no válida');
            else mostrarError('Sesión no válida');
            return;
        }

        // Verificar que las funciones existan
        if (typeof api === 'undefined') {
            console.error('API no cargada');
            return;
        }

        const estudiantes = await api.getEstudiantesByUsuario(usuarioId);
        const todasDeudas = await api.getDeudasPendientes();
        const estudianteIds = estudiantes.map(e => e.id);
        const deudasPendientes = todasDeudas.filter(d => estudianteIds.includes(d.estudiante?.id));
        const notificaciones = await api.getNotificacionesNoLeidas(usuarioId);

        let totalDeuda = 0;
        for (const est of estudiantes) {
            const total = await api.getDeudaTotal(est.id);
            totalDeuda += total?.totalDeuda || 0;
        }

        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="dashboard-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue"><i class="fas fa-user-graduate"></i></div>
                        <div class="stat-value">${estudiantes.length}</div>
                        <div class="stat-label">Hijos registrados</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon red"><i class="fas fa-file-invoice-dollar"></i></div>
                        <div class="stat-value">${window.formatearMoneda(totalDeuda)}</div>
                        <div class="stat-label">Deuda total</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon orange"><i class="fas fa-clock"></i></div>
                        <div class="stat-value">${deudasPendientes.length}</div>
                        <div class="stat-label">Deudas pendientes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green"><i class="fas fa-bell"></i></div>
                        <div class="stat-value">${notificaciones.length}</div>
                        <div class="stat-label">Notificaciones nuevas</div>
                    </div>
                </div>
                
                <div class="table-container" style="margin-top: 32px;">
                    <div class="table-header">
                        <h3><i class="fas fa-bolt"></i> Acciones rápidas</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; padding: 24px;">
                        <button class="btn-primary" onclick="window.cambiarPagina('deudas')" style="justify-content: center;">
                            <i class="fas fa-credit-card"></i> Realizar Pago
                        </button>
                        <button class="btn-outline" onclick="window.cambiarPagina('notificaciones')" style="justify-content: center;">
                            <i class="fas fa-bell"></i> Ver Notificaciones
                        </button>
                        <button class="btn-outline" onclick="window.cambiarPagina('estudiantes')" style="justify-content: center;">
                            <i class="fas fa-users"></i> Ver Mis Hijos
                        </button>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        if (typeof window.mostrarError === 'function') window.mostrarError('No se pudo cargar el dashboard');
        else mostrarError('No se pudo cargar el dashboard');
    }
};

window.cambiarPagina = function (page) {
    const navItem = document.querySelector(`.nav-menu .nav-item[data-page="${page}"]`);
    if (navItem) {
        navItem.click();
    }
};

window.cargarDatosIniciales = function () {
    window.cargarDashboard();
    window.actualizarContadorNotificaciones();
};

window.actualizarContadorNotificaciones = async function () {
    try {
        const session = obtenerSesion();
        if (session?.id && typeof api !== 'undefined') {
            const notificaciones = await api.getNotificacionesNoLeidas(session.id);
            const badge = document.getElementById('notifCount');
            if (badge) {
                const count = notificaciones.length;
                badge.textContent = count;
                badge.style.display = count > 0 ? 'inline-block' : 'none';
            }
        }
    } catch (error) {
        console.error('Error actualizando contador:', error);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando...');

    // Configurar nombre de usuario
    const session = obtenerSesion();
    const userNameSpan = document.getElementById('userName');
    if (session && userNameSpan) {
        userNameSpan.textContent = session.nombre;
    }

    initNavigation();
    window.cargarDatosIniciales();
});