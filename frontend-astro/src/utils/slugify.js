/**
 * Convierte "Artista — Álbum" → "artista-album"
 * Normaliza acentos, elimina caracteres especiales, colapsa guiones.
 */
export function slugify(str) {
  return str
    .normalize('NFD')                      // descompone acentos: á → a + ́
    .replace(/[\u0300-\u036f]/g, '')       // elimina marcas diacríticas
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')           // todo lo no alfanumérico → guion
    .replace(/^-+|-+$/g, '')              // trim guiones extremos
}

export function vinylSlug(vinyl) {
  return slugify(`${vinyl.artista}-${vinyl.album}`)
}

export function rumSlug(rum) {
  return slugify(`${rum.brand}-${rum.name}`)
}

export function whiskeySlug(whisky) {
  const parts = [whisky.brand, whisky.version].filter(Boolean)
  return slugify(parts.join('-'))
}
