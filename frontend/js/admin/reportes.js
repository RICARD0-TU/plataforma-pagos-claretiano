// ============================================
// REPORTES GLOBALES
// ============================================

async function cargarReportesGlobales() {
    mostrarLoadingAdmin();
    try {
        const [pagosReporte, deudasMorosas, estudiantes, conceptos] = await Promise.all([
            api.getReportePagos(new Date().getFullYear()),
            api.getDeudasMorosas(),
            api.getEstudiantes(),
            api.getConceptosPago()
        ]);
        
        const totalRecaudado = pagosReporte?.totalRecaudado || 0;
        
        renderReportesGlobales({ pagosReporte, deudasMorosas, estudiantes, conceptos, totalRecaudado });
    } catch (error) {
        console.error('Error cargando reportes:', error);
        mostrarErrorAdmin('No se pudieron cargar los reportes');
    }
}

function renderReportesGlobales(data) {
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-chart-line"></i> Reportes Globales</h2>
            <p>Análisis financiero y estadísticas del sistema</p>
        </div>
        
        <div class="reporte-filtros">
            <div class="filtros-row">
                <div class="filtro-group">
                    <label>Año</label>
                    <select id="reporteAnio" onchange="actualizarReportePorAño()">
                        <option value="2023">2023</option>
                        <option value="2024" selected>2024</option>
                        <option value="2025">2025</option>
                    </select>
                </div>
                <div class="filtro-group">
                    <label>Mes</label>
                    <select id="reporteMes" onchange="actualizarReportePorAño()">
                        <option value="">Todo el año</option>
                        <option value="1">Enero</option><option value="2">Febrero</option>
                        <option value="3">Marzo</option><option value="4">Abril</option>
                        <option value="5">Mayo</option><option value="6">Junio</option>
                        <option value="7">Julio</option><option value="8">Agosto</option>
                        <option value="9">Septiembre</option><option value="10">Octubre</option>
                        <option value="11">Noviembre</option><option value="12">Diciembre</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="resumen-recaudado">
            <h3>Total Recaudado</h3>
            <div class="total">${formatearMoneda(data.totalRecaudado)}</div>
        </div>
        
        <div class="reporte-resultados">
            <h3>Deudas Morosas (más de 30 días)</h3>
            <table class="admin-table">
                <thead><tr><th>ID</th><th>Estudiante</th><th>Concepto</th><th>Saldo</th><th>Vencimiento</th></tr></thead>
                <tbody>
                    ${data.deudasMorosas.length === 0 ? '<tr><td colspan="5">No hay deudas morosas</td></tr>' :
                        data.deudasMorosas.map(d => `<tr>
                            <td>${d.id}</td>
                            <td>${d.estudiante?.nombreCompleto || 'N/A'}</td>
                            <td>${d.conceptoPago?.nombre || 'N/A'}</td>
                            <td>${formatearMoneda(d.saldoPendiente)}</td>
                            <td>${formatearFecha(d.fechaVencimiento)}</td>
                        </tr>`).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function actualizarReportePorAño() {
    mostrarLoadingAdmin();
    try {
        const anio = document.getElementById('reporteAnio').value;
        const mes = document.getElementById('reporteMes').value;
        
        const pagos = await api.getPagos();
        let pagosFiltrados = pagos.filter(p => new Date(p.fechaPago).getFullYear() === parseInt(anio));
        if (mes) pagosFiltrados = pagosFiltrados.filter(p => new Date(p.fechaPago).getMonth() + 1 === parseInt(mes));
        
        const total = pagosFiltrados.reduce((sum, p) => sum + p.montoPagado, 0);
        document.querySelector('.resumen-recaudado .total').innerHTML = formatearMoneda(total);
    } catch (error) {
        console.error('Error:', error);
    }
}