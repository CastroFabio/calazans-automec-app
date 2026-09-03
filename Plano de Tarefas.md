# Plano de Tarefas - Sistema de Ordens de Serviço (Oficina Mecânica)

## 1. UX/UI & Redesign do Fluxo de Criação de OS (Navegação em Etapas / Wizard)

### [UX/UI] Reestruturação da Criação da OS em Etapas

- **Objetivo:** Tornar o processo intuitivo e simplificado para usuários leigos, dividindo o preenchimento em um passo a passo guiado.
- **Etapa 1 - Cliente e Veículo:**
  - Seleção/cadastro de cliente e seleção/cadastro de veículo.
- **Etapa 2 - Serviços e Materiais:**
  - Tabela de inclusão de peças e mão de obra.
  - Inclusão dos botões de adição no topo.
  - Autocomplete com suporte a cadastro rápido e auto-foco no valor unitário.
  - Opção de marcar item como "Fornecido pelo cliente".
- **Etapa 3 - Informações da OS & Diagnóstico:**
  - Atribuição de profissional/mecânico responsável.
  - Status da Ordem de Serviço.
  - Status de Pagamento (com opção de marcação rápida "Quitado").
  - Campo para diagnóstico e observações técnicas.

---

## 2. Correções Urgentes & Bugs de UX/UI

### [Bug] Desbloquear clique do Autocomplete

- **Problema:** O clique nos itens do Autocomplete não está sendo registrado.
- **Causa provável:** O botão de adicionar peça/serviço (ou container de fundo) está sobreposto ao dropdown/menu popover (z-index ou evento de clique bloqueado).
- **Ação:** Corrigir a sobreposição e z-index para garantir a seleção adequada.

### [Bug/Form] Ajustar formatação e validação de preço (Input Decimal)

- **Problema:** O campo de preço só aceita decimais com 2 casas de precisão, mas permite formatos inválidos ou apresenta comportamento inconsistente.
- **Ação:** Revisar a máscara e o parser do input de preço para aceitar e formatar corretamente os valores decimais (ex: R$ 0,00).

---

## 3. Melhorias na Lista e Formulário de Ordem de Serviço (OS)

### [UX/OS] Mover botões de adição para o topo das tabelas

- **Ação:** Mudar a posição do botão de adicionar material e serviço para cima da lista (atualmente no rodapé/embaixo da lista).

### [UX/OS] Auto-foco no campo "Valor Unitário" após selecionar serviço

- **Ação:** Assim que o usuário selecionar um serviço no autocomplete, mover o foco do cursor (`focus()`) automaticamente para o input de preço/valor unitário.

### [UX/OS] Botão de cadastro rápido no Autocomplete

- **Ação:** Adicionar o botão "Cadastrar novo material/serviço" diretamente dentro ou ao lado do dropdown do autocomplete para pesquisas sem resultado.

### [Feature/OS] Campo / Marcação "Fornecido pelo cliente"

- **Ação:** Adicionar uma opção/checkbox no item da OS para indicar se o material/peça foi fornecido diretamente pelo cliente.

### [Feature/OS] Atalho "Levar para OS"

- **Ação:** Criar um botão direto que permita converter/enviar uma cotação, orçamento ou registro para a tela de Ordem de Serviço.

---

## 4. Módulo de Pagamentos e Recibos

### [Financeiro] Adicionar Status de Pagamento e Botão "Quitado"

- **Ação:**
  - Exibir o status do pagamento (Pendente, Parcial, Quitado).
  - Adicionar o botão rápido "Quitado" no formulário/modal de pagamento para liquidação imediata.

### [Financeiro] Recibos & Fornecedores

- **Ação:** Adicionar botão para copiar dados do recibo e dados do fornecedor para a área de transferência.

### [Financeiro] Refatorar localização do Módulo/Tela de Pagamento

- **Ação:** Reposicionar/reorganizar onde o fluxo de pagamento é acessado dentro da aplicação.

---

## 5. Layout e Outros Módulos

### [UI/Home] Adicionar Logo na Tela Inicial (Home)

- **Ação:** Inserir a identidade visual/logo da oficina no header ou banner principal da Home.

### [Módulo] Módulo de Inventário / Estoque

- **Ação:** Estruturar a tela de Inventário básica para controle de materiais e peças (funcionalidade secundária).

---

## Nomes de Branches Git Sugeridos

Padrão recomendado: `<tipo>/<escopo>-<descrição-curta>`

### Redesign & UX em Etapas

- **Wizard / Formulário por etapas:** `feature/os-stepper-wizard`
- **Botão "Levar para OS":** `feature/os-convert-shortcut`

### Bugs & Correções

- **Fix clique no Autocomplete:** `fix/autocomplete-click-blocking`
- **Fix validação de Input Decimal:** `fix/price-input-decimal-mask`

### Formulário de OS & Itens

- **Reorganizar botões da lista no topo:** `refactor/os-items-add-buttons-top`
- **Auto-foco no valor unitário:** `feature/autocomplete-autofocus-unit-price`
- **Cadastrar material no autocomplete:** `feature/autocomplete-quick-register`
- **Opção "Fornecido pelo cliente":** `feature/os-item-supplied-by-client`

### Financeiro

- **Status de Pagamento & Botão Quitado:** `feature/payment-status-quick-settle`
- **Botões de cópia de recibo e fornecedor:** `feature/receipt-vendor-copy-buttons`
- **Reorganização da tela de pagamento:** `refactor/payment-flow-location`

### General & Módulos Secundários

- **Logo na Home:** `feature/home-logo-branding`
- **Módulo de Inventário:** `feature/inventory-module-basic`
