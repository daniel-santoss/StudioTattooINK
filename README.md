# 🖋️ Ink Studio Tattoo (Front-end)

Sistema de gerenciamento para estúdios de **tatuagem e piercing**, desenvolvido para conectar clientes a artistas e facilitar a administração do estúdio. O projeto utiliza uma **arquitetura moderna baseada em React 19 e Vite**, com ênfase na organização, escalabilidade e experiência do usuário.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído com as seguintes tecnologias principais:

* **Tecnologias:** React `v19.2.3` e TypeScript `5.8.2`
* **Build Tool:** Vite `v6.2.0`
* **Roteamento:** React Router Dom `v7.11.0`
* **Estilização:** Tailwind CSS
* **Assets:** Imagens e arquivos estáticos

---

## 🎨 User Interface & User Experience

O projeto foi pensado com foco em **UI** e **UX**, buscando oferecer uma navegação intuitiva, visual moderno e fluidez na interação entre clientes, artistas e administradores.

### ✨ Principais Destaques de Design

* **Design centrado no usuário**: Fluxos claros para agendamento, navegação e gestão de informações
* **Layouts responsivos**: Adaptação para diferentes resoluções de tela (desktop, tablets e mobile)
* **Separação visual de contextos**:

  * Área do cliente com visual mais leve e convidativo
  * Área administrativa com foco em produtividade e organização
* **Feedback visual**:

  * Estados de hover e foco
  * Indicações visuais de ações (botões, cards, navegação)
* **Componentização visual**:

  * Uso extensivo de componentes reutilizáveis (cards, layouts, topbar e sidebar)
* **Hierarquia visual bem definida**:

  * Tipografia clara
  * Espaçamentos consistentes
  * Organização por seções e cards
* **Transições e efeitos visuais suaves**:

  * Mudanças de páginas e estados sem quebras bruscas

O objetivo é garantir uma experiência fluida, profissional e acessível, tanto para clientes quanto para artistas e administradores do estúdio.

---

## 📋 Funcionalidades

O sistema é dividido em **dois perfis principais**, com base na estrutura de rotas e permissões.

### 👤 Área do Cliente (Público / Privado)

* **Landing Page**: Apresentação do estúdio e portfólio visual
* **Galeria de Artistas**: Visualização de perfis públicos e trabalhos dos tatuadores
* **Agendamento**: Solicitação de sessões de tatuagem ou piercing
* **Matchmaker**: Ferramenta de IA para ajudar o cliente a encontrar o artista ideal
* **Painel do Cliente**:

  * Histórico de agendamentos
  * Detalhes das sessões
* **Autenticação**:

  * Login
  * Cadastro
  * Recuperação de senha

---

### 🛠️ Área Administrativa / Artista (Acesso Restrito)

* **Dashboard**: Visão geral do estúdio
* **Gestão de Agenda (Schedule)**: Calendário de atendimentos
* **Solicitações de Booking**: Aprovação ou rejeição de pedidos de clientes
* **Gestão de Clientes e Staff**: Administração de usuários e equipe
* **Histórico e Relatórios**:

  * Serviços realizados
  * Métricas e relatórios
* **Perfil**: Edição de dados do usuário/artista

---

## 📂 Estrutura do Projeto

A organização das pastas segue um padrão **modular e escalável**:

```bash
src/
├── assets/          # Imagens e recursos estáticos (tatuagens, banners, etc)
├── components/      # Componentes reutilizáveis
│   ├── ClientLayout # Layout da área pública/cliente (Topbar)
│   └── Layout       # Layout da área administrativa (Sidebar)
├── pages/           # Páginas da aplicação
│   ├── client/      # Páginas da visão do cliente (Landing, Gallery, etc)
│   └── admin/       # Páginas administrativas (Dashboard, Reports, Staff)
├── App.tsx          # Configuração principal de rotas e autenticação
└── main.tsx         # Ponto de entrada da aplicação
```

---

## 🔧 Como Executar o Projeto

### Pré-requisitos

* Node.js instalado (versão recomendada: LTS)

### Instalação das dependências

```bash
npm install
```

### Executar em ambiente de desenvolvimento

```bash
npm run dev
```

O comando acima inicia o servidor de desenvolvimento utilizando o **Vite**.

### Build para produção

```bash
npm run build
```

---

## 🔐 Autenticação e Proteção de Rotas

* O sistema utiliza um componente **`RequireAuth`** para proteger rotas sensíveis
* O controle de acesso é feito através da chave **`ink_role`** armazenada no `localStorage`
* Usuários não autenticados ou sem permissão adequada são redirecionados para a rota:

```text
/login
```

---

## 📌 Status do Projeto

🚧 Projeto "Finalizado" (Atuamente sem prévias para futuras mudanças).

---
