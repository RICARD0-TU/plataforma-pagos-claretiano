window.cargarHistorial = cargarHistorial;

async function cargarHistorial() {
    mostrarLoading();
    try {
        const session = obtenerSesion();
        const usuarioId = session?.id;

        if (!usuarioId) {
            mostrarError('Sesión no válida');
            return;
        }

        const misEstudiantes = await api.getEstudiantesByUsuario(usuarioId);
        const todasLasDeudas = await api.getDeudasPendientes();
        const estudianteIds = misEstudiantes.map(e => e.id);
        const todasDeudas = await Promise.all(
            estudianteIds.map(id => api.getDeudasByEstudiante(id))
        );
        const deudasFlat = todasDeudas.flat();

        // Get all payments for all debts
        let todosLosPagos = [];
        for (const deuda of deudasFlat) {
            try {
                const pagos = await api.getPagosByDeuda(deuda.id);
                pagos.forEach(p => {
                    p.estudianteNombre = deudasFlat.find(d => d.id === p.deuda?.id)?.estudiante?.nombreCompleto
                        || misEstudiantes.find(e => e.id === deuda.estudiante?.id)?.nombreCompleto
                        || 'Estudiante';
                    p.conceptoNombre = deuda.conceptoPago?.nombre || 'Concepto';
                });
                todosLosPagos = [...todosLosPagos, ...pagos];
            } catch(e) {}
        }

        todosLosPagos.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago));

        renderHistorial(todosLosPagos, estudianteIds);
    } catch (error) {
        console.error('Error cargando historial:', error);
        mostrarError('Error al cargar historial de pagos');
    }
}

