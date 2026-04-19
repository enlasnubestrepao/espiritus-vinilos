import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import styles from './AtlasView.module.css'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Nombre del espíritu → ISO 3166-1 numérico
const COUNTRY_ISO = {
  'Jamaica':             '388',
  'Barbados':            '052',
  'Trinidad and Tobago': '780',
  'Trinidad':            '780',
  'Cuba':                '192',
  'Dominican Republic':  '214',
  'Colombia':            '170',
  'Venezuela':           '862',
  'Nicaragua':           '558',
  'Guatemala':           '320',
  'Panama':              '591',
  'Haiti':               '332',
  'Guyana':              '328',
  'Martinique':          '474',
  'Belize':              '084',
  'Puerto Rico':         '630',
  'Grenada':             '308',
  'Mexico':              '484',
  'Brazil':              '076',
  'Peru':                '604',
  'Bolivia':             '068',
  'Ecuador':             '218',
  'Scotland':            '826',
  'Ireland':             '372',
  'Japan':               '392',
  'USA':                 '840',
  'United States':       '840',
  'Canada':              '124',
  'India':               '356',
  'Taiwan':              '158',
  'Australia':           '036',
  'Sweden':              '752',
  'France':              '250',
  'South Africa':        '710',
  'New Zealand':         '554',
  'England':             '826',
  'Wales':               '826',
  'United Kingdom':      '826',
  'Islay':               '826',
  'Speyside':            '826',
  'Highlands':           '826',
  'Lowlands':            '826',
  'Campbeltown':         '826',
}

// Color base por colección (RGB)
const BASE_COLOR = {
  rum:    [180, 90, 20],   // ámbar
  whisky: [30, 100, 160],  // azul acero
}

export default function AtlasView({ data, coll, onSelect }) {
  const [activeIso, setActiveIso] = useState(null)

  // Agrupar espíritus por ISO
  const byIso = useMemo(() => {
    const map = {}
    data.forEach(item => {
      const iso = COUNTRY_ISO[item.country]
      if (!iso) return
      if (!map[iso]) map[iso] = { label: item.country, items: [] }
      map[iso].items.push(item)
    })
    return map
  }, [data])

  const maxCount = useMemo(
    () => Math.max(...Object.values(byIso).map(v => v.items.length), 1),
    [byIso]
  )

  const [r, g, b] = BASE_COLOR[coll] || BASE_COLOR.rum

  function getFill(iso) {
    const entry = byIso[iso]
    if (!entry) return '#1c1c1c'
    const intensity = 0.25 + (entry.items.length / maxCount) * 0.75
    return `rgba(${r},${g},${b},${intensity})`
  }

  function getStroke(iso) {
    if (iso === activeIso) return `rgb(${r},${g},${b})`
    return '#0d0d0d'
  }

  const activeEntry = activeIso ? byIso[activeIso] : null

  return (
    <div className={styles.wrap}>
      {/* Mapa principal */}
      <div className={styles.mapContainer}>
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 153, center: [0, 10] }}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const iso = String(geo.id).padStart(3, '0')
                const hasData = !!byIso[iso]
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getFill(iso)}
                    stroke={getStroke(iso)}
                    strokeWidth={iso === activeIso ? 1.5 : 0.4}
                    onClick={hasData ? () => setActiveIso(iso === activeIso ? null : iso) : undefined}
                    style={{
                      default:  { outline: 'none', cursor: hasData ? 'pointer' : 'default' },
                      hover:    { outline: 'none', fill: hasData ? `rgba(${r},${g},${b},0.9)` : '#1c1c1c', cursor: hasData ? 'pointer' : 'default' },
                      pressed:  { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Leyenda */}
        <div className={styles.legend}>
          <div className={styles.legendBar} style={{ background: `linear-gradient(to right, rgba(${r},${g},${b},0.25), rgba(${r},${g},${b},1))` }} />
          <div className={styles.legendLabels}>
            <span>1</span>
            <span>{maxCount}</span>
          </div>
        </div>

        {/* Contador de países */}
        <div className={styles.countryStat}>
          {Object.keys(byIso).length} países · {data.length} {coll === 'rum' ? 'rones' : 'whiskies'}
        </div>
      </div>

      {/* Panel lateral — aparece al hacer click en un país */}
      {activeEntry && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>{activeEntry.label}</h3>
              <p className={styles.panelSub}>{activeEntry.items.length} {activeEntry.items.length === 1 ? 'expresión' : 'expresiones'}</p>
            </div>
            <button className={styles.panelClose} onClick={() => setActiveIso(null)}>✕</button>
          </div>
          <div className={styles.panelCards}>
            {activeEntry.items.map((item, i) => (
              <div
                key={i}
                className={`${styles.spiritCard} ${styles[coll]}`}
                onClick={() => onSelect(item)}
              >
                {item.cover_url
                  ? <img className={styles.cardImg} src={item.cover_url} alt={item.brand} loading="lazy" />
                  : <div className={styles.cardImgPlaceholder}>🥃</div>
                }
                <div className={styles.cardBody}>
                  <div className={styles.cardBrand}>{item.brand}</div>
                  <div className={styles.cardName}>{item.name || item.version || ''}</div>
                  <div className={styles.cardMeta}>
                    {item.type && <span className={`${styles.pill} ${styles[coll]}`}>{item.type}</span>}
                    {item.abv  && <span className={styles.abv}>{item.abv}%</span>}
                    {item.terminado && <span className={styles.finished} title="Ya consumí">🫗</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
