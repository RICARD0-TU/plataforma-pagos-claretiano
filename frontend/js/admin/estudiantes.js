let usuariosList = [];

window.cargarEstudiantesAdmin = cargarEstudiantesAdmin;
window.editarEstudianteAdmin = editarEstudianteAdmin;
window.eliminarEstudianteAdmin = eliminarEstudianteAdmin;
window.abrirModalEstudiante = abrirModalEstudiante;

async function cargarEstudiantesAdmin() {
    mostrarLoadingAdmin();
    try {
        const [estudiantes, usuarios] = await Promise.all([
            api.getEstudiantes(),
            api.getUsuarios()
        ]);
        usuariosList = usuarios;
        renderEstudiantesAdmin(estudiantes);
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        mostrarErrorAdmin('No se pudieron cargar los estudiantes');
    }
}

function renderEstudiantesAdmin(estudiantes) {
    const content = document.getElementById('admin-content');
    content.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-user-graduate"></i> Gesti\u00f3n de Estudiantes</h2>
            <p>Administra los estudiantes registrados en el sistema</p>
        </div>
        <div class="admin-table-container">
            <div class="admin-table-header">
                <h3>Lista de Estudiantes</h3>
                <button class="btn-primary" onclick="abrirModalEstudiante()">
                    <i class="fas fa-plus"></i> Nuevo Estudiante
                </button>
            </div>
            <table class="admin-table">
                <thead><tr><th>ID</th><th>Nombre</th><th>Padre</th><th>Grado</th><th>Secci\u00f3n</th><th>C\u00f3digo</th><th>Acciones</th></tr></thead>
                <tbody>
                    ${estudiantes.length === 0 ? '<tr><td colspan="7" style="text-align:center;padding:40px;"><i class="fas fa-user-graduate" style="font-size:48px;color:#9ca3af;"></i><p>No hay estudiantes registrados</p></td></tr>' :
                        estudiantes.map(est => {
                        const padre = usuariosList.find(u => u.id === est.usuario?.id);
                        return `<tr>
                            <td>${est.id}</td>
                            <td><strong>${est.nombreCompleto}</strong></td>
                            <td>${padre?.nombreCompleto || 'N/A'}</td>
                            <td>${est.grado}</td>
                            <td>${est.seccion || '-'}</td>
                            <td>${est.codigoEstudiante || '-'}</td>
                            <td>
                                <button class="btn-icon" onclick="editarEstudianteAdmin(${est.id})" style="color:#3b82f6;"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon" onclick="eliminarEstudianteAdmin(${est.id})" style="color:#ef4444;"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        <button class="fab-button" onclick="abrirModalEstudiante()"><i class="fas fa-plus"></i></button>
    `;
}

function abrirModalEstudiante(estudiante) {
    const selectPadre = document.getElementById('usuarioId');
    selectPadre.innerHTML = '<option value="">Seleccione un padre</option>' +
        usuariosList.filter(u => u.rol === 'parent' || !u.rol).map(u =>
            `<option value="${u.id}">${u.nombreCompleto}</option>`
        ).join('');

    document.getElementById('formEstudiante').reset();
    document.getElementById('modalEstudianteTitle').textContent = 'Nuevo Estudiante';
    document.getElementById('estudianteId').value = '';

    if (estudiante) {
        document.getElementById('modalEstudianteTitle').textContent = 'Editar Estudiante';
        document.getElementById('estudianteId').value = estudiante.id;
        document.getElementById('estNombreCompleto').value = estudiante.nombreCompleto;
        document.getElementById('usuarioId').value = estudiante.usuario?.id || '';
        document.getElementById('grado').value = estudiante.grado;
        document.getElementById('seccion').value = estudiante.seccion || '';
        document.getElementById('codigoEstudiante').value = estudiante.codigoEstudiante || '';
    }

    document.getElementById('modalEstudiante').style.display = 'flex';
}

async function editarEstudianteAdmin(id) {
    try {
        const estudiante = await api.getEstudiante(id);
        abrirModalEstudiante(estudiante);
    } catch (error) {
        mostrarErrorAdmin('Error al obtener datos del estudiante');
    }
}

async function eliminarEstudianteAdmin(id) {
    if (!confirm('¿Estás seguro de eliminar este estudiante?')) return;
    try {
        await api.deleteEstudiante(id);
        mostrarToastAdmin('Estudiante eliminado correctamente', 'success');
        cargarEstudiantesAdmin();
    } catch (error) {
        mostrarErrorAdmin('Error al eliminar estudiante');
    }
}

document.getElementById('formEstudiante')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('estudianteId').value;
    const data = {
        nombreCompleto: document.getElementById('estNombreCompleto').value,
        usuario: { id: parseInt(document.getElementById('usuarioId').value) },
        grado: document.getElementById('grado').value,
        seccion: document.getElementById('seccion').value,
        codigoEstudiante: document.getElementById('codigoEstudiante').value
    };

    try {
        if (id) {
            await api.updateEstudiante(id, data);
            mostrarToastAdmin('Estudiante actualizado', 'success');
        } else {
            await api.createEstudiante(data);
            mostrarToastAdmin('Estudiante creado', 'success');
        }
        cerrarModal('modalEstudiante');
        cargarEstudiantesAdmin();
    } catch (error) {
        mostrarErrorAdmin('Error al guardar estudiante');
    }
});
