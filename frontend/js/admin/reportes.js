window.cargarReportesGlobales = cargarReportesGlobales;
window.actualizarReporte = actualizarReporte;
window.exportarExcel = exportarExcel;

async function cargarReportesGlobales() {
    mostrarLoadingAdmin();
    try {
        const [dashboard, deudasMorosas, estudiantes, conceptos, pagos] = await Promise.all([
            api.getDashboard(),
            api.getDeudasMorosas(),
            api.getEstudiantes(),
            api.getConceptosPago(),
            api.getPagos()
        ]);

        renderReportesGlobales({ dashboard, deudasMorosas, estudiantes, conceptos, pagos });
    } catch (error) {
        console.error('Error cargando reportes:', error);
        mostrarErrorAdmin('No se pudieron cargar los reportes');
    }
}

function renderReportesGlobales(data) {
    const content = document.getElementById('admin-content');
    const { dashboard, deudasMorosas, estudiantes, conceptos, pagos } = data;

    content.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-chart-line"></i> Reportes Globales</h2>
            <p>Análisis financiero y estadísticas del sistema</p>
        </div>

        <div class="stats-grid" style="margin-bottom: 24px;">
            <div class="stat-card-admin">
                <div class="stat-info">
                    <div class="stat-label">Total Recaudado</div>
                    <div class="stat-value">${formatearMoneda(dashboard.totalRecaudado || 0)}</div>
                </div>
                <div class="stat-icon-admin green"><i class="fas fa-dollar-sign"></i></div>
            </div>
            <div class="stat-card-admin">
                <div class="stat-info">
                    <div class="stat-label">Total Deuda</div>
                    <div class="stat-value">${formatearMoneda(dashboard.totalDeuda || 0)}</div>
                </div>
                <div class="stat-icon-admin red"><i class="fas fa-chart-line"></i></div>
            </div>
            <div class="stat-card-admin">
                <div class="stat-info">
                    <div class="stat-label">Morosidad</div>
                    <div class="stat-value">${dashboard.morosidad || 0}%</div>
                </div>
                <div class="stat-icon-admin orange"><i class="fas fa-exclamation-triangle"></i></div>
            </div>
            <div class="stat-card-admin">
                <div class="stat-info">
                    <div class="stat-label">Total Pagos</div>
                    <div class="stat-value">${dashboard.totalPagos || 0}</div>
                </div>
                <div class="stat-icon-admin blue"><i class="fas fa-receipt"></i></div>
            </div>
        </div>

        <div class="reporte-filtros">
            <div class="filtros-row">
                <div class="filtro-group">
                    <label>Reporte</label>
                    <select id="reporteSelector" onchange="actualizarReporte()">
                        <option value="morosidad">Deudas Morosas</option>
                        <option value="ingresos">Ingresos</option>
                        <option value="estado">Estado de Cuenta Global</option>
                    </select>
                </div>
                <div class="filtro-group" id="estudianteFilter" style="display:none;">
                    <label>Estudiante</label>
                    <select id="reporteEstudiante">
                        <option value="">Todos</option>
                        ${estudiantes.map(e => `<option value="${e.id}">${e.nombreCompleto}</option>`).join('')}
                    </select>
                </div>
                <div class="filtro-group">
                    <label>Exportar</label>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-primary" onclick="exportarExcel()" style="font-size: 12px; padding: 8px 16px;">
                            <i class="fas fa-file-excel"></i> Excel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="reporteResultado" class="admin-table-container">
            <div class="admin-table-header">
                <h3>Deudas Morosas (más de 30 días)</h3>
            </div>
            <table class="admin-table">
                <thead><tr><th>ID</th><th>Estudiante</th><th>Concepto</th><th>Saldo</th><th>Vencimiento</th></tr></thead>
                <tbody>
                    ${deudasMorosas.length === 0 ? '<tr><td colspan="5">No hay deudas morosas</td></tr>' :
                        deudasMorosas.map(d => `<tr>
                            <td>${d.id}</td>
                            <td>${d.estudiante?.nombreCompleto || 'N/A'}</td>
                            <td>${d.conceptoPago?.nombre || 'N/A'}</td>
                            <td>${formatearMoneda(d.saldoPendiente)}</td>
                            <td>${formatearFecha(d.fechaVencimiento)}</td>
                        </tr>`).join('')}
                </tbody>
            </table>
        </div>

        <div class="charts-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px;">
            <div class="admin-table-container">
                <div class="admin-table-header"><h3>Pagos por Mes</h3></div>
                <div style="padding: 20px; height: 300px;">
                    <canvas id="chartReportePagos"></canvas>
                </div>
            </div>
            <div class="admin-table-container">
                <div class="admin-table-header"><h3>Deudas por Estado</h3></div>
                <div style="padding: 20px; height: 300px;">
                    <canvas id="chartReporteEstado"></canvas>
                </div>
            </div>
        </div>
    `;

    // Render charts
    if (dashboard.pagosPorMes) {
        const ctx = document.getElementById('chartReportePagos').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(dashboard.pagosPorMes),
                datasets: [{
                    label: 'Recaudado (S/)',
                    data: Object.values(dashboard.pagosPorMes),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
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
        const ctx2 = document.getElementById('chartReporteEstado').getContext('2d');
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: Object.keys(dashboard.deudasPorEstado),
                datasets: [{
                    data: Object.values(dashboard.deudasPorEstado),
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
}

function actualizarReporte() {
    const tipo = document.getElementById('reporteSelector').value;
    document.getElementById('estudianteFilter').style.display = tipo === 'estado' ? 'block' : 'none';
}

async function exportarExcel() {
    mostrarToastAdmin('Exportando reporte...', 'success');
    try {
        const now = new Date();
        const inicio = new Date(now.getFullYear(), 0, 1).toISOString();
        const fin = now.toISOString();
        const session = obtenerSesion ? obtenerSesion() : null;
        const response = await fetch(`http://localhost:8080/api/reportes/exportar/pagos?inicio=${inicio}&fin=${fin}`, {
            headers: session && session.token ? { 'Authorization': 'Bearer ' + session.token } : {}
        });
        if (!response.ok) throw new Error('Error al exportar');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_pagos_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        mostrarToastAdmin('Reporte exportado exitosamente', 'success');
    } catch (error) {
        mostrarErrorAdmin('Error al exportar: ' + error.message);
    }
}
