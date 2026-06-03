-- =====================================================
-- SCRIPT DE MIGRACIÓN: SQLite a PostgreSQL
-- =====================================================
-- 
-- Este script migra los datos desde una base SQLite
-- a PostgreSQL. Ejecutar después de crear las tablas
-- con schema.sql
--
-- Uso:
--   psql -U postgres -d gestion_pagos -f migrate.sql
--
-- =====================================================

-- Migrar usuarios
INSERT INTO usuarios (id, nombre_completo, username, email, password, telefono, direccion, rol, fecha_registro, activo)
SELECT id, nombre_completo, username, email, password, telefono, direccion, rol, 
       COALESCE(fecha_registro, CURRENT_TIMESTAMP), CAST(activo AS BOOLEAN)
FROM sqlite_usuarios;

-- Migrar estudiantes
INSERT INTO estudiantes (id, usuario_id, nombre_completo, grado, seccion, codigo_estudiante, activo)
SELECT id, usuario_id, nombre_completo, grado, seccion, codigo_estudiante, CAST(activo AS BOOLEAN)
FROM sqlite_estudiantes;

-- Migrar conceptos de pago
INSERT INTO conceptos_pago (id, nombre, descripcion, monto_base, periodicidad, activo)
SELECT id, nombre, descripcion, monto_base, periodicidad, CAST(activo AS BOOLEAN)
FROM sqlite_conceptos_pago;

-- Migrar deudas
INSERT INTO deudas (id, estudiante_id, concepto_pago_id, monto_total, monto_pagado, saldo_pendiente, fecha_vencimiento, estado, anio_academico, mes_correspondiente, fecha_creacion)
SELECT id, estudiante_id, concepto_pago_id, monto_total, COALESCE(monto_pagado, 0), saldo_pendiente, 
       DATE(fecha_vencimiento), estado, anio_academico, mes_correspondiente, COALESCE(fecha_creacion, CURRENT_TIMESTAMP)
FROM sqlite_deudas;

-- Migrar pagos
INSERT INTO pagos (id, deuda_id, monto_pagado, fecha_pago, metodo_pago, referencia_pago, estado, observaciones)
SELECT id, deuda_id, monto_pagado, COALESCE(fecha_pago, CURRENT_TIMESTAMP), 
       COALESCE(metodo_pago, 'EFECTIVO'), referencia_pago, COALESCE(estado, 'COMPLETADO'), observaciones
FROM sqlite_pagos;

-- Migrar recibos
INSERT INTO recibos (id, pago_id, numero_recibo, fecha_emision, monto_total, estado, pdf_generado)
SELECT id, pago_id, numero_recibo, COALESCE(fecha_emision, CURRENT_TIMESTAMP), monto_total, 
       COALESCE(estado, 'EMITIDO'), CAST(COALESCE(pdf_generado, 0) AS BOOLEAN)
FROM sqlite_recibos;

-- Migrar notificaciones
INSERT INTO notificaciones (id, usuario_id, titulo, mensaje, tipo, leida, fecha_envio)
SELECT id, usuario_id, titulo, mensaje, COALESCE(tipo, 'INFO'), CAST(COALESCE(leida, 0) AS BOOLEAN), 
       COALESCE(fecha_envio, CURRENT_TIMESTAMP)
FROM sqlite_notificaciones;

-- Migrar logs
INSERT INTO logs (id, accion, entidad, entidad_id, detalles, ip_origen, fecha)
SELECT id, accion, entidad, entidad_id, detalles, ip_origen, COALESCE(fecha, CURRENT_TIMESTAMP)
FROM sqlite_logs;

-- Reiniciar secuencias
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));
SELECT setval('estudiantes_id_seq', (SELECT MAX(id) FROM estudiantes));
SELECT setval('conceptos_pago_id_seq', (SELECT MAX(id) FROM conceptos_pago));
SELECT setval('deudas_id_seq', (SELECT MAX(id) FROM deudas));
SELECT setval('pagos_id_seq', (SELECT MAX(id) FROM pagos));
SELECT setval('recibos_id_seq', (SELECT MAX(id) FROM recibos));
SELECT setval('notificaciones_id_seq', (SELECT MAX(id) FROM notificaciones));
SELECT setval('logs_id_seq', (SELECT MAX(id) FROM logs));
