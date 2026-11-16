import { Link } from 'react-router-dom'

export default function AtalhoCard({ to, titulo, texto }) {
  return (
    <article className="home-atalho">
      <h3 className="home-atalho-titulo">
        <Link to={to} className="home-link-esticado">{titulo}</Link>
      </h3>
      <p>{texto}</p>
    </article>
  )
}
