import { Fragment, useSyncExternalStore } from 'react'
import { aviso, observar, versaoDaConta } from './data/banco'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Mapa from './pages/Mapa'
import Sobre from './pages/Sobre'
import Roteiros from './pages/Roteiros'
import Comercio from './pages/Comercio'
import Perfil from './pages/Perfil'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Navbar from './components/Navbar'
import useSessao from './hooks/useSessao'

// Sem login ou cadastro, a tela não abre: a pessoa é levada para a entrada
function Protegida({ children }) {
  const versao = useSyncExternalStore(observar, versaoDaConta)
  return useSessao() ? <Fragment key={versao}>{children}</Fragment> : <Navigate to="/login" replace />
}

function App() {
  const mensagem = useSyncExternalStore(observar, aviso)
  return (
    <BrowserRouter>
      <Navbar />
      {mensagem && <p className="notice" role="alert" style={{ position: 'fixed', bottom: 0, left: 12, zIndex: 1200 }}>{mensagem}</p>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={<Protegida><Mapa /></Protegida>} />
        <Route path="/roteiros" element={<Protegida><Roteiros /></Protegida>} />
        <Route path="/comercio" element={<Protegida><Comercio /></Protegida>} />
        <Route path="/perfil" element={<Protegida><Perfil /></Protegida>} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App