import { useState, useEffect } from 'react'
import styles from './Header.module.css'
import About from './About'

const COLLECTIONS = [
  { id: 'vinyl',  label: '🎵 Vinilos' },
  { id: 'rum',    label: '🥃 Rones'   },
  { id: 'whisky', label: '🥃 Whiskies'},
]

const TITLES = { vinyl: 'Vinilos', rum: 'Rones', whisky: 'Whiskies' }

export default function Header({ coll, setColl }) {
  const [showToken, setShowToken] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [showAbout, setShowAbout] = useState(false)
  const hasToken = !!localStorage.getItem('discogs_token')

  useEffect(() => {
    if (showToken) setTokenInput(localStorage.getItem('discogs_token') || '')
  }, [showToken])

  function saveToken() {
    if (tokenInput.trim()) {
      localStorage.setItem('discogs_token', tokenInput.trim())
    } else {
      localStorage.removeItem('discogs_token')
    }
    setShowToken(false)
  }

  return (
    <>
    {showAbout && <About onClose={() => setShowAbout(false)} />}
    <header className={`${styles.header} ${styles[coll]}`}>
      <div className={`${styles.logo} ${styles[`logo_${coll}`]}`} />
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{TITLES[coll]}</h1>
        <p className={styles.sub}>Colección Personal · Federico</p>
      </div>
      <div style={{ flex: 1 }} />

      {/* Botón About */}
      <button
        className={styles.tokenIcon}
        onClick={() => setShowAbout(true)}
        title="Documentación del proyecto"
        style={{ opacity: 1, filter: 'none' }}
      >
        📖
      </button>

      {/* Token Discogs */}
      <div className={styles.tokenWrap}>
        {showToken
          ? <div className={styles.tokenRow}>
              <input
                className={styles.tokenInput}
                type="password"
                placeholder="Token Discogs..."
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveToken()}
                autoFocus
              />
              <button className={styles.tokenBtn} onClick={saveToken}>Guardar</button>
              <button className={styles.tokenBtn} onClick={() => setShowToken(false)}>✕</button>
            </div>
          : <button
              className={`${styles.tokenIcon} ${hasToken ? styles.tokenOk : styles.tokenMissing}`}
              onClick={() => setShowToken(true)}
              title={hasToken ? 'Token Discogs guardado — click para cambiar' : 'Sin token Discogs — click para agregar'}
            >
              🔑
            </button>
        }
      </div>

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
    </>
  )
}
