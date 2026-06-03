let currentAdminPage = 'dashboard';
let chartInstances = {};

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
        reportes: { title: 'Reportes Globales', subtitle: 'Análisis financiero del sistema' },
        auditoria: { title: 'Auditoría del Sistema', subtitle: 'Registro de acciones del sistema' }
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
                case 'auditoria': cargarAuditoria(); break;
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
        case 'auditoria': cargarAuditoria(); break;
    }
}

function destruirChart(id) {
    if (chartInstances[id]) {
        chartInstances[id].destroy();
        delete chartInstances[id];
    }
}

async function cargarDashboardAdmin() {
    mostrarLoadingAdmin();
    try {
        const [usuarios, estudiantes, dashboard] = await Promise.all([
            api.getUsuarios(),
            api.getEstudiantes(),
            api.getDashboard()
        ]);

        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card-admin">
                    <div class="stat-info">
                        <div class="stat-label">Padres Registrados</div>
                        <div class="stat-value">${usuarios.filter(u => u.rol === 'parent').length}</div>
                    </div>
                    <div class="stat-icon-admin blue"><i class="fas fa-users"></i></div>
                </div>
                <div class="stat-card-admin">
                    <div class="stat-info">
                        <div class="stat-label">Estudiantes</div>
                        <div class="stat-value">${dashboard.totalEstudiantes || estudiantes.length}</div>
                    </div>
                    <div class="stat-icon-admin green"><i class="fas fa-user-graduate"></i></div>
                </div>
                <div class="stat-card-admin">
                    <div class="stat-info">
                        <div class="stat-label">Deudas Pendientes</div>
                        <div class="stat-value">${dashboard.deudasPendientes || 0}</div>
                    </div>
                    <div class="stat-icon-admin red"><i class="fas fa-exclamation-triangle"></i></div>
                </div>
                <div class="stat-card-admin">
                    <div class="stat-info">
                        <div class="stat-label">Total Recaudado</div>
                        <div class="stat-value">${formatearMoneda(dashboard.totalRecaudado || 0)}</div>
                    </div>
                    <div class="stat-icon-admin purple"><i class="fas fa-dollar-sign"></i></div>
                </div>
                <div class="stat-card-admin">
                    <div class="stat-info">
                        <div class="stat-label">Morosidad</div>
                        <div class="stat-value">${dashboard.morosidad || 0}%</div>
                    </div>
                    <div class="stat-icon-admin orange"><i class="fas fa-chart-line"></i></div>
                </div>
                <div class="stat-card-admin">
                    <div class="stat-info">
                        <div class="stat-label">Deudas Morosas</div>
                        <div class="stat-value">${dashboard.deudasMorosas || 0}</div>
                    </div>
                    <div class="stat-icon-admin red"><i class="fas fa-exclamation-circle"></i></div>
                </div>
            </div>

            <div class="charts-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px;">
                <div class="admin-table-container">
                    <div class="admin-table-header"><h3><i class="fas fa-chart-bar"></i> Pagos por Mes</h3></div>
                    <div style="padding: 20px; height: 300px;">
                        <canvas id="chartPagosMes"></canvas>
                    </div>
                </div>
                <div class="admin-table-container">
                    <div class="admin-table-header"><h3><i class="fas fa-chart-pie"></i> Deudas por Estado</h3></div>
                    <div style="padding: 20px; height: 300px;">
                        <canvas id="chartDeudasEstado"></canvas>
                    </div>
                </div>
            </div>

            <div style="margin-top: 24px;">
                <div class="admin-table-container">
                    <div class="admin-table-header"><h3><i class="fas fa-bell"></i> Acciones Rápidas</h3></div>
                    <div style="display: flex; gap: 16px; padding: 24px; flex-wrap: wrap;">
                        <a href="#" onclick="cambiarPaginaAdmin('usuarios')" class="btn-primary">Gestionar Padres</a>
                        <a href="#" onclick="cambiarPaginaAdmin('estudiantes')" class="btn-primary">Gestionar Estudiantes</a>
                        <a href="#" onclick="cambiarPaginaAdmin('deudas')" class="btn-primary">Registrar Deuda</a>
                        <a href="#" onclick="cambiarPaginaAdmin('reportes')" class="btn-primary">Ver Reportes</a>
                        <a href="#" onclick="cambiarPaginaAdmin('auditoria')" class="btn-primary">Auditoría</a>
                    </div>
                </div>
            </div>
        `;

        // Render charts
        if (dashboard.pagosPorMes) {
            destruirChart('chartPagosMes');
            const ctx = document.getElementById('chartPagosMes').getContext('2d');
            const labels = Object.keys(dashboard.pagosPorMes);
            const data = Object.values(dashboard.pagosPorMes);
            chartInstances.chartPagosMes = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Recaudado (S/)',
                        data: data,
                        backgroundColor: 'rgba(99, 102, 241, 0.7)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }

        if (dashboard.deudasPorEstado) {
            destruirChart('chartDeudasEstado');
            const ctx2 = document.getElementById('chartDeudasEstado').getContext('2d');
            const labels2 = Object.keys(dashboard.deudasPorEstado);
            const data2 = Object.values(dashboard.deudasPorEstado);
            chartInstances.chartDeudasEstado = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: labels2,
                    datasets: [{
                        data: data2,
                        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        mostrarErrorAdmin('Error al cargar el dashboard');
    }
}

window.cambiarPaginaAdmin = function (page) {
    const navItem = document.querySelector(`.admin-nav .nav-item[data-page="${page}"]`);
    if (navItem) navItem.click();
};

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function mostrarToastAdmin(mensaje, tipo) {
    const existing = document.querySelector('.toast-admin-custom');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-admin-custom';
    toast.innerHTML = `<i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${mensaje}`;
    toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; padding: 12px 24px; border-radius: 12px; z-index: 2000; animation: fadeIn 0.3s; ${tipo === 'success' ? 'background: #10b981; color: white;' : 'background: #ef4444; color: white;'} box-shadow: 0 10px 25px rgba(0,0,0,0.2);`;
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
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-PE');
}

function mostrarLoadingAdmin() {
    const content = document.getElementById('admin-content');
    if (content) {
        content.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div><p>Cargando...</p></div>`;
    }
}

async function cargarAuditoria() {
    mostrarLoadingAdmin();
    try {
        const logs = await api.getLogsRecientes();
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <div class="page-header">
                <h2><i class="fas fa-history"></i> Auditoría del Sistema</h2>
                <p>Registro de todas las acciones realizadas en el sistema</p>
            </div>
            <div class="admin-table-container">
                <div class="admin-table-header">
                    <h3>Últimos 50 eventos</h3>
                </div>
                <table class="admin-table">
                    <thead>
                        <tr><th>ID</th><th>Acción</th><th>Entidad</th><th>Detalles</th><th>IP</th><th>Fecha</th></tr>
                    </thead>
                    <tbody>
                        ${logs.length === 0 ? '<tr><td colspan="6">No hay registros</td></tr>' :
                            logs.map(log => `<tr>
                                <td>${log.id}</td>
                                <td><span class="badge badge-pending">${log.accion}</span></td>
                                <td>${log.entidad || '-'}</td>
                                <td>${log.detalles || '-'}</td>
                                <td>${log.ipOrigen || '-'}</td>
                                <td>${formatearFecha(log.fechaHora)}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error cargando auditoría:', error);
        mostrarErrorAdmin('Error al cargar auditoría');
    }
}

initAdminNavigation();
