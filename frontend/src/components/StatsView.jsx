import { useMemo } from 'react'
import styles from './StatsView.module.css'

/* ── helpers ── */
function countBy(arr, key) {
  const map = {}
  arr.forEach(item => {
    const val = item[key] || 'Desconocido'
    map[val] = (map[val] || 0) + 1
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

function BarChart({ title, entries, accent }) {
  if (!entries || entries.length === 0) return null
  const max = entries[0][1]
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.bars}>
        {entries.slice(0, 10).map(([label, count]) => {
          const pct = Math.round((count / max) * 100)
          return (
            <div key={label} className={styles.barRow}>
              <span className={styles.barLabel}>{label}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${pct}%`, background: accent }}
                />
              </div>
              <span className={styles.barCount}>{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Vinyl stats ── */
function VinylStats({ data }) {
  const genres     = useMemo(() => countBy(data, 'agrupador'), [data])
  const categories = useMemo(() => countBy(data, 'genero'),    [data])
  const countries  = useMemo(() => countBy(data, 'pais'),      [data])

  const decades = useMemo(() => {
    const map = {}
    data.forEach(item => {
      const y = parseInt(item.anio)
      if (!isNaN(y)) {
        const dec = `${Math.floor(y / 10) * 10}s`
        map[dec] = (map[dec] || 0) + 1
      }
    })
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
  }, [data])

  const totalArtists  = useMemo(() => new Set(data.map(r => r.artista).filter(Boolean)).size, [data])
  const withDiscogs   = data.filter(r => r.discogs_url).length
  const withCover     = data.filter(r => r.cover_url).length
  const pctDiscogs    = data.length ? Math.round((withDiscogs / data.length) * 100) : 0
  const pctCover      = data.length ? Math.round((withCover  / data.length) * 100) : 0

  return (
    <>
      {/* Summary card */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Resumen</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{data.length}</span>
            <span className={styles.statLbl}>Álbumes</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{totalArtists}</span>
            <span className={styles.statLbl}>Artistas</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{pctDiscogs}%</span>
            <span className={styles.statLbl}>Con Discogs</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{pctCover}%</span>
            <span className={styles.statLbl}>Con Portada</span>
          </div>
        </div>
      </div>

      <BarChart title="Géneros principales" entries={genres}     accent="var(--v-acc2)"  />
      <BarChart title="Categorías"          entries={categories} accent="var(--v-gold)"  />
      <BarChart title="Países"              entries={countries}  accent="var(--v-acc)"   />
      <BarChart title="Por Década"          entries={decades}    accent="var(--v-acc2)"  />
    </>
  )
}

/* ── Rum stats ── */
function RumStats({ data }) {
  const countries = useMemo(() => countBy(data, 'country'), [data])
  const types     = useMemo(() => countBy(data, 'type'),    [data])
  const blends    = useMemo(() => {
    const map = {}
    data.forEach(item => {
      const val = item.blend ? 'Blend' : 'Single'
      map[val] = (map[val] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [data])

  return (
    <>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Resumen</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{data.length}</span>
            <span className={styles.statLbl}>Rones</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{countries.length}</span>
            <span className={styles.statLbl}>Países</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{types.length}</span>
            <span className={styles.statLbl}>Tipos</span>
          </div>
        </div>
      </div>
      <BarChart title="Países"  entries={countries} accent="var(--ru-acc2)" />
      <BarChart title="Tipos"   entries={types}     accent="var(--ru-gold)" />
      <BarChart title="Blend vs Single" entries={blends} accent="var(--ru-acc)"  />
    </>
  )
}

/* ── Whisky stats ── */
function WhiskyStats({ data }) {
  const countries = useMemo(() => countBy(data, 'country'), [data])
  const types     = useMemo(() => countBy(data, 'type'),    [data])
  const regions   = useMemo(() => countBy(data, 'region'),  [data])

  return (
    <>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Resumen</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{data.length}</span>
            <span className={styles.statLbl}>Whiskies</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{countries.length}</span>
            <span className={styles.statLbl}>Países</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{regions.length}</span>
            <span className={styles.statLbl}>Regiones</span>
          </div>
        </div>
      </div>
      <BarChart title="Países"  entries={countries} accent="var(--wh-acc2)" />
      <BarChart title="Tipos"   entries={types}     accent="var(--wh-gold)" />
      <BarChart title="Regiones" entries={regions}  accent="var(--wh-acc2)" />
    </>
  )
}

/* ── Main component ── */
export default function StatsView({ data, coll }) {
  if (!data || data.length === 0) {
    return <div className={styles.empty}>Sin datos para mostrar estadísticas</div>
  }

  return (
    <div className={styles.container}>
      {coll === 'vinyl'  && <VinylStats  data={data} />}
      {coll === 'rum'    && <RumStats    data={data} />}
      {coll === 'whisky' && <WhiskyStats data={data} />}
    </div>
  )
}
