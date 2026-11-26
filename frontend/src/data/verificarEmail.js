const mensagens = {
  invalido: 'Este endereço de e-mail é inválido. Confira a grafia e tente novamente.',
  inconclusivo: 'Não foi possível confirmar esta caixa de e-mail. Tente novamente ou use outro endereço.',
  limite: 'Muitas verificações em pouco tempo. Aguarde um minuto e tente novamente.',
}

export async function verificarEmail(email, signal) {
  const indisponivel = 'A verificação de e-mail está indisponível. Tente novamente.'
  let resposta
  let estado
  try {
    resposta = await fetch('/api/verificar-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal,
    })
    const resultado = await resposta.json()
    estado = resultado.estado
  } catch {
    throw new Error(indisponivel)
  }
  if (resposta.ok && estado === 'valido') return
  throw new Error(mensagens[estado] || indisponivel)
}
