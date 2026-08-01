# Despliegue En Netlify

## Repositorio

- Repositorio: `https://github.com/vega2004/sgum-frontend`
- Rama de producción: `main`
- Base directory: dejar vacío porque el proyecto está en la raíz.
- Build command: `npm run build`
- Publish directory: `dist`

## Variables De Entorno

Las variables `VITE_` son públicas en el navegador. No usar estas variables para secretos, tokens, contraseñas, cadenas privadas ni credenciales.

### Demostración Sin Backend

Crear en Netlify:

```bash
VITE_USE_MOCKS=true
```

En este modo la aplicación utiliza datos ficticios. No usar datos personales reales en demostraciones, pruebas, capturas o documentación.

### Conexión Con SGUM.Api

Crear en Netlify:

```bash
VITE_USE_MOCKS=false
VITE_API_BASE_URL=https://URL-PUBLICA-DEL-BACKEND
```

No agregar diagonal al final de `VITE_API_BASE_URL`.

El backend debe permitir mediante CORS el dominio exacto generado por Netlify, por ejemplo:

```text
https://nombre-del-sitio.netlify.app
```

Cualquier cambio en variables de entorno requiere un nuevo deploy.

## Configuración De Netlify

El archivo `netlify.toml` define:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

La redirección permite que las rutas internas de React Router funcionen al entrar directamente o recargar el navegador.

## Pruebas Posteriores Al Despliegue

Probar después de publicar:

- Acceso a `/`
- Acceso directo a `/login`
- Recarga de `/dashboard`
- Recarga de `/expedientes`
- Inicio de sesión
- Cierre de sesión
- Protección de rutas
- Protección por rol
- Página no autorizada
- Página no encontrada

No documentar contraseñas reales, cuentas institucionales reales ni datos personales reales.
