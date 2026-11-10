import { Link } from 'react-router-dom'

const seta = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9h12M10 4l5 5-5 5" />
  </svg>
)

export default function SectionHeader({ id, eyebrow, titulo, texto, linkTo, linkTexto }) {
  return (
    <header className="home-sh">
      <div className="home-sh-texto">
        {eyebrow && <p className="home-eyebrow">{eyebrow}</p>}
        <h2 id={id} className="home-sh-titulo">{titulo}</h2>
        {texto && <p className="home-sh-lead">{texto}</p>}
      </div>
      {linkTo && linkTexto && (
        <Link to={linkTo} className="home-sh-link">
          {linkTexto}
          {seta}
        </Link>
      )}
    </header>
  )
}
