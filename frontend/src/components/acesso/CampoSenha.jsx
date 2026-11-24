import { useState } from 'react'

export default function CampoSenha({ id, rotulo = 'Senha', valor, aoMudar, autoComplete }) {
  const [ver, setVer] = useState(false)

  return (
    <div className="perfil-campo">
      <label htmlFor={id}>{rotulo}</label>
      <div className="acesso-senha">
        <input
          id={id}
          type={ver ? 'text' : 'password'}
          autoComplete={autoComplete}
          className="input"
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          required
        />
        <button
          type="button"
          className="acesso-ver"
          aria-label={`${ver ? 'Ocultar' : 'Mostrar'} ${rotulo.toLowerCase()}`}
          onClick={() => setVer((v) => !v)}
        >
          {ver ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    </div>
  )
}
