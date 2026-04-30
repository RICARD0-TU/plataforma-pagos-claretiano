// ============================================
// GESTIÓN DE CONCEPTOS DE PAGO
// ============================================

let conceptosData = [];

async function cargarConceptos() {
    mostrarLoadingAdmin();
    try {
        conceptosData = await api.getConceptosPago();
        renderConceptos(conceptosData);
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
            <p>Define los tipos de pago que pueden registrar los padres</p>
        </div>
        
        <div class="admin-table-container">
            <div class="admin-table-header">
                <h3>Lista de Conceptos</h3>
                <button class="btn-primary" onclick="abrirModalConcepto()">
                    <i class="fas fa-plus"></i> Nuevo Concepto
                </button>
            </div>
            <table class="admin-table">
                <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Monto Base</th><th>Periodicidad</th><th>Acciones</th></tr></thead>
                <tbody>
                    ${conceptos.length === 0 ? '<tr><td colspan="6" style="text-align: center;">No hay conceptos</td></tr>' :
                        conceptos.map(c => `<tr>
                            <td>${c.id}</td><td><strong>${c.nombre}</strong></td><td>${c.descripcion || '-'}</td>
                            <td>${formatearMoneda(c.montoBase)}</td><td>${c.periodicidad}</td>
                            <td>
                                <button class="btn-icon btn-edit-icon" onclick="editarConcepto(${c.id})"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon btn-delete-icon" onclick="eliminarConcepto(${c.id})"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`).join('')
                    }
                </tbody>
            </table>
        </div>
        
        <button class="fab-button" onclick="abrirModalConcepto()"><i class="fas fa-plus"></i></button>
    `;
}

function abrirModalConcepto(concepto = null) {
    if (concepto) {
        document.getElementById('modalConceptoTitle').textContent = 'Editar Concepto';
        document.getElementById('conceptoId').value = concepto.id;
        document.getElementById('nombre').value = concepto.nombre;
        document.getElementById('descripcion').value = concepto.descripcion || '';
        document.getElementById('montoBase').value = concepto.montoBase;
        document.getElementById('periodicidad').value = concepto.periodicidad;
    } else {
        document.getElementById('modalConceptoTitle').textContent = 'Nuevo Concepto';
        document.getElementById('formConcepto').reset();
        document.getElementById('conceptoId').value = '';
    }
    document.getElementById('modalConcepto').style.display = 'flex';
}

function editarConcepto(id) {
    const concepto = conceptosData.find(c => c.id === id);
    if (concepto) abrirModalConcepto(concepto);
}

async function eliminarConcepto(id) {
    if (confirm('¿Eliminar este concepto?')) {
        try {
            await api.deleteConceptoPago(id);
            mostrarToastAdmin('Concepto eliminado', 'success');
            cargarConceptos();
        } catch (error) {
            mostrarToastAdmin('Error al eliminar', 'error');
        }
    }
}

document.getElementById('formConcepto')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('conceptoId').value;
    const concepto = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        montoBase: parseFloat(document.getElementById('montoBase').value),
        periodicidad: document.getElementById('periodicidad').value
    };
    
    try {
        if (id) {
            await api.updateConceptoPago(id, concepto);
            mostrarToastAdmin('Concepto actualizado', 'success');
        } else {
            await api.createConceptoPago(concepto);
            mostrarToastAdmin('Concepto creado', 'success');
        }
        cerrarModal('modalConcepto');
        cargarConceptos();
    } catch (error) {
        mostrarToastAdmin('Error al guardar', 'error');
    }
});