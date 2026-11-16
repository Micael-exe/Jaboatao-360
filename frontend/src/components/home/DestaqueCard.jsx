import { Link } from 'react-router-dom'
import Foto from './Foto'

export default function DestaqueCard({ nome, categoria, bairro, descricao, foto, alt }) {
  return (
    <article className="home-card home-dest">
      <Foto nome={foto} alt={alt} className="home-dest-foto" />
      <div className="home-dest-corpo">
        <span className="tag">{categoria}</span>
        <h3 className="home-card-titulo">
          <Link to="/mapa" className="home-card-link">
            {nome}
            <span className="sr-only"> no mapa</span>
          </Link>
        </h3>
        {bairro && <p className="home-dest-bairro">{bairro}</p>}
        <p className="home-card-texto">{descricao}</p>
        <span className="home-card-acao" aria-hidden="true">Ver no mapa →</span>
      </div>
    </article>
  )
}
