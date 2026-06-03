-- =====================================================
-- DATOS DE EJEMPLO (PostgreSQL) - Versión Mejorada
-- Contraseñas: Admin123!, Ricardo123!, Maria123!, Carlos123!, Ana123!
-- =====================================================

-- =====================================================
-- USUARIOS
-- =====================================================
INSERT INTO usuarios (nombre_completo, email, password, rol, activo)
SELECT 'Administrador', 'admin@claretiano.edu', '$2a$10$aVcbQpJlVfBBNe73qrqcP.nf6X/bGVpPDWPHgan85vlK.AuLjJTpS', 'admin', TRUE
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@claretiano.edu');

INSERT INTO usuarios (nombre_completo, email, password, rol, activo)
SELECT 'Ricardo Gomez', 'ricardo@email.com', '$2a$10$p1/KiBiV1TN6P0/cHox/o.L4XzTJSujmnvNKgYqhWnuuD9rJeYTEK', 'parent', TRUE
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'ricardo@email.com');

INSERT INTO usuarios (nombre_completo, email, password, rol, activo)
SELECT 'Maria Lopez', 'maria@email.com', '$2a$10$fxUyKGwKeCC6CTcgx2nxcOG7fvE4CrXrmUuE4MBqBuUmfw3JPXIv2', 'parent', TRUE
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'maria@email.com');

INSERT INTO usuarios (nombre_completo, email, password, rol, activo)
SELECT 'Carlos Silva', 'carlos@email.com', '$2a$10$TfIXoW2doGcclrPNkLSUIuNvn7waUVObCtGFRyHWuGpmz6YrlqB.2', 'parent', TRUE
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'carlos@email.com');

INSERT INTO usuarios (nombre_completo, email, password, rol, activo)
SELECT 'Ana Torres', 'ana@email.com', '$2a$10$4Ko1KHC9xXkFsdka8vD51eGaRfNLYcljsGD90f4ttYLUvJ9KL6b1u', 'parent', TRUE
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'ana@email.com');

-- =====================================================
-- CONCEPTOS DE PAGO
-- =====================================================
INSERT INTO conceptos_pago (nombre, descripcion, monto_base, periodicidad)
SELECT 'Pensión Mensual', 'Pago mensual por concepto de pensión', 450.00, 'MENSUAL'
WHERE NOT EXISTS (SELECT 1 FROM conceptos_pago WHERE nombre = 'Pensión Mensual');

INSERT INTO conceptos_pago (nombre, descripcion, monto_base, periodicidad)
SELECT 'Matrícula', 'Pago anual de matrícula', 200.00, 'ANUAL'
WHERE NOT EXISTS (SELECT 1 FROM conceptos_pago WHERE nombre = 'Matrícula');

INSERT INTO conceptos_pago (nombre, descripcion, monto_base, periodicidad)
SELECT 'Material Educativo', 'Cuotas para materiales y útiles escolares', 80.00, 'MENSUAL'
WHERE NOT EXISTS (SELECT 1 FROM conceptos_pago WHERE nombre = 'Material Educativo');

INSERT INTO conceptos_pago (nombre, descripcion, monto_base, periodicidad)
SELECT 'Actividades Extracurriculares', 'Deportes, arte, música y talleres', 60.00, 'MENSUAL'
WHERE NOT EXISTS (SELECT 1 FROM conceptos_pago WHERE nombre = 'Actividades Extracurriculares');

INSERT INTO conceptos_pago (nombre, descripcion, monto_base, periodicidad)
SELECT 'Tutoría Personalizada', 'Clases de reforzamiento académico', 100.00, 'MENSUAL'
WHERE NOT EXISTS (SELECT 1 FROM conceptos_pago WHERE nombre = 'Tutoría Personalizada');

