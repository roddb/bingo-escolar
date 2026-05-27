# Bingo Escolar — Colegio Santo Tomás de Aquino

Aplicación web interactiva de Bingo (90 números, formato tradicional) para actividades escolares.

## Stack

- Next.js 14 (App Router, output standalone)
- React 18 + TypeScript
- Tailwind CSS + Framer Motion (animaciones)
- Radix UI (componentes base) + lucide-react (iconos)
- Hosting: Google Cloud Run (us-east1, proyecto `sistema-ventas-rifas-prod`)

App **100% client-side**: sin BD, sin auth, sin secrets, sin API routes. Estado en memoria de React. Logo institucional servido desde ImgBB (host externo).

## Desarrollo local

```bash
npm install
npm run dev
# → http://localhost:3000
```

Otros comandos:

```bash
npm run build   # Build de producción (.next/standalone/ para Docker)
npm run lint    # ESLint
npm start       # Servir build (requiere build previo)
```

## Deploy a Cloud Run

Configurado con `output: 'standalone'` en `next.config.js` + Dockerfile multi-stage Node 20 slim.

```bash
./scripts/deploy.sh
```

El script corre `gcloud run deploy bingo-escolar --source=.` contra el proyecto `sistema-ventas-rifas-prod` en `us-east1`, sin necesidad de secrets ni env vars.

**Prerequisitos** (one-time):
- `gcloud auth login` con la cuenta `intellego.ok@gmail.com`
- APIs habilitadas en el proyecto: `run`, `cloudbuild`, `artifactregistry`
- Repositorio Artifact Registry `cloud-run-source-deploy` en `us-east1` (creado automáticamente por el primer deploy)

## Operación

```bash
# Ver URL pública
gcloud run services describe bingo-escolar --region=us-east1 --project=sistema-ventas-rifas-prod --format='value(status.url)'

# Ver logs
gcloud run services logs read bingo-escolar --region=us-east1 --project=sistema-ventas-rifas-prod --limit=50

# Rollback a revisión previa
gcloud run services update-traffic bingo-escolar --region=us-east1 --to-revisions=<REVISION>=100
```

## Características del juego

- **Bolillero animado** (2s de animación + número random 1-90)
- **Tablero de 90 números**: pinta en rojo los que ya salieron
- **Historial** con animaciones de entrada (Framer Motion)
- **Stats en vivo**: salidos vs restantes
- **Reiniciar** en cualquier momento

## Notas

- **Cold start ~4s** (Cloud Run scale-to-zero). Aceptable porque la app se usa 1-2 veces al año (eventos escolares).
- **Logo institucional** servido desde `https://i.ibb.co/C3FPySjg/...` (configurado en `next.config.js > images.remotePatterns`). Si ImgBB cae, el logo desaparece pero el bingo sigue funcionando.
- **Sin tests automatizados** — el dominio es trivial (un juego con estado en memoria). Validación manual en cada deploy.

## Repositorio padre

Este repo es proyecto hermano del [sistema-ventas-rifas](https://github.com/roddb/sistema-ventas-rifas). Comparten cuenta GCP y patrón de deploy a Cloud Run, pero son apps independientes.
