-- =====================================================
-- DATOS DE EJEMPLO CON FECHAS CORRECTAS
-- =====================================================

-- Usuarios (Padres + Admin)
INSERT OR IGNORE INTO usuarios (nombre_completo, username, email, password, rol, activo) VALUES
('Ricardo Gomez', 'ricardo', 'ricardo@email.com', '123456', 'parent', 1),
('Maria Lopez', 'mlopez', 'maria@email.com', '123456', 'parent', 1),
('Administrador', 'admin', 'admin@claretiano.edu', 'admin123', 'admin', 1);

-- Conceptos de pago
INSERT OR IGNORE INTO conceptos_pago (nombre, descripcion, monto_base) VALUES
('Pensión Mensual', 'Pago mensual por concepto de pensión', 450.00),
('Matrícula', 'Pago anual de matrícula', 200.00),
('Material Educativo', 'Cuotas para materiales y útiles', 80.00),
('Actividades Extracurriculares', 'Deportes, arte, música', 60.00);

-- Estudiantes
INSERT OR IGNORE INTO estudiantes (usuario_id, nombre_completo, grado, seccion, codigo_estudiante) VALUES
(1, 'Carlos Gomez', '5to', 'A', 'EST2024001'),
(1, 'Ana Gomez', '3ro', 'B', 'EST2024002'),
(2, 'Luis Lopez', '1ro', 'A', 'EST2024003');

-- Deudas (con fechas en formato con hora)
INSERT OR IGNORE INTO deudas (
    estudiante_id,
    concepto_pago_id,
    monto_total,
    saldo_pendiente,
    fecha_vencimiento,
    estado,
    anio_academico,
    mes_correspondiente
) VALUES
(1, 1, 450.00, 450.00, '2024-12-31 00:00:00', 'PENDIENTE', 2024, 12),
(1, 2, 200.00, 200.00, '2024-12-15 00:00:00', 'PENDIENTE', 2024, NULL),
(2, 1, 450.00, 450.00, '2024-12-31 00:00:00', 'PENDIENTE', 2024, 12),
(3, 1, 450.00, 450.00, '2024-12-31 00:00:00', 'PENDIENTE', 2024, 12);