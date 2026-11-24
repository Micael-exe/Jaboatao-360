import { Link } from 'react-router-dom'
import logo from '../assets/logo-jaboatao360.webp'
import { estaLogado } from '../data/acesso'
import './Footer.css'

// 'restrito' indica os caminhos que só aparecem depois do login ou cadastro
const links = [
  { to: '/', rotulo: 'Início' },
  { to: '/mapa', rotulo: 'Mapa', restrito: true },
  { to: '/roteiros', rotulo: 'Roteiros', restrito: true },
  { to: '/comercio', rotulo: 'Comércio local', restrito: true },
  { to: '/perfil', rotulo: 'Perfil', restrito: true },
  { to: '/sobre', rotulo: 'Sobre' },
]

export default function Footer() {
  const logado = estaLogado()
  const linksVisiveis = links.filter(({ restrito }) => logado || !restrito)

  return (
    <footer className="foot" data-nav-tema="clara">
      <div className="foot-container">
        <div className="foot-grid">
          <div>
            <img
              src={logo}
              width="640"
              height="137"
              alt="Jaboatão 360: descubra, explore, viva Jaboatão"
              className="foot-logo"
              loading="lazy"
              decoding="async"
            />
            <p className="foot-texto">
              Guia digital de turismo e comércio local de Jaboatão dos Guararapes, em Pernambuco.
            </p>
          </div>

          <nav aria-label="Rodapé">
            <p className="foot-titulo">Navegue</p>
            <ul className="foot-lista">
              {linksVisiveis.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.rotulo}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="foot-titulo">Sobre o projeto</p>
            <p className="foot-texto">
              Projeto acadêmico em formato de MVP. Os dados exibidos são demonstrativos e podem
              ser alterados.
            </p>
          </div>
        </div>

        <p className="foot-copy">© {new Date().getFullYear()} Jaboatão 360</p>
      </div>
    </footer>
  )
}
