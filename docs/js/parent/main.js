window.cargarDeudasPendientes = cargarDeudasPendientes;
window.formatearMoneda = function (monto) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(monto || 0);
};

window.formatearFecha = function (fecha) {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-PE');
};

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
    const toast = document.createElement('div');
    toast.className = 'toast-error';
    toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensaje}`;
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #ef4444; color: white; padding: 12px 20px; border-radius: 12px; z-index: 9999; box-shadow: 0 10px 25px rgba(0,0,0,0.2);';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

window.mostrarToast = function (mensaje, tipo) {
    const toast = document.createElement('div');
    toast.className = `toast-${tipo}`;
    toast.innerHTML = `<i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${mensaje}`;
    toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; padding: 12px 24px; border-radius: 12px; z-index: 9999; animation: fadeIn 0.3s; ${tipo === 'success' ? 'background: #10b981;' : 'background: #ef4444;'} color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.2);`;
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
                historial: 'Consulta el historial completo de tus pagos',
                reportes: 'Visualiza reportes detallados',
                notificaciones: 'Mantente informado de todo'
            };

            if (subtitleElement) {
                subtitleElement.textContent = subtitles[page] || 'Gestión de pagos escolares';
            }

            switch (page) {
                case 'dashboard':
                    window.cargarDashboard();
                    break;
                case 'estudiantes':
                    if (typeof cargarEstudiantes === 'function') cargarEstudiantes();
                    break;
                case 'deudas':
                    if (typeof cargarDeudasPendientes === 'function') cargarDeudasPendientes();
                    break;
                case 'historial':
                    if (typeof cargarHistorial === 'function') cargarHistorial();
                    break;
                case 'reportes':
                    if (typeof cargarEstudiantes === 'function') cargarEstudiantes();
                    break;
                case 'notificaciones':
                    if (typeof cargarNotificaciones === 'function') cargarNotificaciones();
                    break;
            }
        });
    });
}

window.cargarDashboard = async function () {
    if (typeof window.mostrarLoading === 'function') window.mostrarLoading();

    try {
        const session = obtenerSesion();
        const usuarioId = session?.id;

        if (!usuarioId) {
            window.mostrarError('Sesión no válida');
            return;
        }

        const estudiantes = await api.getEstudiantesByUsuario(usuarioId);
        const estudianteIds = estudiantes.map(e => e.id);
        const todasDeudas = await api.getDeudas();
        const deudasPendientes = todasDeudas.filter(d => estudianteIds.includes(d.estudiante?.id) && d.saldoPendiente > 0);
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
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding: 24px;">
                        <button class="btn-primary" onclick="window.cambiarPagina('deudas')" style="justify-content: center;">
                            <i class="fas fa-credit-card"></i> Realizar Pago
                        </button>
                        <button class="btn-outline" onclick="window.cambiarPagina('historial')" style="justify-content: center;">
                            <i class="fas fa-history"></i> Ver Historial
                        </button>
                        <button class="btn-outline" onclick="window.cambiarPagina('notificaciones')" style="justify-content: center;">
                            <i class="fas fa-bell"></i> Notificaciones
                        </button>
                        <button class="btn-outline" onclick="window.cambiarPagina('estudiantes')" style="justify-content: center;">
                            <i class="fas fa-users"></i> Mis Hijos
                        </button>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        window.mostrarError('No se pudo cargar el dashboard');
    }
};

window.cambiarPagina = function (page) {
    const navItem = document.querySelector(`.nav-menu .nav-item[data-page="${page}"]`);
    if (navItem) navItem.click();
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

document.addEventListener('DOMContentLoaded', () => {
    const session = obtenerSesion();
    const userNameSpan = document.getElementById('userName');
    if (session && userNameSpan) {
        userNameSpan.textContent = session.nombre;
    }

    initNavigation();
    window.cargarDatosIniciales();
});
