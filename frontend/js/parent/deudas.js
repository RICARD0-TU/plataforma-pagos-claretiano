
// ============================================
// DEUDAS - VERSIÓN CORREGIDA + PAGOS
// ============================================

window.cargarDeudasPendientes = cargarDeudasPendientes;

async function cargarDeudasPendientes() {
    mostrarLoading();
    try {
        const session = obtenerSesion();
        const usuarioId = session?.id;

        if (!usuarioId) {
            mostrarError('Sesión no válida');
            return;
        }

        const misEstudiantes = await api.getEstudiantesByUsuario(usuarioId);

        if (misEstudiantes.length === 0) {
            document.getElementById('content-area').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-user-graduate"></i></div>
                    <h3>No tienes hijos registrados</h3>
                </div>`;
            return;
        }

        let todasMisDeudas = [];

        for (const estudiante of misEstudiantes) {
            const deudasEstudiante = await api.getDeudasByEstudiante(estudiante.id);
            const deudasPendientes = deudasEstudiante.filter(d => d.saldoPendiente > 0);

            deudasPendientes.forEach(d => {
                d.estudianteNombre = estudiante.nombreCompleto;
                d.estudianteId = estudiante.id;
            });

            todasMisDeudas = [...todasMisDeudas, ...deudasPendientes];
        }

        console.log('Mis deudas:', todasMisDeudas);

        if (todasMisDeudas.length === 0) {
            document.getElementById('content-area').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-check-circle"></i></div>
                    <h3>¡No tienes deudas pendientes!</h3>
                    <p>Todos tus pagos están al día.</p>
                </div>`;
            return;
        }

        const totalDeudas = todasMisDeudas.reduce((sum, d) => sum + d.saldoPendiente, 0);

        let html = `
            <div class="section-header">
                <h2><i class="fas fa-file-invoice-dollar"></i> Mis Deudas Pendientes</h2>
                <p>Tienes ${todasMisDeudas.length} deuda(s) por un total de ${formatearMoneda(totalDeudas)}</p>
            </div>
            <div class="deudas-list">
        `;

        for (const deuda of todasMisDeudas) {
            const hoy = new Date();
            const vencimiento = new Date(deuda.fechaVencimiento);
            const isVencida = vencimiento < hoy;

            html += `
                <div class="deuda-card ${isVencida ? 'vencida' : ''}">
                    <div class="deuda-card-header">
                        <div class="deuda-concepto">
                            <div class="concepto-icon">
                                <i class="fas fa-receipt"></i>
                            </div>
                            <div>
                                <h4>${deuda.estudianteNombre}</h4>
                                <p>${deuda.conceptoPago?.nombre || 'Concepto'} - Vence: ${formatearFecha(deuda.fechaVencimiento)}</p>
                            </div>
                        </div>
                        <div class="deuda-monto">
                            <span class="monto-label">Saldo pendiente</span>
                            <span class="monto-value">${formatearMoneda(deuda.saldoPendiente)}</span>
                        </div>
                    </div>

                    <div class="deuda-card-body">
                        <div class="deuda-details">
                            <div class="detail">
                                <i class="fas fa-dollar-sign"></i>
                                <span>Total: ${formatearMoneda(deuda.montoTotal)}</span>
                            </div>
                            <div class="detail">
                                <i class="fas fa-calendar"></i>
                                <span>${isVencida ? 'VENCIDA' : 'Pendiente'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="deuda-card-footer">
                        <button class="btn-primary"
                            onclick="window.abrirModalPagoSimple(${deuda.id}, ${deuda.saldoPendiente})">
                            <i class="fas fa-credit-card"></i> Pagar ${formatearMoneda(deuda.saldoPendiente)}
                        </button>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        document.getElementById('content-area').innerHTML = html;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('content-area').innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error al cargar deudas: ${error.message}</p>
                <button class="btn-primary" onclick="cargarDeudasPendientes()">Reintentar</button>
            </div>`;
    }
}


// ============================================
// FUNCIONES DE PAGO
// ============================================

async function abrirModalPagoSimple(deudaId, monto) {
    console.log('Abriendo modal para deuda:', deudaId, 'Monto:', monto);

    window.deudaPagoId = deudaId;
    window.deudaPagoMonto = monto;

    // Obtener detalles de la deuda
    let conceptoNombre = 'Pago Educativo';
    let estudianteNombre = 'Estudiante';

    try {
        const todasDeudas = await api.getDeudasPendientes();
        const deuda = todasDeudas.find(d => d.id === deudaId);
        if (deuda) {
            if (deuda.conceptoPago?.nombre) conceptoNombre = deuda.conceptoPago.nombre;
            if (deuda.estudiante?.nombreCompleto) estudianteNombre = deuda.estudiante.nombreCompleto;
        }
    } catch (e) { }

    const modalHtml = `
        <div id="modalPagoPremium" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 500px; animation: slideIn 0.3s ease;">
                <div class="modal-header" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
                    <h2 style="color: white; margin: 0;">
                        <i class="fas fa-credit-card"></i> Realizar Pago
                    </h2>
                    <span class="close-modal" onclick="cerrarModalPagoPremium()" style="color: white; font-size: 28px; cursor: pointer;">&times;</span>
                </div>
                <div class="modal-body" style="padding: 30px;">
                    <!-- Resumen del pago -->
                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 25px;">
                        <div style="font-size: 14px; color: #166534; margin-bottom: 8px;">Monto a pagar</div>
                        <div style="font-size: 36px; font-weight: 800; color: #16a34a;">${window.formatearMoneda(monto)}</div>
                        <div style="font-size: 12px; color: #166534; margin-top: 8px;">
                            <i class="fas fa-receipt"></i> Deuda #${deudaId}
                        </div>
                    </div>
                    
                    <!-- Detalles -->
                    <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280;"><i class="fas fa-tag"></i> Concepto</span>
                            <span style="font-weight: 500;">${conceptoNombre}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 12px 0;">
                            <span style="color: #6b7280;"><i class="fas fa-user-graduate"></i> Estudiante</span>
                            <span style="font-weight: 500;">${estudianteNombre}</span>
                        </div>
                    </div>
                    
                    <!-- Método de pago -->
                    <div class="form-group" style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #374151;">
                            <i class="fas fa-wallet"></i> Método de Pago
                        </label>
                        <select id="metodoPagoSelect" style="width: 100%; padding: 14px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; cursor: pointer;">
                            <option value="EFECTIVO">💰 Efectivo</option>
                            <option value="TRANSFERENCIA">🏦 Transferencia Bancaria</option>
                            <option value="TARJETA">💳 Tarjeta de Crédito/Débito</option>
                        </select>
                    </div>
                    
                    <!-- Botones -->
                    <div style="display: flex; gap: 12px; margin-top: 10px;">
                        <button onclick="window.confirmarPagoPremium()" class="btn-primary" style="flex: 1; padding: 14px; font-size: 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                            <i class="fas fa-check-circle"></i> Confirmar Pago
                        </button>
                        <button onclick="window.cerrarModalPagoPremium()" class="btn-outline" style="flex: 1; padding: 14px; font-size: 16px;">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `;

    const existingModal = document.getElementById('modalPagoPremium');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function cerrarModalPagoPremium() {
    const modal = document.getElementById('modalPagoPremium');
    if (modal) modal.remove();
    window.deudaPagoId = null;
    window.deudaPagoMonto = null;
}

async function confirmarPagoPremium() {
    const deudaId = window.deudaPagoId;
    const monto = window.deudaPagoMonto;
    const metodoPago = document.getElementById('metodoPagoSelect').value;

    if (!deudaId) {
        alert('Error: No hay deuda seleccionada');
        return;
    }

    // Deshabilitar botón y mostrar loading
    const confirmBtn = document.querySelector('#modalPagoPremium .btn-primary');
    const cancelBtn = document.querySelector('#modalPagoPremium .btn-outline');
    const originalText = confirmBtn?.innerHTML;

    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        confirmBtn.style.opacity = '0.7';
    }
    if (cancelBtn) cancelBtn.disabled = true;

    try {
        const resultado = await api.realizarPago({
            deudaId: deudaId,
            monto: monto,
            metodoPago: metodoPago,
            referencia: `PAG-${Date.now()}`
        });

        // Mostrar mensaje de éxito
        alert('✅ ¡Pago realizado con éxito!');
        cerrarModalPagoPremium();
        location.reload();

    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al procesar el pago: ' + (error.message || 'Intente nuevamente'));
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = originalText;
            confirmBtn.style.opacity = '1';
        }
        if (cancelBtn) cancelBtn.disabled = false;
    }
}

// Hacer funciones globales
window.abrirModalPagoSimple = abrirModalPagoSimple;
window.cerrarModalPagoPremium = cerrarModalPagoPremium;
window.confirmarPagoPremium = confirmarPagoPremium;