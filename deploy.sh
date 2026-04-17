#!/usr/bin/env bash
# deploy.sh — build frontend y publica en gh-pages automáticamente
set -e

export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "🔨 Buildando frontend..."
cd "$REPO_ROOT/frontend"
npm run build

# Copiar archivos a /tmp antes de cambiar de rama
echo "📦 Copiando artefactos..."
BUILD_DIR="$REPO_ROOT/frontend/dist"
TMP_DIR=$(mktemp -d)
cp -r "$BUILD_DIR/." "$TMP_DIR/"

echo "🌿 Cambiando a gh-pages..."
cd "$REPO_ROOT"
git stash --include-untracked --quiet 2>/dev/null || true
git checkout gh-pages

# Limpiar assets viejos y copiar nuevos
rm -f assets/index-*.js assets/index-*.css
cp "$TMP_DIR/assets/"* assets/
cp "$TMP_DIR/index.html" index.html
cp "$TMP_DIR/favicon.svg"    favicon.svg    2>/dev/null || true
cp "$TMP_DIR/icons.svg"      icons.svg      2>/dev/null || true
# Copiar todos los archivos raíz del public (logos, CNAME, etc.)
for f in "$TMP_DIR"/*.jpeg "$TMP_DIR"/*.jpg "$TMP_DIR"/*.png "$TMP_DIR"/*.webp; do
  [ -f "$f" ] && cp "$f" "$(basename "$f")" 2>/dev/null || true
done

# Limpiar tmp
rm -rf "$TMP_DIR"

echo "🚀 Commiteando y pusheando a gh-pages..."
git add -A
if git diff --cached --quiet; then
  echo "ℹ️  Sin cambios nuevos — pusheando igualmente..."
else
  git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M')" \
    -m "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
fi
git push origin gh-pages

echo "✅ Volviendo a main..."
git checkout main
git stash pop --quiet 2>/dev/null || true

echo ""
echo "✅ Deploy completo — espera ~2 min y recarga la app"
echo "🌐 https://enlasnubestrepao.github.io/espiritus-vinilos/"
