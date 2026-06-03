window.cargarConceptos = cargarConceptos;
window.abrirModalConcepto = abrirModalConcepto;
window.editarConcepto = editarConcepto;
window.eliminarConcepto = eliminarConcepto;

async function cargarConceptos() {
    mostrarLoadingAdmin();
    try {
        const conceptos = await api.getConceptosPago();
        renderConceptos(conceptos);
    } catch (error) {
        console.error('Error cargando conceptos:', error);
        mostrarErrorAdmin('No se pudieron cargar los conceptos');
    }
}

function renderConceptos(conceptos) {
    const content = document.getElementById('admin-content');
    content.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-tags"></i> Conceptos de Pago</h2>
            <p>Define los tipos de pago disponibles en el colegio</p>
        </div>
        <div class="admin-table-container">
            <div class="admin-table-header">
                <h3>Lista de Conceptos</h3>
                <button class="btn-primary" onclick="abrirModalConcepto()">
                    <i class="fas fa-plus"></i> Nuevo Concepto
                </button>
            </div>
            <table class="admin-table">
                <thead><tr><th>ID</th><th>Nombre</th><th>Descripci\u00f3n</th><th>Monto Base</th><th>Periodicidad</th><th>Acciones</th></tr></thead>
                <tbody>
                    ${conceptos.length === 0 ? '<tr><td colspan="6" style="text-align:center;padding:40px;"><i class="fas fa-tags" style="font-size:48px;color:#9ca3af;"></i><p>No hay conceptos de pago registrados</p></td></tr>' :
                        conceptos.map(c => `<tr>
                        <td>${c.id}</td>
                        <td><strong>${c.nombre}</strong></td>
                        <td>${c.descripcion || '-'}</td>
                        <td>${formatearMoneda(c.montoBase)}</td>
                        <td><span class="badge badge-pending">${c.periodicidad || 'MENSUAL'}</span></td>
                        <td>
                            <button class="btn-icon" onclick="editarConcepto(${c.id})" style="color:#3b82f6;"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon" onclick="eliminarConcepto(${c.id})" style="color:#ef4444;"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
        <button class="fab-button" onclick="abrirModalConcepto()"><i class="fas fa-plus"></i></button>
    `;
}

function abrirModalConcepto(concepto) {
    document.getElementById('formConcepto').reset();
    document.getElementById('modalConceptoTitle').textContent = 'Nuevo Concepto de Pago';
    document.getElementById('conceptoId').value = '';

    if (concepto) {
        document.getElementById('modalConceptoTitle').textContent = 'Editar Concepto';
        document.getElementById('conceptoId').value = concepto.id;
        document.getElementById('nombre').value = concepto.nombre;
        document.getElementById('descripcion').value = concepto.descripcion || '';
        document.getElementById('montoBase').value = concepto.montoBase;
        document.getElementById('periodicidad').value = concepto.periodicidad || 'MENSUAL';
    }

    document.getElementById('modalConcepto').style.display = 'flex';
}

async function editarConcepto(id) {
    try {
        const concepto = await api.getConceptoPago(id);
        abrirModalConcepto(concepto);
    } catch (error) {
        mostrarErrorAdmin('Error al obtener datos del concepto');
    }
}

async function eliminarConcepto(id) {
    if (!confirm('¿Estás seguro de eliminar este concepto?')) return;
    try {
        await api.deleteConceptoPago(id);
        mostrarToastAdmin('Concepto eliminado', 'success');
        cargarConceptos();
    } catch (error) {
        mostrarErrorAdmin('Error al eliminar concepto');
    }
}

document.getElementById('formConcepto')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('conceptoId').value;
    const data = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        montoBase: parseFloat(document.getElementById('montoBase').value),
        periodicidad: document.getElementById('periodicidad').value
    };

    try {
        if (id) {
            await api.updateConceptoPago(id, data);
            mostrarToastAdmin('Concepto actualizado', 'success');
        } else {
            await api.createConceptoPago(data);
            mostrarToastAdmin('Concepto creado', 'success');
        }
        cerrarModal('modalConcepto');
        cargarConceptos();
    } catch (error) {
        mostrarErrorAdmin('Error al guardar concepto');
    }
});
