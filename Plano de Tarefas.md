# Plano de Tarefas - Sistema de Ordens de Serviço (Oficina Mecânica)

## ~~1. Módulo de Peças e Serviços (Gestão de Cadastros)~~

### ~~[UX/UI] Ajuste de Layout e Scroll na Tabela de Peças e Serviços~~

- ~~**Problema:** A lista de peças e serviços é muito extensa e causa rolagem excessiva em toda a página.~~
- ~~**Ação:** Fixar a altura máxima (`max-height`) do container da lista com rolagem interna (`overflow-y: auto`), mantendo o cabeçalho e os controles fixos na tela.~~

---

## 2. UX/UI & Redesign do Fluxo de Criação de OS (Wizard em 4 Passos)

### [UX/UI] Reestruturação da Criação da OS em 4 Passos

- **Passo 1 - Cliente e Veículo:**
  - Busca e seleção de cliente e veículo.
  - ~~Botão/Modal de **Novo Cliente**.~~
  - ~~Botão/Modal de **Novo Veículo** (vinculado diretamente ao cliente selecionado).~~
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

---

## ~~3. Formulários, Modais & Cadastro Rápido~~

### ~~[Modal] Cadastro Rápido de Cliente e Veículo na Criação da OS~~

- ~~**Ação:** Adicionar botões para abrir modais de cadastro direto na Etapa 1 do Wizard:~~
  - ~~"Cadastrar Novo Cliente".~~
  - ~~"Cadastrar Novo Veículo" (associando ao cliente selecionado).~~

### ~~[Modal] Modal de Cadastro Rápido de Peça e Serviço~~

- ~~**Ação:** Criar modal acessível na Etapa 2 de Serviços/Materiais para permitir o cadastro imediato de uma nova peça ou serviço no banco de dados sem perder o progresso da OS.~~

### ~~[UX/OS] Auto-foco no campo "Valor Unitário" após selecionar serviço~~

- ~~**Ação:** Mover o foco do cursor (`focus()`) automaticamente para o input de preço/valor unitário assim que um serviço for selecionado no autocomplete.~~

### ~~[Feature/OS] Campo / Marcação "Fornecido pelo cliente"~~

- ~~**Ação:** Adicionar checkbox no item da OS para indicar se a peça/material foi fornecido pelo cliente.~~

#### ~~O que falta?~~

1. ~~Desenvolver a lógica para que o value_unit, supplier e receipt daquele itemMaterial sejam 0/''/'', respectivamente.~~
2. ~~Adicionar no handleSaveOS no NewServiceOrder para enviar o itemMaterial com o isCustomerSupplier~~
3. ~~Adicionar no banco de dados a coluna isCustomerSupplier (`isCustomerSupplier Boolean @default(false)`) na tabela de itemMaterial~~

### ~~[Feature/Customer] Atalho "Criar OS" no Card do Veículo do Cliente~~

- ~~**Ação:** Criar um botão de atalho direto ("Criar OS" / "Gerar Ordem de Serviço") dentro do card de cada veículo no painel lateral de detalhes do cliente.~~
- ~~**Comportamento Esperado:** Ao clicar no botão, redirecionar o usuário para a tela de criação da Ordem de Serviço (Wizard) pré-selecionando e preenchendo automaticamente tanto o **Cliente** quanto o **Veículo** correspondente na Etapa 1.~~

---

## ~~4. Auditoria de Código & Validação de Inputs de Preço (Decimal)~~

### ~~[Refactor/Code] Verificação Geral de Inputs de Preço e Totais~~

- ~~**Objetivo:** Garantir que todos os inputs de valor monetário aceitem e tratem corretamente o formato decimal de 2 casas (`R$ 0,00` ou `float/number` com 2 casas), evitando inconsistências de parsing, NaN ou quebra de concatenação no estado.~~
- ~~**Mapeamento de Locais para Auditoria/Ajuste:**~~
  - ~~**Criação de OS (`NewServiceOrder` / `NewOrderMaintenanceJob`):**~~
    - ~~`value_unit` do material.~~
    - ~~`labor_cost` / `labor_job`.~~
    - ~~Valores de pagamento.~~
    - ~~Total acumulado de serviços.~~
    - ~~Total acumulado de materiais.~~
    - ~~Total geral da OS (`grand_total`).~~
  - ~~**Edição de OS (`EditServiceOrder` / componentes correlatos):**~~
    - ~~`value_unit` do material.~~
    - ~~`labor_cost` / `labor_job`.~~
    - ~~Valores e parcelas de pagamento.~~
    - ~~Total acumulado de serviços.~~
    - ~~Total acumulado de materiais.~~
    - ~~Total geral da OS.~~

