window.cargarNotificaciones = cargarNotificaciones;

async function cargarNotificaciones() {
    mostrarLoading();
    try {
        const session = obtenerSesion();
        const notificaciones = await api.getNotificaciones(session.id);
        renderNotificaciones(notificaciones);
        actualizarContadorNotificaciones();
    } catch (error) {
        console.error('Error cargando notificaciones:', error);
        mostrarError('No se pudieron cargar las notificaciones');
    }
}

function renderNotificaciones(notificaciones) {
    const contentArea = document.getElementById('content-area');
    
    if (notificaciones.length === 0) {
        contentArea.innerHTML = `<div class="empty-state"><div class="empty-state-icon"><i class="fas fa-bell-slash"></i></div><h3>No hay notificaciones</h3></div>`;
        return;
    }
    
    contentArea.innerHTML = `
        <h2><i class="fas fa-bell"></i> Notificaciones</h2>
        <div class="notificaciones-list">
            ${notificaciones.map(notif => `
                <div class="notificacion-card ${!notif.leida ? 'no-leida' : ''}">
                    <div class="notificacion-icon ${notif.tipo === 'PAGO' ? 'pago' : 'info'}">
                        <i class="fas ${notif.tipo === 'PAGO' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                    </div>
                    <div class="notificacion-content">
                        <div class="notificacion-header">
                            <h4>${notif.titulo}</h4>
                            <span class="notificacion-fecha">${formatearFecha(notif.fechaEnvio)}</span>
                        </div>
                        <p>${notif.mensaje}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function actualizarContadorNotificaciones() {
    try {
        const session = obtenerSesion();
        const notificaciones = await api.getNotificacionesNoLeidas(session.id);
        const badge = document.getElementById('notifCount');
        if (badge) {
            badge.textContent = notificaciones.length;
            badge.style.display = notificaciones.length > 0 ? 'inline-block' : 'none';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}