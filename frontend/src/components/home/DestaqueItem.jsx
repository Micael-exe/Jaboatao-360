import { Link } from 'react-router-dom'
import Foto from './Foto'

export default function DestaqueItem({ nome, categoria, bairro, descricao, foto, alt }) {
  return (
    <article className="home-item">
      <Foto nome={foto} alt={alt} className="home-item-foto" />
      <div>
        <h3 className="home-item-nome">
          <Link to="/mapa" className="home-link-esticado">
            {nome}
            <span className="sr-only"> no mapa</span>
          </Link>
        </h3>
        <p className="home-item-meta">{categoria}, {bairro}</p>
        <p className="home-item-desc">{descricao}</p>
      </div>
    </article>
  )
}