INSERT INTO conceptos_pago (nombre, descripcion, monto_base, periodicidad)
SELECT 'Seguro Escolar', 'Seguro contra accidentes escolares', 35.00, 'ANUAL'
WHERE NOT EXISTS (SELECT 1 FROM conceptos_pago WHERE nombre = 'Seguro Escolar');

-- =====================================================
-- ESTUDIANTES
-- =====================================================
INSERT INTO estudiantes (usuario_id, nombre_completo, grado, seccion, codigo_estudiante)
SELECT u.id, 'Carlos Gomez', '5to', 'A', 'EST2024001'
FROM usuarios u WHERE u.email = 'ricardo@email.com'
AND NOT EXISTS (SELECT 1 FROM estudiantes WHERE codigo_estudiante = 'EST2024001');

INSERT INTO estudiantes (usuario_id, nombre_completo, grado, seccion, codigo_estudiante)
SELECT u.id, 'Ana Gomez', '3ro', 'B', 'EST2024002'
FROM usuarios u WHERE u.email = 'ricardo@email.com'
AND NOT EXISTS (SELECT 1 FROM estudiantes WHERE codigo_estudiante = 'EST2024002');

INSERT INTO estudiantes (usuario_id, nombre_completo, grado, seccion, codigo_estudiante)
SELECT u.id, 'Luis Lopez', '1ro', 'A', 'EST2024003'
FROM usuarios u WHERE u.email = 'maria@email.com'
AND NOT EXISTS (SELECT 1 FROM estudiantes WHERE codigo_estudiante = 'EST2024003');

INSERT INTO estudiantes (usuario_id, nombre_completo, grado, seccion, codigo_estudiante)
SELECT u.id, 'Sofia Silva', '2do', 'C', 'EST2024004'
FROM usuarios u WHERE u.email = 'carlos@email.com'
AND NOT EXISTS (SELECT 1 FROM estudiantes WHERE codigo_estudiante = 'EST2024004');

INSERT INTO estudiantes (usuario_id, nombre_completo, grado, seccion, codigo_estudiante)
SELECT u.id, 'Mateo Silva', '4to', 'A', 'EST2024005'
FROM usuarios u WHERE u.email = 'carlos@email.com'
AND NOT EXISTS (SELECT 1 FROM estudiantes WHERE codigo_estudiante = 'EST2024005');

INSERT INTO estudiantes (usuario_id, nombre_completo, grado, seccion, codigo_estudiante)
SELECT u.id, 'Lucia Torres', 'Inicial', 'B', 'EST2024006'
FROM usuarios u WHERE u.email = 'ana@email.com'
AND NOT EXISTS (SELECT 1 FROM estudiantes WHERE codigo_estudiante = 'EST2024006');

INSERT INTO estudiantes (usuario_id, nombre_completo, grado, seccion, codigo_estudiante)
SELECT u.id, 'Diego Torres', '6to', 'B', 'EST2024007'
FROM usuarios u WHERE u.email = 'ana@email.com'
AND NOT EXISTS (SELECT 1 FROM estudiantes WHERE codigo_estudiante = 'EST2024007');

-- =====================================================
-- DEUDAS
-- =====================================================
-- Carlos Gomez: Pensión Dic 2024 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico, mes_correspondiente)
SELECT e.id, c.id, 450.00, 0.00, 450.00, '2024-12-31', 'PENDIENTE', 2024, 12
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024001' AND c.nombre = 'Pensión Mensual'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024 AND d.mes_correspondiente = 12);

-- Carlos Gomez: Matrícula 2024 (PARCIAL - pagó 100 de 200)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico)
SELECT e.id, c.id, 200.00, 100.00, 100.00, '2024-12-15', 'PARCIAL', 2024
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024001' AND c.nombre = 'Matrícula'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024 AND d.estado = 'PARCIAL');

-- Carlos Gomez: Pensión Ene 2025 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico, mes_correspondiente)
SELECT e.id, c.id, 450.00, 0.00, 450.00, '2025-01-31', 'PENDIENTE', 2025, 1
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024001' AND c.nombre = 'Pensión Mensual'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2025 AND d.mes_correspondiente = 1);

