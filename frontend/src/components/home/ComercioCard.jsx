import { Link } from 'react-router-dom'

export default function ComercioCard({ nome, tipo, categoria, descricao, bairro, horario, preco, proximoA }) {
  return (
    <article className="home-com">
      <h3 className="home-com-nome">
        <Link to="/comercio" className="home-link-esticado">{nome}</Link>
      </h3>
      <p className="home-com-meta">{categoria}, {tipo.toLowerCase()}</p>
      <p className="home-com-desc">{descricao}</p>
      <p className="home-com-info">{bairro}, perto de {proximoA}</p>
      <p className="home-com-info">Horário: {horario}. Preço: {preco}</p>
    </article>
  )
}
