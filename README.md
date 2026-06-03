# ClaretianPay - Plataforma de Pagos Educativos

Sistema de gestión de pagos educativos para el **Colegio Claretiano**. Permite a los padres de familia consultar deudas, realizar pagos, descargar recibos PDF, y a los administradores gestionar el sistema con reportes gerenciales, dashboard financiero y notificaciones automáticas.

---

## 🚀 Características

### Para Padres de Familia
- Registro y autenticación segura
- Consulta de hijos y su estado de cuenta
- Visualización de deudas pendientes
- Realizar pagos (Efectivo, Transferencia, Tarjeta)
- Descargar recibos PDF
- Historial completo de pagos con filtros
- Notificaciones automáticas

### Para Administradores
- Dashboard financiero con gráficos
- Gestión de padres, estudiantes, conceptos y deudas
- Reportes gerenciales (ingresos, morosidad, estado de cuenta)
- Exportación de reportes a Excel y PDF
- Auditoría completa del sistema
- Notificaciones automáticas por email

---

## 🛠️ Tecnologías

### Backend
| Tecnología | Versión |
|-----------|---------|
| Java | 17 |
| Spring Boot | 3.2.5 |
| Spring Security | 6.x |
| Spring Data JPA | 3.x |
| PostgreSQL | 16 |
| JWT (jjwt) | 0.12.5 |
| iText 7 | 8.0.4 |
| Apache POI | 5.2.5 |
| Lombok | 1.18.32 |

### Frontend
| Tecnología | Versión |
|-----------|---------|
| HTML5 | - |
| CSS3 | - |
| JavaScript (Vanilla) | ES6+ |
| Chart.js | 4.4.1 |
| Font Awesome | 6.4.0 |

---

## 📋 Requisitos

- **Java 17+**
- **Maven 3.8+**
- **PostgreSQL 14+**
- **Node.js** (opcional, para desarrollo frontend)

---

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-repo/gestion-pagos-educativos.git
cd gestion-pagos-educativos
```

### 2. Configurar base de datos PostgreSQL

```sql
CREATE DATABASE gestion_pagos;
```

### 3. Configurar variables de entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env`:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/gestion_pagos
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_contraseña
JWT_SECRET=tu_clave_secreta_de_256_bits
JWT_EXPIRATION=86400000
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_contraseña_app
SERVER_PORT=8080
```

### 4. Compilar y ejecutar

```bash
./mvnw clean package -DskipTests
java -jar target/gestion-pagos-educativos-0.0.1-SNAPSHOT.jar
```

O usando Maven directamente:

```bash
./mvnw spring-boot:run
```

### 5. Acceder a la aplicación

- **Frontend:** `http://localhost:8080/login.html`
- **API:** `http://localhost:8080/api/test`

---

## 🐳 Docker

### Usando Docker Compose

```bash
docker-compose up -d
```

Esto levantará:
- **PostgreSQL** en `localhost:5432`
- **App** en `http://localhost:8080`

---

## 🧪 Pruebas

```bash
./mvnw test
```

Para ver reporte de cobertura (JaCoCo):

```bash
./mvnw verify
```

El reporte estará en `target/site/jacoco/index.html`

---

## 📚 Estructura del Proyecto

```
gestion-pagos-educativos/
├── frontend/
│   ├── admin/           # Panel administrador
│   ├── parent/          # Panel padre de familia
│   ├── css/             # Estilos
│   └── js/              # Lógica frontend
│       ├── admin/       # JS del admin
│       └── parent/      # JS del padre
├── src/
│   └── main/
│       ├── java/.../
│       │   ├── config/      # Seguridad, JWT
│       │   ├── controller/  # Controladores REST
│       │   ├── dto/         # Data Transfer Objects
│       │   ├── model/
│       │   │   └── entity/  # Entidades JPA
│       │   ├── repository/  # Repositorios JPA
│       │   └── service/     # Lógica de negocio
│       └── resources/
│           ├── schema.sql   # Esquema PostgreSQL
│           └── data.sql     # Datos semilla
├── scripts/
│   └── migrate.sql          # Migración SQLite→PostgreSQL
├── docs/
│   ├── MANUAL_ADMIN.md
│   └── MANUAL_PADRE.md
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@claretiano.edu | admin123 |
| Padre | ricardo@email.com | 123456 |
| Padre | maria@email.com | 123456 |

---

## 📖 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/usuarios` | Registrar usuario |

### Recuperación de Contraseña
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/password-reset/solicitar` | Solicitar token |
| POST | `/api/password-reset/restablecer` | Restablecer contraseña |

### Gestión
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | `/api/usuarios/**` | CRUD usuarios |
| GET/POST/PUT/DELETE | `/api/estudiantes/**` | CRUD estudiantes |
| GET/POST/PUT/DELETE | `/api/conceptos-pago/**` | CRUD conceptos |
| GET/POST | `/api/deudas/**` | Gestión deudas |
| GET/POST | `/api/pagos/**` | Gestión pagos |
| GET | `/api/recibos/**` | Recibos y PDF |

### Reportes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard financiero |
| GET | `/api/reportes/**` | Reportes varios |
| GET | `/api/reportes/exportar/**` | Exportación Excel |

### Notificaciones y Auditoría
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET/PUT | `/api/notificaciones/**` | Notificaciones |
| GET | `/api/logs/**` | Auditoría |

---

## 🌐 Despliegue

### Render
1. Crear servicio Web con Docker
2. Configurar variable de entorno `DATABASE_URL` con PostgreSQL externo
3. Build Command: `./mvnw clean package -DskipTests`
4. Start Command: `java -jar target/*.jar`

### Railway
1. Conectar repositorio
2. Agregar PostgreSQL plugin
3. Railway asigna automáticamente `DATABASE_URL`
4. Deploy automático

---

## 📄 Licencia

Proyecto académico - Colegio Claretiano