-- Carlos Gomez: Material Educativo 2024 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico)
SELECT e.id, c.id, 80.00, 0.00, 80.00, '2024-12-20', 'PENDIENTE', 2024
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024001' AND c.nombre = 'Material Educativo'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024 AND c.nombre = 'Material Educativo');

-- Ana Gomez: Pensión Dic 2024 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico, mes_correspondiente)
SELECT e.id, c.id, 450.00, 0.00, 450.00, '2024-12-31', 'PENDIENTE', 2024, 12
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024002' AND c.nombre = 'Pensión Mensual'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024 AND d.mes_correspondiente = 12);

-- Ana Gomez: Actividades Extracurriculares 2024 (PAGADO)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico)
SELECT e.id, c.id, 60.00, 60.00, 0.00, '2024-11-30', 'PAGADO', 2024
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024002' AND c.nombre = 'Actividades Extracurriculares'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024 AND d.estado = 'PAGADO');

-- Ana Gomez: Material Educativo 2024 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico)
SELECT e.id, c.id, 80.00, 0.00, 80.00, '2024-12-31', 'PENDIENTE', 2024
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024002' AND c.nombre = 'Material Educativo'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024);

-- Luis Lopez: Pensión Nov 2024 (VENCIDO)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico, mes_correspondiente)
SELECT e.id, c.id, 450.00, 0.00, 450.00, '2024-11-30', 'VENCIDO', 2024, 11
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024003' AND c.nombre = 'Pensión Mensual'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024 AND d.mes_correspondiente = 11);

-- Luis Lopez: Material Educativo 2024 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico)
SELECT e.id, c.id, 80.00, 0.00, 80.00, '2024-12-31', 'PENDIENTE', 2024
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024003' AND c.nombre = 'Material Educativo'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024);

-- Luis Lopez: Tutoría Personalizada Ene 2025 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico, mes_correspondiente)
SELECT e.id, c.id, 100.00, 0.00, 100.00, '2025-01-15', 'PENDIENTE', 2025, 1
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024003' AND c.nombre = 'Tutoría Personalizada'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2025);

-- Sofia Silva: Matrícula 2025 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico)
SELECT e.id, c.id, 200.00, 0.00, 200.00, '2025-03-31', 'PENDIENTE', 2025
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024004' AND c.nombre = 'Matrícula'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2025);

-- Sofia Silva: Pensión Mar 2025 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico, mes_correspondiente)
SELECT e.id, c.id, 450.00, 0.00, 450.00, '2025-03-31', 'PENDIENTE', 2025, 3
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024004' AND c.nombre = 'Pensión Mensual'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2025 AND d.mes_correspondiente = 3);

-- Sofia Silva: Actividades Extracurriculares 2025 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico)
SELECT e.id, c.id, 60.00, 0.00, 60.00, '2025-04-30', 'PENDIENTE', 2025
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024004' AND c.nombre = 'Actividades Extracurriculares'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2025);

-- Mateo Silva: Pensión Dic 2024 (PAGADO)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico, mes_correspondiente)
SELECT e.id, c.id, 450.00, 450.00, 0.00, '2024-12-31', 'PAGADO', 2024, 12
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024005' AND c.nombre = 'Pensión Mensual'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024 AND d.mes_correspondiente = 12);

-- Mateo Silva: Seguro Escolar 2025 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico)
SELECT e.id, c.id, 35.00, 0.00, 35.00, '2025-04-30', 'PENDIENTE', 2025
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024005' AND c.nombre = 'Seguro Escolar'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2025);

-- Lucia Torres: Pensión Feb 2025 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico, mes_correspondiente)
SELECT e.id, c.id, 450.00, 0.00, 450.00, '2025-02-28', 'PENDIENTE', 2025, 2
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024006' AND c.nombre = 'Pensión Mensual'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2025 AND d.mes_correspondiente = 2);

