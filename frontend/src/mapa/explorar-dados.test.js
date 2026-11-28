import { expect, it } from 'vitest'
import { montarCatalogo, filtrar, temCoordenadas } from './explorar-dados'
import { consultarRota } from './rota-explorar'
it('preserva horários, inclui comércio sem coordenadas e não filtra por raio', () => {
  const horarios = [[['10:00','18:00']]]
  const dados = montarCatalogo([{id:'a',nome:'Praia',tags:['Praia'],lat:-8.18,lng:-34.9,horarios}], [{id:'c',nome:'Café',categoria:'Gastronomia',origem:'Comércio'}])
  expect(dados[0].horarios).toBe(horarios)
  expect(filtrar(dados,{origem:{lat:-9,lng:-35}})).toHaveLength(2)
  expect(filtrar(dados,{cat:'comercio'}).map(l=>l.id)).toEqual(['c'])
  expect(dados.filter(temCoordenadas)).toHaveLength(1)
})
it('converte a geometria OSRM em pontos Leaflet e calcula distância e tempo', async () => {
  const consultar = async () => ({ok:true,json:async()=>({code:'Ok',routes:[{distance:2300,duration:121,geometry:{coordinates:[[-34.9,-8.18],[-34.91,-8.19]]}}]})})
  const r = await consultarRota({lat:-8.18,lng:-34.9},{lat:-8.19,lng:-34.91},new AbortController().signal,consultar)
  expect(r).toEqual({linha:[[-8.18,-34.9],[-8.19,-34.91]],distancia:2.3,minutos:3})
})
