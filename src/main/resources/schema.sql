-- =====================================================
-- 1. TABLAS (CREAR PRIMERO)
-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_completo TEXT NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    telefono TEXT,
    direccion TEXT,
    rol TEXT DEFAULT 'parent',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS estudiantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nombre_completo TEXT NOT NULL,
    grado TEXT NOT NULL,
    seccion TEXT,
    codigo_estudiante TEXT UNIQUE,
    activo BOOLEAN DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conceptos_pago (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    monto_base DECIMAL(10,2) NOT NULL,
    periodicidad TEXT DEFAULT 'MENSUAL',
    activo BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS deudas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudiante_id INTEGER NOT NULL,
    concepto_pago_id INTEGER NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    monto_pagado DECIMAL(10,2) DEFAULT 0,
    saldo_pendiente DECIMAL(10,2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado TEXT DEFAULT 'PENDIENTE',
    anio_academico INTEGER NOT NULL,
    mes_correspondiente INTEGER,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
    FOREIGN KEY (concepto_pago_id) REFERENCES conceptos_pago(id)
);

CREATE TABLE IF NOT EXISTS pagos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deuda_id INTEGER NOT NULL,
    monto_pagado DECIMAL(10,2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pago TEXT DEFAULT 'EFECTIVO',
    referencia_pago TEXT,
    estado TEXT DEFAULT 'COMPLETADO',
    observaciones TEXT,
    FOREIGN KEY (deuda_id) REFERENCES deudas(id)
);

CREATE TABLE IF NOT EXISTS recibos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pago_id INTEGER NOT NULL UNIQUE,
    numero_recibo TEXT UNIQUE NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(10,2) NOT NULL,
    estado TEXT DEFAULT 'EMITIDO',
    pdf_generado BOOLEAN DEFAULT 0,
    FOREIGN KEY (pago_id) REFERENCES pagos(id)
);

CREATE TABLE IF NOT EXISTS notificaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    tipo TEXT DEFAULT 'INFO',
    leida BOOLEAN DEFAULT 0,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accion TEXT NOT NULL,
    entidad TEXT,
    entidad_id INTEGER,
    detalles TEXT,
    ip_origen TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. ÍNDICES (CREAR AL FINAL)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_deudas_estudiante ON deudas(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_deudas_estado ON deudas(estado);
CREATE INDEX IF NOT EXISTS idx_deudas_vencimiento ON deudas(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_pagos_deuda ON pagos(deuda_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida);