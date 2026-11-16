import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo-jaboatao360-navbar.webp'
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
  // Rolou a página? Passando de 40 px, a barra deixa de ser escura e fica clara e translúcida
  const [rolou, setRolou] = useState(() => typeof window !== 'undefined' && window.scrollY > 40)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40)
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  // Na página inicial, e no topo dela, a barra usa o degradê escuro do topo da home
  const naHome = pathname === '/'
  const escura = naHome && !rolou

  return (
    <nav className={`nav ${naHome ? 'nav--home' : ''} ${escura ? 'nav--escura' : ''}`}>
      <div className="max-w-6xl mx-auto px-5 py-2.5 flex items-center justify-between gap-4">
        <Link to="/" className="nav-marca flex items-center">
          <img src={logo} width="400" height="86" alt="Jaboatão 360" className="nav-logo h-10 md:h-11 w-auto" />
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
