# Plano de Tarefas - Sistema de Ordens de Serviço (Oficina Mecânica)

## 1. UX/UI & Redesign do Fluxo de Criação de OS (Wizard em 4 Passos)

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

### Wizard de OS & Modais de Criação

- **Wizard em 4 Passos com Resumo:** `feature/os-4step-wizard-summary`

---

## 2. [UI/UX] Componente Global de Tratamento e Exibição de Erros

- **Objetivo:** Criar um componente/modal/banner reutilizável (`ErrorNotification`) para capturar exceções da API e exibir mensagens amigáveis ao usuário.
- **Cenários/Erros Mapeados:**
  - **HTTP 400 (Bad Request):** Dados de formulário/input inválidos (ex: validação de DTO, preço/valor em formato incorreto ou nome obrigatório não preenchido).
  - **HTTP 404 (Not Found):** Registro inexistente (ex: tentar carregar um cliente, peça ou OS pelo ID incorreto).
  - **HTTP 409 (Conflict):** Conflito de cadastro no banco (ex: tentativa de cadastrar um cliente com celular/CPF já em uso).
  - **HTTP 401 / 403 (Unauthorized / Forbidden):** Sessão expirada ou sem permissão de acesso.
  - **HTTP 500 (Internal Server Error):** Erro imprevisto no servidor ou banco de dados.
  - **Erro de Conexão/Rede:** Servidor indisponível ou queda de internet no cliente.

### Componente Global de Tratamento e Exibição de Erros

- **Error handling:** `feature/ui-global-error-handling-component`

---

## 3. [Backend/Jest] Suíte de Testes Unitários

- **Objetivo:** Implementar cobertura de testes unitários para Services e Controllers no NestJS utilizando Jest.
- **Estratégia de Mocks:**
  - Criar mock do `PrismaService` (usando `jest-mock-extended` ou objetos mockados com `jest.fn()`) para isolar o banco de dados.
  - Criar mocks do `JwtService` e estratégias de validação para testar o fluxo de autenticação em memória.
- **Escopo por Módulo:**
  - **`AuthService` & `UsersService`:** Testar login com credenciais válidas e inválidas, hash/validação de senha (Bcrypt), geração de Access/Refresh tokens e renovação via `/refresh`.
  - **`CustomersService` & `VehiclesService`:** Testar CRUD, validação de unicidade (celular/placa) e tratamento de exceções (HTTP 404/409).
  - **`ServiceOrdersService`:** Testar cálculo de totais (mão de obra + materiais), validação de decimal, paginação (`skip`/`take`) e regras de transição de status.
  - **`MaterialsService` & `MaintenanceJobsService`:** Testar buscas paginadas e inserção de novos itens.

### Por módulo

- **Autenticação e Usuários:** `test/auth-users-unit-tests`
- **Clientes e Veículos:** `test/customers-vehicles-unit-tests`
- **Ordens de Serviço:** `test/service-orders-unit-tests`

---
