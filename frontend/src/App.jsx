import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Mapa from './pages/Mapa'
import Sobre from './pages/Sobre'
import Roteiros from './pages/Roteiros'
import Comercio from './pages/Comercio'
import Perfil from './pages/Perfil'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/roteiros" element={<Roteiros />} />
        <Route path="/comercio" element={<Comercio />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App