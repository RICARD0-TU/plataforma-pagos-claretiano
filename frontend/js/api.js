const API_BASE_URL = 'http://localhost:8080/api';

const api = {
    async request(endpoint, method = 'GET', data = null) {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (data) options.body = JSON.stringify(data);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) throw new Error('Error en la petición');
        return response.json();
    },

    // Usuarios
    getUsuarios: () => api.request('/usuarios'),
    getEstudiantesByUsuario: (usuarioId) => api.request(`/estudiantes/usuario/${usuarioId}`),
    updateUsuario: (id, data) => api.request(`/usuarios/${id}`, 'PUT', data),
    deleteUsuario: (id) => api.request(`/usuarios/${id}`, 'DELETE'),
    createUsuario: (data) => api.request('/usuarios', 'POST', data),

    // Deudas
    getDeudasPendientes: () => api.request('/deudas/pendientes'),
    getDeudaTotal: (estudianteId) => api.request(`/deudas/total-estudiante/${estudianteId}`),
    getDeudasByEstudiante: (estudianteId) => api.request(`/deudas/estudiante/${estudianteId}`),
    registrarDeuda: (data) => api.request('/deudas/registrar', 'POST', data),

    // Pagos
    realizarPago: (data) => api.request('/pagos/realizar', 'POST', data),
    getPagosByDeuda: (deudaId) => api.request(`/pagos/deuda/${deudaId}`),
    getPagos: () => api.request('/pagos'),

    // ✅ AGREGAR ESTO - Conceptos de Pago
    getConceptosPago: () => api.request('/conceptos-pago'),

    // Notificaciones
    getNotificaciones: (usuarioId) => api.request(`/notificaciones/usuario/${usuarioId}`),
    getNotificacionesNoLeidas: (usuarioId) => api.request(`/notificaciones/usuario/${usuarioId}/no-leidas`),
    marcarLeida: (id) => api.request(`/notificaciones/marcar-leida/${id}`, 'PUT'),

    // Reportes
    getEstadoCuenta: (estudianteId) => api.request(`/reportes/estado-cuenta/${estudianteId}`)
};