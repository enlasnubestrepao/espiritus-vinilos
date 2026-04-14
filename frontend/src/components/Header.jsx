import styles from './Header.module.css'

const COLLECTIONS = [
  { id: 'vinyl',  label: '🎵 Vinilos' },
  { id: 'rum',    label: '🥃 Rones'   },
  { id: 'whisky', label: '🥃 Whiskies'},
]

const TITLES = { vinyl: 'Vinilos', rum: 'Rones', whisky: 'Whiskies' }

// Props = parámetros que recibe el componente desde su padre (App.jsx)
// coll    = valor actual (como IN parameter)
// setColl = función para cambiarlo (como OUT parameter)
export default function Header({ coll, setColl }) {
  return (
    <header className={`${styles.header} ${styles[coll]}`}>
      <div className={`${styles.logo} ${styles[`logo_${coll}`]}`} />
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{TITLES[coll]}</h1>
        <p className={styles.sub}>Colección Personal · Federico</p>
      </div>
      <div style={{ flex: 1 }} />
      <nav className={styles.toggle}>
        {COLLECTIONS.map(c => (
          <button
            key={c.id}
            className={`${styles.toggleBtn} ${styles[c.id]} ${coll === c.id ? styles.active : ''}`}
            onClick={() => setColl(c.id)}
          >
            {c.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
