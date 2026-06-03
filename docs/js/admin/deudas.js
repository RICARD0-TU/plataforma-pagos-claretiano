// ============================================
// GESTIÓN DE DEUDAS
// ============================================

window.cargarDeudasAdmin = cargarDeudasAdmin;
window.abrirModalDeuda = abrirModalDeuda;
window.verDetalleDeudaAdmin = verDetalleDeudaAdmin;
window.filtrarDeudas = filtrarDeudas;

let estudiantesList = [];
let conceptosList = [];
let deudasData = [];

async function cargarDeudasAdmin() {
    mostrarLoadingAdmin();
    try {
        const [deudas, estudiantes, conceptos] = await Promise.all([
            api.getDeudas(),
            api.getEstudiantes(),
            api.getConceptosPago()
        ]);
        deudasData = deudas;
        estudiantesList = estudiantes;
        conceptosList = conceptos;
        renderDeudasAdmin(deudasData);
    } catch (error) {
        console.error('Error cargando deudas:', error);
        mostrarErrorAdmin('No se pudieron cargar las deudas');
    }
}

function renderDeudasAdmin(deudas) {
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-file-invoice-dollar"></i> Gestión de Deudas</h2>
            <p>Registra nuevas deudas para los estudiantes</p>
        </div>
        
        <div class="admin-table-container">
            <div class="admin-table-header">
                <h3>Lista de Deudas</h3>
                <button class="btn-primary" onclick="abrirModalDeuda()">
                    <i class="fas fa-plus"></i> Registrar Deuda
                </button>
            </div>
            <div class="filtros-container">
                <div class="filtro-group">
                    <label>Filtrar por estudiante</label>
                    <select id="filtroEstudiante" onchange="filtrarDeudas()">
                        <option value="">Todos</option>
                        ${estudiantesList.map(e => `<option value="${e.id}">${e.nombreCompleto}</option>`).join('')}
                    </select>
                </div>
                <div class="filtro-group">
                    <label>Filtrar por estado</label>
                    <select id="filtroEstado" onchange="filtrarDeudas()">
                        <option value="">Todos</option>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="PARCIAL">Parcial</option>
                        <option value="PAGADO">Pagado</option>
                        <option value="VENCIDO">Vencido</option>
                    </select>
                </div>
            </div>
            <table class="admin-table">
                <thead>
                    <tr><th>ID</th><th>Estudiante</th><th>Concepto</th><th>Monto Total</th><th>Saldo</th><th>Vencimiento</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody id="deudasTableBody">
                    ${deudas.length === 0 ? '<tr><td colspan="8" style="text-align:center;padding:40px;"><i class="fas fa-file-invoice" style="font-size:48px;color:#9ca3af;"></i><p>No hay deudas registradas</p></td></tr>' :
                        deudas.map(deuda => {
                        const estudiante = estudiantesList.find(e => e.id === deuda.estudiante?.id);
                        const concepto = conceptosList.find(c => c.id === deuda.conceptoPago?.id);
                        return `<tr>
                            <td>${deuda.id}</td>
                            <td>${estudiante?.nombreCompleto || 'N/A'}</td>
                            <td>${concepto?.nombre || 'N/A'}</td>
                            <td>${formatearMoneda(deuda.montoTotal)}</td>
                            <td>${formatearMoneda(deuda.saldoPendiente)}</td>
                            <td>${formatearFecha(deuda.fechaVencimiento)}</td>
                            <td><span class="badge ${deuda.estado === 'PAGADO' ? 'badge-paid' : deuda.estado === 'PARCIAL' ? 'badge-partial' : 'badge-pending'}">${deuda.estado}</span></td>
                            <td>
                                <button class="btn-icon" onclick="verDetalleDeudaAdmin(${deuda.id})" style="color: #3b82f6;"><i class="fas fa-info-circle"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <button class="fab-button" onclick="abrirModalDeuda()"><i class="fas fa-plus"></i></button>
    `;
}

function filtrarDeudas() {
    const estudianteId = document.getElementById('filtroEstudiante')?.value;
    const estado = document.getElementById('filtroEstado')?.value;
    
    let filtradas = [...deudasData];
    if (estudianteId) filtradas = filtradas.filter(d => d.estudiante?.id === parseInt(estudianteId));
    if (estado) filtradas = filtradas.filter(d => d.estado === estado);
    
    const tbody = document.getElementById('deudasTableBody');
    if (tbody) {
        tbody.innerHTML = filtradas.map(deuda => {
            const estudiante = estudiantesList.find(e => e.id === deuda.estudiante?.id);
            const concepto = conceptosList.find(c => c.id === deuda.conceptoPago?.id);
            return `<tr>
                <td>${deuda.id}</td>
                <td>${estudiante?.nombreCompleto || 'N/A'}</td>
                <td>${concepto?.nombre || 'N/A'}</td>
                <td>${formatearMoneda(deuda.montoTotal)}</td>
                <td>${formatearMoneda(deuda.saldoPendiente)}</td>
                <td>${formatearFecha(deuda.fechaVencimiento)}</td>
                <td><span class="badge ${deuda.estado === 'PAGADO' ? 'badge-paid' : deuda.estado === 'PARCIAL' ? 'badge-partial' : 'badge-pending'}">${deuda.estado}</span></td>
                <td><button class="btn-icon" onclick="verDetalleDeudaAdmin(${deuda.id})" style="color: #3b82f6;"><i class="fas fa-info-circle"></i></button></td>
            </tr>`;
        }).join('');
    }
}

function abrirModalDeuda() {
    const selectEstudiante = document.getElementById('deudaEstudianteId');
    const selectConcepto = document.getElementById('conceptoPagoId');
    
    selectEstudiante.innerHTML = '<option value="">Seleccione un estudiante</option>' + 
        estudiantesList.map(e => `<option value="${e.id}">${e.nombreCompleto}</option>`).join('');
    selectConcepto.innerHTML = '<option value="">Seleccione un concepto</option>' + 
        conceptosList.map(c => `<option value="${c.id}">${c.nombre} - ${formatearMoneda(c.montoBase)}</option>`).join('');
    
    document.getElementById('formDeuda').reset();
    document.getElementById('anioAcademico').value = new Date().getFullYear();
    document.getElementById('fechaVencimiento').value = new Date().toISOString().split('T')[0];
    document.getElementById('modalDeuda').style.display = 'flex';
}

async function verDetalleDeudaAdmin(deudaId) {
    try {
        const pagos = await api.getPagosByDeuda(deudaId);
        const deuda = deudasData.find(d => d.id === deudaId);
        const estudiante = estudiantesList.find(e => e.id === deuda?.estudiante?.id);
        const concepto = conceptosList.find(c => c.id === deuda?.conceptoPago?.id);
        
        const modalContent = document.getElementById('detalleDeudaContent');
        modalContent.innerHTML = `
            <h3>Deuda #${deudaId}</h3>
            <p><strong>Estudiante:</strong> ${estudiante?.nombreCompleto}</p>
            <p><strong>Concepto:</strong> ${concepto?.nombre}</p>
            <p><strong>Monto total:</strong> ${formatearMoneda(deuda.montoTotal)}</p>
            <p><strong>Pagado:</strong> ${formatearMoneda(deuda.montoPagado)}</p>
            <p><strong>Saldo pendiente:</strong> ${formatearMoneda(deuda.saldoPendiente)}</p>
            <p><strong>Vencimiento:</strong> ${formatearFecha(deuda.fechaVencimiento)}</p>
            <hr>
            <h4>Historial de Pagos</h4>
            <table class="admin-table">
                <thead><tr><th>Fecha</th><th>Monto</th><th>Método</th><th>Recibo</th></tr></thead>
                <tbody>
                    ${pagos.length === 0 ? '<tr><td colspan="4">No hay pagos registrados</td></tr>' :
                        pagos.map(p => `<tr><td>${formatearFecha(p.fechaPago)}</td><td>${formatearMoneda(p.montoPagado)}</td><td>${p.metodoPago}</td><td>${p.recibo?.numeroRecibo || '-'}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('modalDetalleDeuda').style.display = 'flex';
    } catch (error) {
        mostrarToastAdmin('Error cargando detalle', 'error');
    }
}

document.getElementById('formDeuda')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const deuda = {
        estudianteId: parseInt(document.getElementById('deudaEstudianteId').value),
        conceptoId: parseInt(document.getElementById('conceptoPagoId').value),
        monto: parseFloat(document.getElementById('montoTotal').value),
        fechaVencimiento: document.getElementById('fechaVencimiento').value,
        anioAcademico: parseInt(document.getElementById('anioAcademico').value),
        mesCorrespondiente: parseInt(document.getElementById('mesCorrespondiente').value)
    };
    
    if (!deuda.estudianteId || !deuda.conceptoId) {
        mostrarToastAdmin('Complete todos los campos', 'error');
        return;
    }
    
    try {
        await api.registrarDeuda(deuda);
        mostrarToastAdmin('Deuda registrada correctamente', 'success');
        cerrarModal('modalDeuda');
        cargarDeudasAdmin();
    } catch (error) {
        mostrarToastAdmin('Error al registrar deuda', 'error');
    }
});