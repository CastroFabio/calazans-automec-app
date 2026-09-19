# Plano de Tarefas - Sistema de Ordens de Serviço (Oficina Mecânica)

## 1. UX/UI & Redesign do Fluxo de Criação de OS (Teste A/B de Variante)

> **Nota de Contexto:** Esta reestruturação do fluxo de OS será implementada como uma **variante de teste de usabilidade** junto aos usuários para validar se a navegação em 4 passos traz ganho real de agilidade em comparação ao fluxo contínuo.

### [UX/UI] Reestruturação da Criação da OS em 4 Passos

- **Passo 1 - Cliente e Veículo:**
  - Busca e seleção de cliente e veículo.
- **Passo 2 - Serviços e Materiais:**
  - **Input de Mão de Obra:** Custo no topo da seção.
  - **Botão "Registrar serviço":** Posicionado no topo do formulário.
  - **Lista de serviços:** Renderização dos serviços adicionados com autocomplete.
  - **Peças/Materiais:** Adição e listagem de peças associadas a cada serviço.
  - Botão de acionamento do Modal de Cadastro Rápido de Peça e Serviço.
- **Passo 3 - Informações da OS & Pagamento:**
  - Atribuição de profissional/mecânico responsável.
  - Status da Ordem de Serviço (Aguardando, Em Andamento, Concluída, etc.).
  - Status do Pagamento (Pendente, Parcial, Quitado).
  - **Ação de Pagamento Efetivado:** Se a OS já estiver paga, liberar etapa/opção para "Efetuar Pagamento" imediato com os detalhes da transação.
  - Campo para diagnóstico e observações técnicas.
- **Passo 4 - Resumo da OS:**
  - Tela final de conferência de todos os dados preenchidos (Cliente, Veículo, Serviços, Peças, Valores Totais, Responsável e Pagamento).
  - Botão final para salvar e emitir a OS.

#### Informações Técnicas & Git

- **Variante do Wizard em 4 Passos:** `feature/os-4step-wizard-summary`
- **Versão:** `MINOR`

---

## 2. [UI/UX] Componente Global de Tratamento e Exibição de Erros

> **Nota de Contexto:** Implementação essencial para focar no aprendizado de **resiliência de software** e tratamento padronizado de falhas na camada do cliente.

- **Objetivo:** Criar um componente/modal/banner reutilizável (`ErrorNotification`) para capturar exceções da API via interceptor e exibir mensagens amigáveis ao usuário.
- **Cenários/Erros Mapeados:**
  - **HTTP 400 (Bad Request):** Dados de formulário/input inválidos (ex: validação de DTO, preço em formato incorreto ou campo obrigatório ausente).
  - **HTTP 404 (Not Found):** Registro inexistente (ex: carregar cliente, peça ou OS por ID inexistente).
  - **HTTP 409 (Conflict):** Conflito de cadastro (ex: tentativa de cadastrar celular/CPF em duplicidade).
  - **HTTP 401 / 403 (Unauthorized / Forbidden):** Sessão expirada ou acesso não autorizado.
  - **HTTP 500 (Internal Server Error):** Erro interno no servidor ou no banco de dados.
  - **Erro de Conexão/Rede:** Servidor indisponível ou perda de conexão com a internet.

#### Informações Técnicas & Git

- **Componente Global de Erros:** `feature/ui-global-error-handling-component`
- **Versão:** `PATCH` (Melhoria interna de resiliência e UI)

---

## 3. [Backend/Jest] Suíte de Testes Unitários

> **Nota de Contexto:** Tarefa **principal do backend**. Servirá de base sólida para entender na prática a necessidade de validação automatizada de código antes de introduzir rotinas avançadas de CI/CD.

- **Objetivo:** Implementar cobertura de testes unitários para Services e Controllers no NestJS utilizando Jest, isolando o banco de dados via mocks.
- **Estratégia de Mocks:**
  - Criar mock do `PrismaService` (via `jest-mock-extended` ou `jest.fn()`) para simular o comportamento do banco sem efetuar chamadas reais.
  - Criar mocks do `JwtService` e estratégias de autenticação para validar emissão e expiração de tokens em memória.
