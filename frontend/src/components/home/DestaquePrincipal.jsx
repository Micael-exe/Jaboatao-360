import { Link } from 'react-router-dom'
import Foto from './Foto'

export default function DestaquePrincipal({ nome, categoria, bairro, descricao, foto, alt }) {
  return (
    <article className="home-principal">
      <Foto nome={foto} alt={alt} className="home-principal-foto" />
      <div className="home-principal-veu" aria-hidden="true" />
      <div className="home-principal-texto">
        <p className="home-principal-meta">{categoria}, {bairro}</p>
        <h3 className="home-principal-nome">
          <Link to="/mapa" className="home-link-esticado">
            {nome}
            <span className="sr-only"> no mapa</span>
          </Link>
        </h3>
        <p>{descricao}</p>
      </div>
    </article>
  )
}
