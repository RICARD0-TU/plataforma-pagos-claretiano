const API_BASE_URL = 'https://plataforma-pagos-claretiano.onrender.com/api';

const api = {
    async request(endpoint, method = 'GET', data = null) {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        const session = obtenerSesion ? obtenerSesion() : null;
        if (session && session.token) {
            options.headers['Authorization'] = 'Bearer ' + session.token;
        }
        if (data) options.body = JSON.stringify(data);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Error en la petición');
        }
        return response.json();
    },

    // Usuarios
    getUsuarios: () => api.request('/usuarios'),
    getUsuario: (id) => api.request(`/usuarios/${id}`),
    createUsuario: (data) => api.request('/usuarios', 'POST', data),
    updateUsuario: (id, data) => api.request(`/usuarios/${id}`, 'PUT', data),
    deleteUsuario: (id) => api.request(`/usuarios/${id}`, 'DELETE'),
    cambiarPassword: (data) => api.request('/usuarios/cambiar-password', 'PUT', data),

    // Estudiantes
    getEstudiantes: () => api.request('/estudiantes'),
    getEstudiante: (id) => api.request(`/estudiantes/${id}`),
    getEstudiantesByUsuario: (usuarioId) => api.request(`/estudiantes/usuario/${usuarioId}`),
    createEstudiante: (data) => api.request('/estudiantes', 'POST', data),
    updateEstudiante: (id, data) => api.request(`/estudiantes/${id}`, 'PUT', data),
    deleteEstudiante: (id) => api.request(`/estudiantes/${id}`, 'DELETE'),

    // Conceptos de Pago
    getConceptosPago: () => api.request('/conceptos-pago'),
    getConceptoPago: (id) => api.request(`/conceptos-pago/${id}`),
    createConceptoPago: (data) => api.request('/conceptos-pago', 'POST', data),
    updateConceptoPago: (id, data) => api.request(`/conceptos-pago/${id}`, 'PUT', data),
    deleteConceptoPago: (id) => api.request(`/conceptos-pago/${id}`, 'DELETE'),

    // Deudas
    getDeudas: () => api.request('/deudas'),
    getDeudasPendientes: () => api.request('/deudas/pendientes'),
    getDeudasPendientesConDetalles: () => api.request('/deudas/pendientes-con-detalles'),
    getDeudasByEstudiante: (estudianteId) => api.request(`/deudas/estudiante/${estudianteId}`),
    getDeudaTotal: (estudianteId) => api.request(`/deudas/total-estudiante/${estudianteId}`),
    registrarDeuda: (data) => api.request('/deudas/registrar', 'POST', data),

    // Pagos
    getPagos: () => api.request('/pagos'),
    getPagosByDeuda: (deudaId) => api.request(`/pagos/deuda/${deudaId}`),
    getPagosPorFechas: (inicio, fin) => api.request(`/pagos/reporte/fechas?inicio=${inicio}&fin=${fin}`),
    realizarPago: (data) => api.request('/pagos/realizar', 'POST', data),

    // Recibos
    getRecibo: (id) => api.request(`/recibos/${id}`),
    getReciboPorPago: (pagoId) => api.request(`/recibos/pago/${pagoId}`),
    descargarReciboPdf: async (id) => {
        const session = obtenerSesion ? obtenerSesion() : null;
        const response = await fetch(`${API_BASE_URL}/recibos/${id}/pdf`, {
            headers: session && session.token ? { 'Authorization': 'Bearer ' + session.token } : {}
        });
        if (!response.ok) throw new Error('Error al descargar PDF');
        return response.blob();
    },

    // Notificaciones
    getNotificaciones: (usuarioId) => api.request(`/notificaciones/usuario/${usuarioId}`),
    getNotificacionesNoLeidas: (usuarioId) => api.request(`/notificaciones/usuario/${usuarioId}/no-leidas`),
    marcarLeida: (id) => api.request(`/notificaciones/marcar-leida/${id}`, 'PUT'),
    crearNotificacion: (data) => api.request('/notificaciones/crear', 'POST', data),

    // Reportes
    getEstadoCuenta: (estudianteId) => api.request(`/reportes/estado-cuenta/${estudianteId}`),
    getReportePagos: (inicio, fin) => api.request(`/reportes/pagos?inicio=${inicio}&fin=${fin}`),
    getDeudasMorosas: () => api.request('/reportes/deudas-morosas'),
    getDashboard: () => api.request('/dashboard'),

    // Logs
    getLogs: () => api.request('/logs'),
    getLogsRecientes: () => api.request('/logs/recientes'),

    // Password Reset
    solicitarResetPassword: (email) => api.request('/password-reset/solicitar', 'POST', { email }),
    restablecerPassword: (token, nuevaPassword) =>
        api.request('/password-reset/restablecer', 'POST', { token, nuevaPassword })
};
