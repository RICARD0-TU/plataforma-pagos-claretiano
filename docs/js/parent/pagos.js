// ============================================
// PAGOS - VERSIÓN SIMPLE Y FUNCIONAL
// ============================================

window.abrirModalPago = abrirModalPago;
window.cerrarModales = cerrarModales;

let deudaSeleccionada = null;

async function abrirModalPago(deudaId, montoMaximo) {
    console.log('=== ABRIENDO MODAL ===');
    console.log('Deuda ID recibido:', deudaId);
    console.log('Monto máximo:', montoMaximo);

    try {
        // Obtener todas las deudas pendientes
        const todasDeudas = await api.getDeudasPendientes();
        console.log('Todas las deudas:', todasDeudas);

        // Buscar la deuda específica
        const deuda = todasDeudas.find(d => d.id === deudaId);
        console.log('Deuda encontrada:', deuda);

        if (!deuda) {
            alert('Error: No se encontró la deuda #' + deudaId);
            return;
        }

        // Guardar la deuda seleccionada
        deudaSeleccionada = {
            id: deuda.id,
            estudiante: deuda.estudiante?.nombreCompleto || 'Estudiante',
            concepto: deuda.conceptoPago?.nombre || 'Concepto',
            monto: deuda.saldoPendiente
        };

        console.log('Deuda seleccionada:', deudaSeleccionada);

        // Mostrar información en el modal
        document.getElementById('deudaId').value = deudaSeleccionada.id;
        document.getElementById('conceptoNombre').value = deudaSeleccionada.concepto;
        document.getElementById('estudianteNombre').value = deudaSeleccionada.estudiante;
        document.getElementById('montoMostrar').value = formatearMoneda(deudaSeleccionada.monto);

        // Mostrar el modal
        const modal = document.getElementById('modalPago');
        modal.style.display = 'flex';

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar la deuda: ' + error.message);
    }
}

function cerrarModales() {
    console.log('Cerrando modales');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    deudaSeleccionada = null;
}

// Configurar el formulario de pago
document.addEventListener('DOMContentLoaded', () => {
    const formPago = document.getElementById('formPago');
    if (formPago) {
        formPago.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('=== ENVIANDO PAGO ===');

            if (!deudaSeleccionada) {
                alert('No hay una deuda seleccionada');
                return;
            }

            const metodoPago = document.getElementById('metodoPago').value;
            const referencia = `PAG-${Date.now()}`;

            console.log('Datos del pago:', {
                deudaId: deudaSeleccionada.id,
                monto: deudaSeleccionada.monto,
                metodoPago: metodoPago,
                referencia: referencia
            });

            const confirmar = confirm(`Confirmar pago de ${formatearMoneda(deudaSeleccionada.monto)}?`);
            if (!confirmar) return;

            const submitBtn = formPago.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
            submitBtn.disabled = true;

            try {
                const resultado = await api.realizarPago({
                    deudaId: deudaSeleccionada.id,
                    monto: deudaSeleccionada.monto,
                    metodoPago: metodoPago,
                    referencia: referencia
                });

                console.log('Resultado:', resultado);
                alert('¡Pago realizado con éxito!');
                cerrarModales();
                location.reload();

            } catch (error) {
                console.error('Error al pagar:', error);
                alert('Error al procesar el pago: ' + (error.message || 'Intente nuevamente'));
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Cerrar modal al hacer clic fuera
window.onclick = (event) => {
    if (event.target.classList && event.target.classList.contains('modal')) {
        cerrarModales();
    }
};

// Cerrar modal con la X
document.querySelectorAll('.close-modal').forEach(btn => {
    if (btn) {
        btn.onclick = () => cerrarModales();
    }
});