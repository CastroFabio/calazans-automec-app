# Plano de Tarefas - Sistema de Ordens de Serviço (Oficina Mecânica)

## 1. UX/UI & Redesign do Fluxo de Criação de OS (Wizard em 4 Passos)

### [UX/UI] Reestruturação da Criação da OS em 4 Passos

- **Passo 1 - Cliente e Veículo:**
  - Busca e seleção de cliente e veículo.
  - Botão/Modal de **Novo Cliente**.
  - Botão/Modal de **Novo Veículo** (vinculado diretamente ao cliente selecionado).
- **Passo 2 - Serviços e Materiais:**
  - **Botão "Registrar serviço":** Posicionado no topo do formulário.
  - **Mão de obra (labor_cost):** Campo para valor/custo da mão de obra.
  - **Lista de serviços:** Renderização dos serviços adicionados.
  - **Peças/Materiais:** Adição e listagem de peças associadas a cada serviço.
  - Botão de acionamento do Modal de Cadastro Rápido de Peça e Serviço.
- **Passo 3 - Informações da OS & Pagamento:**
  - Atribuição de profissional/mecânico responsável.
  - Status da Ordem de Serviço (Aguardando, Em Andamento, Concluída, etc.).
  - Status do Pagamento (Pendente, Parcial, Quitado).
  - **Check / Ação de Pagamento Efetivado:** Se a OS já estiver paga, liberar etapa/opção para "Efetuar Pagamento" imediato com os detalhes da transação.
  - Campo para diagnóstico e observações técnicas.
- **Passo 4 - Resumo da OS:**
  - Tela final de conferência de todos os dados preenchidos (Cliente, Veículo, Serviços, Peças, Valores Totais, Responsável e Pagamento).
  - Botão final para salvar e emitir a OS.

---

## 2. Formulários, Modais & Cadastro Rápido

### [Modal] Cadastro Rápido de Cliente e Veículo na Criação da OS

- **Ação:** Adicionar botões para abrir modais de cadastro direto na Etapa 1 do Wizard:
  - "Cadastrar Novo Cliente".
  - "Cadastrar Novo Veículo" (já associando ao ID do cliente selecionado).

### [Modal] Modal de Cadastro Rápido de Peça e Serviço

- **Ação:** Criar modal acessível na Etapa 2 de Serviços/Materiais para permitir o cadastro imediato de uma nova peça ou serviço no banco de dados sem perder o progresso da OS.

### [UX/OS] Reposicionamento do Botão "Registrar Serviço"

- **Ação:** Mover o botão de registro/adição de serviço para o topo da seção de serviços no formulário.

### [UX/OS] Auto-foco no campo "Valor Unitário" após selecionar serviço

- **Ação:** Mover o foco do cursor (`focus()`) automaticamente para o input de preço/valor unitário assim que um serviço for selecionado no autocomplete.

### [Feature/OS] Campo / Marcação "Fornecido pelo cliente"

- **Ação:** Adicionar checkbox no item da OS para indicar se a peça/material foi fornecido pelo cliente.

### [Feature/OS] Atalho "Levar para OS"

- **Ação:** Criar botão para converter orçamentos/cotações diretamente em uma nova OS.

---

## 3. Auditoria de Código & Validação de Inputs de Preço (Decimal)

### [Refactor/Code] Verificação Geral de Inputs de Preço e Totais

- **Objetivo:** Garantir que todos os inputs de valor monetário aceitem e tratem corretamente o formato decimal de 2 casas (`R$ 0,00` ou `float/number` com 2 casas), evitando inconsistências de parsing, NaN ou quebra de concatenação no estado.
- **Mapeamento de Locais para Auditoria/Ajuste:**
  - **Criação de OS (`NewServiceOrder` / `NewOrderMaintenanceJob`):**
    - `value_unit` do material (valor unitário das peças).
    - `labor_cost` / `labor_job` (mão de obra).
    - Valores de pagamento.
    - Total acumulado de serviços.
    - Total acumulado de materiais.
    - Total geral da OS (`grand_total`).
  - **Edição de OS (`EditServiceOrder` / componentes correlatos):**
    - `value_unit` do material.
    - `labor_cost` / `labor_job`.
    - Valores e parcelas de pagamento.
    - Total acumulado de serviços.
    - Total acumulado de materiais.
    - Total geral da OS.

---

## 4. Bugs Urgentes de UX/UI

### [Bug] Desbloquear clique do Autocomplete

- **Problema:** O clique nos itens do Autocomplete não está sendo registrado.
- **Causa provável:** Sobreposição do botão/container de fundo ao menu popover (z-index ou evento bloqueado).
- **Ação:** Ajustar z-index e manipuladores de evento do menu dropdown.

---

## 5. Módulo de Pagamentos, Recibos e Outros

### [Financeiro] Status de Pagamento e Botão "Quitado"

- **Ação:** Exibir status do pagamento e disponibilizar botão rápido "Quitado" no formulário/modal para liquidação direta.

### [Financeiro] Recibos & Fornecedores

- **Ação:** Adicionar botão para copiar dados do recibo e dados do fornecedor para a área de transferência.

### [Financeiro] Refatorar localização do Módulo/Tela de Pagamento

- **Ação:** Reposicionar/reorganizar onde o fluxo de pagamento é acessado dentro da aplicação.

### [UI/Home] Logo na Tela Inicial

- **Ação:** Inserir a logo da oficina na página inicial.

### [Módulo] Módulo de Inventário / Estoque

- **Ação:** Estruturar a tela de Inventário básica para controle de materiais e peças.

---

## Nomes de Branches Git Sugeridos

Padrão: `<tipo>/<escopo>-<descrição-curta>`

### Wizard de OS & Modais de Criação

- **Wizard em 4 Passos com Resumo:** `feature/os-4step-wizard-summary`
- **Passo de Pagamento na OS:** `feature/os-payment-step-integration`
- **Modal Novo Cliente e Novo Veículo na OS:** `feature/os-quick-add-customer-vehicle`
- **Modal Cadastro Rápido Peça e Serviço:** `feature/modal-quick-add-part-service`
- **Botão "Registrar Serviço" no topo:** `refactor/os-register-service-btn-top`
- **Atalho "Levar para OS":** `feature/os-convert-shortcut`

### Auditoria e Correção de Preços (Inputs)

- **Padronização e validação de inputs de preço (Criação e Edição):** `refactor/price-inputs-decimal-validation`

### Formulário de OS & UX

- **Auto-foco no valor unitário:** `feature/autocomplete-autofocus-unit-price`
- **Marcação "Fornecido pelo cliente":** `feature/os-item-supplied-by-client`

### Bugs & Fixes

- **Fix clique no Autocomplete:** `fix/autocomplete-click-blocking`

### Financeiro & Outros

- **Status de Pagamento & Botão Quitado:** `feature/payment-status-quick-settle`
- **Botões de cópia de recibo e fornecedor:** `feature/receipt-vendor-copy-buttons`
- **Refatoração da tela de pagamento:** `refactor/payment-flow-location`
- **Logo na Home:** `feature/home-logo-branding`
- **Módulo de Inventário:** `feature/inventory-module-basic`
