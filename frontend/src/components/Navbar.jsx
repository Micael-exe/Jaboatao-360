import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

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

  return (
    <nav className="nav">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-mare-900">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <circle cx="13" cy="13" r="13" fill="#12665d" />
            <circle cx="16.5" cy="9.5" r="4" fill="#f5b544" />
            <path d="M0 17c3-3 6-3 9 0s6 3 9 0 5-2 8-1v10H0z" fill="#e6f3ef" />
          </svg>
          Jaboatão 360
        </Link>

        <button
          type="button"
          onClick={() => setAberto((a) => !a)}
          aria-expanded={aberto}
          aria-label="Abrir menu"
          className="md:hidden grid place-items-center w-10 h-10 rounded-full border border-gray-200 bg-white"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {aberto ? <path d="M4 4l10 10M14 4L4 14" /> : <path d="M3 5h12M3 9h12M3 13h12" />}
          </svg>
        </button>

        <div
          className={`${aberto ? 'flex' : 'hidden'} md:flex absolute md:static left-0 right-0 top-full flex-col md:flex-row gap-1 md:gap-7 px-5 py-4 md:p-0 bg-[#f6f9f8] md:bg-transparent border-b border-gray-200 md:border-0`}
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
