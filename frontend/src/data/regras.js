export const emailValido = (valor) => /^\S+@\S+\.\S+$/.test(valor)

// Senha: 6 caracteres ou mais, com pelo menos uma letra maiúscula, um número e um caractere especial
export const senhaValida = (valor) =>
  valor.length >= 6 &&
  valor !== valor.toLowerCase() &&
  /\d/.test(valor) &&
  /[^\p{L}\p{N}\s]/u.test(valor)

export const mensagemSenha =
  'A senha precisa ter pelo menos 6 caracteres, com uma letra maiúscula, um número e um caractere especial.'

export function cnpjValido(valor) {
  const n = String(valor).replace(/\D/g, '')
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false
  const digito = (tamanho) => {
    const pesos = tamanho === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const resto = pesos.reduce((soma, p, i) => soma + Number(n[i]) * p, 0) % 11
    return resto < 2 ? 0 : 11 - resto
  }
  return digito(12) === Number(n[12]) && digito(13) === Number(n[13])
}

