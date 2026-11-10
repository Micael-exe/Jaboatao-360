import { Link } from 'react-router-dom'

export default function ComercioCard({ nome, tipo, categoria, descricao, bairro, horario, preco, proximoA }) {
  return (
    <article className="home-card home-comercio">
      <div className="home-comercio-topo">
        <span className="tag">{categoria}</span>
        <span className="home-comercio-tipo">{tipo}</span>
      </div>
      <h3 className="home-card-titulo">
        <Link to="/comercio" className="home-card-link">{nome}</Link>
      </h3>
      <p className="home-card-texto">{descricao}</p>
      <ul className="home-comercio-meta">
        <li>{bairro} · próximo a {proximoA}</li>
        <li>
          {horario} · <span className="sr-only">faixa de preço </span>{preco}
        </li>
      </ul>
    </article>
  )
}
