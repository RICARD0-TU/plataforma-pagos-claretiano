// ============================================
// ESTUDIANTES - VERSIÓN CORREGIDA
// ============================================

window.cargarEstudiantes = cargarEstudiantes;
window.verEstadoCuenta = verEstadoCuenta;

async function cargarEstudiantes() {
    mostrarLoading();
    try {
        const session = obtenerSesion();
        const usuarioId = session?.id;

        if (!usuarioId) {
            mostrarError('Sesión no válida');
            return;
        }

        const estudiantes = await api.getEstudiantesByUsuario(usuarioId);

        // Calcular deuda por estudiante
        const estudiantesConDeuda = await Promise.all(
            estudiantes.map(async (est) => {
                const total = await api.getDeudaTotal(est.id);
                return {
                    ...est,
                    totalDeuda: total?.totalDeuda || 0
                };
            })
        );

        renderEstudiantes(estudiantesConDeuda);
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        mostrarError('No se pudieron cargar los estudiantes');
    }
}

function renderEstudiantes(estudiantes) {
    const contentArea = document.getElementById('content-area');

    if (estudiantes.length === 0) {
        contentArea.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fas fa-user-graduate"></i></div>
                <h3>No tienes hijos registrados</h3>
                <p>Contacta con la administración del colegio</p>
            </div>
        `;
        return;
    }

    contentArea.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-heart"></i> Mis Hijos</h2>
            <p>Gestiona la información académica y financiera de tus hijos</p>
        </div>
        
        <div class="estudiantes-grid">
            ${estudiantes.map(est => `
                <div class="estudiante-card" onclick="verEstadoCuenta(${est.id})">
                    <div class="estudiante-avatar">
                        <div class="avatar-initials">
                            ${est.nombreCompleto.split(' ').map(n => n[0]).join('')}
                        </div>
                    </div>
                    <div class="estudiante-info">
                        <h3>${est.nombreCompleto}</h3>
                        <div class="estudiante-details">
                            <span class="detail-item"><i class="fas fa-graduation-cap"></i> ${est.grado}° "${est.seccion}"</span>
                            <span class="detail-item"><i class="fas fa-id-card"></i> ${est.codigoEstudiante}</span>
                        </div>
                        <div class="deuda-resumen">
                            <div class="deuda-label">Deuda total</div>
                            <div class="deuda-monto ${est.totalDeuda > 0 ? 'text-danger' : 'text-success'}">
                                ${formatearMoneda(est.totalDeuda)}
                            </div>
                        </div>
                    </div>
                    <div class="estudiante-actions">
                        <button class="btn-primary btn-sm" onclick="event.stopPropagation(); verEstadoCuenta(${est.id})">
                            <i class="fas fa-chart-line"></i> Ver detalle
                        </button>
                        ${est.totalDeuda > 0 ? `
                            <button class="btn-outline btn-sm" onclick="event.stopPropagation(); window.cambiarPagina('deudas')">
                                <i class="fas fa-credit-card"></i> Pagar
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function verEstadoCuenta(estudianteId) {
    mostrarLoading();
    try {
        const estadoCuenta = await api.getEstadoCuenta(estudianteId);
        renderEstadoCuenta(estadoCuenta);
    } catch (error) {
        console.error('Error cargando estado cuenta:', error);
        mostrarError('No se pudo cargar el estado de cuenta');
    }
}

function renderEstadoCuenta(estado) {
    const contentArea = document.getElementById('content-area');

    contentArea.innerHTML = `
        <div class="back-button">
            <button class="btn-outline btn-sm" onclick="cargarEstudiantes()">
                <i class="fas fa-arrow-left"></i> Volver a Mis Hijos
            </button>
        </div>
        
        <div class="estudiante-header-premium">
            <div class="header-info">
                <h1>${estado.estudianteNombre}</h1>
                <p class="grado-info">${estado.grado}</p>
            </div>
            <div class="header-resumen">
                <div class="resumen-card">
                    <span class="resumen-label">Saldo Pendiente</span>
                    <span class="resumen-monto ${estado.saldoPendiente > 0 ? 'text-danger' : 'text-success'}">
                        ${formatearMoneda(estado.saldoPendiente)}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="resumen-grid">
            <div class="resumen-stat-card">
                <div class="stat-icon small blue"><i class="fas fa-chart-simple"></i></div>
                <div><div class="stat-label">Total Deuda</div><div class="stat-value">${formatearMoneda(estado.totalDeuda)}</div></div>
            </div>
            <div class="resumen-stat-card">
                <div class="stat-icon small green"><i class="fas fa-check-circle"></i></div>
                <div><div class="stat-label">Total Pagado</div><div class="stat-value">${formatearMoneda(estado.totalPagado)}</div></div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header"><h3>Detalle de Deudas</h3></div>
            <table class="admin-table">
                <thead><tr><th>Concepto</th><th>Monto Total</th><th>Pagado</th><th>Saldo</th><th>Vencimiento</th><th>Estado</th><th>Acción</th></tr></thead>
                <tbody>
                    ${estado.deudas.map(deuda => `
                        <tr>
                            <td><strong>${deuda.concepto}</strong></td>
                            <td>${formatearMoneda(deuda.montoTotal)}</td>
                            <td>${formatearMoneda(deuda.montoPagado)}</td>
                            <td class="${deuda.saldo > 0 ? 'text-danger' : 'text-success'}">${formatearMoneda(deuda.saldo)}</td>
                            <td>${formatearFecha(deuda.fechaVencimiento)}</td>
                            <td><span class="badge ${deuda.estado === 'PAGADO' ? 'badge-paid' : 'badge-pending'}">${deuda.estado}</span></td>
                            <td>${deuda.saldo > 0 ? `<button class="btn-pagar" onclick="window.abrirModalPago(${deuda.id}, ${deuda.saldo})">Pagar ${formatearMoneda(deuda.saldo)}</button>` : '✓ Pagado'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}