---

## 5. Bugs Urgentes de UX/UI

### [Bug] Desbloquear clique do Autocomplete

- **Problema:** O clique nos itens do Autocomplete não está sendo registrado.
- **Causa provável:** Sobreposição do botão/container de fundo ao menu popover (z-index ou evento bloqueado).
- **Ação:** Ajustar z-index e manipuladores de evento do menu dropdown.

---

## 6. Módulo de Pagamentos, Recibos e Outros

### ~~[Financeiro] Status de Pagamento e Botão "Quitado"~~

- ~~**Ação:** Exibir status do pagamento e disponibilizar botão rápido "Quitado" no formulário/modal para liquidação direta.~~

### ~~[Financeiro] Recibos & Fornecedores~~

- ~~**Ação:** Adicionar botão para copiar dados do recibo e dados do fornecedor para a área de transferência.~~

### ~~[Financeiro] Refatorar localização do Módulo/Tela de Pagamento~~

- ~~**Ação:** Reposicionar/reorganizar onde o fluxo de pagamento é acessado dentro da aplicação.~~

### ~~[UI/Home] Logo na Tela Inicial~~

- ~~**Ação:** Inserir a logo da oficina na página inicial.~~

## 7. [UI/UX] Componente Global de Tratamento e Exibição de Erros

- **Objetivo:** Criar um componente/modal/banner reutilizável (`ErrorNotification`) para capturar exceções da API e exibir mensagens amigáveis ao usuário[cite: 1, 2].
- **Cenários/Erros Mapeados:**
  - **HTTP 400 (Bad Request):** Dados de formulário/input inválidos (ex: validação de DTO, preço/valor em formato incorreto ou nome obrigatório não preenchido)[cite: 1, 2].
  - **HTTP 404 (Not Found):** Registro inexistente (ex: tentar carregar um cliente, peça ou OS pelo ID incorreto)[cite: 1, 2].
  - **HTTP 409 (Conflict):** Conflito de cadastro no banco (ex: tentativa de cadastrar um cliente com celular/CPF já em uso)[cite: 1, 2].
  - **HTTP 401 / 403 (Unauthorized / Forbidden):** Sessão expirada ou sem permissão de acesso.
  - **HTTP 500 (Internal Server Error):** Erro imprevisto no servidor ou banco de dados.
  - **Erro de Conexão/Rede:** Servidor indisponível ou queda de internet no cliente.

---

## ~~8. [Feature/Pagination] Paginação em Clientes e Ordens de Serviço~~

- ~~**Objetivo:** Adicionar paginação (API e Frontend) nas listagens das páginas de Clientes e Ordens de Serviço para otimizar a performance e evitar o carregamento excessivo de registros de uma só vez .~~
- ~~**Ações no Backend (NestJS / Prisma):**~~
  - ~~Atualizar as consultas `findAll` em `CustomersService` e `ServiceOrdersService` para aceitar os parâmetros `page` e `limit`.~~
  - ~~Implementar o uso de `skip` e `take` no Prisma, além de retornar a estrutura de metadados (`meta: { total, page, limit, totalPages }`) junto aos resultados.~~
- ~~**Ações no Frontend (React):**~~
  - ~~Incluir controle de página atual (`page`) e limite por página (`limit`) nos estados das páginas de `Customers` e `ServiceOrderList`.~~
  - ~~Adicionar componente/controles de navegação de página ("Anterior", "Próxima" e números de página) no rodapé das tabelas.~~

---

## 9. Módulo de Autenticação e Segurança (JWT)

### [Backend/NestJS] Infraestrutura de Autenticação JWT

