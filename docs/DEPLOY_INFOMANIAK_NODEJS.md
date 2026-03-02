# Deploy en Infomaniak (Node.js)

Este proyecto ya queda preparado para arrancar en Infomaniak con:

- `npm run build:infomaniak`
- `npm run start:infomaniak`

## 1) Crear el sitio Node.js en Infomaniak

En el Manager de Infomaniak:

1. Crear un nuevo sitio y elegir **Node.js**.
2. Método de instalación: **Personalizado**.
3. Importar código desde **Git** y conectar este repo:
   `https://github.com/guille008rm-blip/BLACK-GUM.git`
4. Rama: `main`.

## 2) Configuración recomendada del runtime

- `Node.js version`: `20.x` o superior compatible con Next.js 14.
- `Execution folder`: `/` (raíz del proyecto).
- `Build command`: `npm ci && npm run build:infomaniak`
- `Launch command`: `npm run start:infomaniak`
- `Access URL`: dominio principal del sitio.

## 3) Variables de entorno

Configura en el panel de Infomaniak (no en Git):

- `DATABASE_URL`
- `SESSION_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GOOGLE_SHEETS_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `ADMIN_BLOCK_SECRET`
- `NEXT_PUBLIC_BASE_URL`

Usa `.env.example` como plantilla de nombres, nunca dejes secretos reales en el repositorio.

## 4) Base de datos en producción

El esquema actual está en SQLite (`prisma/schema.prisma` con `provider = "sqlite"`).

Para producción se recomienda Postgres:

1. Cambiar `provider` a `postgresql`.
2. Ajustar `DATABASE_URL`.
3. Ejecutar migraciones en la base de datos de producción.

## 5) Verificación rápida tras deploy

1. Abrir `/` y revisar que carga sin error 500.
2. Abrir `/admin/login`.
3. Comprobar logs del proceso Node.js en el panel.
4. Si falla el build, revisar variables de entorno faltantes.
