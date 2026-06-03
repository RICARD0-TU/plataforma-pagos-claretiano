-- =====================================================
-- ESQUEMA POSTGRESQL PARA GESTIÓN DE PAGOS EDUCATIVOS
-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    direccion TEXT,
    rol VARCHAR(20) DEFAULT 'parent',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS estudiantes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    grado VARCHAR(50) NOT NULL,
    seccion VARCHAR(10),
    codigo_estudiante VARCHAR(50) UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conceptos_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    monto_base DECIMAL(10,2) NOT NULL,
    periodicidad VARCHAR(20) DEFAULT 'MENSUAL',
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS deudas (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL,
    concepto_pago_id INTEGER NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    monto_pagado DECIMAL(10,2) DEFAULT 0,
    saldo_pendiente DECIMAL(10,2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    anio_academico INTEGER NOT NULL,
    mes_correspondiente INTEGER,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
    FOREIGN KEY (concepto_pago_id) REFERENCES conceptos_pago(id)
);

CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    deuda_id INTEGER NOT NULL,
    monto_pagado DECIMAL(10,2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(20) DEFAULT 'EFECTIVO',
    referencia_pago VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'COMPLETADO',
    observaciones TEXT,
    FOREIGN KEY (deuda_id) REFERENCES deudas(id)
);

CREATE TABLE IF NOT EXISTS recibos (
    id SERIAL PRIMARY KEY,
    pago_id INTEGER NOT NULL UNIQUE,
    numero_recibo VARCHAR(50) UNIQUE NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'EMITIDO',
    pdf_generado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (pago_id) REFERENCES pagos(id)
);

CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'INFO',
    leida BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    accion VARCHAR(50) NOT NULL,
    entidad VARCHAR(50),
    entidad_id INTEGER,
    detalles TEXT,
    ip_origen VARCHAR(50),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    usuario_id INTEGER NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_deudas_estudiante ON deudas(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_deudas_estado ON deudas(estado);
CREATE INDEX IF NOT EXISTS idx_deudas_vencimiento ON deudas(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_pagos_deuda ON pagos(deuda_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX IF NOT EXISTS idx_logs_accion ON logs(accion);
CREATE INDEX IF NOT EXISTS idx_logs_fecha ON logs(fecha);