- **Ação:** Implementar o módulo `@nestjs/jwt` e `passport-jwt` no backend[cite: 1].
- **Entidades & Banco de Dados:**
  - Tabela `User` no Prisma com `email`, `password` (hash via `bcrypt`), `name` e `role` (enum: `ADMIN`, `CLIENT`).
- **Estratégia de Tokens (Access & Refresh Token):**
  - **Payload do Access Token:** `{ sub: userId, email, role }`.
  - Rota `POST /auth/login`: Autentica credenciais e retorna o Access Token + Refresh Token.
  - Rota `POST /auth/refresh`: Valida o Refresh Token e gera um novo Access Token sem exigir novo login.
- **Guards & Middlewares:**
  - Criar `JwtAuthGuard` global para proteger todas as rotas da API, liberando apenas a rota de login pública.
  - Criar `RolesGuard` para garantir restrições de permissão por perfil de acesso no futuro.

### [Frontend/React] Interface de Login e Proteção de Rotas

- **Tela de Login (`/login`):**
  - Criar interface simples com campos de e-mail e senha.
- **Gerenciamento de Sessão & Interceptors:**
  - Configurar interceptor de requisições (Axios/Fetch) para anexar o cabeçalho `Authorization: Bearer <token>` em todas as chamadas.
  - Configurar interceptor de resposta para tratar erro HTTP 401: tentar a renovação silenciosa via `/auth/refresh` ou redirecionar automaticamente para a tela de login se a sessão expirar.
- **Proteção de Interface (`<ProtectedRoute />`):**
  - Envolver todas as rotas da aplicação em um componente guardião de rota que redireciona usuários não autenticados para `/login`.

---

# Nomes de Branches Git Sugeridos

Padrão: `<tipo>/<escopo>-<descrição-curta>`

## Módulo de Peças e Serviços

- **Autocomplete de busca em Peças/Serviços:** `feature/parts-services-autocomplete-search`
- ~~**Scroll e limitação de altura da lista:** `refactor/parts-services-list-scroll`~~
- **Novo modal/fluxo de edição de itens:** `refactor/parts-services-edit-modal-flow`

## Wizard de OS & Modais de Criação

- **Wizard em 4 Passos com Resumo:** `feature/os-4step-wizard-summary`
- **Passo de Pagamento na OS:** `feature/os-payment-step-integration`
- ~~**Modal Novo Cliente e Novo Veículo na OS:** `feature/os-quick-add-customer-vehicle`~~
- ~~**Modal Cadastro Rápido Peça e Serviço:** `feature/modal-quick-add-part-service`~~
- **Botão "Registrar Serviço" no topo:** `refactor/os-register-service-btn-top`
- ~~**Atalho "Criar OS" no Card do Veículo do Cliente:** `feature/customer-vehicle-card-create-os-shortcut`~~

## Auditoria e Correção de Preços (Inputs)

- ~~**Padronização e validação de inputs de preço:** `refactor/price-inputs-decimal-validation`~~

## Formulário de OS & UX

- ~~**Auto-foco no valor unitário:** `feature/autocomplete-autofocus-unit-price`~~
- ~~**Marcação "Fornecido pelo cliente":** `feature/os-item-supplied-by-client`~~

## Bugs & Fixes

- **Fix clique no Autocomplete:** `fix/autocomplete-click-blocking`

## Financeiro & Outros

- ~~**Status de Pagamento & Botão Quitado:** `feature/payment-status-quick-settle`~~
- ~~**Botões de cópia de recibo e fornecedor:** `feature/receipt-vendor-copy-buttons`~~
- ~~**Refatoração da tela de pagamento:** `refactor/payment-flow-location`~~
- ~~**Logo na Home:** `feature/home-logo-branding`~~
- **Módulo de Inventário:** `feature/inventory-module-basic`

## Componente Global de Tratamento e Exibição de Erros

- **Branch:** `feature/ui-global-error-handling-component`

## ~~Paginação em Clientes e Ordens de Serviço~~

- ~~**Clientes:** `feature/customers-list-pagination`~~
- ~~**Ordens de Serviço:** `feature/service-orders-list-pagination`~~

## Módulo de Autenticação JWT

- **Backend (NestJS + Prisma):** `feature/backend-jwt-auth-guard`
- **Frontend (React + Protection):** `feature/frontend-login-protected-routes`
