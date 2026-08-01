# SGUM Frontend

Frontend del Sistema de Gestión de Usuarias Municipal para la Instancia Municipal para el Desarrollo de la Mujer de Tula de Allende, Hidalgo.

Responsable frontend: Valeria Galindo Marín.

## Objetivo

Aplicación institucional para iniciar sesión, consultar dashboard, buscar expedientes, registrar usuarias, consultar expedientes, registrar atenciones, seguimientos, reportes, usuarios y auditoría según rol.

La tecnología es apoyo administrativo y no sustituye decisiones psicológicas, jurídicas, sociales o institucionales.

## Tecnologías

- React
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- @hookform/resolvers
- CSS normal
- Vitest y React Testing Library

## Requisitos

- Node.js compatible con Vite actual
- npm

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

## Variables De Entorno

Crear `.env` local a partir de `.env.example` si se requiere cambiar valores.

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCKS=true
```

Si el backend corre con Docker usar `http://localhost:8080`. Si corre local sin Docker, ajustar `VITE_API_BASE_URL` al puerto correspondiente de `SGUM.Api`.

No se debe versionar `.env` con datos privados.

## Modo Mock

Con `VITE_USE_MOCKS=true` la aplicación usa datos ficticios en memoria, simula tiempos de carga y muestra avisos de modo demostración.

No se generan archivos PDF o Excel falsos. Los botones de exportación quedan deshabilitados hasta conectar el servicio real.

Accesos ficticios disponibles únicamente desde el panel cerrado `Accesos de demostración` en `/login`:

- Administrador: `admin.demo`
- Personal de Atención: `atencion.demo`
- Coordinación: `coordinacion.demo`

Todos utilizan credenciales ficticias para demostración. No usar datos reales en modo mock.

## Conexión Con Backend Actual

Con `VITE_USE_MOCKS=false` se usa `VITE_API_BASE_URL` mediante el cliente central `src/shared/lib/apiClient.ts`.

Para conectar con `SGUM.Api`:

```bash
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:8080
```

No documentar usuarios, contraseñas ni cuentas institucionales reales en este repositorio.

Endpoints realmente integrados:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/usuarias/buscar`
- `GET /api/usuarias/{id}`
- `POST /api/usuarias`
- `PUT /api/usuarias/{id}`
- `DELETE /api/usuarias/{id}`

Módulos pendientes de backend real, conservados en demo temporal:

- Atenciones
- Seguimientos
- Reportes
- Usuarios
- Auditoría

## Estructura Real

- `src/app`: providers, router y aplicación principal.
- `src/shared/components`: controles, tabla, modal, estados y toast.
- `src/shared/config`: entorno, rutas, roles y permisos.
- `src/shared/layout`: layout institucional, sidebar y topbar.
- `src/shared/lib`: cliente HTTP, formateadores y validadores.
- `src/shared/styles`: CSS global.
- `src/features/auth`: login, sesión en memoria y rutas protegidas.
- `src/features/dashboard`: panel agregado.
- `src/features/expedientes`: búsqueda, vista, formulario por pasos, catálogos, mocks y servicios.
- `src/features/atenciones`: registro de atención.
- `src/features/seguimientos`: registro y consulta de seguimientos.
- `src/features/reportes`: filtros y vista previa agregada.
- `src/features/administracion`: usuarios y auditoría.
- `src/test`: configuración de pruebas.

## Rutas

- `/login`
- `/dashboard`
- `/expedientes`
- `/expedientes/nueva`
- `/expedientes/:id`
- `/expedientes/:id/editar`
- `/expedientes/:id/atenciones/nueva`
- `/expedientes/:id/seguimiento`
- `/seguimientos`
- `/reportes`
- `/administracion/usuarios`
- `/administracion/auditoria`
- `/no-autorizado`
- `/*`

## Roles

- Administrador: acceso completo, usuarios, auditoría, expedientes y reportes.
- Personal de Atención: registro, consulta, actualización, atenciones y seguimientos.
- Consulta/Coordinación: consulta autorizada, seguimientos, reportes y auditoría sin edición general.

El menú se construye por permisos y las rutas también están protegidas.

## Datos De Demostración

Los mocks usan datos ficticios identificados como demostración. No usar datos personales reales en desarrollo, pruebas, capturas o documentación.

## Seguridad Y Confidencialidad

- El token se mantiene en memoria.
- No se guardan expedientes, narraciones, CURP, teléfonos ni domicilios en `localStorage`.
- No se imprimen objetos de usuarias en consola.
- CURP y teléfono se enmascaran en listados generales.
- La narración no aparece en tablas y se protege por permiso.
- No existe eliminación física de expedientes desde el frontend.
- Se muestra aviso de confidencialidad en login y revisión.

## Comandos

```bash
npm run dev
npm run lint
npm test
npm run build
```

## Despliegue En Netlify

Consultar `DEPLOY_NETLIFY.md` para publicar mediante despliegue continuo desde GitHub.

## Campos Pendientes De Validación Institucional

- Área anatómica lesionada: opción `Cero` requiere confirmación institucional por provenir del documento escaneado.

## Advertencia

Este sistema contiene información confidencial. Su consulta y uso están restringidos al personal autorizado de la Instancia Municipal para el Desarrollo de la Mujer.
