// ============================================
// ADMIN - CONTROLADOR PRINCIPAL
// ============================================

let currentAdminPage = 'dashboard';

function initAdminNavigation() {
    const navItems = document.querySelectorAll('.admin-nav .nav-item');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    const titles = {
        dashboard: { title: 'Dashboard Administrativo', subtitle: 'Panel de control general del sistema' },
        usuarios: { title: 'Gestión de Padres', subtitle: 'Administra los padres de familia registrados' },
        estudiantes: { title: 'Gestión de Estudiantes', subtitle: 'Administra los estudiantes y su asignación' },
        conceptos: { title: 'Conceptos de Pago', subtitle: 'Define los tipos de pago del colegio' },
        deudas: { title: 'Gestión de Deudas', subtitle: 'Registra y monitorea las deudas' },
        reportes: { title: 'Reportes Globales', subtitle: 'Análisis financiero del sistema' }
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (!page) return;

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            currentAdminPage = page;

            pageTitle.textContent = titles[page]?.title || 'Dashboard';
            pageSubtitle.textContent = titles[page]?.subtitle || '';

            switch (page) {
                case 'dashboard': cargarDashboardAdmin(); break;
                case 'usuarios': cargarUsuarios(); break;
                case 'estudiantes': cargarEstudiantesAdmin(); break;
                case 'conceptos': cargarConceptos(); break;
                case 'deudas': cargarDeudasAdmin(); break;
                case 'reportes': cargarReportesGlobales(); break;
            }
        });
    });
}

function cargarPaginaActual() {
    switch (currentAdminPage) {
        case 'dashboard': cargarDashboardAdmin(); break;
        case 'usuarios': cargarUsuarios(); break;
        case 'estudiantes': cargarEstudiantesAdmin(); break;
        case 'conceptos': cargarConceptos(); break;
        case 'deudas': cargarDeudasAdmin(); break;
        case 'reportes': cargarReportesGlobales(); break;
    }
}

async function cargarDashboardAdmin() {
    mostrarLoadingAdmin();
    try {
        const [usuarios, estudiantes, deudasPendientes, pagos] = await Promise.all([
            api.getUsuarios(),
            api.getEstudiantes(),
            api.getDeudasPendientes(),
            api.getPagos()
        ]);

        const totalDeuda = deudasPendientes.reduce((sum, d) => sum + (d.saldoPendiente || 0), 0);
        const totalRecaudado = pagos.reduce((sum, p) => sum + p.montoPagado, 0);

        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card-admin"><div class="stat-info"><div class="stat-label">Padres Registrados</div><div class="stat-value">${usuarios.filter(u => u.rol === 'parent').length}</div></div><div class="stat-icon-admin blue"><i class="fas fa-users"></i></div></div>
                <div class="stat-card-admin"><div class="stat-info"><div class="stat-label">Estudiantes</div><div class="stat-value">${estudiantes.length}</div></div><div class="stat-icon-admin green"><i class="fas fa-user-graduate"></i></div></div>
                <div class="stat-card-admin"><div class="stat-info"><div class="stat-label">Deudas Pendientes</div><div class="stat-value">${deudasPendientes.length}</div></div><div class="stat-icon-admin red"><i class="fas fa-exclamation-triangle"></i></div></div>
                <div class="stat-card-admin"><div class="stat-info"><div class="stat-label">Total Deuda</div><div class="stat-value">${formatearMoneda(totalDeuda)}</div></div><div class="stat-icon-admin orange"><i class="fas fa-chart-line"></i></div></div>
                <div class="stat-card-admin"><div class="stat-info"><div class="stat-label">Total Recaudado</div><div class="stat-value">${formatearMoneda(totalRecaudado)}</div></div><div class="stat-icon-admin purple"><i class="fas fa-dollar-sign"></i></div></div>
            </div>
            <div class="admin-table-container"><div class="admin-table-header"><h3><i class="fas fa-bell"></i> Acciones Rápidas</h3></div><div style="display: flex; gap: 16px; padding: 24px; flex-wrap: wrap;"><a href="#" onclick="cambiarPaginaAdmin('usuarios')" class="btn-primary">👨‍👩‍👧 Gestionar Padres</a><a href="#" onclick="cambiarPaginaAdmin('estudiantes')" class="btn-primary">🎓 Gestionar Estudiantes</a><a href="#" onclick="cambiarPaginaAdmin('deudas')" class="btn-primary">📝 Registrar Deuda</a><a href="#" onclick="cambiarPaginaAdmin('reportes')" class="btn-primary">📊 Ver Reportes</a></div></div>
        `;
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        mostrarErrorAdmin('Error al cargar el dashboard');
    }
}

// 🔹 AQUÍ está tu cambio (expuesto en window)
window.cambiarPaginaAdmin = function (page) {
    const navItem = document.querySelector(`.admin-nav .nav-item[data-page="${page}"]`);
    if (navItem) navItem.click();
};

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function mostrarToastAdmin(mensaje, tipo) {
    const toast = document.createElement('div');
    toast.className = `toast-${tipo}`;
    toast.innerHTML = `<i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${mensaje}`;
    toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; padding: 12px 24px; border-radius: 12px; z-index: 2000; animation: fadeIn 0.3s; ${tipo === 'success' ? 'background: #10b981; color: white;' : 'background: #ef4444; color: white;'}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function mostrarErrorAdmin(mensaje) {
    mostrarToastAdmin(mensaje, 'error');
}

function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(monto || 0);
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-PE');
}

function mostrarLoadingAdmin() {
    const content = document.getElementById('admin-content');
    if (content) {
        content.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div><p>Cargando...</p></div>`;
    }
}

initAdminNavigation();