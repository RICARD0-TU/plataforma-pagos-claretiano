// ============================================
// GESTIÓN DE USUARIOS (PADRES) - VERSIÓN COMPLETA
// ============================================

window.cargarUsuarios = cargarUsuarios;
window.abrirModalUsuario = abrirModalUsuario;
window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
window.verDetallePadre = verDetallePadre;

let usuariosData = [];

async function cargarUsuarios() {
    mostrarLoadingAdmin();
    try {
        const usuarios = await api.getUsuarios();
        // Filtrar solo padres (rol parent)
        usuariosData = usuarios.filter(u => u.rol === 'parent' || !u.rol);

        // Obtener cantidad de hijos por padre
        for (const user of usuariosData) {
            const estudiantes = await api.getEstudiantesByUsuario(user.id);
            user.cantidadHijos = estudiantes.length;
        }

        renderUsuarios(usuariosData);
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        mostrarErrorAdmin('No se pudieron cargar los usuarios');
    }
}

function renderUsuarios(usuarios) {
    const content = document.getElementById('admin-content');

    content.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <h2><i class="fas fa-users"></i> Gestión de Padres de Familia</h2>
            <p>Administra los padres registrados en el sistema</p>
        </div>
        
        <div class="admin-table-container">
            <div class="admin-table-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                <h3><i class="fas fa-list"></i> Lista de Padres</h3>
                <button class="btn-primary" onclick="window.abrirModalNuevoPadre()">
                    <i class="fas fa-plus"></i> Nuevo Padre
                </button>
            </div>
            
            <div style="overflow-x: auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Hijos</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usuarios.length === 0 ? `
                            <tr>
                                <td colspan="7" style="text-align: center; padding: 40px;">
                                    <i class="fas fa-user-slash" style="font-size: 48px; color: #9ca3af;"></i>
                                    <p>No hay padres registrados</p>
                                    <button class="btn-primary" onclick="abrirModalUsuario()">Crear primer padre</button>
                                </td>
                            </tr>
                        ` : usuarios.map(user => `
                            <tr style="border-bottom: 1px solid #f3f4f6;">
                                <td style="font-weight: 600;">${user.id}</td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">
                                            <i class="fas fa-user-friends"></i>
                                        </div>
                                        <div>
                                            <strong>${user.nombreCompleto}</strong>
                                        </div>
                                    </div>
                                </td>
                                <td>${user.email}</td>
                                <td>${user.telefono || '<span style="color: #9ca3af;">-</span>'}</td>
                                <td>
                                    <span style="background: #dbeafe; color: #2563eb; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                        <i class="fas fa-child"></i> ${user.cantidadHijos || 0} hijo(s)
                                    </span>
                                </td>
                                <td>
                                    <span style="background: #d1fae5; color: #059669; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                        <i class="fas fa-check-circle"></i> Activo
                                    </span>
                                </td>
                                <td>
                                    <div style="display: flex; gap: 8px;">
                                        <button class="btn-icon" onclick="verDetallePadre(${user.id})" title="Ver detalles" style="background: #dbeafe; width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; color: #2563eb;">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon" onclick="editarUsuario(${user.id})" title="Editar" style="background: #fed7aa; width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; color: #d97706;">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon" onclick="eliminarUsuario(${user.id})" title="Eliminar" style="background: #fee2e2; width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; color: #dc2626;">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <button class="fab-button" onclick="abrirModalUsuario()">
            <i class="fas fa-plus"></i>
        </button>
    `;
}

function abrirModalUsuario(usuario = null) {
    // Crear modal dinámicamente
    const isEditing = usuario !== null;

    const modalHtml = `
        <div id="modalUsuarioPremium" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100000;">
            <div class="modal-content" style="max-width: 500px; animation: slideIn 0.3s ease;">
                <div class="modal-header" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
                    <h2 style="color: white; margin: 0;">
                        <i class="fas ${isEditing ? 'fa-edit' : 'fa-user-plus'}"></i> 
                        ${isEditing ? 'Editar Padre' : 'Nuevo Padre'}
                    </h2>
                    <span class="close-modal" onclick="cerrarModalUsuarioPremium()" style="color: white; font-size: 28px; cursor: pointer;">&times;</span>
                </div>
                <div class="modal-body" style="padding: 30px;">
                    <form id="formUsuarioPremium">
                        <input type="hidden" id="usuarioId" value="${usuario?.id || ''}">
                        
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-user"></i> Nombre completo
                            </label>
                            <input type="text" id="nombreCompleto" value="${usuario?.nombreCompleto || ''}" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px;"
                                   placeholder="Ej: Juan Pérez" required>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-envelope"></i> Email
                            </label>
                            <input type="email" id="email" value="${usuario?.email || ''}" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px;"
                                   placeholder="ejemplo@email.com" required>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-phone"></i> Teléfono
                            </label>
                            <input type="text" id="telefono" value="${usuario?.telefono || ''}" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px;"
                                   placeholder="999 888 777">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-map-marker-alt"></i> Dirección
                            </label>
                            <input type="text" id="direccion" value="${usuario?.direccion || ''}" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px;"
                                   placeholder="Dirección">
                        </div>
                        
                        ${!isEditing ? `
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-lock"></i> Contraseña
                            </label>
                            <input type="password" id="password" value="123456" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px;">
                            <small style="color: #6b7280;">Por defecto: 123456</small>
                        </div>
                        ` : ''}
                        
                        <div style="display: flex; gap: 12px; margin-top: 20px;">
                            <button type="submit" class="btn-primary" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                                <i class="fas fa-save"></i> ${isEditing ? 'Actualizar' : 'Guardar'}
                            </button>
                            <button type="button" onclick="cerrarModalUsuarioPremium()" class="btn-outline" style="flex: 1; padding: 14px;">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('modalUsuarioPremium');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Configurar evento del formulario
    const form = document.getElementById('formUsuarioPremium');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarUsuario();
        });
    }
}