function renderHistorial(pagos, estudianteIds) {
    const contentArea = document.getElementById('content-area');

    contentArea.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-history"></i> Historial de Pagos</h2>
            <p>Consulta el historial completo de tus pagos realizados</p>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h3>Todos los pagos</h3>
                <div class="filtros-container" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                    <div class="filtro-group" style="display:flex;align-items:center;gap:6px;">
                        <label style="font-size:12px;margin:0;">Desde:</label>
                        <input type="date" id="filtroFechaInicio" onchange="filtrarHistorial()" style="padding:6px 10px;border:1px solid #e5e7eb;border-radius:8px;">
                    </div>
                    <div class="filtro-group" style="display:flex;align-items:center;gap:6px;">
                        <label style="font-size:12px;margin:0;">Hasta:</label>
                        <input type="date" id="filtroFechaFin" onchange="filtrarHistorial()" style="padding:6px 10px;border:1px solid #e5e7eb;border-radius:8px;">
                    </div>
                    <div class="filtro-group">
                        <input type="text" id="filtroBusqueda" placeholder="Buscar..." oninput="filtrarHistorial()" style="padding:6px 10px;border:1px solid #e5e7eb;border-radius:8px;">
                    </div>
                </div>
            </div>
            <table class="admin-table" id="historialTable">
                <thead>
                    <tr><th>Fecha</th><th>Estudiante</th><th>Concepto</th><th>Monto</th><th>Método</th><th>Recibo</th><th>Acción</th></tr>
                </thead>
                <tbody id="historialBody">
                    ${pagos.length === 0 ? '<tr><td colspan="7" style="text-align:center;padding:24px;">No hay pagos registrados</td></tr>' :
                        pagos.map(p => `<tr class="historial-row">
                            <td>${formatearFecha(p.fechaPago)}</td>
                            <td><strong>${p.estudianteNombre || 'N/A'}</strong></td>
                            <td>${p.conceptoNombre || 'N/A'}</td>
                            <td style="color:#10b981;font-weight:600;">${formatearMoneda(p.montoPagado)}</td>
                            <td><span class="badge badge-pending">${p.metodoPago}</span></td>
                            <td>${p.recibo?.numeroRecibo || '-'}</td>
                            <td>
                                <button class="btn-icon" onclick="verReciboPago(${p.id})" style="color:#3b82f6;" title="Ver recibo">
                                    <i class="fas fa-receipt"></i>
                                </button>
                            </td>
                        </tr>`).join('')}
                </tbody>
            </table>
            <div id="paginacion" style="padding:16px;display:flex;justify-content:center;gap:8px;"></div>
        </div>
    `;

    window.historialData = pagos;
}

function filtrarHistorial() {
    const fechaInicio = document.getElementById('filtroFechaInicio')?.value;
    const fechaFin = document.getElementById('filtroFechaFin')?.value;
    const busqueda = document.getElementById('filtroBusqueda')?.value?.toLowerCase() || '';
    const pagos = window.historialData || [];

    const filtrados = pagos.filter(p => {
        const fechaPago = new Date(p.fechaPago).toISOString().split('T')[0];
        if (fechaInicio && fechaPago < fechaInicio) return false;
        if (fechaFin && fechaPago > fechaFin) return false;
        if (busqueda) {
            const searchStr = `${p.estudianteNombre || ''} ${p.conceptoNombre || ''} ${p.recibo?.numeroRecibo || ''} ${p.metodoPago || ''}`.toLowerCase();
            if (!searchStr.includes(busqueda)) return false;
        }
        return true;
    });

    const tbody = document.getElementById('historialBody');
    if (tbody) {
        if (filtrados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;">No se encontraron pagos con los filtros aplicados</td></tr>';
        } else {
            tbody.innerHTML = filtrados.map(p => `<tr>
                <td>${formatearFecha(p.fechaPago)}</td>
                <td><strong>${p.estudianteNombre || 'N/A'}</strong></td>
                <td>${p.conceptoNombre || 'N/A'}</td>
                <td style="color:#10b981;font-weight:600;">${formatearMoneda(p.montoPagado)}</td>
                <td><span class="badge badge-pending">${p.metodoPago}</span></td>
                <td>${p.recibo?.numeroRecibo || '-'}</td>
                <td><button class="btn-icon" onclick="verReciboPago(${p.id})" style="color:#3b82f6;"><i class="fas fa-receipt"></i></button></td>
            </tr>`).join('');
        }
    }
}

async function verReciboPago(pagoId) {
    try {
        const recibo = await api.getReciboPorPago(pagoId);
        if (!recibo) {
            mostrarError('No hay recibo disponible');
            return;
        }

        const modalContent = document.getElementById('reciboContent');
        modalContent.innerHTML = `
            <div class="recibo-card" style="animation: slideIn 0.3s ease;">
                <div class="recibo-header">
                    <i class="fas fa-check-circle" style="font-size:48px;color:#10b981;"></i>
                    <h3>Pago Exitoso</h3>
                </div>
                <div class="recibo-body">
                    <div class="row">
                        <span class="label">N° Recibo</span>
                        <span class="value">${recibo.numeroRecibo}</span>
                    </div>
                    <div class="row">
                        <span class="label">Fecha</span>
                        <span class="value">${formatearFecha(recibo.fechaEmision)}</span>
                    </div>
                    <div class="row">
                        <span class="label">Monto</span>
                        <span class="value" style="color:#10b981;font-size:18px;">${formatearMoneda(recibo.montoTotal)}</span>
                    </div>
                    <div class="row">
                        <span class="label">Estado</span>
                        <span class="value"><span class="badge badge-paid">${recibo.estado}</span></span>
                    </div>
                </div>
                <div class="recibo-footer">
                    <button class="btn-primary" onclick="descargarPDFRecibo(${recibo.id})">
                        <i class="fas fa-file-pdf"></i> Descargar PDF
                    </button>
                </div>
            </div>
        `;
        document.getElementById('modalRecibo').style.display = 'flex';
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al obtener recibo');
    }
}

async function descargarPDFRecibo(reciboId) {
    try {
        const blob = await api.descargarReciboPdf(reciboId);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recibo_${reciboId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        mostrarToast('PDF descargado exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al descargar PDF');
    }
}
