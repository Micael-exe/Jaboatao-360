export const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const relogio = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Recife', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
})
export function agoraEmJaboatao(data = new Date()) {
  const partes = Object.fromEntries(relogio.formatToParts(data).map(p => [p.type, p.value]))
  return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(partes.weekday),
    minuto: Number(partes.hour) * 60 + Number(partes.minute), segundos: Number(partes.second) }
}
export function hora(minuto) {
  return [Math.floor(minuto / 60), minuto % 60].map(n => String(n).padStart(2, '0')).join(':')
}
function minutos(valor) {
  if (valor === '24:00') return 1440
  if (typeof valor !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(valor)) return NaN
  return Number(valor.slice(0, 2)) * 60 + Number(valor.slice(3))
}
// null = horário desconhecido; [] = fechado. Um período que cruza a meia-noite
// ocupa o final do dia de abertura e o início do dia seguinte.
function periodos(horarios, dia) {
  const valor = horarios?.[dia]
  if (!Array.isArray(valor)) return null
  const intervalos = []
  for (const par of valor) {
    if (!Array.isArray(par) || par.length !== 2) return null
    const [inicio, fim] = par.map(minutos)
    if (!Number.isFinite(inicio + fim) || inicio >= 1440 || inicio === fim) return null
    intervalos.push([inicio, fim])
  }
  return intervalos
}
export function janelas(horarios, dia) {
  const hoje = periodos(horarios, dia)
  if (!hoje) return null
  const ontem = periodos(horarios, (dia + 6) % 7) ?? []
  const faixas = [
    ...ontem.filter(([a, b]) => b < a && b > 0).map(([, b]) => [0, b]),
    ...hoje.map(([a, b]) => [a, b < a ? 1440 : b]),
  ].sort((a, b) => a[0] - b[0])
  const agrupadas = []
  for (const faixa of faixas) {
    const ultima = agrupadas.at(-1)
    if (ultima && faixa[0] <= ultima[1]) ultima[1] = Math.max(ultima[1], faixa[1])
    else agrupadas.push(faixa)
  }
  return agrupadas
}
export function funcionamento(horarios, dia) {
  const faixas = janelas(horarios, dia)
  if (!faixas) return 'Horário a confirmar'
  return faixas.map(([a, b]) => `${hora(a)}–${hora(b)}`).join(' e ') || 'Fechado'
}
export function situacao(horarios, { dia, minuto }) {
  const faixas = janelas(horarios, dia)
  if (!faixas) return 'Horário a confirmar'
  for (const [a, b] of faixas) {
    if (a === 0 && b === 1440) return 'Aberto o dia todo'
    if (minuto < a) return `Fechado agora · abre às ${hora(a)}`
    if (minuto < b) return `Aberto até as ${hora(b)}`
  }
  return faixas.length ? 'Fechado agora' : `Fechado · ${dias[dia].toLowerCase()}`
}
