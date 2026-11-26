# Documentação — Novas telas, testes e pipeline de CI

Projeto **Jaboatão 360** · Frontend (React + Vite + Tailwind), API Node.js e MySQL 8

Versão da documentação: **1.9** · Atualizado em 25/11/2026

O histórico abaixo acompanha a evolução do projeto. Para configurar a versão atual, siga os [primeiros passos do README](../README.md#primeiros-passos). A seção 20 descreve as contas, a persistência e as migrações disponíveis desde a versão 1.9.

---

## 1. Escopo da entrega

| Item | Situação |
|------|----------|
| Tela de Planejamento de roteiros | Criada |
| Tela de Comércio local | Criada |
| Tela de Perfil do usuário | Criada |
| Testes automatizados do frontend | Criados |
| Pipeline GitHub Actions (linter + testes + build) | Criada |
| Badge de status no README | Adicionado |
| Backend | Fora do escopo (não alterado) |

O padrão visual existente foi mantido para que o design possa ser evoluído depois: Tailwind, verde `green-700`, cards `rounded-2xl` com borda cinza, emojis como ícones, contêiner `max-w-5xl` e aviso amarelo de dados demonstrativos.

---

## 2. As telas

### 2.1 Planejamento de roteiros — `/roteiros`
Criação, organização e salvamento de passeios.

- Catálogo de paradas (atrativos e comércios) com filtro por tipo.
- Cada parada pode receber um horário, ser movida para cima ou para baixo e ser removida.
- O roteiro tem nome e data, e só é salvo se tiver nome e ao menos uma parada.
- Roteiros salvos aparecem em cards, com ações de **editar**, **duplicar** e **excluir**.
- O rascunho em andamento é mantido ao trocar de página.

### 2.2 Comércio local — `/comercio`
Divulgação de estabelecimentos e experiências próximas aos atrativos.

- Cards com tipo, categoria, bairro, horário, faixa de preço e atrativo próximo.
- Busca por texto e filtros por tipo (Estabelecimento/Experiência) e categoria.
- Botão de favoritar.
- Botão **"+ Adicionar ao roteiro"**, que envia o item para a tela de roteiros, com atalho para ela.

### 2.3 Perfil do usuário — `/perfil`
Gerenciamento da conta, preferências e histórico de visitas.

- **Resumo:** visitas, atrativos conhecidos, roteiros salvos e favoritos.
- **Conta:** nome, e-mail, cidade, tipo de perfil e avatar.
- **Preferências:** interesses, ritmo dos passeios, faixa de gastos e notificações (salvas automaticamente).
- **Histórico de visitas:** registrar e remover visitas.

A tela foi redesenhada na versão 1.4 (seção 13) e ganhou as categorias Turista, Empreendedor e Empresa na versão 1.5 (seção 14). A descrição acima é a da versão 1.0.

### 2.4 Armazenamento
Como ainda não há backend, os dados ficam no `localStorage` do navegador (chaves iniciadas por `j360_`). Os dados de exemplo ficam centralizados em `src/data/dados.js`, o que facilita trocar por chamadas à API no futuro.

---

## 3. Arquivos criados e alterados

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Roteiros.jsx            (novo)
│   │   ├── Comercio.jsx            (novo)
│   │   ├── Perfil.jsx              (novo)
│   │   └── *.test.jsx              (novos — testes das telas)
│   ├── data/dados.js               (novo — dados demonstrativos)
│   ├── data/dados.test.js          (novo)
│   ├── hooks/useLocalStorage.js    (novo)
│   ├── hooks/useLocalStorage.test.js (novo)
│   ├── components/Navbar.jsx       (alterado — 3 links novos)
│   ├── components/Navbar.test.jsx  (novo)
│   ├── test/setup.js               (novo — configuração dos testes)
│   └── App.jsx                     (alterado — 3 rotas novas)
├── vite.config.js                  (alterado — bloco de testes)
└── package.json                    (alterado — scripts e dependências de teste)
.github/workflows/ci.yml            (novo — pipeline)
docs/DOCUMENTACAO.md                (este documento)
README.md                           (alterado — apenas o badge)
```

---

## 4. Como rodar localmente

Dentro da pasta `frontend`:

```bash
npm install        # instala dependências (inclui as de teste)
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run lint       # linter (ESLint)
npm test           # roda os testes uma vez
npm run test:watch # roda os testes em modo observação
npm run build      # build de produção
```

---

## 5. Testes automatizados

**Ferramentas:** Vitest (executor), React Testing Library (renderização e interação) e jsdom (navegador simulado).

Cada teste começa com o `localStorage` limpo, para que um teste não influencie o outro (`src/test/setup.js`).

### 5.1 Cenários cobertos

| Tela / módulo | Cenário | Tipo |
|---|---|---|
| Dados | Ids do catálogo são únicos | Integridade |
| Dados | Todo comércio aponta para um atrativo existente | Integridade |
| Dados | `buscarItem` com id existente e inexistente | Positivo / negativo |
| Hook | Usa valor inicial, lê valor salvo e grava ao alterar | Positivo |
| Hook | Conteúdo corrompido no `localStorage` volta ao valor inicial | Negativo |
| Navbar | Links novos e originais existem com a rota correta | Positivo |
| Navbar | Apenas a página atual fica destacada | Positivo |
| Roteiros | Estados vazios ao abrir | Limite |
| Roteiros | Salvar sem nome é bloqueado | Negativo |
| Roteiros | Salvar sem paradas é bloqueado | Negativo |
| Roteiros | Criar e salvar roteiro com uma parada | Positivo |
| Roteiros | Reordenar paradas (subir/descer) | Positivo |
| Roteiros | Remover parada | Positivo |
| Roteiros | Filtrar catálogo por comércio | Positivo |
| Roteiros | Duplicar e excluir roteiro salvo | Positivo |
| Comércio | Lista completa ao abrir | Positivo |
| Comércio | Busca por texto e filtro por tipo | Positivo |
| Comércio | Busca sem resultados mostra aviso | Limite |
| Comércio | Favoritar e persistir a escolha | Positivo |
| Comércio | Adicionar ao roteiro e exibir atalho | Positivo / integração |
| Perfil | Dados iniciais e resumo | Positivo |
| Perfil | Editar e salvar dados da conta | Positivo |
| Perfil | Interesses salvos automaticamente | Positivo |
| Perfil | Ligar e desligar notificações | Positivo |
| Perfil | Registrar e remover visitas | Positivo |

---

## 6. Uso de IA para apoiar os cenários de teste

A IA (Claude, da Anthropic) foi usada como **assistente de planejamento de testes**, não como substituta da revisão humana.

### 6.1 Como foi usada
1. **Levantamento de cenários:** a IA recebeu o código das telas e sugeriu cenários organizados em quatro categorias: caminho feliz (positivo), entradas inválidas (negativo), situações de borda (listas vazias, busca sem resultado) e integração entre telas (Comércio → Roteiros).
2. **Geração dos testes:** os cenários aprovados foram transformados em testes com Vitest e Testing Library.
3. **Verificação cruzada com os dados:** a IA checou, por exemplo, que os valores esperados nos testes (como "9 resultados" ou "3 resultados") batem com os dados de exemplo.
4. **Correção durante a revisão:** ao revisar o código, a IA apontou que o id de roteiros baseado só em `Date.now()` poderia colidir ao duplicar rapidamente, o que deixaria um teste instável. O gerador de id foi ajustado.

### 6.2 Cuidados adotados
- **Revisão humana obrigatória:** a equipe deve ler e aprovar cada teste sugerido antes do merge.
- **A pipeline é o juiz:** testes escritos por IA só valem depois de passarem no CI. Eles não substituem a execução real.
- **Evitar testes frágeis:** os testes verificam comportamento visível ao usuário (textos, botões, dados salvos), não detalhes internos do código.
- **Reaproveitamento:** ao criar novas telas, repetir o processo acima, pedindo cenários positivos, negativos, de borda e de integração.

### 6.3 Exemplo de pedido (prompt) reutilizável

> Aqui está o componente `NomeDaTela.jsx`. Liste cenários de teste agrupados em: caminho feliz, entradas inválidas, casos de borda e integração com outras telas. Para cada cenário, diga o que o usuário faz e o que deve acontecer. Depois escreva os testes com Vitest e React Testing Library, consultando elementos por papel e texto visível.

---

## 7. Pipeline de CI (GitHub Actions)

Arquivo: `.github/workflows/ci.yml`

**Quando roda:** a cada `push` em qualquer branch e a cada Pull Request.

**O que faz (na pasta `frontend`):**

1. Baixa o código.
2. Instala o Node.js 22 (com cache do npm).
3. Instala as dependências.
4. Executa o **linter** (`npm run lint`).
5. Executa os **testes** (`npm test`).
6. Executa o **build** de produção (`npm run build`).

Se qualquer etapa falhar, a execução fica vermelha. Em um Pull Request, o resultado aparece na própria página, e é possível exigir que a pipeline passe antes do merge (ver abaixo).

### 7.1 Badge "passing"
O README mostra o status da última execução na branch padrão:

```markdown
[![CI](https://github.com/Micael-exe/jaboatao-360/actions/workflows/ci.yml/badge.svg)](https://github.com/Micael-exe/jaboatao-360/actions/workflows/ci.yml)
```

**Troque `SEU-USUARIO/jaboatao-360` pelo caminho real do repositório.** O badge exibe **passing** (verde) depois que a pipeline rodar com sucesso na branch padrão (normalmente a `main`), ou seja, depois do primeiro merge.

### 7.2 Bloquear merge com testes falhando (opcional)
No GitHub: **Settings → Branches → Add branch protection rule** na `main` → marque **Require status checks to pass before merging** e selecione **Linter, testes e build**.

---

## 8. Limitações e próximos passos

- Os dados são demonstrativos e ficam só no navegador; não há sincronização. O login e o cadastro existem desde a versão 1.5, mas são demonstrativos (seção 14).
- Ainda não há testes de ponta a ponta (E2E) nem de cobertura mínima; podem entrar em uma próxima etapa.
- Quando o backend existir, trocar `dados.js` e o `useLocalStorage` por chamadas à API (já há `axios` instalado) e adicionar um job de testes do backend na pipeline.
- A pipeline usa `npm install`. Depois que o `package-lock.json` estiver atualizado e commitado, pode-se trocar por `npm ci`, que é mais rápido e reprodutível.

---

## 9. Redesign visual (identidade "Maré")

Esta etapa mudou **somente a aparência** das telas. Nenhuma lógica, rota, dado, texto de botão/rótulo consultado pelos testes ou chave do `localStorage` foi alterado.

### 9.1 Escopo

| Item | Situação |
|------|----------|
| Nova paleta, tipografia e formas | Aplicadas em todo o frontend |
| Navbar translúcida com menu para celular | Reescrita visualmente (mesmos links e rotas) |
| Início com hero animado (sol e ondas) e destaques em grade assimétrica | Refeito |
| Mapa, Roteiros, Comércio, Perfil e Sobre | Restilizados (estrutura e lógica intactas) |
| Testes, dados, hooks, rotas, CI e backend | Não alterados |

### 9.2 Identidade visual

- **Cores:** verde-maré `#12665d` (primária), espuma `#e6f3ef` (fundos suaves), sol `#f5b544` (acento pontual), tintas verde-acinzentadas para texto e bordas. O verde original foi mantido como base.
- **Tipografia:** Bricolage Grotesque (títulos) e Instrument Sans (texto), carregadas do Google Fonts em `index.html`. Sem conexão, o navegador usa a fonte do sistema.
- **Formas:** cantos arredondados (`1.5rem` nos cartões), bordas finas, sombras suaves apenas no hover.
- **Aviso de dados demonstrativos:** agora é uma pílula discreta com um ponto "sol", sem o emoji de alerta.
- **Ícones:** os emojis dos dados (`dados.js`) continuam; os emojis decorativos do cabeçalho e da Navbar foram trocados por SVG.

### 9.3 Animações

- **Início:** entrada em sequência dos títulos, subida do sol e ondas em movimento contínuo e lento.
- **Demais telas:** entrada suave e curta do conteúdo ao abrir a página.
- **Interações:** cor e sublinhado nos links da Navbar, botões que reagem ao clique, filtros, campos com foco destacado e ícone que se inclina no hover dos cartões.
- **Acessibilidade:** quem usa "reduzir movimento" no sistema não vê as animações; o foco do teclado é sempre visível.

### 9.4 Como o tema funciona

As cores `green`, `gray` e `yellow` do Tailwind foram **remapeadas** em `src/index.css` (bloco `@theme`). Por isso as classes já usadas nas telas assumem a nova paleta sem reescrever cada uma. Para ajustar a identidade, altere esse bloco.

Classes novas definidas no mesmo arquivo:

| Classe | Uso |
|--------|-----|
| `page`, `page-narrow`, `page-title`, `page-lead` | Contêiner, título e subtítulo das páginas |
| `notice` | Aviso de dados demonstrativos |
| `card`, `panel`, `tile`, `tag` | Cartões, painéis fixos, ícone do cartão e categoria |
| `btn` (`btn-sm`, `btn-lg`), `chip` (`chip-on`), `input` (`input-sm`) | Botões, filtros e campos |
| `avatar-btn` (`avatar-on`), `fav` | Escolha de avatar e botão de favorito |
| `nav`, `nav-link` | Navbar |
| `hero`, `ondas`, `dest` e derivadas | Tela inicial (até a v1.1; a partir da v1.2 a home usa classes `home-*`, ver seção 10) |

### 9.5 Arquivos alterados

```
frontend/
├── index.html                      (alterado — idioma pt-BR, título, fontes e cor do tema)
└── src/
    ├── index.css                   (alterado — tema, animações e classes visuais)
    ├── components/Navbar.jsx       (alterado — novo visual e menu para celular)
    └── pages/
        ├── Home.jsx                (alterado — hero e destaques; dados dos destaques mantidos)
        ├── Mapa.jsx                (alterado — apenas classes)
        ├── Roteiros.jsx            (alterado — apenas classes)
        ├── Comercio.jsx            (alterado — apenas classes e remoção do emoji do campo de busca)
        ├── Perfil.jsx              (alterado — apenas classes)
        └── Sobre.jsx               (alterado — apenas classes)
docs/DOCUMENTACAO.md                (este documento — seção 9 adicionada)
```

### 9.6 Compatibilidade com os testes

- O link ativo da Navbar continua com a classe `underline`, que o teste da Navbar consulta.
- Nomes de botões, rótulos, placeholders e títulos usados pelos testes foram preservados.
- O botão de menu da Navbar só aparece em telas pequenas e não duplica os links.
- **Pendente:** esta etapa foi entregue sem rodar a pipeline. Antes de abrir o Pull Request, execute `cd frontend && npm run lint && npm test && npm run build`.

### 9.7 Limitações

- A tela inicial usa `<a href="/mapa">` (como antes), que recarrega a página. Trocar por `Link` do React Router seria uma mudança de comportamento e ficou fora desta etapa. **Resolvido na v1.2** (seção 10).
- Os pontos de quebra (celular, tablet e desktop) foram pensados no código, mas ainda não foram conferidos em dispositivos reais.

---

## 10. Redesign da página inicial (versão 1.2)

Esta etapa redesenhou **somente a home** (`/`), com base na organização de seções do site da Abrecon (hierarquia, espaçamento e padrões de componentes), sem copiar textos, imagens ou marcas. Nenhuma outra tela, rota, dado existente, chave do `localStorage`, teste ou o `App.jsx` foi alterado. A única mudança fora da home é a marca da Navbar (seção 10.4), a pedido da equipe.

### 10.1 Escopo

| Item | Situação |
|------|----------|
| Nova home em seções (hero, indicadores, atalhos, destaques, comércio, chamada final) | Criada |
| Fotos de Jaboatão (hero e destaque principal) | Aplicadas com degradê; **demais fotos pendentes** |
| Logo nova do projeto | Aplicada no rodapé da home |
| Favicon | Trocado pelo ícone novo (`index.html` e `public/`) |
| Marca da Navbar | Ícone e texto antigos trocados pela logo nova, **sem fundo branco** (**afeta todas as telas**, pois a Navbar é global) |
| Navbar adaptativa | Só na home (`/`) e em Sobre (`/sobre`): transparente sobre o topo, encolhe ao rolar e assume o tom (escuro ou claro) da seção que está por baixo. Nas demais telas é sempre clara |
| Rodapé global (`Footer`) | Criado, com a logo, **usado somente na home** por enquanto |
| Links da home com React Router (`Link`) | Aplicado |
| Emojis na home | Removidos (ícones em SVG) |
| Novas dependências | Nenhuma |
| Paleta de cores | Mantida (somente cores já existentes no projeto) |
| Testes unitários dos componentes da home | **Pendentes** (próxima etapa) |

### 10.2 Estrutura da página

| Ordem | Bloco | Conteúdo |
|---|---|---|
| 1 | Topo | Foto de fundo com degradê, título, texto curto, botões **Ver o mapa** (`/mapa`) e **Montar roteiro** (`/roteiros`) e uma linha com 3 números calculados dos dados: atrativos (6), comércios e experiências (9) e bairros (6) |
| 2 | O que você encontra no site | Lista de 4 links: Mapa, Roteiros, Comércio local e Perfil, sem caixas nem ícones |
| 3 | Atrativos turísticos | Destaque principal com foto e degradê (Igreja de Nossa Senhora do Pilar) e lista dos demais atrativos, levando ao mapa |
| 4 | Comércio local | 3 comércios em destaque (gastronomia, experiência guiada e cultura), levando à tela de comércio |
| 5 | Chamada final | Convite para montar um roteiro |
| 6 | Rodapé | Logo, navegação, nota sobre o projeto e ano |

Em cada item, o link do título cobre a área inteira, o que mantém um único ponto de foco por item no teclado.

### 10.3 Paleta

Somente cores que já existiam no projeto:

- **Tokens do tema (`@theme`):** `#edf7f4`, `#cbe7df`, `#9fd1c5`, `#178273`, `#12665d`, `#0c4e47`, `#dce6e3`, `#566762`, `#44564f`, `#12231f`, sol `#f5b544` e verde profundo `#0c3b38`.
- **Fixas já usadas na home anterior:** `#f6f9f8`, `#e6f3ef`, `#b9d6cf` e `#ffffff`.

Os degradês sobre as fotos usam o verde profundo `#0c3b38` com transparência. Os estilos da home ficam em `Home.css` e os do rodapé em `Footer.css`, com variáveis locais que apontam para esses tokens.

**Atenção:** a logo e o favicon usam verdes, azul-marinho e toques de azul e laranja. Os verdes são próximos da paleta do site, mas não idênticos. São imagens aplicadas como recebidas; a paleta do site não foi alterada.

### 10.4 Fotos e logo

- Pasta: `frontend/src/assets/jaboatao/`. O arquivo é encontrado pelo nome, sem extensão (jpg, jpeg, png, webp ou avif).
- **Em uso:** `hero.webp` (fundo do topo, com degradê escuro por cima) e `pilar.webp` (destaque principal de atrativos).
- **Opcionais:** `piedade`, `candeias`, `guararapes`, `barra-de-jangada` e `morro-da-conceicao`. Se existirem, aparecem como miniatura na lista de atrativos.
- Sem o arquivo, o componente `Foto` não renderiza nada e o bloco continua legível (fundo em verde profundo no topo e no destaque principal).
- A imagem do topo é decorativa (`alt` vazio); a do destaque tem texto alternativo descrevendo o que mostra. A do topo carrega com prioridade e as demais, de forma preguiçosa.
- **Logo:** `src/assets/logo-jaboatao360.webp`, versão horizontal recortada das margens vazias a partir do PNG original, com fundo transparente (640 px de largura, cerca de 38 KB). Usada no rodapé.
- **Logo na Navbar:** duas versões, ambas com fundo transparente e 400 px de largura (cerca de 20 KB cada): `logo-jaboatao360-navbar.webp` (colorida, para fundos claros) e `logo-jaboatao360-navbar-branca.webp` (a mesma logo com o texto azul-marinho convertido em branco, para fundos escuros). Elas substituem o ícone SVG e o texto "Jaboatão 360", já que o nome faz parte da logo, e não há mais placa branca atrás dela. A versão clara só é carregada na home. A imagem tem `alt="Jaboatão 360"`; a outra é decorativa (`alt` vazio).
- **Favicon:** `public/favicon-32.png` (32 px) e `public/favicon.png` (192 px), referenciados em `index.html`. Foram recortados do arquivo enviado e centralizados em um quadrado, mantendo os cantos transparentes.
- **Navbar na home:** inspirada no padrão de barra transparente sobre o topo (template Canvas, usado pela referência). Nas rotas `/` e `/sobre`, a barra fica fixa sobre o topo da página, sem fundo, com links e logo claros sobre a foto. Ao rolar mais de 40 px, ela encolhe (menos altura e logo menor) e ganha fundo translúcido com desfoque. O tom do fundo acompanha a seção que está por baixo do meio da barra: sobre seções escuras (topo e chamada final) usa `#0c3b38` translúcido, texto e logo claros; sobre seções claras usa `#f6f9f8` translúcido, texto escuro e logo colorida. A troca tem transição de 0,3 s. Cada seção declara seu tom em `data-nav-tema="escura"` ou `"clara"`. Nas outras telas nada muda.
- **Pendências:** as duas fotos têm 730×449 px, abaixo do ideal para tela cheia; conferir licença e crédito de cada uma e confirmar que a foto do destaque realmente mostra a Igreja de Nossa Senhora do Pilar.

### 10.5 Rodapé global

`src/components/Footer.jsx` tem a logo, a navegação (Início, Mapa, Roteiros, Comércio local, Perfil e Sobre), uma nota de que os dados são demonstrativos e o ano atual. O fundo é claro para combinar com a logo. Ele é chamado em `Home.jsx`, `Sobre.jsx`, `Perfil.jsx` e `PaginaAcesso.jsx` (login e cadastro). Para usá-lo em todas as telas, renderize-o em `App.jsx` após as rotas e remova as chamadas dessas duas páginas para não duplicar.

### 10.6 Acessibilidade

- Estrutura de títulos: um `h1` no hero, `h2` por seção e `h3` nos cards.
- Seções com `aria-labelledby`, rodapé com `nav` rotulada e indicadores em lista de definição (`dl`).
- Foco visível, inclusive no card inteiro (`:has(:focus-visible)`); no rodapé e na faixa escura, o contorno usa a cor sol.
- Links repetidos ganham texto para leitor de tela (por exemplo, "no mapa" e "faixa de preço"), e elementos decorativos usam `aria-hidden`.
- Contraste conferido par a par, todos acima de 4,5:1 (WCAG AA), inclusive no pior caso do texto branco sobre as fotos com degradê (cerca de 5:1, considerando a parte mais clara possível da imagem). O menor valor entre cores sólidas foi 5,2:1 (texto `#cbe7df` sobre `#12665d`).
- Na barra, o texto claro sobre a foto do topo é protegido por um sombreamento escuro no alto do hero (contraste de cerca de 6:1 no pior caso).
- Mobile-first: grades de 1 coluna que passam a 2 e 3 ou 4 em telas maiores. A home não usa animações de entrada.

### 10.7 Arquivos criados e alterados

```
frontend/src/
├── pages/
│   ├── Home.jsx                    (alterado — composição das seções e rodapé)
│   └── Home.css                    (novo — estilos da home, prefixo home-)
├── data/home.js                    (novo — destaques, atalhos, indicadores e comércios em destaque)
├── components/
│   ├── Footer.jsx                  (novo — rodapé global, com a logo)
│   ├── Footer.css                  (novo)
│   ├── Navbar.jsx                  (alterado — logo nova e comportamento adaptativo na home)
│   ├── Navbar.css                  (novo — barra transparente sobre o topo da home que se adapta à seção)
│   └── home/                       (novo)
│       ├── HomeHero.jsx
│       ├── Foto.jsx
│       ├── SectionHeader.jsx
│       ├── StatsBar.jsx
│       ├── AtalhoCard.jsx
│       ├── DestaquePrincipal.jsx
│       ├── DestaqueItem.jsx
│       ├── ComercioCard.jsx
│       └── CtaBand.jsx
└── assets/
    ├── logo-jaboatao360.webp       (novo — logo do projeto)
    ├── logo-jaboatao360-navbar.webp (novo — logo leve para a Navbar)
    ├── logo-jaboatao360-navbar-branca.webp (novo — logo com texto claro, para fundos escuros)
    └── jaboatao/                   (novo — hero.webp, pilar.webp e LEIA-ME.txt)
frontend/index.html                 (alterado — links do favicon)
frontend/public/                    (novos — favicon.png e favicon-32.png)
docs/DOCUMENTACAO.md                (este documento — seção 10 e histórico)
README.md                           (alterado — versão, home, estrutura, fotos e histórico)
```

### 10.8 Limitações e pendências

- **Testes:** os componentes novos da home ainda não têm testes unitários (previstos para a próxima etapa).
- **Pipeline:** esta etapa foi entregue sem rodar `lint`, `test` e `build`. Antes do Pull Request, execute `cd frontend && npm run lint && npm test && npm run build`.
- **Visual:** a home foi validada na estrutura (renderização no servidor), mas ainda não foi conferida em navegador e dispositivos reais.
- **CSS sem uso:** as regras `.hero`, `.ondas`, `.onda*` e `.dest*` em `src/index.css` deixaram de ser usadas pela home e podem ser removidas em uma limpeza futura.
- **Fotos:** `hero.webp` e `pilar.webp` têm 730×449 px e ficam ampliadas no topo em telas grandes; o degradê escuro reduz o efeito, mas fotos de 1600 px ou mais dão resultado melhor.
- **Navbar adaptativa:** ao criar uma seção nova na home, defina `data-nav-tema` nela; sem o atributo, a barra considera o tom claro.
- **Favicon antigo:** o arquivo `public/favicon.svg` não é mais referenciado e pode ser removido.
- **Dados:** os números dos indicadores são reais em relação ao catálogo, mas o catálogo continua demonstrativo.
- **Rodapé:** os links são os mesmos da Navbar; não há contatos nem redes sociais, que precisam ser definidos pela equipe.

### 10.9 Direção visual da home

Para evitar o aspecto de página gerada por modelo, a home foi simplificada:

- Sem rótulos em caixa-alta acima dos títulos, setas "→" nos links, ícones em quadradinhos e numeração decorativa.
- Sem cartões idênticos e arredondados com sombra e elevação ao passar o mouse: atalhos e comércio viram listas com filete, e os atrativos combinam um destaque com foto e uma lista.
- Sem ilustração de reserva, sol decorativo, ondas animadas nem animação de entrada em cada bloco. Os degradês existem apenas para dar legibilidade ao texto sobre as fotos.
- Textos mais diretos, em frases simples e sem slogans.

---

## 11. Histórico de versões

| Versão | Seções | Resumo |
|---|---|---|
| **1.9** | 20 | Contas, sessões, dados pessoais e migrações versionadas no MySQL |
| **1.8.2** | 19 | Migração do cadastro para a Email Intelligence API da Abstract |
| **1.8.1** | 18 | Migração da consulta de entregabilidade para a Verifalia e tratamento de verificações em andamento |
| **1.8** | 17 | Verificação de e-mail no cadastro, saída da conta e atualização visual das telas do guia |
| **1.7** | 16 | Link "Entrar" oculto depois do login e regra de senha (maiúscula, número e caractere especial) no cadastro e no login |
| **1.6** | 15 | Acesso restrito ao mapa, roteiros, comércio e perfil (menu, rodapé e rotas), botão "Continuar sem conta" removido e documentação e testes atualizados |
| **1.5** | 14 | Login e cadastro por categoria (Turista, Empreendedor e Empresa), categorias novas no Perfil e link "Entrar" na Navbar |
| **1.4** | 13 | Redesign da página de Perfil no padrão da home e da Sobre, sem emojis, com índice lateral |
| **1.3** | 12 | Redesign da página Sobre no padrão da home e Navbar adaptativa também em `/sobre` |
| **1.2** | 10 | Redesign da página inicial com fotos e degradê, logo nova, rodapé global (só na home) e visual mais sóbrio |
| **1.1** | 9 | Redesign visual "Maré" em todo o frontend (paleta, tipografia, navbar, animações) |
| **1.0** | 1 a 8 | Telas de Roteiros, Comércio local e Perfil, testes automatizados, uso de IA nos cenários de teste e pipeline de CI |

---

## 12. Redesign da página Sobre (versão 1.3)

Esta etapa redesenhou somente a página Sobre (`/sobre`). Ela mantém a família visual da home (cores, tipografia, Navbar adaptativa, chamada final e rodapé) e a lógica da página "Quem somos" do viagem20.com.br (apresentar a plataforma, mostrar uma imagem, separar os benefícios por público e fechar com a identidade do projeto), mas tem identidade própria. As outras telas, as rotas, os dados e os testes existentes não foram alterados. A única mudança fora da página é a condição de rota da Navbar (seção 12.6).

### 12.1 Conceito

O "360" do nome é um círculo completo. O topo mostra a foto da igreja dentro de um círculo, cercado por uma escala de graus, como o mostrador de uma bússola: marcas a cada 5 graus e uma marca mais longa a cada 30. Esse é o único elemento ousado da página; o restante é quieto: texto em coluna de leitura, linhas finas e um índice lateral.

- **Escala de graus:** feita só com CSS (`repeating-conic-gradient`), nas cores sol `#f5b544` e verde profundo. Na abertura da página ela gira 25 graus até a posição final, uma única vez, em 1,4 s. Para quem reduz movimento no sistema, ela aparece parada.
- **Título do topo:** em vez de "Sobre", usa uma frase própria do projeto, "Os atrativos de Jaboatão merecem ser mais conhecidos.", que resume a problemática. O nome da página continua na Navbar.

### 12.2 Estrutura da página

| Bloco | Conteúdo |
|---|---|
| Topo | Fundo em degradê verde escuro, título, frase de apresentação da plataforma e a foto da igreja (`pilar.webp`) no círculo com escala de graus |
| Índice | "Nesta página", com os cinco capítulos. No computador fica fixo ao lado do texto e destaca o capítulo que está sendo lido; no celular vira uma fileira de atalhos com rolagem lateral |
| A problemática | Primeira frase em destaque, seguida do restante do texto |
| Motivação | Primeira frase em destaque, seguida do restante do texto |
| Objetivos | Os 5 objetivos em linhas com divisórias finas e fonte maior |
| Nossa proposta | Texto da proposta, foto do lago (`hero.webp`), as colunas **Para turistas e moradores** e **Para empreendedores locais** e a frase "Boa visita a Jaboatão!" |
| Um projeto acadêmico | Texto do curso de ADS e as tecnologias agrupadas por função: Interface, Servidor, Banco de dados, Mapas e Hospedagem |
| Chamada final e rodapé | Os mesmos componentes da home |

### 12.3 Conteúdo

- **Mantidos do projeto:** problemática, motivação, objetivos, proposta e contexto acadêmico, com a mesma redação; só os travessões foram trocados por vírgulas e dois-pontos. Em problemática e motivação, o texto foi dividido em uma frase de abertura em destaque e o restante.
- **Escritos nesta etapa:** o título do topo, a frase de apresentação, os textos introdutórios dos dois públicos, as listas de benefícios e a despedida. As listas vieram dos textos do projeto e das telas existentes (mapa, atrativos, comércio local e roteiros). Para empreendedores, os itens são objetivos do projeto, e não funcionalidades de cadastro, que o MVP não tem.
- **Definido na revisão:** o agrupamento das tecnologias por função. A lista de tecnologias é a mesma de antes.
- **Da referência:** apenas a ordem e a lógica da página. Textos e imagens do site de referência não foram usados.

### 12.4 Reaproveitamento da home

`Sobre.jsx` usa a classe `.home` e importa `Home.css`, para compartilhar as variáveis de cor, o container e a chamada final. Também reutiliza `Foto`, `CtaBand` e `Footer`. Os estilos próprios ficam em `src/pages/Sobre.css`, com prefixo `sobre-`.

### 12.5 Paleta e acessibilidade

- Somente as cores já usadas na home. O texto branco sobre o degradê do topo tem contraste de 9,6:1 a 12,4:1, e o menor contraste de texto no corpo da página é 6,4:1 (verde `#12665d` sobre `#f6f9f8`).
- Um `h1` no topo, `h2` por capítulo e `h3` nas colunas de público. Capítulos com `aria-labelledby`, índice em `nav` rotulada com `aria-current` no item ativo e tecnologias em lista de definição (`dl`).
- A foto do círculo e a do lago têm texto alternativo. A escala de graus é decorativa e fica oculta para leitores de tela.
- A rolagem suave até os capítulos só vale para quem não reduz movimento. Sem suporte a `IntersectionObserver`, o índice funciona, só não destaca o capítulo atual.
- Sem os arquivos das fotos, o círculo fica liso e a foto do lago não aparece; o restante continua legível.

### 12.6 Navbar

A Navbar adaptativa da seção 10 passa a valer também em `/sobre`: a condição de rota em `Navbar.jsx` inclui as duas páginas. Cada bloco da Sobre declara seu tom em `data-nav-tema`.

### 12.7 Arquivos criados e alterados

```
frontend/src/
├── pages/
│   ├── Sobre.jsx                   (alterado — nova página, com o índice que acompanha a rolagem)
│   └── Sobre.css                   (novo)
└── components/
    ├── Navbar.jsx                  (alterado — condição de rota inclui /sobre)
    └── Navbar.css                  (alterado — apenas comentários)
docs/DOCUMENTACAO.md                (este documento — seção 12 e histórico)
README.md                           (alterado — versão 1.3, Institucional e histórico)
```

### 12.8 Limitações e pendências

- **Testes:** a página Sobre não tem testes unitários (nem tinha antes). Ficam para a etapa de testes.
- **Pipeline e visual:** esta etapa foi entregue sem rodar `lint`, `test` e `build` e sem conferir no navegador, inclusive o desenho da escala de graus e o comportamento do índice. Execute `cd frontend && npm run lint && npm test && npm run build` antes do Pull Request.
- **Acoplamento:** a Sobre depende de `Home.css`. Se a home mudar, a Sobre acompanha.
- **Fotos:** a foto da igreja aparece na home e no topo da Sobre, e a do lago aparece no topo da home e na proposta da Sobre. Falta confirmar que a da igreja mostra a Igreja de Nossa Senhora do Pilar, descobrir o local da do lago e definir licença e crédito das duas.
- **Conteúdo novo:** revise o título do topo e as listas de benefícios, escritos a partir dos textos do projeto.

---

## 13. Redesign da página de Perfil (versão 1.4)

Esta etapa redesenhou a página de Perfil (`/perfil`) para seguir o padrão da home e da Sobre: topo escuro em degradê, tipografia, botões, Navbar adaptativa, chamada final e rodapé. A lógica, as chaves do `localStorage` e os dados da página foram mantidos. As mudanças de comportamento estão na seção 13.3.

### 13.1 Conceito

O avatar deixou de ser um emoji e virou as iniciais do nome em um disco, dentro da mesma escala de graus do topo da Sobre (o "360" do nome). Os quatro números do resumo (visitas, atrativos conhecidos, roteiros salvos e favoritos) usam a faixa de indicadores da home. As abas viraram o índice lateral da Sobre, e os cartões deram lugar a títulos grandes, filetes finos e formulários em coluna de leitura.

### 13.2 Estrutura da página

| Bloco | Conteúdo |
|---|---|
| Topo | Nome como título principal, tipo de perfil, cidade e e-mail, faixa com os quatro números e o avatar no disco com a escala de graus |
| Índice | "Seu perfil", com Conta, Preferências e Histórico de visitas. No computador fica fixo ao lado do conteúdo; no celular vira uma fileira de atalhos |
| Conta | Cor do avatar (quatro cores da paleta), nome, e-mail, cidade, tipo de perfil e, para empreendedores e empresas, o nome do negócio |
| Preferências | Interesses, ritmo dos passeios, faixa de gastos e notificações, salvos automaticamente |
| Histórico de visitas | Formulário para registrar visitas e lista em linhas com data, atrativo, categoria, bairro, anotação e o botão Remover |
| Chamada final e rodapé | Convite para montar um roteiro e o rodapé global |

### 13.3 O que foi mantido e o que mudou

**Mantido:** as chaves `j360_conta`, `j360_preferencias`, `j360_visitas`, `j360_roteiros` e `j360_favoritos_comercio`, a rotina de salvar, registrar e remover, e os textos que os testes consultam ("Salvar alterações", "+ Registrar visita", "Remover" e os nomes das seções).

**Mudou:**

- **Avatar:** o campo `avatar` da conta passa a guardar uma cor (`espuma`, `sol`, `vivo` ou `claro`) em vez de um emoji. Um emoji salvo antes é tratado como `espuma`.
- **Emojis:** removidos de toda a página (avatar, resumo, interesses, atrativos e mensagem de confirmação), seguindo a decisão da equipe de evitar emojis nas telas.
- **Mensagem ao salvar:** "Dados atualizados.", anunciada para leitores de tela (`role="status"`).
- **Interesses:** os botões informam o estado ligado ou desligado (`aria-pressed`).

### 13.4 Reaproveitamento

`Perfil.jsx` usa as classes `.home`, `.sobre` e `.perfil` e importa `Home.css`, `Sobre.css` e `Perfil.css`. Os estilos próprios ficam em `src/pages/Perfil.css`, com prefixo `perfil-`. Como a página agora usa `Link` (chamada final e rodapé), o teste dela renderiza dentro de um `MemoryRouter`.

### 13.5 Navbar

A condição de rota em `Navbar.jsx` inclui `/perfil`: a barra fica transparente sobre o topo e assume o tom de cada seção, como na home e na Sobre. Cada bloco da página declara o tom em `data-nav-tema`.

### 13.6 Acessibilidade

- Um `h1` (o nome), `h2` por seção e `h3` nos blocos. O índice é uma `nav` rotulada, com `aria-current` no item ativo.
- Todos os campos têm `label` ligado ao campo (`htmlFor`) e altura mínima de 44 px.
- As cores do avatar são decorativas: o disco fica oculto para leitores de tela e o botão de cada cor tem nome ("Cor do avatar: Sol").
- Somente cores da paleta do projeto.

### 13.7 Arquivos criados e alterados

```
frontend/src/
├── pages/
│   ├── Perfil.jsx                  (alterado — nova página)
│   ├── Perfil.css                  (novo)
│   └── Perfil.test.jsx             (alterado — MemoryRouter e teste da cor do avatar)
└── components/
    ├── Navbar.jsx                  (alterado — condição de rota inclui /perfil)
    └── Navbar.css                  (alterado — apenas comentários)
```

### 13.8 Limitações e pendências

- **Pipeline e visual:** esta etapa foi entregue sem rodar `lint`, `test` e `build` e sem conferir no navegador. Execute `cd frontend && npm run lint && npm test && npm run build` antes do Pull Request.
- **Acoplamento:** o Perfil depende de `Home.css` e de `Sobre.css`. Se a home ou a Sobre mudarem, o Perfil acompanha.
- **CSS sem uso:** as regras `.avatar-btn`, `.avatar-on` e `.panel` em `src/index.css` deixaram de ser usadas pelo Perfil. Confirme que nenhuma outra tela as usa antes de removê-las.
- **Dados de interesses:** o campo `emoji` de `interessesDisponiveis` e dos atrativos continua nos dados, mas não é mais exibido no Perfil.

---

## 14. Login e cadastro (versão 1.5)

Esta etapa criou as páginas `/login` e `/cadastro`, uma entrada e um cadastro para cada categoria de usuário, no mesmo padrão visual do Perfil e da Sobre. São **demonstrativos**: não há servidor e a senha nunca é guardada.

### 14.1 Escopo

| Item | Situação |
|------|----------|
| Login por categoria (`/login`) | Criado |
| Cadastro por categoria (`/cadastro`) | Criado |
| Categorias Turista, Empreendedor e Empresa no Perfil | Aplicadas (substituem Morador) |
| Campo do nome do negócio no Perfil (empreendedor e empresa) | Criado |
| Link "Entrar" na Navbar | Criado |
| Botão "Sair" | **Não criado** |
| Autenticação real, backend e recuperação de senha | Fora do escopo |

### 14.2 Categorias

| Categoria | Para quem |
|---|---|
| **Turista** | Turistas e moradores que usam o guia para conhecer a cidade e organizar passeios |
| **Empreendedor** | Quem toca um negócio próprio, como quiosque, passeio guiado ou ateliê |
| **Empresa** | Empresas com CNPJ, como restaurantes, hotéis e agências de turismo |

O índice lateral "Eu sou" troca de categoria, e a escolha fica na URL (`/login?categoria=empresa`), o que permite linkar direto para cada uma. Cada categoria tem seu texto, uma lista "O que você acessa" e um formulário próprio, montado do zero ao trocar de categoria (campos e erros não se misturam).

### 14.3 Login

| Categoria | Campos | Extra |
|---|---|---|
| Turista | E-mail e senha | Tinha o botão "Continuar sem conta", removido na versão 1.6 (seção 15) |
| Empreendedor | E-mail e senha | |
| Empresa | E-mail corporativo e senha | |

Validações: e-mail em formato válido e senha que segue a regra do cadastro (ver 14.4). A senha tem o botão Mostrar/Ocultar. Como não há servidor, qualquer e-mail válido com senha que siga a regra entra, e a página avisa isso.

### 14.4 Cadastro

| Categoria | Campos |
|---|---|
| Turista | Nome, e-mail, cidade de origem (opcional), senha e confirmação |
| Empreendedor | Seu nome, e-mail, nome do negócio, ramo de atuação, bairro (opcional), senha e confirmação |
| Empresa | Nome do responsável, e-mail corporativo, nome da empresa, CNPJ, ramo de atuação, senha e confirmação |

Validações, nesta ordem: nome (2 letras ou mais), e-mail, nome do negócio ou da empresa, CNPJ (pelos dígitos verificadores, aceitando com ou sem pontuação), ramo, senha e confirmação igual à senha. A senha precisa ter pelo menos 6 caracteres, com uma letra maiúscula, um número e um caractere especial (qualquer símbolo que não seja letra, número ou espaço). A mesma regra vale no login. A primeira falha aparece em uma mensagem em português. O ramo é escolhido em uma lista fixa: Gastronomia, Artesanato, Passeios e turismo, Hospedagem, Comércio em geral e Outro. O CNPJ é gravado só com os números. A validação confere apenas o formato e os dígitos, e não consulta a Receita Federal.

### 14.5 O que acontece ao entrar ou cadastrar

A função `iniciarSessao` (`src/data/acesso.js`) grava no `localStorage`:

- `j360_sessao`: categoria, e-mail e data e hora da entrada.
- `j360_conta`: nome, cidade, avatar, e-mail e tipo de perfil. No **login**, o que já estava salvo na conta é mantido e só o e-mail e o tipo mudam. No **cadastro**, a conta é criada de novo com os dados informados, mantendo apenas o avatar. Empreendedores e empresas também guardam `negocio`, `ramo`, `bairro` e, só para empresas, `cnpj`.

Depois disso, o usuário vai para `/perfil`. A senha não é gravada em nenhum lugar.

### 14.6 Mudanças no Perfil

O campo "Perfil" da conta oferece Turista, Empreendedor e Empresa. Um valor antigo (como "Morador") é tratado como Turista. Para empreendedores e empresas, aparece o campo "Nome do negócio" ou "Nome da empresa", que grava em `negocio`.

### 14.7 Estrutura do código

- `src/data/acesso.js`: categorias, ramos, validações (`emailValido`, `cnpjValido`) e `iniciarSessao`.
- `src/components/acesso/PaginaAcesso.jsx`: layout compartilhado (topo, índice de categorias, aviso, formulário, chamada final e rodapé).
- `FormularioLogin.jsx` e `FormularioCadastro.jsx`: formulários de cada modo, com os campos de cada categoria.
- `Campo.jsx` e `CampoSenha.jsx`: campo com rótulo e campo de senha com mostrar/ocultar.
- `src/pages/Login.jsx` e `Cadastro.jsx`: páginas finas que chamam `PaginaAcesso`.
- `src/pages/Acesso.css`: estilos próprios, com prefixo `acesso-`. Os formulários e botões vêm de `Perfil.css`.

### 14.8 Testes escritos (não executados)

| Arquivo | Casos | Comportamentos |
|---|---:|---|
| `Login.test.jsx` | 8 | Categoria inicial e URL, troca de categoria, recusa de e-mail e senha inválidos, entrada com gravação da sessão, mostrar senha, link para o cadastro e, na versão 1.5, "Continuar sem conta" (removido na 1.6) |
| `Cadastro.test.jsx` | 6 | Campos de cada categoria, cadastro de turista (sem gravar a senha), senhas diferentes, empreendedor com negócio e ramo, CNPJ inválido e válido, link para o login |
| `acesso.test.js` | 6 | Categorias, e-mail, CNPJ, nome gerado do e-mail e as duas formas de `iniciarSessao` |
| `Perfil.test.jsx` | 6 | Os cinco casos anteriores mais a troca de cor do avatar |

### 14.9 Navbar

Foi acrescentado o link "Entrar" (`/login`). As rotas `/login` e `/cadastro` usam a Navbar transparente sobre o topo escuro, como a home. O cadastro é acessado pelo link da página de login ou direto pela URL.

### 14.10 Arquivos criados e alterados

```
frontend/src/
├── App.jsx                         (alterado — rotas /login e /cadastro)
├── data/
│   ├── acesso.js                   (novo)
│   └── acesso.test.js              (novo)
├── pages/
│   ├── Login.jsx                   (novo)
│   ├── Login.test.jsx              (novo)
│   ├── Cadastro.jsx                (novo)
│   ├── Cadastro.test.jsx           (novo)
│   ├── Acesso.css                  (novo)
│   └── Perfil.jsx                  (alterado — categorias e campo do negócio)
└── components/
    ├── Navbar.jsx                  (alterado — link Entrar e rotas com topo escuro)
    └── acesso/                     (novo)
        ├── PaginaAcesso.jsx
        ├── FormularioLogin.jsx
        ├── FormularioCadastro.jsx
        ├── Campo.jsx
        └── CampoSenha.jsx
docs/DOCUMENTACAO.md                (este documento — seções 13 e 14 e histórico)
README.md                           (alterado — versão 1.5, funcionalidades, rotas, estrutura, persistência e histórico)
```

### 14.11 Limitações e pendências

- **Sem servidor:** o login não confere a senha nem se a conta existe. Quando houver backend, só `iniciarSessao` e os formulários precisam trocar para chamadas à API.
- **Sem "Sair":** quem entra continua com a sessão gravada até limpar os dados do navegador.
- **Dados do negócio:** o ramo, o bairro e o CNPJ são gravados no cadastro, mas o Perfil só mostra e edita o nome do negócio.
- **Sem recuperação de senha** e sem confirmação de e-mail.
- **Navbar:** não há link "Cadastrar" na barra, só o "Entrar".
- **Pipeline e visual:** esta etapa foi entregue sem rodar `lint`, `test` e `build` e sem conferir no navegador. Execute `cd frontend && npm run lint && npm test && npm run build` antes do Pull Request.
- **Acoplamento:** login e cadastro dependem de `Home.css`, `Sobre.css` e `Perfil.css`.

---

## 15. Acesso restrito a mapa, roteiros, comércio e perfil (versão 1.6)

Esta etapa faz com que os caminhos de Mapa, Roteiros, Comércio e Perfil só apareçam depois do login ou do cadastro. Sem sessão, essas telas também não abrem pela URL. Continua demonstrativo: não há servidor, e a verificação usa a mesma sessão gravada em `j360_sessao` (seção 14.5).

### 15.1 Escopo

| Item | Situação |
|------|----------|
| Mapa, Roteiros, Comércio e Perfil ocultos no menu sem login | Feito |
| Os mesmos quatro links ocultos no rodapé sem login | Feito |
| Rotas protegidas: acesso direto sem sessão redireciona para `/login` | Feito |
| Botão "Continuar sem conta" removido da tela de login | Feito |
| CTA da tela de acesso passa a levar para `/sobre` (página pública) | Feito |
| Botões da home e links internos que apontam para as telas restritas | Pendente (ver 15.7) |
| Botão "Sair" | Não criado |

### 15.2 Comportamento

| Situação | Menu e rodapé | Acesso pela URL |
|---|---|---|
| Sem sessão | Início, Sobre e Entrar aparecem. Mapa, Roteiros, Comércio e Perfil ficam ocultos | `/mapa`, `/roteiros`, `/comercio` e `/perfil` levam para `/login` |
| Com sessão (após login ou cadastro) | Os oito caminhos aparecem | As telas abrem normalmente |

As páginas públicas (`/`, `/sobre`, `/login` e `/cadastro`) continuam abertas para todos. O link "Entrar" permanece visível mesmo com sessão ativa.

### 15.3 Como funciona

- **`estaLogado()`** (`src/data/acesso.js`): retorna verdadeiro quando existe uma sessão válida em `j360_sessao`. Uma sessão corrompida conta como ausência de login.
- **Navbar e Footer:** os links de Mapa, Roteiros, Comércio e Perfil estão marcados com `restrito: true` e são filtrados conforme `estaLogado()`.
- **`Protegida` (`App.jsx`):** envolve as quatro rotas restritas. Sem sessão, renderiza `<Navigate to="/login" replace />`. O `replace` evita que o botão Voltar do navegador devolva a pessoa a uma tela restrita.
- **Atualização após o login:** `iniciarSessao` grava a sessão antes do redirecionamento para `/perfil`. Como a Navbar e o Footer são lidos a cada navegação, os links aparecem sem recarregar a página.

### 15.4 Arquivos criados e alterados

```
frontend/src/
├── App.jsx                         (alterado — componente Protegida nas rotas restritas)
├── App.test.jsx                    (novo — redirecionamento e acesso das rotas)
├── data/
│   ├── acesso.js                   (alterado — função estaLogado e botão removido do fluxo)
│   └── sessao.test.js              (novo — testes de estaLogado)
├── components/
│   ├── Navbar.jsx                  (alterado — links restritos filtrados por sessão)
│   ├── Navbar.test.jsx             (alterado — casos sem login e com login)
│   ├── Footer.jsx                  (alterado — links restritos filtrados por sessão)
│   └── acesso/
│       ├── FormularioLogin.jsx     (alterado — botão "Continuar sem conta" removido)
│       └── PaginaAcesso.jsx        (alterado — CTA aponta para /sobre)
└── pages/
    └── Login.test.jsx              (alterado — teste do "Continuar sem conta" removido)
docs/DOCUMENTACAO.md                (este documento — seção 15, histórico e seção 14)
README.md                           (alterado — versão 1.6, funcionalidades, rotas, persistência, decisões e histórico)
```

### 15.5 Testes

| Arquivo | Alteração | Casos antes → depois |
|---|---|---:|
| `Navbar.test.jsx` | Novo caso: links ocultos sem login. Os demais casos passam a rodar com sessão | 3 → 4 |
| `Login.test.jsx` | Removido o caso de "Continuar sem conta" e ajustado o caso da troca de categoria | 8 → 7 |
| `sessao.test.js` | Novo: sem sessão, após login, sessão apagada e sessão corrompida | 0 → 4 |
| `App.test.jsx` | Novo: redirecionamento das quatro rotas sem sessão, acesso com sessão e página pública aberta | 0 → 6 |

No total, o projeto passou de 11 para 13 arquivos de teste e de 66 para 76 testes.

### 15.6 Resultados medidos

| Comando | Resultado |
|---|---|
| `npm run lint` | 54 arquivos examinados, 0 erros e 0 avisos |
| `npm run test` | 76 testes aprovados em 13 arquivos |
| `npm run build` | 114 módulos transformados e 13 arquivos gerados, com 773,38 kB antes de compressão |

A cobertura por arquivo não foi medida, porque `@vitest/coverage-v8` não está instalado no projeto.

### 15.7 Limitações e pendências

- **Botões da home ainda levam às telas restritas.** "Ver o mapa" e "Montar roteiro" do hero, os destaques de atrativos, os cards de comércio e as chamadas finais de Home, Sobre e Perfil continuam apontando para as rotas protegidas. Sem login, eles levam para `/login` em vez de ficarem ocultos. Também há um link de Comércio para Roteiros nessa mesma situação.
- **Sem "Sair":** a sessão só desaparece ao limpar os dados do navegador.
- **"Entrar" continua visível** mesmo com sessão ativa.
- **Proteção apenas no frontend:** quem edita o `localStorage` consegue abrir as telas. Quando houver backend, a verificação precisa acontecer na API.
- **Cobertura por arquivo** ainda não foi remedida (ver 15.6).

---

## 16. Entrar oculto depois do login e regra de senha (versão 1.7)

Esta versão atende a dois pedidos feitos depois da 1.6: o link "Entrar" não deve aparecer depois do login, e a senha precisa de mais requisitos.

### 16.1 Escopo

| Item | Situação |
|------|----------|
| Link "Entrar" oculto na Navbar quando há sessão | Feito |
| Senha com 6 caracteres ou mais, uma letra maiúscula, um número e um caractere especial | Feito no cadastro e no login |
| Mensagem de erro da senha em português, igual nos dois formulários | Feito |
| Aviso do login demonstrativo atualizado para a nova regra | Feito |
| Dica das regras da senha visível antes do envio | Não feito (ver 16.7) |
| Botão "Sair" | Não criado |

### 16.2 Link "Entrar"

O link "Entrar" da Navbar está marcado com `visitante: true`. Sem sessão, ele aparece; com sessão, some. Os demais caminhos seguem a regra da 1.6 (seção 15.2): Mapa, Roteiros, Comércio e Perfil só aparecem com login. A Navbar e o rodapé são lidos a cada navegação, então o link some logo após o login, sem recarregar a página.

### 16.3 Regra de senha

A função `senhaValida` (`src/data/acesso.js`) exige:

- **6 caracteres ou mais;**
- **uma letra maiúscula:** a senha precisa ser diferente da sua versão em minúsculas. Letras com acento também contam;
- **um número:** qualquer dígito de 0 a 9;
- **um caractere especial:** qualquer símbolo que não seja letra, número ou espaço, como `!`, `@`, `#`, `$`, `%`, `&`, `-` e `_`. O espaço não conta.

A mensagem de erro é a mesma nos dois formulários, definida em `mensagemSenha`:

> A senha precisa ter pelo menos 6 caracteres, com uma letra maiúscula, um número e um caractere especial.

No login, a regra é aplicada também. Como o login é demonstrativo e nenhuma senha é guardada, isso só afeta quem tenta entrar com uma senha que não segue a regra.

### 16.4 Arquivos criados e alterados

```
frontend/src/
├── data/
│   ├── acesso.js                   (alterado — senhaValida e mensagemSenha)
│   └── senha.test.js               (novo — 9 casos da regra de senha)
├── components/
│   ├── Navbar.jsx                  (alterado — link Entrar oculto com sessão)
│   ├── Navbar.test.jsx             (alterado — caso do Entrar oculto)
│   └── acesso/
│       ├── FormularioCadastro.jsx  (alterado — regra de senha)
│       ├── FormularioLogin.jsx     (alterado — regra de senha)
│       └── PaginaAcesso.jsx        (alterado — aviso do login)
└── pages/
    ├── Cadastro.test.jsx           (alterado — senhas de teste e caso de senha recusada)
    └── Login.test.jsx              (alterado — senhas de teste e caso de senha recusada)
docs/DOCUMENTACAO.md                (este documento — seção 16, histórico e seção 14.4)
README.md                           (alterado — versão 1.7, regra de senha, resultados e histórico)
```

### 16.5 Testes

| Arquivo | Alteração | Casos antes → depois |
|---|---|---:|
| `Navbar.test.jsx` | Novo caso: "Entrar" some depois do login | 4 → 5 |
| `Login.test.jsx` | Novo caso: senha fora da regra é recusada. Senhas de teste trocadas | 7 → 8 |
| `Cadastro.test.jsx` | Novo caso: senhas sem maiúscula, sem número ou sem caractere especial são recusadas. Senhas de teste trocadas | 6 → 7 |
| `senha.test.js` | Novo: senhas aceitas e recusadas pela regra | 0 → 9 |

No total, o projeto passou de 76 para 88 testes e de 13 para 14 arquivos de teste.

### 16.6 Resultados medidos

| Comando | Resultado |
|---|---|
| `npm run lint` | 55 arquivos examinados, 0 erros e 0 avisos |
| `npm run test` | 88 testes aprovados em 14 arquivos |
| `npm run build` | 114 módulos transformados e 13 arquivos gerados, com 773,51 kB antes de compressão |

### 16.7 Limitações e pendências

- **Dica das regras:** a pessoa só descobre a regra ao errar. Uma dica visível abaixo do campo de senha no cadastro seria o próximo passo.
- **Login acessível com sessão:** a tela `/login` continua abrindo pela URL mesmo com sessão ativa. Só o link "Entrar" da barra some.
- **Sem "Sair":** a sessão só desaparece ao limpar os dados do navegador (seção 14.11).
- **Regra apenas no frontend:** como toda a autenticação demonstrativa, a validação não é segurança real até existir backend.
- **Cobertura por arquivo** ainda não foi remedida (ver 15.6).

---

## 17. Verificação de e-mail, saída da conta e telas do guia (versão 1.8)

### 17.1 Escopo

| Tela | Comportamento |
|---|---|
| Cadastro de turista, empreendedor ou empresa | Depois das validações locais, consulta o endereço informado. Um resultado válido libera a gravação da conta e da sessão e leva ao Perfil, com a confirmação. |
| Perfil → Dados da conta | **Sair da conta** encerra a sessão e leva para `/login`. O menu, o rodapé e as rotas protegidas acompanham a mudança, inclusive em outras abas da mesma origem. |
| Roteiros | Abertura com a foto do Pilar. Catálogo e editor ficam lado a lado em telas largas e empilhados no celular. Os roteiros salvos aparecem abaixo. |
| Comércio | Busca e filtros ficam ao lado dos resultados em telas largas. A vitrine apresenta tipo, categoria, bairro, horário e preço, com ações de favorito e de inclusão no roteiro. |
| Mapa | A apresentação e as etapas estão descritas em [MAPA_INTERATIVO.md](MAPA_INTERATIVO.md). |

### 17.2 Contrato e configuração da API

O navegador envia `POST /api/verificar-email` com `Content-Type: application/json` e um corpo como `{"email":"pessoa@example.com"}`. A API encaminha o endereço para a Abstract. Nome, senha, CNPJ e dados do negócio ficam fora da requisição. A resposta contém a chave `estado`. A aplicação não grava as consultas em banco nem no armazenamento local.

| HTTP | Estado | Efeito no cadastro |
|---|---|---|
| 200 | `valido` | O provedor retornou `deliverable` para o endereço informado, com SMTP confirmado e sem indicação de domínio catch-all. O formulário pode concluir o cadastro. |
| 200 | `invalido` | Formato incorreto ou retorno `undeliverable`, exceto para caixa cheia ou servidor temporariamente indisponível. A pessoa pode corrigir e reenviar. |
| 200 | `inconclusivo` | O provedor não confirmou uma caixa entregável para cadastro. Inclui `unknown`, caixa cheia, servidor de e-mail indisponível ou resposta entregável sem confirmação SMTP ou com indicação de domínio catch-all. A pessoa pode tentar depois ou informar outro endereço. |
| 429 | `limite` | Limite de consultas no período. O cabeçalho `Retry-After` informa quantos segundos aguardar. |
| 503 | `indisponivel` | Chave ausente ou recusada, cota ou limite de requisições da Abstract atingido, falha de rede, tempo esgotado ou resposta inesperada do provedor. Os dados preenchidos permanecem no formulário para nova tentativa. |

A API aceita JSON de até 2 KiB. Método incorreto retorna 405, tipo de conteúdo incompatível retorna 415, JSON malformado retorna 400 e corpo grande demais retorna 413. O servidor limita as consultas a 10 por endereço de conexão e 100 no total por minuto, por processo. Atrás de um proxy, conexões vindas do mesmo proxy compartilham o limite. O servidor faz uma consulta à Abstract por envio válido do formulário, com prazo de 20 segundos.

**Desenvolvimento.** Copie `frontend/.env.example` para `frontend/.env.local`, preencha `ABSTRACT_API_KEY` com a chave da Email Intelligence API da Abstract e reinicie `npm run dev` em `frontend/`. O mesmo endpoint atende `npm run preview`. A chave é lida pelo servidor e usa um nome sem o prefixo `VITE_`. A falta da chave bloqueia o cadastro com aviso de indisponibilidade. O login demonstrativo continua disponível para experimentar as telas.

**Produção.** Na raiz do projeto, com Node.js 22 e a chave no ambiente do processo, execute:

```sh
node backend/servidor.mjs
```

A porta padrão é 3001 e pode ser definida em `PORT`. No servidor web, encaminhe `/api/verificar-email` para esse processo antes da regra de fallback da SPA. Sirva o conteúdo de `frontend/dist/` no mesmo domínio, por HTTPS. Uma hospedagem exclusivamente estática precisa desse serviço para concluir cadastros. Parâmetros e credenciais do provedor estão na [documentação da Abstract](https://docs.abstractapi.com/api/email-reputation).

### 17.3 Sessão e limites do MVP

A saída remove apenas `j360_sessao`. Conta, roteiros, rascunho, favoritos, preferências e visitas continuam neste navegador conforme o modelo de armazenamento da seção 2.4. Voltar pelo histórico ou digitar uma rota protegida após sair leva ao login. O MVP continua usando um conjunto de dados por navegador, sem isolamento por conta.

A consulta indica entregabilidade no momento do cadastro. Comprovar que a pessoa controla a caixa exigiria confirmar um código ou link recebido por e-mail. O login continua demonstrativo, e a edição do endereço em Perfil não passa por nova consulta.

### 17.4 Arquivos criados e alterados

| Local | Alteração |
|---|---|
| `backend/verificar-email.mjs`, `backend/servidor.mjs` | Verificação e serviço HTTP para produção, usando recursos nativos do Node.js. |
| `frontend/vite.config.js`, `frontend/.env.example` | Rota no desenvolvimento e na prévia e exemplo da variável privada. |
| `src/data/verificarEmail.js`, `components/acesso/FormularioCadastro.jsx`, `components/acesso/PaginaAcesso.jsx` | Chamada HTTP, bloqueio de envio duplicado, cancelamento ao trocar de formulário, estados de espera e mensagens. |
| `src/data/acesso.js`, `hooks/useSessao.js`, `App.jsx`, `components/Navbar.jsx`, `components/Footer.jsx`, `pages/Perfil.jsx` | Encerramento da sessão, atualização das rotas e links, confirmação no Perfil e opção de sair. |
| `src/components/PaginaGuia.jsx`, `pages/Guia.css`, `pages/Mapa.jsx`, `pages/Mapa.css`, `pages/Roteiros.jsx`, `pages/Comercio.jsx` | Composição das três telas com fotos existentes, tipografia, cores e largura de leitura da Home e da Sobre. A Navbar adapta o contraste ao topo e ao corpo. |
| `backend/verificar-email.test.mjs`, `src/pages/Cadastro.test.jsx`, `src/App.test.jsx`, `.github/workflows/ci.yml` | Cenários de verificação, sessão e execução dos testes de API na integração contínua. |
| `README.md`, `docs/DOCUMENTACAO.md`, `docs/MAPA_INTERATIVO.md` | Instalação, arquitetura atual, histórico, alterações e resultados da entrega. |

Os caminhos abreviados de componentes, hooks e páginas da tabela são relativos a `frontend/src/`.

### 17.5 Resultados medidos

| Comando em `frontend/` | Resultado |
|---|---|
| `npm run lint` | Concluído sem erros ou avisos. |
| `npm test` | 94 testes aprovados em 14 arquivos, incluindo as três categorias de cadastro, recusa e indisponibilidade da API, saída e atualização entre abas. |
| `node --test ../backend/verificar-email.test.mjs` | 10 testes aprovados. As requisições passam pelo manipulador HTTP com respostas de provedor simuladas. |
| `npm run build` | Build de produção concluído com 118 módulos transformados. |

As três telas foram renderizadas em larguras de 375 e 1.340 px. O conteúdo ficou em uma coluna no celular e em duas no desktop, sem rolagem horizontal da página.

A verificação com uma caixa real depende das credenciais da equipe. Os testes automatizados simulam o provedor e não consomem créditos.

---

## 18. Migração do cadastro para a Verifalia (versão 1.8.1)

Esta seção registra a configuração usada na versão 1.8.1. Para instalar a versão com Abstract, siga a seção 19.

### 18.1 Atualização de uma instalação 1.8

1. Extraia os arquivos desta atualização na raiz do projeto, onde ficam o README e as pastas `backend/`, `frontend/` e `docs/`, e substitua os arquivos correspondentes.
2. No `frontend/.env.local` existente, troque a linha `ZEROBOUNCE_API_KEY` pelas duas variáveis abaixo. Preserve os valores do mapa e das demais integrações.
3. Preencha as variáveis com o usuário e a senha de API da Verifalia. O usuário precisa ter autenticação por usuário e senha habilitada e permissão para criar e ler os próprios trabalhos de verificação.
4. Em desenvolvimento, reinicie `npm run dev`. Em produção, defina as variáveis no ambiente de `backend/servidor.mjs`, reinicie esse processo e publique o frontend recompilado para atualizar o aviso do cadastro.

```dotenv
VERIFALIA_USERNAME=
VERIFALIA_PASSWORD=
```

### 18.2 Como a verificação funciona

A rota usada pelo formulário continua sendo `POST /api/verificar-email`. No servidor, a integração envia um único endereço pelo campo `entries[0].inputData` em um POST para `https://api.verifalia.com/v2.7/email-validations?waitTime=5000`. As credenciais seguem no cabeçalho HTTP Basic sobre HTTPS.

Quando recebe HTTP 202, o servidor usa o identificador do trabalho para consultar o resultado por GET, com até quatro consultas e espera solicitada de três segundos por consulta. Um HTTP 200 só libera o cadastro se o trabalho estiver concluído, contiver o endereço enviado e trouxer a classificação `Deliverable`. A tabela da seção 17.2 descreve os demais resultados. [Envio do trabalho](https://verifalia.com/developers/email-verifications/creating-jobs) · [Leitura do resultado](https://verifalia.com/developers/email-verifications/retrieving-jobs)

### 18.3 Arquivos alterados

| Arquivo | Alteração |
|---|---|
| `backend/verificar-email.mjs` | Envio autenticado, acompanhamento do trabalho e tradução das quatro classificações. |
| `backend/servidor.mjs` | Leitura das credenciais no serviço de produção. |
| `backend/verificar-email.test.mjs` | Testes do formato da requisição, classificações, acompanhamento e falhas. |
| `frontend/vite.config.js` | Carregamento das credenciais nos servidores de desenvolvimento e prévia. |
| `frontend/.env.example` | Nomes das duas variáveis privadas. |
| `frontend/src/components/acesso/PaginaAcesso.jsx` | Nome do provedor no aviso do cadastro. |
| `README.md` e `docs/DOCUMENTACAO.md` | Configuração, migração, histórico e contrato do serviço. |

### 18.4 Verificação

Os testes da API simulam as respostas da Verifalia, incluindo conclusão imediata, resposta pendente seguida de conclusão, pendência prolongada, credenciais ausentes e falhas do provedor. O teste com uma caixa real depende das credenciais da instalação.

Na versão 1.8.1, os 94 testes do frontend e os 10 da API passaram. Lint e build de produção concluídos sem erros.

---

## 19. Migração do cadastro para a Abstract (versão 1.8.2)

### 19.1 Atualização de uma instalação 1.8.1

1. Extraia o pacote na raiz do projeto, na pasta do README. Os arquivos já seguem os caminhos de destino.
2. Em `frontend/.env.local`, substitua as linhas de `VERIFALIA_USERNAME` e `VERIFALIA_PASSWORD` por `ABSTRACT_API_KEY` e informe a chave da **Email Intelligence API** da Abstract. Mantenha as outras configurações locais.
3. Reinicie `npm run dev` em `frontend/`. Para produção, configure a mesma variável no ambiente de `backend/servidor.mjs`, reinicie o serviço e publique o frontend recompilado.

```dotenv
ABSTRACT_API_KEY=sua_chave_da_abstract
```

### 19.2 Consulta e resultados

O formulário continua enviando o endereço a `POST /api/verificar-email`. O servidor faz um POST HTTPS para `https://emailreputation.abstractapi.com/v1/`, com a chave no cabeçalho Bearer e apenas o campo `email` no corpo JSON. A resposta já contém o resultado. A chave fica no servidor.

O cadastro confere se o endereço devolvido corresponde ao enviado e lê `email_deliverability.status`. Para aprovar, exige `deliverable` e `is_smtp_valid: true`. Quando o provedor sinaliza `email_quality.is_catchall: true`, a existência da caixa específica fica inconclusiva. Esse campo é opcional. A seção 17.2 descreve a resposta do projeto para cada caso, incluindo indisponibilidade do provedor. [Referência da API](https://docs.abstractapi.com/api/email-reputation)

### 19.3 Arquivos alterados

| Arquivo | Alteração |
|---|---|
| `backend/verificar-email.mjs` | Consulta à Abstract e interpretação da entregabilidade. |
| `backend/verificar-email.test.mjs` | Testes da requisição e das respostas do novo provedor. |
| `frontend/vite.config.js` e `frontend/.env.example` | Leitura e exemplo de configuração da chave. |
| `frontend/src/components/acesso/PaginaAcesso.jsx` | Identificação da Abstract no aviso de cadastro. |
| `README.md` e `docs/DOCUMENTACAO.md` | Instalação, contrato, histórico e instruções de migração. |

### 19.4 Verificação

Os testes da API usam respostas simuladas da Abstract. Os casos cobrem endereço entregável, caixa inválida ou cheia, servidor de e-mail indisponível, retorno desconhecido, domínio catch-all, ausência de confirmação SMTP, falta de chave e falhas de rede ou de cota. Para consultar um endereço real, a instalação precisa de uma chave ativa da equipe.

Resultado da versão 1.8.2: 94 testes do frontend e 10 da API aprovados. Lint e build de produção concluídos sem erros.

---

## 20. Contas e banco de dados (versão 1.9)

### 20.1 Estrutura do banco

O projeto usa o MySQL 8 previsto no roadmap e aproveita a API Node.js já usada pela Abstract. Cada conta tem um UUID que continua válido mesmo se o titular mudar o e-mail ou a categoria. As tabelas usam InnoDB e chaves estrangeiras. As coleções têm uma linha por item, o que permite ordenar paradas, consultar visitas por data e impedir favoritos repetidos.

| Tabela | Conteúdo e relação |
|---|---|
| `contas` | Uma linha por pessoa. Contém nome, e-mail único normalizado, hash da senha, cidade, tipo, avatar, data de criação e revisão. |
| `negocios` | Até um negócio por conta de empreendedor ou empresa. Registra nome, ramo e bairro. Para empresa, o CNPJ é validado e salvo com 14 dígitos. Voltar ao perfil turista remove os dados do negócio. |
| `preferencias` e `interesses_conta` | Ritmo, orçamento e três opções de notificações por conta. Cada interesse selecionado ocupa uma linha com chave composta. |
| `locais` | Identificador, nome e origem de cada atrativo ou comércio do catálogo do projeto. O comando de migração atualiza esses dados usando os IDs de `frontend/src/data/dados.js`. Preserve esses IDs ao editar o catálogo. |
| `favoritos` e `visitas` | Relacionam conta e local. Favoritos são únicos por comércio e conta. Visitas têm ID próprio, data e anotação, permitindo voltar ao mesmo atrativo. |
| `roteiros` e `paradas` | Roteiros salvos e um rascunho por conta. Cada parada tem identificador, posição e horário opcional. A referência composta liga a parada ao roteiro do titular. Locais externos do mapa conservam a referência e o nome usados no passeio. |
| `sessoes` | Hash do token de sessão, conta e vencimento. O navegador recebe um cookie HttpOnly com duração de sete dias. Sair revoga a sessão atual. |
| `migracoes` | Nome do arquivo SQL aplicado, soma SHA-256 e data de aplicação. A revisão da tabela `contas` controla alterações pessoais concorrentes e é independente da versão do esquema. |

Na página Sobre, os rótulos de servidor e banco de dados identificam Node.js e MySQL 8.

### 20.2 Arquivos e API

| Arquivo | Responsabilidade |
|---|---|
| `backend/banco/conexao.mjs` | Pool do mysql2 e transações com commit ou rollback. |
| `backend/banco/migrar.mjs` e `migracoes/*.sql` | Ordem de aplicação, trava de execução, histórico e atualização do catálogo. |
| `backend/banco/dados.mjs` | Validação e conversão entre os objetos da interface e as linhas do banco. |
| `backend/banco/api.mjs` e `backend/servidor.mjs` | Cadastro, credenciais, cookies, autorização e rotas HTTP. A API usa scrypt com salt individual para as senhas. |
| `frontend/src/data/banco.js` e `frontend/src/hooks/` | Carga da sessão, importação opcional, gravação das alterações, avisos de falha e sincronização ao voltar à aba. |

| Método e rota | Comportamento |
|---|---|
| `POST /api/cadastro` | Valida categoria, dados pessoais e e-mail pela Abstract. Cria conta, preferências e sessão em uma transação, junto dos dados importados quando selecionados. |
| `POST /api/login` | Confere e-mail, senha e categoria e devolve os dados da conta autenticada. |
| `GET /api/sessao` | Obtém os dados e a revisão atuais. Sem sessão ativa, devolve `null`. |
| `PATCH /api/dados` | Recebe `contaId`, `revisao` e `alteracoes`. A sessão identifica o titular. Os grupos enviados são validados e gravados na mesma transação. Uma troca de endereço passa pela Abstract. |
| `POST /api/sair` | Revoga a sessão no banco e expira o cookie. |
| `POST /api/verificar-email` | Mantém a consulta independente de entregabilidade da versão anterior. O cadastro faz a própria verificação no servidor. |

A interface confirma o salvamento depois da resposta da API. Se duas abas editarem a mesma revisão, a primeira gravação avança a revisão. A segunda recebe HTTP 409, recarrega os dados e pede que a pessoa refaça a alteração. Se uma transação falhar, o banco desfaz o lote.

### 20.3 Instalação e atualização da versão demonstrativa

1. Aplique os arquivos na raiz do projeto 1.8.2, preservando as pastas. Crie o banco e configure `backend/.env.local` conforme os [primeiros passos do README](../README.md#primeiros-passos). A chave da Abstract passa a ser lida pelo backend.
2. Em `backend/`, instale as dependências, execute `npm run migrate` e inicie a API com `npm start`. Abra o frontend em outro terminal.
3. Na versão demonstrativa, os registros estavam no navegador e as senhas nunca foram armazenadas. No mesmo navegador e endereço do site, abra **Cadastro**, informe o e-mail usado no perfil antigo e defina a senha. Quando os dados locais forem reconhecidos, selecione a opção de importação. Confira os campos do perfil e conclua o cadastro.
4. O cadastro importa roteiros, rascunho, favoritos, preferências e visitas presentes no armazenamento local. A importação é opcional e preserva a cópia original no navegador. Depois do cadastro, use **Entrar** em qualquer dispositivo. Para uma conta já existente no MySQL, basta rodar as migrações da nova versão no servidor.

### 20.4 Como acrescentar um campo para contas antigas e novas

A migração `002_cor_do_avatar.sql` é um exemplo executável. A primeira migração cria as contas. A segunda acrescenta `contas.avatar` com `NOT NULL DEFAULT 'espuma'`. Ao consultar uma conta criada antes da migração, o novo campo já contém o valor padrão. Novas inserções que omitem o campo também recebem esse valor.

1. Crie o próximo arquivo numerado, por exemplo `003_idioma_preferido.sql`, na pasta `backend/banco/migracoes/`. Para uma preferência individual com padrão conhecido, acrescente uma coluna em `preferencias`, como `idioma VARCHAR(12) NOT NULL DEFAULT 'pt-BR'`. Para vários valores por conta, use uma tabela relacionada, como em `interesses_conta`.
2. Se o valor inicial depender de cada registro, permita `NULL` na primeira etapa, preencha os registros antigos com uma regra definida e verifique o resultado antes de exigir o valor. Escreva cada etapa de modo que possa ser retomada após interrupção. O MySQL confirma comandos de alteração de estrutura separadamente. A migração 002 consulta `information_schema` antes de criar a coluna.
3. Mantenha intactos os arquivos já aplicados. O comando `npm run migrate` usa uma trava por banco, confere o histórico e executa os arquivos pendentes em ordem. Uma mudança no conteúdo de uma migração já registrada interrompe a execução.
4. Atualize leitura, validação e gravação em `dados.mjs` e o componente que edita o campo. Preserve o valor atual quando um cliente antigo omitir a nova propriedade. No teste de integração, crie uma conta antes da migração, aplique a mudança, crie outra e confira o valor nas duas.
5. Faça uma cópia de segurança antes de aplicar em um banco com dados reais. Execute primeiro em uma cópia de teste e depois no ambiente da aplicação, antes de iniciar o código que depende do novo campo.

### 20.5 Verificação

| Onde executar | Comandos e cobertura |
|---|---|
| `frontend/` | `npm run lint`, `npm test` e `npm run build`. Os testes de interface simulam a API e verificam fluxos como login, perfil, favoritos, rascunho e roteiro do mapa. |
| `backend/` | `npm test` executa os testes da verificação de e-mail com respostas simuladas e os testes de integração com MySQL. Use uma instância de testes e informe `DB_HOST`, `DB_PORT`, `DB_USER` e `DB_PASSWORD` em `.env.teste.local` ou no ambiente. A credencial de testes deve poder criar e remover esquemas temporários. |
| GitHub Actions | O trabalho `banco` provisiona MySQL 8 e executa a suíte com o driver definido em `backend/package.json`. |

A suíte de integração cria um esquema de nome aleatório com prefixo `j360_teste_` e o remove ao terminar. Verifica o valor padrão em contas antigas e novas, a repetição da migração, importação, validações, persistência após novo login, conflito de revisão, isolamento entre contas, exclusão em cascata e saída da conta.

Na verificação local desta entrega, os 88 testes do frontend e os 10 testes de e-mail passaram. O lint e o build também passaram. Os seis cenários de integração rodaram no MySQL 8.0.44 com o cliente nativo, por meio de um adaptador de teste. A execução com o driver mysql2 está configurada na CI. As respostas da Abstract foram simuladas.

### 20.6 Correção de “Origem inválida” no cadastro local

Ao abrir o frontend em `http://localhost:5173`, o navegador identifica essa origem no pedido de cadastro. A configuração inicial do proxy do Vite encaminhava o pedido para a API com o cabeçalho `Host: 127.0.0.1:3001`. Como os endereços divergiam, a API respondia com HTTP 403 antes de consultar a Abstract ou gravar a conta.

Em `frontend/vite.config.js`, a regra de `/api` passou a usar `changeOrigin: false`. O Vite continua encaminhando o pedido à porta 3001 e preserva o endereço público para a conferência feita pela API. A regra atende tanto ao desenvolvimento quanto à prévia do build.

Para aplicar em uma instalação da versão 1.9, substitua o arquivo de configuração, reinicie o Vite na pasta `frontend` e tente novamente pelo endereço exibido no terminal. O banco e as migrações já instalados podem continuar em uso.

Na verificação local, a configuração anterior retornou 403 em desenvolvimento e na prévia. Com a correção, o mesmo fluxo retornou 201 nos dois modos e as duas contas de teste foram localizadas no MySQL. O teste usou o proxy do Vite, a API de cadastro do projeto, uma resposta simulada da Abstract e um esquema MySQL isolado acessado pelo cliente nativo.

### 20.7 Como configurar o MySQL para `npm test` no backend

O servidor e o comando de migração leem `.env.local`. A suíte de testes lê `.env.teste.local` ou as variáveis exportadas no terminal ou na CI. Se o arquivo de teste estiver ausente e o ambiente não definir `DB_USER`, os dez testes de e-mail podem passar enquanto o teste de contas para antes da primeira conexão. A própria suíte escolhe `DB_NAME` e simula as respostas da Abstract.

1. Na pasta `backend`, execute `Copy-Item .env.teste.example .env.teste.local` no PowerShell. O arquivo de exemplo pode ser versionado. A cópia com a senha fica ignorada pelo Git.
2. Se já houver uma credencial de testes com acesso aos esquemas temporários, use-a. Para criar uma credencial local em uma instalação padrão do MySQL 8, abra o Workbench na conexão de administrador **da instância de testes**. Troque a senha de exemplo antes de executar o SQL. Os sublinhados escapados são literais e o sinal de porcentagem identifica o sufixo aleatório do esquema. Essa regra pressupõe `partial_revokes=OFF`, o padrão do MySQL 8.

   ```sql
   CREATE USER 'j360_testes'@'localhost' IDENTIFIED BY 'SUA_SENHA_DE_TESTE';
   GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES
       ON `j360\_teste\_%`.* TO 'j360_testes'@'localhost';
   ```

3. Abra `.env.teste.local` e preencha `DB_PASSWORD` com a senha escolhida. Confira `DB_HOST`, `DB_PORT` e `DB_USER`. Para outra máquina ou contêiner, ajuste o endereço e a conta de acesso à instância usada.
4. Na mesma pasta, execute `npm test`. A suíte cria um esquema `j360_teste_<identificador>`, aplica as migrações, testa as contas e remove o esquema ao terminar. Basta que o MySQL esteja rodando para essa execução.

Se aparecer **Access denied for user**, confira o usuário, a senha e o host da credencial de testes. Se a recusa mencionar um banco `j360_teste_...` durante a criação ou remoção, confira as permissões da credencial nessa instância.