-- Diego Torres: Pensión Dic 2024 (PARCIAL - pagó 200 de 450)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico, mes_correspondiente)
SELECT e.id, c.id, 450.00, 200.00, 250.00, '2024-12-31', 'PARCIAL', 2024, 12
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024007' AND c.nombre = 'Pensión Mensual'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024 AND d.mes_correspondiente = 12);

-- Diego Torres: Matrícula 2024 (PENDIENTE)
INSERT INTO deudas (estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico)
SELECT e.id, c.id, 200.00, 0.00, 200.00, '2024-12-15', 'PENDIENTE', 2024
FROM estudiantes e, conceptos_pago c
WHERE e.codigo_estudiante = 'EST2024007' AND c.nombre = 'Matrícula'
AND NOT EXISTS (SELECT 1 FROM deudas d WHERE d.estudiante_id = e.id AND d.concepto_pago_id = c.id AND d.anio_academico = 2024 AND c.nombre = 'Matrícula');

-- =====================================================
-- PAGOS
-- =====================================================
-- Ana Gomez pagó Actividades Extracurriculares (deuda pagada)
INSERT INTO pagos (deuda_id, monto_pagado, fecha_pago, metodo_pago, referencia_pago, estado)
SELECT d.id, 60.00, '2024-11-15 10:30:00', 'EFECTIVO', 'PAG-001-2024', 'COMPLETADO'
FROM deudas d
JOIN estudiantes e ON d.estudiante_id = e.id
WHERE e.codigo_estudiante = 'EST2024002' AND d.estado = 'PAGADO' AND d.monto_total = 60.00
AND NOT EXISTS (SELECT 1 FROM pagos p WHERE p.deuda_id = d.id AND p.referencia_pago = 'PAG-001-2024');

-- Mateo Silva pagó Pensión Dic 2024 (deuda pagada)
INSERT INTO pagos (deuda_id, monto_pagado, fecha_pago, metodo_pago, referencia_pago, estado)
SELECT d.id, 450.00, '2024-12-05 14:00:00', 'TRANSFERENCIA', 'PAG-002-2024', 'COMPLETADO'
FROM deudas d
JOIN estudiantes e ON d.estudiante_id = e.id
WHERE e.codigo_estudiante = 'EST2024005' AND d.estado = 'PAGADO' AND d.monto_total = 450.00
AND NOT EXISTS (SELECT 1 FROM pagos p WHERE p.deuda_id = d.id AND p.referencia_pago = 'PAG-002-2024');

-- Carlos Gomez pagó parcial de Matrícula
INSERT INTO pagos (deuda_id, monto_pagado, fecha_pago, metodo_pago, referencia_pago, estado)
SELECT d.id, 100.00, '2024-11-20 09:15:00', 'EFECTIVO', 'PAG-003-2024', 'COMPLETADO'
FROM deudas d
JOIN estudiantes e ON d.estudiante_id = e.id
WHERE e.codigo_estudiante = 'EST2024001' AND d.estado = 'PARCIAL' AND d.monto_total = 200.00
AND NOT EXISTS (SELECT 1 FROM pagos p WHERE p.deuda_id = d.id AND p.referencia_pago = 'PAG-003-2024');

-- Diego Torres pagó parcial de Pensión Dic 2024
INSERT INTO pagos (deuda_id, monto_pagado, fecha_pago, metodo_pago, referencia_pago, estado)
SELECT d.id, 200.00, '2024-12-10 11:45:00', 'EFECTIVO', 'PAG-004-2024', 'COMPLETADO'
FROM deudas d
JOIN estudiantes e ON d.estudiante_id = e.id
WHERE e.codigo_estudiante = 'EST2024007' AND d.estado = 'PARCIAL' AND d.monto_total = 450.00
AND NOT EXISTS (SELECT 1 FROM pagos p WHERE p.deuda_id = d.id AND p.referencia_pago = 'PAG-004-2024');

