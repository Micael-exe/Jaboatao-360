# Mapa interativo do Jaboatão 360

Na tela `/mapa`, a pessoa filtra os interesses com **Sim** ou **Não**, escolhe lugares pelas fotos e define a partida pelo GPS ou por um ponto no mapa. O roteiro mostra o trajeto de carro pelas ruas, as paradas numeradas e os horários sugeridos. Se uma visita inteira não couber no horário de funcionamento, o lugar aparece fora do trajeto com o motivo.

## Como executar a demonstração

Prepare o MySQL, aplique as migrações e inicie a API e o frontend seguindo os [primeiros passos do README](../README.md#primeiros-passos). Entre com uma conta cadastrada para acessar o mapa.

Abra o endereço indicado pelo Vite e acesse `/mapa`. Com `VITE_MAPA_LOCAIS_URL` em branco, o aplicativo usa o catálogo de demonstração incluído no projeto. A rede neural também já acompanha o código e roda no navegador. A conexão com a internet permite carregar as fotos externas, o mapa do OpenStreetMap e as rotas do OSRM.

Para conferir o fluxo durante o dia, marque **Sim** em **Praias**, clique em **Ver lugares** e escolha duas fotos com **Quero visitar**. Clique em **Montar roteiro**, selecione **Escolher no mapa**, marque um ponto próximo às praias e clique em **Gerar roteiro**. O mapa e a lista devem mostrar a mesma ordem. Para usar o GPS, abra o site em HTTPS ou em `localhost` e permita o acesso à localização.

## Como conectar os locais da equipe

Copie `frontend/.env.example` para `frontend/.env.local` e defina as variáveis conforme o ambiente.

| Variável | O que configurar |
| --- | --- |
| `VITE_MAPA_LOCAIS_URL` | Endereço completo do recurso que devolve os locais em JSON por `GET`. Se estiver em outro domínio, a API precisa permitir a leitura pelo navegador do site (CORS). |
| `VITE_MAPA_OSRM_URL` | Endereço base do servidor que calcula os trajetos. A demonstração já usa um servidor público. Para usar uma instância própria, ela deve ter cobertura de Jaboatão e oferecer os serviços `table` e `route` com o perfil `driving`. |

A API pode devolver uma lista ou um objeto com a lista na chave `locais`. Cada lugar precisa de um `id`, um `nome`, uma lista de `tags` e coordenadas numéricas em `lat` e `lng`. O exemplo abaixo representa um museu fictício.

```json
[
  {
    "id": "museu-exemplo",
    "nome": "Museu de exemplo",
    "tags": ["Museu"],
    "lat": -8.17,
    "lng": -34.92,
    "foto": "/fotos/museu.webp",
    "duracaoMin": 30,
    "horarios": {
      "0": [],
      "1": [["10:00", "14:00"]],
      "2": [["10:00", "14:00"]],
      "3": [["10:00", "14:00"]],
      "4": [["10:00", "14:00"]],
      "5": [["10:00", "14:00"]],
      "6": [["12:00", "15:00"]]
    }
  }
]
```

Use em `foto` a imagem escolhida pela equipe. Um caminho relativo é resolvido a partir da URL da API. Em `horarios`, os dias vão de `0` (domingo) a `6` (sábado). Uma lista vazia indica que o local fecha naquele dia. Um dia omitido aparece como **Horário a confirmar**. Para uma pausa de almoço, envie dois intervalos no mesmo dia.

Depois de mudar as variáveis, reinicie `npm run dev`. Para publicar, defina as variáveis no ambiente de compilação e execute `npm run build` na pasta `frontend`.

## 1. Filtrar por interesse

A primeira tela terá o título **Filtro de interesses** e a instrução **“Marque Sim para o que te interessa neste passeio e Não para o que prefere deixar de fora.”** Cada linha terá duas opções. Marcar uma delas substituirá a resposta anterior apenas naquela linha.

| Interesse | Tenho interesse | Prefiro deixar de fora |
| --- | --- | --- |
| Praias | ( ) Sim | ( ) Não |
| Shoppings | ( ) Sim | ( ) Não |
| Museus | ( ) Sim | ( ) Não |
| Artesanato | ( ) Sim | ( ) Não |
| Restaurantes | ( ) Sim | ( ) Não |
| Bares | ( ) Sim | ( ) Não |
| Outros | ( ) Sim | ( ) Não |

**Outros** reúne as categorias de interesse cadastradas na API que vão além das seis listadas. Se a equipe cadastrar **Parques**, por exemplo, marcar **Sim** em **Outros** permitirá ver fotos de parques. Novas categorias de interesse entrarão nesse grupo automaticamente.

**Regras propostas para o filtro.** Todas as linhas começarão em branco. Com pelo menos um **Sim**, a pessoa poderá tocar em **Ver lugares**. Uma categoria em branco ficará sem preferência. Se todas estiverem em branco ou marcadas como **Não**, a tela orientará a pessoa a marcar ao menos um interesse para ver as fotos.

Cada categoria corresponderá a uma tag no back-end. A resposta em **Outros** valerá para todas as categorias desse grupo. Para aparecer nos cartões, um lugar deverá ter ao menos uma tag marcada como **Sim**. Uma tag marcada como **Não** excluirá o lugar deste passeio, inclusive quando ele tiver outra tag marcada como **Sim**. Por exemplo, quem marcar **Sim** para Museus e Artesanato e **Não** para Bares verá museus e feiras de artesanato. Um museu também classificado como artesanato aparecerá uma única vez. Um local classificado como artesanato e bar ficará fora da lista.

Se nenhum lugar atender às respostas, o mapa manterá as escolhas e oferecerá **Alterar interesses**. Se a API falhar, a tela oferecerá **Tentar novamente** com as mesmas respostas.

## 2. Escolher pelas fotos e decidir quando parar

Cada cartão representará **um lugar**. A foto de destaque será a que a equipe pré-selecionou para aquele local. O nome e o tema ficarão visíveis junto à imagem para a pessoa saber o que está escolhendo. Mesmo que o local tenha várias fotos na API, um gesto registrará uma única decisão sobre o lugar.

| Ação | O que acontece |
| --- | --- |
| Deslizar para a direita ou tocar em **Quero visitar** | Guarda o lugar para este passeio, atualiza a contagem e mostra o próximo cartão. |
| Deslizar para a esquerda ou tocar em **Pular** | Deixa o lugar fora deste passeio e mostra o próximo cartão. |

Os dois botões também poderão ser usados com o teclado. A tela mostrará o progresso, por exemplo, **8 de 12 lugares vistos · 3 escolhidos**. A partir da primeira escolha, o botão **Montar roteiro** permitirá encerrar a seleção. Nesse exemplo, tocar no botão enviará somente os três escolhidos. Os quatro cartões ainda por ver ficarão fora do cálculo.

Ao terminar o último cartão, a tela seguirá para o ponto de partida se houver algum lugar escolhido. Se a pessoa tiver pulado todos, poderá **Rever os lugares** ou **Alterar interesses**. A seleção de um único lugar também será válida. Nesse caso, o mapa calculará a ida direta e verificará se a visita cabe no horário de funcionamento.

## 3. Definir de onde e quando sair

A pessoa poderá tocar em **Usar minha localização** ou **Escolher no mapa**. A primeira opção pedirá permissão para usar a posição do aparelho. A segunda permitirá marcar e confirmar outro ponto, como o hotel de onde a pessoa pretende sair. Se ela já tiver indicado um ponto de partida, o mapa o mostrará para confirmação. Se o aparelho não conseguir obter a posição, a escolha manual continuará disponível e os lugares escolhidos serão mantidos.

Para esta proposta, o cálculo usará como referência a **saída agora**, no horário local de Jaboatão. A tela mostrará essa referência antes de gerar o roteiro. Ela importa porque sair às 9h e sair às 16h do mesmo ponto pode mudar a ordem das visitas e quais paradas ainda cabem no dia.

## 4. Transformar as escolhas em um roteiro viável

A rede neural receberá o ponto de partida, a data e a hora de saída e os lugares escolhidos. Para cada lugar, receberá também os horários de funcionamento por dia da semana e a indicação de **aberto** ou **fechado** no momento da consulta. O serviço de roteiros usará os horários cadastrados na API e a hora local de Jaboatão para determinar essa indicação. Para planejar cada parada, levará em conta o horário previsto de chegada e as estimativas de percurso e de duração da visita.

**Exemplo de funcionamento de um museu**

| Dia da semana | Funcionamento |
| --- | --- |
| Segunda a sexta-feira | Das 10:00 às 14:00 |
| Sábado | Das 12:00 às 15:00 |
| Domingo | Fechado o dia inteiro |

1. **Comparar ordens de visita.** A rede sugerirá sequências considerando o tempo de percurso desde a origem e entre as paradas. O cálculo usará o caminho percorrível para o meio de transporte adotado. Dois pontos próximos no mapa podem exigir uma volta longa pelas ruas. Um local mais distante também poderá vir primeiro se fechar mais cedo.
2. **Consultar o dia da visita.** O cálculo usará o horário correspondente ao dia de cada parada. No museu do exemplo, às 11:00 de sexta-feira a indicação será **Aberto até as 14:00**. Às 11:00 de sábado, será **Fechado agora. Abre às 12:00**. No domingo, o museu aparecerá entre os lugares escolhidos com o aviso **Fechado aos domingos** e ficará fora do trajeto daquele dia.
3. **Conferir se a visita cabe inteira.** No sábado, uma chegada às 11:50 permitirá sugerir o início às 12:00, com dez minutos de espera. Para uma visita de meia hora, o último início possível será às 14:30. Às 14:45 o museu ainda estará aberto, mas restarão apenas 15 minutos. Nesse caso, o serviço tentará antecipar a parada. Se houver uma pausa no funcionamento, a visita deverá caber inteira em um dos períodos abertos. A saída de cada parada servirá de base para calcular a próxima chegada.
4. **Escolher a sequência.** A prioridade proposta é acomodar o maior número de lugares escolhidos enquanto estiverem abertos. Entre sequências que atendam ao mesmo número de lugares, terá preferência a de menor tempo somado de deslocamento e espera.

Aqui, **horário sugerido** significa a hora de iniciar a visita que melhor se encaixa naquele passeio. A indicação levará em conta as paradas anteriores e o funcionamento do local. Quando faltar o horário de um lugar, ele aparecerá entre os escolhidos com **Horário a confirmar**. Quando houver horário conhecido, mas nenhuma visita couber no período aberto, a tela mostrará o motivo ao lado do lugar. Assim, a pessoa saberá o que aconteceu com cada escolha.

## 5. Ler o resultado no mapa

O mapa mostrará o ponto de partida, o traçado do percurso e as paradas numeradas na ordem sugerida. A lista abaixo seguirá a mesma numeração. Ao tocar em um marcador, a pessoa verá o nome do lugar, se ele está aberto ou fechado naquele momento, os horários por dia da semana, o tempo estimado desde o ponto anterior e o início sugerido da visita. Quando houver espera até a abertura, a lista mostrará tanto a chegada prevista quanto o início da visita.

Se nenhuma visita couber nos horários disponíveis, a tela mostrará os lugares escolhidos com seus motivos e oferecerá **Rever escolhas**. Se o serviço de rotas estiver indisponível, a pessoa poderá tentar o cálculo novamente com a mesma origem e seleção.

**Exemplo de leitura com horários fictícios.** Uma pessoa marca **Sim** para Museus e Artesanato, escolhe o museu do exemplo e uma feira de artesanato e sai às 13:00 de sexta-feira. O museu fecha às 14:00 e a feira às 17:00. A visita prevista é de 30 minutos em cada local. Da origem, são 5 minutos até a feira ou 20 até o museu. Entre os dois, são 15 minutos.

| Parada | Funcionamento | Visita sugerida | Motivo da ordem |
| --- | --- | --- | --- |
| 1. Museu | 10:00 às 14:00 | 13:20 às 13:50 | A visita cabe inteira antes do fechamento. |
| 2. Feira | 09:00 às 17:00 | 14:05 às 14:35 | Após o museu, ainda há tempo para visitar a feira. |

Começando pela feira, a pessoa sairia de lá às 13:35 e chegaria ao museu às 13:50, com apenas dez minutos para uma visita de meia hora.

## Ordem de implementação e verificação

| Etapa | O que entregar | Como verificar antes de avançar |
| --- | --- | --- |
| 1. Filtro | Associar as respostas Sim e Não de cada categoria às tags da API. | Marcar Sim para Museus e Artesanato e Não para Bares. Conferir se um museu de artesanato aparece uma vez e se um bar com artesanato fica fora da lista. |
| 2. Cartões | Transformar os locais filtrados em cartões e reunir os identificadores dos escolhidos. | Escolher um local à direita, pular outro à esquerda e encerrar antes do último cartão. Apenas o primeiro deve seguir para o roteiro. |
| 3. Origem e cálculo | Usar a seleção da etapa anterior, confirmar a origem e validar as sequências sugeridas pela rede. | Recusar o acesso à localização, marcar a origem manualmente e reproduzir o exemplo do museu e da feira. |
| 4. Resultado | Usar a sequência validada para desenhar o percurso e preencher a lista de horários. | Conferir se mapa e lista mostram a mesma ordem e se cada lugar escolhido tem uma parada ou uma explicação visível. |

O cálculo implementado considera saída imediata no fuso de Recife e deslocamento de carro. A API pode informar a duração da visita em minutos no campo `duracaoMin`. Quando esse valor estiver ausente ou for inválido, o planejador usará 30 minutos.

## Apresentação da tela (projeto 1.8)

O topo de `/mapa` usa a foto panorâmica da Home, um degradê verde para a leitura do título e a Navbar adaptativa. Em telas largas, o índice das quatro etapas fica à esquerda e acompanha a rolagem. No celular, ele fica acima do conteúdo. A etapa atual recebe destaque visual e continua identificada para leitores de tela por `aria-current="step"`.

A coluna principal reúne o filtro, a seleção de fotos, a partida ou o resultado, conforme a etapa. Ao avançar, o foco vai para o título dessa área. Os controles **Sim** e **Não** têm área de toque de pelo menos 44 px. A seleção, o GPS, os horários, o Leaflet e o cálculo de rotas seguem o fluxo descrito nas seções 1 a 5.

| Arquivo | Papel na apresentação |
|---|---|
| `frontend/src/pages/Mapa.jsx` e `Mapa.css` | Estrutura das etapas, índice responsivo e painel de trabalho. |
| `frontend/src/components/PaginaGuia.jsx` e `frontend/src/pages/Guia.css` | Cabeçalho, largura de leitura e cores compartilhadas com as telas de Roteiros e Comércio. |

## Salvar o passeio na conta (projeto 1.9)

Depois de gerar um passeio com ao menos uma visita, use **Salvar em Meus roteiros**. Abra a tela **Roteiros** para consultar ou editar o passeio. A conta guarda a data local de Recife, a ordem, o horário sugerido e a referência de cada parada. Para os locais fornecidos por um catálogo externo, guarda também o nome apresentado no momento da escolha.

O ponto de partida, a posição do GPS, o desenho do trajeto e os locais que ficaram fora do passeio são usados apenas durante o planejamento. O botão confirma a gravação após a resposta da API e permite tentar novamente em caso de falha.

## Histórico de versões

Na atualização da versão 0.1 para a 0.2, a documentação do mapa interativo foi aprofundada. O foco foi definir as regras com mais rigor e reduzir ao máximo as chances de erros ou alucinações ao projetar e codificar a funcionalidade descrita no documento.

Na versão 1.8 do projeto, a tela recebeu a apresentação descrita acima. Os três testes de interface do mapa passaram na suíte do frontend.

Na versão 1.9, o resultado do mapa passou a poder ser salvo na conta e reaberto na tela de Roteiros.
