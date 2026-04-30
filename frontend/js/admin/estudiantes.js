// ============================================
// GESTIÓN DE ESTUDIANTES
// ============================================

let estudiantesData = [];
let padresList = [];

async function cargarEstudiantesAdmin() {
    mostrarLoadingAdmin();
    try {
        const [estudiantes, usuarios] = await Promise.all([
            api.getEstudiantes(),
            api.getUsuarios()
        ]);
        estudiantesData = estudiantes;
        padresList = usuarios.filter(u => u.rol === 'parent' || !u.rol);
        renderEstudiantesAdmin(estudiantesData);
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        mostrarErrorAdmin('No se pudieron cargar los estudiantes');
    }
}

function renderEstudiantesAdmin(estudiantes) {
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-user-graduate"></i> Gestión de Estudiantes</h2>
            <p>Administra los estudiantes y su asignación a padres</p>
        </div>
        
        <div class="admin-table-container">
            <div class="admin-table-header">
                <h3>Lista de Estudiantes</h3>
                <button class="btn-primary" onclick="abrirModalEstudiante()">
                    <i class="fas fa-plus"></i> Nuevo Estudiante
                </button>
            </div>
            <table class="admin-table">
                <thead>
                    <tr><th>ID</th><th>Nombre</th><th>Padre</th><th>Grado</th><th>Código</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    ${estudiantes.length === 0 ? '<tr><td colspan="6" style="text-align: center;">No hay estudiantes</td></tr>' : 
                        estudiantes.map(est => {
                            const padre = padresList.find(p => p.id === est.usuario?.id);
                            return `<tr>
                                <td>${est.id}</td>
                                <td><strong>${est.nombreCompleto}</strong></td>
                                <td>${padre?.nombreCompleto || 'Sin asignar'}</td>
                                <td>${est.grado} "${est.seccion || ''}"</td>
                                <td>${est.codigoEstudiante}</td>
                                <td>
                                    <button class="btn-icon btn-edit-icon" onclick="editarEstudianteAdmin(${est.id})"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon btn-delete-icon" onclick="eliminarEstudianteAdmin(${est.id})"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>`;
                        }).join('')
                    }
                </tbody>
            </table>
        </div>
        
        <button class="fab-button" onclick="abrirModalEstudiante()"><i class="fas fa-plus"></i></button>
    `;
}

function abrirModalEstudiante(estudiante = null) {
    const selectPadre = document.getElementById('usuarioId');
    selectPadre.innerHTML = '<option value="">Seleccione un padre</option>' + 
        padresList.map(p => `<option value="${p.id}">${p.nombreCompleto} (${p.email})</option>`).join('');
    
    if (estudiante) {
        document.getElementById('modalEstudianteTitle').textContent = 'Editar Estudiante';
        document.getElementById('estudianteId').value = estudiante.id;
        document.getElementById('estNombreCompleto').value = estudiante.nombreCompleto;
        document.getElementById('usuarioId').value = estudiante.usuario?.id || '';
        document.getElementById('grado').value = estudiante.grado;
        document.getElementById('seccion').value = estudiante.seccion || '';
        document.getElementById('codigoEstudiante').value = estudiante.codigoEstudiante;
    } else {
        document.getElementById('modalEstudianteTitle').textContent = 'Nuevo Estudiante';
        document.getElementById('formEstudiante').reset();
        document.getElementById('estudianteId').value = '';
    }
    document.getElementById('modalEstudiante').style.display = 'flex';
}

function editarEstudianteAdmin(id) {
    const est = estudiantesData.find(e => e.id === id);
    if (est) abrirModalEstudiante(est);
}

async function eliminarEstudianteAdmin(id) {
    if (confirm('¿Eliminar este estudiante?')) {
        try {
            await api.deleteEstudiante(id);
            mostrarToastAdmin('Estudiante eliminado', 'success');
            cargarEstudiantesAdmin();
        } catch (error) {
            mostrarToastAdmin('Error al eliminar', 'error');
        }
    }
}

document.getElementById('formEstudiante')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('estudianteId').value;
    const estudiante = {
        nombreCompleto: document.getElementById('estNombreCompleto').value,
        usuario: { id: parseInt(document.getElementById('usuarioId').value) },
        grado: document.getElementById('grado').value,
        seccion: document.getElementById('seccion').value,
        codigoEstudiante: document.getElementById('codigoEstudiante').value
    };
    
    try {
        if (id) {
            await api.updateEstudiante(id, estudiante);
            mostrarToastAdmin('Estudiante actualizado', 'success');
        } else {
            await api.createEstudiante(estudiante);
            mostrarToastAdmin('Estudiante creado', 'success');
        }
        cerrarModal('modalEstudiante');
        cargarEstudiantesAdmin();
    } catch (error) {
        mostrarToastAdmin('Error al guardar', 'error');
    }
});