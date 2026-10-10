# ⚡ Mrl Stock & CRM

> Sistema web leve, modular e interativo para controle de estoque (entradas e saídas) e gestão de relacionamento com clientes (CRM), desenvolvido com foco em performance, arquitetura limpa e usabilidade para pequenos negócios.

![Badge Status](https://img.shields.io/badge/status-active-success.svg)
![Badge License](https://img.shields.io/badge/license-MIT-blue.svg)
![Badge Tech](https://img.shields.io/badge/stack-HTML5%20%7C%20TailwindCSS%20%7C%20JavaScript%20ES6-yellow)

---

## 🚀 Demonstração
Acesse a versão online rodando diretamente via GitHub Pages: [🔗 Ver Demonstração Ao Vivo](https://SEU-USUARIO.github.io/mrl-stock-crm/)  
*(Lembre-se de substituir `SEU-USUARIO` pelo seu usuário real do GitHub)*

---

## 📊 Principais Funcionalidades

### 📈 1. Dashboard Executivo (Visão Geral)
* Métricas financeiras e operacionais em tempo real.
* Cálculo automático do **Capital Total Imobilizado** no estoque.
* Monitoramento de itens com **Estoque Crítico** ($\le 3$ unidades) com destaque visual.
* Indicador do total de produtos cadastrados e clientes ativos no CRM.

### 📦 2. Controle de Estoque Inteligente
* Cadastro, listagem, filtragem e exclusão de produtos.
* Registro rápido de **Entradas** (reposição/compras) e **Saídas** (vendas/baixas) com histórico auditável.
* Log completo de movimentações contendo data, hora, tipo e observações.

### 👥 3. CRM de Clientes & Leads
* Gestão de contatos com nome, telefone e estágio no funil de vendas (*Lead, Contato, Negociação, Fechado*).
* Botão de disparo rápido direto para o **WhatsApp** com mensagem automatizada e personalizada.
* Filtros em tempo real por nome ou status do cliente.

---

## 🛠️ Tecnologias Utilizadas
* **HTML5 Semantic:** Estruturação limpa e acessível.
* **Tailwind CSS (CDN):** Design moderno, responsivo e interface *mobile-first*.
* **JavaScript (ES6 Modules):** Organização modular do código sem dependência de frameworks complexos ou ferramentas de build.
* **Web Storage (LocalStorage):** Persistência de dados direto no navegador do usuário, contendo dados iniciais de exemplo (*seed*).

---

## 📁 Estrutura do Projeto

```text
mrl-stock-crm/
├── index.html          # Ponto de entrada (SPA com abas e modais)
├── js/
│   ├── main.js         # Orquestrador global e controle de navegação
│   ├── state.js        # Gerenciamento de estado e LocalStorage
│   ├── dashboard.js    # Métricas e cálculos executivos
│   ├── estoque.js      # Lógica e renderização do estoque
│   ├── movimentos.js   # Histórico de entradas e saídas
│   └── crm.js          # Gestão de clientes e links do WhatsApp
└── README.md           # Documentação do projeto