-- =====================================================
-- NOTIFICACIONES
-- =====================================================
INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, leida)
SELECT u.id, 'Bienvenido al Sistema', 'Su cuenta ha sido creada exitosamente. Ya puede realizar pagos y consultar el estado de cuenta de sus hijos.', 'INFO', TRUE
FROM usuarios u WHERE u.email = 'ricardo@email.com'
AND NOT EXISTS (SELECT 1 FROM notificaciones n WHERE n.usuario_id = u.id AND n.titulo = 'Bienvenido al Sistema');

INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, leida)
SELECT u.id, 'Bienvenido al Sistema', 'Su cuenta ha sido creada exitosamente. Ya puede realizar pagos y consultar el estado de cuenta de sus hijos.', 'INFO', TRUE
FROM usuarios u WHERE u.email = 'maria@email.com'
AND NOT EXISTS (SELECT 1 FROM notificaciones n WHERE n.usuario_id = u.id AND n.titulo = 'Bienvenido al Sistema');

INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, leida)
SELECT u.id, 'Bienvenido al Sistema', 'Su cuenta ha sido creada exitosamente. Ya puede realizar pagos y consultar el estado de cuenta de sus hijos.', 'INFO', TRUE
FROM usuarios u WHERE u.email = 'carlos@email.com'
AND NOT EXISTS (SELECT 1 FROM notificaciones n WHERE n.usuario_id = u.id AND n.titulo = 'Bienvenido al Sistema');

INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, leida)
SELECT u.id, 'Bienvenido al Sistema', 'Su cuenta ha sido creada exitosamente. Ya puede realizar pagos y consultar el estado de cuenta de sus hijos.', 'INFO', TRUE
FROM usuarios u WHERE u.email = 'ana@email.com'
AND NOT EXISTS (SELECT 1 FROM notificaciones n WHERE n.usuario_id = u.id AND n.titulo = 'Bienvenido al Sistema');

INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, leida, fecha_envio)
SELECT u.id, 'Deuda Próxima a Vencer', 'La pensión mensual de Carlos Gomez (5to A) vence en 3 días. Realice el pago a tiempo para evitar recargos.', 'PAGO', FALSE, '2024-12-28 08:00:00'
FROM usuarios u WHERE u.email = 'ricardo@email.com'
AND NOT EXISTS (SELECT 1 FROM notificaciones n WHERE n.usuario_id = u.id AND n.titulo = 'Deuda Próxima a Vencer');

INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, leida, fecha_envio)
SELECT u.id, 'Deuda Vencida', 'La pensión mensual de Luis Lopez (1ro A) se encuentra vencida. Regularice su situación a la brevedad.', 'PAGO', FALSE, '2024-12-01 09:00:00'
FROM usuarios u WHERE u.email = 'maria@email.com'
AND NOT EXISTS (SELECT 1 FROM notificaciones n WHERE n.usuario_id = u.id AND n.titulo = 'Deuda Vencida');

INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, leida, fecha_envio)
SELECT u.id, 'Pago Registrado', 'Se ha registrado un pago de S/ 60.00 por Actividades Extracurriculares de Ana Gomez.', 'PAGO', TRUE, '2024-11-15 10:30:00'
FROM usuarios u WHERE u.email = 'ricardo@email.com'
AND NOT EXISTS (SELECT 1 FROM notificaciones n WHERE n.usuario_id = u.id AND n.titulo = 'Pago Registrado');

INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, leida)
SELECT u.id, 'Bienvenido Administrador', 'Has sido registrado como administrador del sistema de pagos educativos.', 'INFO', TRUE
FROM usuarios u WHERE u.email = 'admin@claretiano.edu'
AND NOT EXISTS (SELECT 1 FROM notificaciones n WHERE n.usuario_id = u.id AND n.titulo = 'Bienvenido Administrador');
