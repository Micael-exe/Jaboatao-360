import { Link } from 'react-router-dom'

export default function SectionHeader({ id, titulo, texto, linkTo, linkTexto }) {
  return (
    <header className="home-sh">
      <div>
        <h2 id={id} className="home-sh-titulo">{titulo}</h2>
        {texto && <p className="home-sh-lead">{texto}</p>}
      </div>
      {linkTo && linkTexto && (
        <Link to={linkTo} className="home-sh-link">{linkTexto}</Link>
      )}
    </header>
  )
}
