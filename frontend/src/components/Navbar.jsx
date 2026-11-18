import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoColorida from '../assets/logo-jaboatao360-navbar.webp'
import logoBranca from '../assets/logo-jaboatao360-navbar-branca.webp'
import './Navbar.css'

const links = [
  { to: '/', label: 'Início' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/roteiros', label: 'Roteiros' },
  { to: '/comercio', label: 'Comércio' },
  { to: '/perfil', label: 'Perfil' },
  { to: '/sobre', label: 'Sobre' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [aberto, setAberto] = useState(false)
  const barra = useRef(null)
  const naHome = pathname === '/'

  // Só na home: a barra fica transparente sobre o topo e, ao rolar, encolhe e assume o tom
  // da seção que está por baixo dela. Cada seção declara seu tom em data-nav-tema.
  const [rolou, setRolou] = useState(false)
  const [tema, setTema] = useState('escura') // 'escura' = fundo escuro por baixo; 'clara' = fundo claro

  useEffect(() => {
    if (!naHome) return undefined
    let quadro = 0

    const medir = () => {
      quadro = 0
      setRolou(window.scrollY > 40)
      const meio = (barra.current?.offsetHeight ?? 64) / 2
      let atual = 'clara'
      for (const secao of document.querySelectorAll('[data-nav-tema]')) {
        const r = secao.getBoundingClientRect()
        if (r.top <= meio && r.bottom > meio) {
          atual = secao.dataset.navTema
          break
        }
      }
      setTema(atual)
    }
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(medir)
    }

    agendar()
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
    }
  }, [naHome])

  const classeHome = naHome ? `nav--home nav--${tema} ${rolou ? 'nav--rolou' : ''}` : ''

  return (
    <nav ref={barra} className={`nav ${classeHome}`}>
      <div className="nav-container max-w-6xl mx-auto px-5 py-2.5 flex items-center justify-between gap-4">
        <Link to="/" className="nav-marca flex items-center">
          <img
            src={logoColorida}
            width="400"
            height="86"
            alt="Jaboatão 360"
            className="nav-logo nav-logo--colorida h-10 md:h-11 w-auto"
          />
          {/* Versão clara da logo, usada sobre fundos escuros. Só aparece na home */}
          {naHome && (
            <img
              src={logoBranca}
              width="400"
              height="86"
              alt=""
              aria-hidden="true"
              className="nav-logo nav-logo--branca w-auto"
            />
          )}
        </Link>

        <button
          type="button"
          onClick={() => setAberto((a) => !a)}
          aria-expanded={aberto}
          aria-label="Abrir menu"
          className="nav-toggle md:hidden grid place-items-center w-10 h-10 rounded-full border border-gray-200 bg-white"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {aberto ? <path d="M4 4l10 10M14 4L4 14" /> : <path d="M3 5h12M3 9h12M3 13h12" />}
          </svg>
        </button>

        <div
          className={`nav-menu ${aberto ? 'flex' : 'hidden'} md:flex absolute md:static left-0 right-0 top-full flex-col md:flex-row gap-1 md:gap-7 px-5 py-4 md:p-0 bg-[#f6f9f8] md:bg-transparent border-b border-gray-200 md:border-0`}
        >
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setAberto(false)}
              className={`nav-link ${
                pathname === to ? 'underline decoration-2 decoration-sol-400 underline-offset-[10px]' : ''
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
