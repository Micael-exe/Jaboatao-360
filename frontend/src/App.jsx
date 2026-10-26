import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Mapa from './pages/Mapa'
import Sobre from './pages/Sobre'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App