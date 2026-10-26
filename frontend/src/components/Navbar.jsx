import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Início' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/sobre', label: 'Sobre' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          🌎 Jaboatão 360
        </Link>
        <div className="flex gap-4 text-sm font-medium">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`hover:text-green-200 transition-colors ${
                pathname === to ? 'underline underline-offset-4' : ''
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