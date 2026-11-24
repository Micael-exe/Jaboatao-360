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
import { estaLogado } from './data/acesso'

// Sem login ou cadastro, a tela não abre: a pessoa é levada para a entrada
function Protegida({ children }) {
  return estaLogado() ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
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