- **Escopo por Módulo:**
  - **`AuthService` & `UsersService`:** Testar login, validação de senha via Bcrypt, geração de Access/Refresh tokens JWT e rotas de renovação (`/refresh`).
  - **`CustomersService` & `VehiclesService`:** Testar CRUD, validação de unicidade (celular/placa) e tratamento de exceções (HTTP 404/409).
  - **`ServiceOrdersService`:** Testar regras de cálculo de totais (mão de obra + materiais), tratamento de decimais, paginação (`skip`/`take`) e regras de transição de status da OS.
  - **`MaterialsService` & `MaintenanceJobsService`:** Testar busca paginada e cadastro de novos itens no catálogo.

#### Informações Técnicas & Git

- **Versão:** `PATCH` (Validação de qualidade do código sem alteração do comportamento externo)
- **Branches por Módulo:**
  - **Autenticação e Usuários:** `test/auth-users-unit-tests`
  - **Clientes e Veículos:** `test/customers-vehicles-unit-tests`
  - **Ordens de Serviço:** `test/service-orders-unit-tests`

---

## 4. Backlog Futuro & Portfólio de Alto Impacto

### 4.1. Módulos de Produção Futura (Apos Aprender Novas Áreas de Dev)

- **[Portal] Portal do Cliente & Acompanhamento de Veículo:**
  - **Por que e para que serve:** Permite que o dono do veículo consulte o status da manutenção em tempo real sem precisar ligar para a oficina, além de visualizar e aprovar orçamentos online.
  - **Escopo:** Página web pública/restrita para clientes com acompanhamento gráfico das etapas da OS e histórico de serviços passados.
  - **Versão:** `MINOR`
  - **Branch:** `feature/customer-portal-vehicle-status`

- **[Agendamento] Módulo de Agendamento Online:**
  - **Por que e para que serve:** Resolve gargalos de recepção na oficina, permitindo que o próprio cliente escolha o melhor dia e horário para levar o veículo para revisão.
  - **Escopo:** Interface de calendário integrada ao backend para gestão de horários disponíveis e confirmação de serviços.
  - **Versão:** `MINOR`
  - **Branch:** `feature/online-scheduling-calendar`

- **[Dashboard] Indicadores & Métricas do Negócio:**
  - **Por que e para que serve:** Oferece visão estratégica do negócio para o gestor da oficina, transformando dados brutos em inteligência comercial.
  - **Escopo:** Gráficos e cards na home apresentando faturamento mensal, ticket médio por OS, peças/serviços mais lucrativos e taxa de ocupação da oficina.
  - **Versão:** `MINOR`
  - **Branch:** `feature/analytics-dashboard-metrics`

### 4.2. DevOps, Qualidade & Documentação (Diferenciais para Portfólio)

- **[API] Documentação Interativa com Swagger (`@nestjs/swagger`):**
  - **Explicativo:** Gera automaticamente uma interface gráfica interativa (na rota `/api/docs`) onde qualquer desenvolvedor ou recrutador pode testar todas as rotas da API NestJS direto no navegador.
  - **Versão:** `PATCH`
  - **Swagger Docs:** `docs/nestjs-swagger-api`
- **[DevOps] Containerização & Infraestrutura com Docker (`Docker Compose`):**
  - **Explicativo:** Empacota o backend NestJS, o frontend React, o banco PostgreSQL e o Redis em "containers" isolados. Garante que qualquer pessoa consiga rodar o projeto inteiro no seu computador executando apenas o comando `docker compose up`.
  - **Versão:** `PATCH`
  - **Branch:** `infra/docker-compose-setup`

- **[CI/CD] Integração Contínua com GitHub Actions:**
  - **Explicativo:** Automatiza a execução dos testes unitários do Jest toda vez que você enviar um código novo para o GitHub (`git push`). Impede que bugs entrem no código principal e adiciona badges de validação no `README.md`.
  - **Versão:** `PATCH`
  - **Branch:** `ci/github-actions-tests-pipeline`

- **[QA] Testes End-to-End (E2E) com Supertest & Playwright:**
  - **Explicativo:** Testes que simulam a jornada real do usuário. O Supertest testa as requisições HTTP completas no NestJS e o Playwright abre um navegador automatizado para testar se o formulário do React preenche e salva uma OS com sucesso.
  - **Versão:** `PATCH`
  - **Branch:** `test/e2e-playwright-supertest`

- **[Frontend] Documentação de Componentes com Storybook:**
  - **Explicativo:** Cria um catálogo isolado para visualização de todos os componentes da interface (botões, modais, autocomplete, tabelas). Demonstra domínio sobre Arquitetura de Design System no React.
  - **Versão:** `PATCH`
  - **Branch:** `docs/react-storybook-ui`
