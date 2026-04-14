import styles from './SearchBar.module.css'

// search y setSearch vienen del padre (Dashboard)
// Este componente es "controlado" — no tiene estado propio
// Analogía: como un parámetro de entrada de un procedure
export default function SearchBar({ search, setSearch, coll }) {
  const placeholder = coll === 'vinyl'
    ? 'Buscar artista, álbum, género...'
    : 'Buscar marca, país, tipo...'

  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>🔍</span>
      <input
        className={styles.input}
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={placeholder}
      />
      {search && (
        <button className={styles.clear} onClick={() => setSearch('')}>✕</button>
      )}
    </div>
  )
}