function cerrarModalUsuarioPremium() {
    const modal = document.getElementById('modalUsuarioPremium');
    if (modal) modal.remove();
}

async function guardarUsuario() {
    const id = document.getElementById('usuarioId').value;
    const usuario = {
        nombreCompleto: document.getElementById('nombreCompleto').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        rol: 'parent',
        activo: true
    };

    const password = document.getElementById('password')?.value;
    if (password && !id) {
        usuario.password = password;
    }

    const submitBtn = document.querySelector('#modalUsuarioPremium button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    submitBtn.disabled = true;

    try {
        if (id) {
            await api.updateUsuario(id, usuario);
            mostrarToastAdmin('Padre actualizado correctamente', 'success');
        } else {
            await api.createUsuario(usuario);
            mostrarToastAdmin('Padre creado correctamente', 'success');
        }
        cerrarModalUsuarioPremium();
        cargarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        mostrarToastAdmin('Error al guardar: ' + (error.message || 'Intente nuevamente'), 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function editarUsuario(id) {
    const usuario = usuariosData.find(u => u.id === id);
    if (usuario) {
        abrirModalUsuario(usuario);
    }
}

async function eliminarUsuario(id) {
    const usuario = usuariosData.find(u => u.id === id);
    const hijos = await api.getEstudiantesByUsuario(id);

    if (hijos.length > 0) {
        if (!confirm(`⚠️ El padre "${usuario?.nombreCompleto}" tiene ${hijos.length} hijo(s) asignado(s).\n\n¿Eliminar también los estudiantes?`)) {
            return;
        }
    } else {
        if (!confirm(`¿Eliminar al padre "${usuario?.nombreCompleto}"?`)) {
            return;
        }
    }

    try {
        await api.deleteUsuario(id);
        mostrarToastAdmin('Padre eliminado correctamente', 'success');
        cargarUsuarios();
    } catch (error) {
        mostrarToastAdmin('Error al eliminar', 'error');
    }
}

async function verDetallePadre(id) {
    const usuario = usuariosData.find(u => u.id === id);
    const estudiantes = await api.getEstudiantesByUsuario(id);

    const modalHtml = `
        <div id="modalDetallePadre" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 600px; animation: slideIn 0.3s ease;">
                <div class="modal-header" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
                    <h2 style="color: white; margin: 0;">
                        <i class="fas fa-user-circle"></i> Detalle del Padre
                    </h2>
                    <span class="close-modal" onclick="cerrarModalDetallePadre()" style="color: white; font-size: 28px; cursor: pointer;">&times;</span>
                </div>
                <div class="modal-body" style="padding: 30px;">
                    <div style="display: flex; gap: 20px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
                        <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user-friends" style="font-size: 32px; color: white;"></i>
                        </div>
                        <div>
                            <h3 style="margin: 0 0 5px 0;">${usuario?.nombreCompleto}</h3>
                            <p style="margin: 0; color: #6b7280;"><i class="fas fa-envelope"></i> ${usuario?.email}</p>
                            <p style="margin: 5px 0 0 0; color: #6b7280;"><i class="fas fa-phone"></i> ${usuario?.telefono || 'No registrado'}</p>
                        </div>
                    </div>
                    
                    <h4 style="margin-bottom: 15px;"><i class="fas fa-child"></i> Hijos Registrados</h4>
                    
                    ${estudiantes.length === 0 ? `
                        <div style="text-align: center; padding: 30px; background: #f9fafb; border-radius: 12px;">
                            <i class="fas fa-user-graduate" style="font-size: 48px; color: #9ca3af;"></i>
                            <p>No tiene hijos registrados</p>
                            <button class="btn-primary" onclick="cerrarModalDetallePadre(); window.cambiarPaginaAdmin('estudiantes')">
                                Asignar estudiante
                            </button>
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${estudiantes.map(est => `
                                <div style="display: flex; align-items: center; gap: 15px; padding: 12px; background: #f9fafb; border-radius: 12px;">
                                    <div style="width: 45px; height: 45px; background: #dbeafe; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-user-graduate" style="color: #2563eb;"></i>
                                    </div>
                                    <div style="flex: 1;">
                                        <strong>${est.nombreCompleto}</strong>
                                        <div style="font-size: 12px; color: #6b7280;">${est.grado}° "${est.seccion}" | Cód: ${est.codigoEstudiante}</div>
                                    </div>
                                    <button class="btn-icon" onclick="verEstadoCuentaAdmin(${est.id})" style="background: #dbeafe; padding: 8px 12px; border-radius: 8px;">
                                        <i class="fas fa-chart-line"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('modalDetallePadre');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function cerrarModalDetallePadre() {
    const modal = document.getElementById('modalDetallePadre');
    if (modal) modal.remove();
}

async function verEstadoCuentaAdmin(estudianteId) {
    cerrarModalDetallePadre();
    // Cambiar a la vista de estudiantes y ver estado de cuenta
    // Por ahora solo mostrar alert
    alert('Función de estado de cuenta en desarrollo');
}

function mostrarToastAdmin(mensaje, tipo) {
    const toast = document.createElement('div');
    toast.className = `toast-${tipo}`;
    toast.innerHTML = `<i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${mensaje}`;
    toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; background: ${tipo === 'success' ? '#10b981' : '#ef4444'}; color: white; padding: 12px 20px; border-radius: 12px; z-index: 9999; animation: fadeIn 0.3s;`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function mostrarLoadingAdmin() {
    const content = document.getElementById('admin-content');
    if (content) {
        content.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Cargando...</p>
            </div>
        `;
    }
}

function mostrarErrorAdmin(mensaje) {
    const content = document.getElementById('admin-content');
    if (content) {
        content.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ef4444;"></i>
                <p>${mensaje}</p>
                <button class="btn-primary" onclick="cargarUsuarios()">Reintentar</button>
            </div>
        `;
    }
}

// ============================================
// MODAL PREMIUM PARA NUEVO PADRE - VERSIÓN DEFINITIVA
// ============================================

window.abrirModalNuevoPadre = function (usuario = null) {
    console.log('Abriendo modal premium para padre');

    // Eliminar modal existente
    const existingModal = document.getElementById('modalNuevoPadreDefinitivo');
    if (existingModal) existingModal.remove();

    const isEditing = usuario !== null;

    const modalHtml = `
        <div id="modalNuevoPadreDefinitivo" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100000;">
            <div style="background: white; border-radius: 24px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: fadeInUp 0.3s ease;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; border-radius: 24px 24px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="color: white; margin: 0; font-size: 1.5rem;">
                        <i class="fas ${isEditing ? 'fa-edit' : 'fa-user-plus'}"></i> 
                        ${isEditing ? 'Editar Padre' : 'Nuevo Padre'}
                    </h2>
                    <button onclick="document.getElementById('modalNuevoPadreDefinitivo').remove()" style="background: none; border: none; color: white; font-size: 28px; cursor: pointer; line-height: 1;">&times;</button>
                </div>
                
                <!-- Body -->
                <div style="padding: 30px;">
                    <form id="formNuevoPadreDefinitivo">
                        <input type="hidden" id="usuarioIdField" value="${usuario?.id || ''}">
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i class="fas fa-user"></i> Nombre completo
                            </label>
                            <input type="text" id="nombreCompletoField" value="${usuario?.nombreCompleto || ''}" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; transition: border 0.3s;"
                                   placeholder="Ej: Juan Pérez" required>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i class="fas fa-envelope"></i> Email
                            </label>
                            <input type="email" id="emailField" value="${usuario?.email || ''}" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px;"
                                   placeholder="ejemplo@email.com" required>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i class="fas fa-phone"></i> Teléfono
                            </label>
                            <input type="text" id="telefonoField" value="${usuario?.telefono || ''}" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px;"
                                   placeholder="999 888 777">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i class="fas fa-map-marker-alt"></i> Dirección
                            </label>
                            <input type="text" id="direccionField" value="${usuario?.direccion || ''}" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px;"
                                   placeholder="Dirección">
                        </div>
                        
                        ${!isEditing ? `
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i class="fas fa-lock"></i> Contraseña
                            </label>
                            <input type="password" id="passwordField" value="123456" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px;">
                            <small style="color: #6b7280; display: block; margin-top: 5px;">Por defecto: 123456</small>
                        </div>
                        ` : ''}
                        
                        <div style="display: flex; gap: 12px; margin-top: 25px;">
                            <button type="submit" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px;">
                                <i class="fas fa-save"></i> ${isEditing ? 'Actualizar' : 'Guardar'}
                            </button>
                            <button type="button" onclick="document.getElementById('modalNuevoPadreDefinitivo').remove()" style="flex: 1; padding: 14px; background: white; border: 2px solid #e5e7eb; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px;">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Configurar el formulario
    const form = document.getElementById('formNuevoPadreDefinitivo');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('usuarioIdField').value;
            const usuarioData = {
                nombreCompleto: document.getElementById('nombreCompletoField').value,
                email: document.getElementById('emailField').value,
                telefono: document.getElementById('telefonoField').value,
                direccion: document.getElementById('direccionField').value,
                rol: 'parent',
                activo: true
            };

            const password = document.getElementById('passwordField')?.value;
            if (password && !id) {
                usuarioData.password = password;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            submitBtn.disabled = true;

            try {
                if (id) {
                    await api.updateUsuario(id, usuarioData);
                    mostrarToastAdmin('Padre actualizado correctamente', 'success');
                } else {
                    await api.createUsuario(usuarioData);
                    mostrarToastAdmin('Padre creado correctamente', 'success');
                }
                document.getElementById('modalNuevoPadreDefinitivo').remove();
                cargarUsuarios();
            } catch (error) {
                console.error('Error:', error);
                mostrarToastAdmin('Error al guardar: ' + (error.message || 'Intente nuevamente'), 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
};
// ============================================
// FUNCIONES GLOBALES ASEGURADAS
// ============================================

// Asegurar que las funciones principales estén disponibles
window.cargarUsuarios = cargarUsuarios;
window.abrirModalNuevoPadre = window.abrirModalNuevoPadre;
window.cerrarModalUsuarioPremium = cerrarModalUsuarioPremium;
window.guardarUsuario = guardarUsuario;
window.mostrarToastAdmin = mostrarToastAdmin;
window.verDetallePadre = verDetallePadre;
window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;