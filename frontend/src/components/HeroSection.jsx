import { forwardRef } from 'react'
import styles from './HeroSection.module.css'

const HERO_CONTENT = {
  vinyl: {
    img:     '/hero-4.png',
    imgPos:  'center top',
    eyebrow: 'En Las Nubes Trepao',
    headline: ['Para escuchar', 'con algo', 'en la mano.'],
    tagline:  'Afinando el vinilo entre espíritus.\nUna colección personal desde Medellín, Colombia.',
    cta:     'La colección',
  },
  rum: {
    img:     '/hero-1.png',
    imgPos:  'center 30%',
    eyebrow: 'La colección — Rones',
    headline: ['Caña destilada.', 'Tiempo.', 'Identidad.'],
    tagline:  'Saboreando la barrica entre melodías.\nDesde el Caribe hasta Latinoamérica.',
    cta:     'Los rones',
  },
  whisky: {
    img:     '/hero-2.png',
    imgPos:  'center 40%',
    eyebrow: 'La colección — Whiskies',
    headline: ['Turba, madera', 'y tiempo', 'en la copa.'],
    tagline:  'Saboreando la barrica entre melodías.\nDestilerías que priorizan el proceso.',
    cta:     'Los whiskies',
  },
}

const HeroSection = forwardRef(function HeroSection({ coll = 'vinyl', onScrollDown }, ref) {
  const content = HERO_CONTENT[coll] || HERO_CONTENT.vinyl

  return (
    <section className={`${styles.hero} ${styles[coll]}`} ref={ref}>

      {/* Foto de fondo */}
      <div className={styles.photoBg} aria-hidden="true">
        <img
          src={content.img}
          alt=""
          className={styles.photoImg}
          style={{ objectPosition: content.imgPos }}
          key={content.img}
        />
        <div className={styles.photoOverlay} />
      </div>

      {/* Contenido editorial */}
      <div className={styles.content}>

        <p className={styles.eyebrow}>{content.eyebrow}</p>

        <h1 className={styles.headline}>
          {content.headline.map((line, i) => (
            <span key={i}>{line}{i < content.headline.length - 1 && <br />}</span>
          ))}
        </h1>

        <p className={styles.tagline}>
          {content.tagline.split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </p>

        <button
          className={styles.scrollCue}
          onClick={onScrollDown}
          aria-label={`Ver ${content.cta}`}
        >
          <span className={styles.scrollLabel}>{content.cta}</span>
          <span className={styles.scrollArrow}>↓</span>
        </button>
      </div>

      {/* Degradado de transición hacia la colección */}
      <div className={styles.fadeBottom} aria-hidden="true" />
    </section>
  )
})

export default HeroSection
