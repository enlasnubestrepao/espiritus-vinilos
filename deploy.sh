#!/usr/bin/env bash
# deploy.sh — build unificado React + Astro → un solo deploy en gh-pages
# Uso: ./deploy.sh
set -e

# Node 24 vía nvm (>= 24.22.1: parche de seguridad oct 2026 — TLS hostname + eMudhra)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 24 >/dev/null
node -e 'const [a,b,c]=process.versions.node.split(".").map(Number);
  const ok=(a===22&&(b>23||b===23&&c>=4))||(a===24&&(b>22||b===22&&c>=1))||(a===26&&(b>12||b===12&&c>=1))||a>26;
  if(!ok){console.error("Node "+process.version+" sin parche de seguridad. Actualizá: nvm install 24");process.exit(1)}'
ROOT="$(cd "$(dirname "$0")" && pwd)"
REACT_DIR="$ROOT/frontend"
ASTRO_DIR="$ROOT/frontend-astro"
API_URL="https://espiritus-vinilos.onrender.com"

echo "▶ [1/4] Despertando backend..."
curl -s "$API_URL/api/vinyls/" | head -c 50 > /dev/null
echo " OK"

echo "▶ [2/4] Build React..."
cd "$REACT_DIR"
npm run build

echo "▶ [3/4] Build Astro..."
cd "$ASTRO_DIR"
VITE_API_URL="$API_URL" npx astro build 2>&1 | grep -E "(built|error|warn|Complete|pages)" || true

echo "▶ [4/4] Mergeando Astro → React dist..."

# Páginas estáticas de Astro
rm -rf "$REACT_DIR/dist/vinilos" "$REACT_DIR/dist/rones" "$REACT_DIR/dist/whiskies"
cp -r "$ASTRO_DIR/dist/vinilos"   "$REACT_DIR/dist/vinilos"
cp -r "$ASTRO_DIR/dist/rones"     "$REACT_DIR/dist/rones"
cp -r "$ASTRO_DIR/dist/whiskies"  "$REACT_DIR/dist/whiskies"

# Assets de Astro (hashes distintos — no colisionan con los de React)
cp -r "$ASTRO_DIR/dist/assets/."  "$REACT_DIR/dist/assets/"

# Sitemaps de Astro (más completos — incluyen las páginas estáticas)
cp "$ASTRO_DIR/dist/sitemap-index.xml" "$REACT_DIR/dist/sitemap-index.xml"
cp "$ASTRO_DIR/dist/sitemap-0.xml"     "$REACT_DIR/dist/sitemap-0.xml"
cp "$ASTRO_DIR/dist/robots.txt"        "$REACT_DIR/dist/robots.txt"

# favicon.ico (solo Astro lo tiene)
cp "$ASTRO_DIR/dist/favicon.ico" "$REACT_DIR/dist/favicon.ico" 2>/dev/null || true

echo "▶ Deployando a gh-pages..."
cd "$REACT_DIR"
npx gh-pages -d dist

echo ""
echo "✓ Deploy completo — https://enlasnubestrepao.com"
