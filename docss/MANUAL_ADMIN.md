# Manual del Administrador

## ClaretianPay - Sistema de Gestión de Pagos Educativos

---

## 1. Acceso al Sistema

1. Abrir `http://localhost:8080/login.html`
2. Ingresar credenciales de administrador:
   - Email: `admin@claretiano.edu`
   - Contraseña: `admin123`
3. Será redirigido al panel administrativo

---

## 2. Dashboard

El dashboard muestra:

- **Estadísticas**: Padres registrados, estudiantes, deudas pendientes, total recaudado, morosidad
- **Gráficos**: Pagos por mes (barras) y Deudas por estado (pastel)
- **Acciones rápidas**: Accesos directos a las principales funcionalidades

---

## 3. Gestión de Padres

- **Listar**: Muestra tabla con todos los padres registrados
- **Crear**: Click en "Nuevo Padre", completar formulario
- **Editar**: Click en icono de lápiz
- **Eliminar**: Click en icono de papelera (desactivación lógica)

---

## 4. Gestión de Estudiantes

- **Listar**: Muestra todos los estudiantes con su padre asignado
- **Crear**: Click en "Nuevo Estudiante", seleccionar padre, completar datos
- **Editar**: Click en icono de lápiz
- **Eliminar**: Click en icono de papelera

---

## 5. Conceptos de Pago

- **Listar**: Muestra pensión mensual, matrícula, material educativo, etc.
- **Crear**: Definir nombre, descripción, monto base y periodicidad
- **Editar/Eliminar**: Iconos respectivos

---

## 6. Gestión de Deudas

- **Listar**: Todas las deudas con filtros por estudiante y estado
- **Registrar**: Seleccionar estudiante, concepto, monto, fecha vencimiento
- **Detalle**: Ver historial de pagos de cada deuda

---

## 7. Reportes Globales

### Dashboard Financiero
- Total recaudado, total deuda, morosidad
- Gráficos interactivos

### Deudas Morosas
- Deudas con más de 30 días de vencimiento

### Exportación
- Reportes exportables a Excel

---

## 8. Auditoría

Muestra el registro cronológico de todas las acciones:
- Inicios de sesión
- Creación/edición/eliminación de registros
- Pagos realizados
- Generación de reportes

---

## 9. Notificaciones

El sistema envía notificaciones automáticas por:
- Pago registrado
- Deuda próxima a vencer (7, 3 y 1 día antes)
- Deuda vencida

---

## 10. Buenas Prácticas

1. Verificar datos antes de registrar deudas
2. Revisar la auditoría periódicamente
3. Mantener actualizados los conceptos de pago
4. Exportar reportes al finalizar cada período
