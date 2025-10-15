🚀 MarceTech - Sistema Completo de Gestão
<div align="center">
https://img.shields.io/badge/Status-Em%2520Desenvolvimento-yellow
https://img.shields.io/badge/Backend-ASP.NET%2520Core-blue
https://img.shields.io/badge/Frontend-React-61dafb
https://img.shields.io/badge/Database-MySQL-orange

Sistema profissional para gestão comercial, orçamentos e produção

</div>
📋 Sobre o Projeto
O MarceTech é um sistema completo desenvolvido para otimizar processos comerciais e de produção, oferecendo soluções integradas para gestão de clientes, orçamentos, materiais e muito mais. Este projeto demonstra habilidades full-stack com tecnologias modernas e boas práticas de desenvolvimento.

🎯 Destaques do Projeto
Arquitetura bem definida com separação clara entre frontend e backend

API RESTful completa com documentação Swagger

Interface moderna e responsiva em React

Integração com MySQL via Entity Framework Core

Validações robustas no servidor e cliente

Sistema de gestão comercial completo

🏗️ Arquitetura do Sistema
text
marcetech/
├── 📁 backend/          # API ASP.NET Core
│   ├── Controllers/     # Endpoints da API
│   ├── Models/          # Modelos de dados
│   └── MarceTechContext.cs
├── 📁 frontend/         # Aplicação React
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   └── styles/          # Estilos CSS
└── 📄 README.md
🛠️ Tecnologias Utilizadas
Backend
ASP.NET Core - Framework web

Entity Framework Core - ORM para acesso a dados

Pomelo.EntityFrameworkCore.MySql - Provider MySQL

Swagger/OpenAPI - Documentação da API

CORS - Configuração de políticas de origem cruzada

Frontend
React 18.2.0 - Biblioteca de interface

React Router DOM 6.8.0 - Roteamento

CSS Modules - Estilização componentizada

Componentes Funcionais - Com hooks modernos

Banco de Dados
MySQL - Banco de dados relacional

Scaffolding - Geração automática de modelos

⚙️ Funcionalidades Implementadas
✅ Módulos Concluídos
Backend (API)
Ambientes - CRUD completo

Categorias - Gestão com remoção em cascata

Clientes - Cadastro com validações de CPF/CNPJ

Itens de Categoria - Gestão de produtos/serviços

Orçamentos - Criação vinculada a clientes

Frontend (Interface)
Dashboard - Visão geral do sistema

Gestão de Clientes - Cadastro e listagem

Catálogo de Materiais - Controle de produtos

Sistema de Orçamentos - Criação e acompanhamento

Layout Responsivo - Sidebar colapsável e design adaptativo

🔄 Em Desenvolvimento
Módulo de Contratos

Gestão Comercial Avançada

Gestão de Produção

Cronogramas e Timeline

Sistema de Usuários e Permissões

🚀 Como Executar o Projeto
Pré-requisitos
.NET 6.0 ou superior

Node.js 16+ e npm

MySQL Server

Git

1. Clone o repositório
bash
git clone <url-do-repositorio>
cd marcetech
2. Configuração do Backend
bash
cd backend

# Sincronizar banco de dados
dotnet ef dbcontext scaffold "server=148.113.189.63;database=marcetech;uid=marcetech;pwd=36R#e*3V&tO1@uI7zHcQYeD3;" Pomelo.EntityFrameworkCore.MySql -o Model -f -c MarceTechContext

# Restaurar pacotes
dotnet restore

# Executar aplicação
dotnet run
API disponível em: https://localhost:7000
Swagger UI: https://localhost:7000/swagger

3. Configuração do Frontend
bash
cd frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm start
Frontend disponível em: http://localhost:3000

📊 Características Técnicas Destacadas
Backend Excellence
Tratamento de Erros - Try/catch em todos os endpoints

Validações de Negócio - CPF/CNPJ, email, duplicatas

Padrão REST - Verbos HTTP corretos e status codes apropriados

Injeção de Dependência - Configuração nativa do ASP.NET Core

Migrações EF Core - Controle de versão do banco

Frontend Moderno
Componentização - Código reutilizável e manutenível

Roteamento Declarativo - Navegação fluida entre páginas

Estado Local - Gerenciamento com useState hooks

CSS Modular - Estilos escopados por componente

UX/UI - Interface intuitiva com feedback visual

Integração Robust
Comunicação API - Fetch/axios para consumo de endpoints

CORS Configurado - Comunicação entre domínios

Formatação de Dados - Models compatíveis entre frontend/backend

Validações Sincronizadas - Regras consistentes no client e server

🎯 Habilidades Demonstradas
Desenvolvimento Backend
Arquitetura de APIs RESTful

Entity Framework Core e ORM

MySQL e modelagem de dados

Validações e tratamento de exceções

Segurança básica (CORS, validações)

Documentação com Swagger

Desenvolvimento Frontend
React com Hooks modernos

Gerenciamento de estado e props

Roteamento com React Router

Componentização e reutilização

CSS e design responsivo

Consumo de APIs REST

DevOps e Ferramentas
Controle de versão com Git

Gerenciamento de dependências (NuGet, npm)

Build e deployment scripts

Configuração de ambiente

Documentação técnica

📈 Próximos Passos Planejados
Implementar autenticação JWT

Adicionar testes unitários e de integração

Criar sistema de relatórios

Implementar upload de arquivos

Adicionar notificações em tempo real

Criar versão PWA (Progressive Web App)

Implementar logging estruturado

Adicionar monitoramento e métricas

🤝 Contato
Desenvolvido com 💙 por um profissional apaixonado por tecnologia

https://img.shields.io/badge/LinkedIn-Connect-blue
https://img.shields.io/badge/GitHub-Follow-black

<div align="center">
"Código não é apenas instruções para máquinas, é a materialização da solução de problemas reais."

</div>
