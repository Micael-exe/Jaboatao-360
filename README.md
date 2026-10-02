# 🌎 Jaboatão 360

**Uma nova forma de descobrir, explorar e vivenciar Jaboatão dos Guararapes – PE.**

## 📌 Sobre o projeto

O **Jaboatão 360** é um aplicativo mobile desenvolvido como projeto acadêmico do curso de **Análise e Desenvolvimento de Sistemas (ADS)**.

O objetivo é ampliar a visibilidade dos atrativos turísticos, culturais e naturais de Jaboatão dos Guararapes, facilitando a descoberta de novos lugares e incentivando o turismo e o comércio local.

Por meio da tecnologia, o aplicativo busca proporcionar experiências personalizadas, conectando moradores, turistas, visitantes e empreendedores.

## 🎯 Objetivos

* Valorizar o patrimônio histórico, cultural e natural de Jaboatão.
* Facilitar o acesso às informações turísticas.
* Incentivar a visitação dos atrativos locais.
* Conectar turistas, moradores e empreendedores.
* Utilizar inteligência artificial para personalizar experiências.
* Promover o turismo e fortalecer o comércio local.

## 🚀 Funcionalidades

* 🗺️ **Mapa interativo:** localização dos principais atrativos turísticos.
* 📍 **Exploração turística:** descoberta de praias, pontos históricos e culturais.
* 🤖 **Assistente com IA:** sugestões de roteiros personalizados de acordo com as preferências do usuário.
* 🧭 **Planejamento de roteiros:** criação, organização e salvamento de passeios.
* 📷 **QR Codes:** acesso a informações históricas e curiosidades sobre os locais.
* 🏆 **Passaporte Jaboatão:** sistema de conquistas e gamificação para incentivar a exploração.
* ❤️ **Favoritos:** salvamento de atrações e roteiros.
* 🛍️ **Comércio local:** divulgação de estabelecimentos e experiências próximas.
* 👤 **Perfil do usuário:** gerenciamento da conta, preferências e histórico de visitas.

> *As funcionalidades serão implementadas progressivamente durante o desenvolvimento do projeto.*

## 💡 Diferencial

O **Jaboatão 360** vai além de um guia turístico tradicional.

O aplicativo combina **turismo, tecnologia, inteligência artificial e gamificação** para transformar a descoberta dos atrativos em uma experiência personalizada.

### Principais diferenciais

* 🤖 **Turismo personalizado:** recomendações baseadas nos interesses do usuário.
* 🗺️ **Roteiros inteligentes:** criação de experiências de acordo com tempo, interesses e preferências.
* 📷 **Experiências interativas:** QR Codes com informações e curiosidades sobre os atrativos.
* 🏆 **Gamificação:** conquistas e progresso para incentivar a descoberta de novos lugares.
* 🛍️ **Integração com o comércio local:** conexão entre visitantes, atrativos e empreendedores.
* 📱 **Experiência mobile:** acesso às funcionalidades diretamente pelo smartphone.

## 🛠️ Tecnologias

### 📱 Aplicativo Mobile

* **React Native** — desenvolvimento do aplicativo.
* **TypeScript** — tipagem e organização do código.
* **Expo** — ambiente e ferramentas para desenvolvimento mobile.

### ⚙️ Backend

* **Python** — linguagem de programação.
* **Django** — framework para desenvolvimento do backend.
* **Django REST Framework** — criação da API REST.

### 🗄️ Banco de dados

* **MySQL** — armazenamento e gerenciamento dos dados.

### 🌐 Integrações

* **OpenStreetMap** — dados cartográficos.
* **Serviço de mapas compatível com React Native** — visualização e interação com mapas.
* **Inteligência Artificial** — geração de recomendações e roteiros personalizados.
* **QR Code** — identificação e interação com atrativos turísticos.

## 👥 Público-alvo

O aplicativo é destinado principalmente a:

* Moradores de Jaboatão dos Guararapes;
* Turistas e visitantes;
* Empreendedores do setor turístico e cultural;
* Comerciantes locais;
* Pessoas interessadas em conhecer a história, cultura e atrativos do município.

## 🌱 Impacto esperado

O **Jaboatão 360** busca contribuir para:

* Maior visibilidade dos atrativos turísticos;
* Valorização do patrimônio histórico, cultural e natural;
* Incentivo ao turismo sustentável;
* Fortalecimento do comércio e dos empreendedores locais;
* Maior conexão entre moradores e os espaços turísticos do município.

### 🌍 Objetivos de Desenvolvimento Sustentável

**ODS 11 — Cidades e Comunidades Sustentáveis**

Contribuição para a valorização e preservação do patrimônio cultural e natural.

**ODS 8 — Trabalho Decente e Crescimento Econômico**

Contribuição para o fortalecimento do turismo, comércio e empreendedores locais.

## 📂 Estrutura do projeto

```text
jaboatao-360/
│
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   └── assets/
│   ├── app.json
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── usuarios/
│   ├── atrativos/
│   ├── roteiros/
│   ├── parceiros/
│   └── manage.py
│
└── README.md
```

*A estrutura poderá ser modificada conforme a evolução do projeto.*

## ⚙️ Instalação

### Pré-requisitos

* Node.js;
* npm;
* Expo;
* Python;
* MySQL;
* Git.

### 📱 Aplicativo

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/jaboatao-360.git
```

Entre na pasta do aplicativo:

```bash
cd jaboatao-360/mobile
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npx expo start
```

O aplicativo poderá ser executado utilizando **Expo Go**, emulador Android ou dispositivo compatível.

### ⚙️ Backend

Acesse a pasta:

```bash
cd jaboatao-360/backend
```

Crie o ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual e instale as dependências:

```bash
pip install -r requirements.txt
```

Configure as variáveis de ambiente e a conexão com o MySQL.

Execute as migrações:

```bash
python manage.py migrate
```

Inicie o servidor:

```bash
python manage.py runserver
```

> Os comandos e configurações poderão ser ajustados conforme a implementação definitiva do projeto.

## 🎓 Contexto acadêmico

Projeto desenvolvido no curso de **Análise e Desenvolvimento de Sistemas (ADS)**, com foco na aplicação prática de conhecimentos em:

* Desenvolvimento mobile;
* Engenharia de software;
* Desenvolvimento de APIs;
* Banco de dados;
* Inteligência artificial;
* Geolocalização;
* QR Codes;
* UX/UI;
* Integração de serviços.

## 📌 Status

🚧 **Em desenvolvimento**

O **Jaboatão 360** está em fase de planejamento e desenvolvimento acadêmico. As funcionalidades serão implementadas, testadas e aprimoradas ao longo do projeto.

---

### 🌎 Jaboatão 360

**Descubra. Explore. Viva Jaboatão.**
