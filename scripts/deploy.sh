#!/usr/bin/env bash
#
# Deploy del Bingo Escolar a Google Cloud Run.
# App 100% client-side: sin BD, sin secrets, sin env vars.
#
# Uso: ./scripts/deploy.sh
#
# Prerequisitos one-time (compartidos con el proyecto sistema-ventas-rifas):
#   - Proyecto GCP sistema-ventas-rifas-prod
#   - APIs habilitadas: run, cloudbuild, artifactregistry
#   - gcloud autenticado con account intellego.ok@gmail.com
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

PROJECT="sistema-ventas-rifas-prod"
SERVICE="bingo-escolar"
REGION="us-east1"

command -v gcloud >/dev/null || { echo "ERROR: gcloud CLI no instalado."; exit 1; }
gcloud auth print-access-token >/dev/null 2>&1 || { echo "ERROR: gcloud no autenticado. Corré: gcloud auth login"; exit 1; }

echo "🎯 Deploying $SERVICE a $PROJECT en $REGION..."

gcloud run deploy "$SERVICE" \
  --source=. \
  --region="$REGION" \
  --project="$PROJECT" \
  --allow-unauthenticated \
  --min-instances=0 --max-instances=3 \
  --memory=512Mi --cpu=1 --timeout=60s \
  --port=8080

echo ""
echo "✅ Deploy listo. URL pública:"
gcloud run services describe "$SERVICE" \
  --region="$REGION" --project="$PROJECT" \
  --format='value(status.url)'
