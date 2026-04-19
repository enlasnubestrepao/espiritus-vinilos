import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import styles from './CountryMiniMap.module.css'

// TopoJSON 110m — países a baja resolución (~100KB, ideal para thumbnail)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Nombre del espíritu → ISO 3166-1 numérico (id en world-atlas)
const COUNTRY_ISO = {
  // Caribe / Rones
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
  // Whiskies
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

// Centro de proyección y escala para cada ISO — evita que el país quede en los bordes
const PROJ = {
  '388': { center: [-77,  18],  scale: 2200 },  // Jamaica
  '052': { center: [-59,  13],  scale: 2200 },  // Barbados
  '780': { center: [-61,  10],  scale: 2200 },  // Trinidad
  '192': { center: [-79,  22],  scale: 1000 },  // Cuba
  '214': { center: [-70,  19],  scale: 2200 },  // Dominican Republic
  '170': { center: [-74,   4],  scale:  500 },  // Colombia
  '862': { center: [-66,   8],  scale:  500 },  // Venezuela
  '558': { center: [-85,  13],  scale: 1100 },  // Nicaragua
  '320': { center: [-90,  16],  scale: 1400 },  // Guatemala
  '591': { center: [-80,   9],  scale: 1600 },  // Panama
  '332': { center: [-72,  19],  scale: 2500 },  // Haiti
  '328': { center: [-59,   5],  scale:  700 },  // Guyana
  '474': { center: [-61,  15],  scale: 3000 },  // Martinique
  '084': { center: [-88,  17],  scale: 1800 },  // Belize
  '630': { center: [-66,  18],  scale: 3000 },  // Puerto Rico
  '308': { center: [-62,  12],  scale: 3000 },  // Grenada
  '484': { center:[-102,  24],  scale:  400 },  // Mexico
  '076': { center: [-53, -14],  scale:  250 },  // Brazil
  '604': { center: [-76, -10],  scale:  450 },  // Peru
  '068': { center: [-64, -17],  scale:  500 },  // Bolivia
  '218': { center: [-78,  -2],  scale:  700 },  // Ecuador
  '826': { center: [ -3,  55],  scale: 1000 },  // UK / Scotland
  '372': { center: [ -8,  53],  scale: 1600 },  // Ireland
  '392': { center: [138,  37],  scale:  700 },  // Japan
  '840': { center: [-98,  39],  scale:  280 },  // USA
  '124': { center: [-96,  60],  scale:  220 },  // Canada
  '356': { center: [ 78,  21],  scale:  350 },  // India
  '158': { center: [121,  24],  scale: 2800 },  // Taiwan
  '036': { center: [134, -26],  scale:  220 },  // Australia
  '752': { center: [ 18,  63],  scale:  700 },  // Sweden
  '250': { center: [  2,  47],  scale:  800 },  // France
  '710': { center: [ 25, -29],  scale:  400 },  // South Africa
  '554': { center: [172, -42],  scale: 1000 },  // New Zealand
}

const DEFAULT_PROJ = { center: [0, 20], scale: 140 }

export default function CountryMiniMap({ country, coll }) {
  const iso    = COUNTRY_ISO[country]
  const proj   = (iso && PROJ[iso]) || DEFAULT_PROJ
  const accent = coll === 'rum' ? 'var(--ru-acc)' : 'var(--wh-acc)'

  if (!country) return null

  return (
    <div className={styles.wrap}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: proj.center, scale: proj.scale }}
        width={280}
        height={140}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const isTarget = iso && String(geo.id) === iso
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isTarget ? accent : '#2a2a2a'}
                  stroke="#111"
                  strokeWidth={0.5}
                  style={{ outline: 'none' }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      <div className={styles.label} style={{ color: accent }}>{country}</div>
    </div>
  )
}
