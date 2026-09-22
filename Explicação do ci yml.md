# CI.yml Explicação

[Arquivo ci.yml](.github\workflows\ci.yml)

## Nome do Workflow

```YAML
name: Node.js CI (NestJS)
```

- `name`: Define o nome do workflow exibido na aba Actions no repositório do GitHub.

## Gatilhos de Execução (`on`)

```YAML
on:
  push:
    branches: ["main", "staging"]
    paths:
      - "backend/\*\*"
      - ".github/workflows/ci.yml"
```

- `on`: Define as condições/eventos que ativam a execução automática da pipeline.
- `push`: Executa a pipeline sempre que novos commits forem enviados para o repositório remotos.
- `branches: ["main", "staging"]`: Restringe o gatilho de push apenas para as branches main e staging.
- `paths`: Filtro de arquivos. A pipeline só é disparada se houver alterações em:
  - Qualquer arquivo na pasta do backend (backend/\*\*).
  - O próprio arquivo do workflow (.github/workflows/ci.yml).

### Como funciona o push

- **Executa?**
  - Commitou algo dentro de `backend/src/app.module.ts` e deu push para a `main` ou `staging` $\rArr$ **SIM**, a pipeline executa.
  - Alterou o arquivo `.github/workflows/ci.yml` na `main` $\rArr$ **SIM**, a pipeline executa.
- **NÃO Executa?**
  - Alterou apenas arquivos da pasta `frontend/` e deu push na `main` $\rArr$ **NÃO** (o filtro de paths ignora).
  - Commitou arquivos no `backend/`, mas em uma branch de testes como `feature/minha-feature` $\rArr$ **NÃO** (o filtro de branches ignora).

---

```YAML
  pull_request:
    branches: ["main", "staging"]
    paths:
      - "backend/\*\*"
```

- `pull_request`: Dispara a pipeline quando um Pull Request é aberto ou atualizado direcionado às branches main ou staging.
- `paths`: Garante que PRs alterando apenas a pasta `frontend/\*\*`, por exemplo, não gastem recursos executando o CI do backend.

## Definição do Job (`jobs`)

```YAML
jobs:
  test-and-build:
    runs-on: ubuntu-latest
```

- `jobs`: Agrupa os conjuntos de tarefas que o GitHub Actions vai executar.
- `test-and-build`: Nome/identificador do job (usado para configurar verificações de status no GitHub Ruleset/Branch Protection).
- `runs-on`: ubuntu-latest: Especifica o sistema operacional do ambiente isolado (runner) alocado pelo GitHub.

---

```YAML
    defaults:
      run:
        working-directory: ./backend
```

- `defaults.run.working-directory`: Define o diretório de trabalho padrão. Todos os comandos `run` subsequentes serão executados dentro da pasta `./backend` (ideal para a estrutura monorepo).

### Diferença entre o working-directory (seção `jobs`) para paths (seção `on`)

- `paths: - "backend/**"` $\rightarrow$ Filtro de Disparo: _"Só ligue a máquina se algo mudou no backend."_
- `working-directory: ./backend` $\rightarrow$ Navegação do Terminal: _"Agora que a máquina ligou, navegue até a pasta do backend antes de rodar qualquer comando npm."_

---

```YAML
    strategy:
      matrix:
        node-version: [20.x]
```

- `strategy.matrix`: Matriz de execução. Permite rodar o mesmo job em múltiplas versões/ambientes se necessário (neste caso, fixado na versão major 20.x do Node.js).

---

### Passos da Pipeline (`steps`)

```YAML
    steps:
      - name: Checkout do Código
        uses: actions/checkout@v4
```

- `actions/checkout@v4`: Action oficial do GitHub que clona o código-fonte do repositório para o sistema do runner.

### O que realmente faz?

- A instrução `uses: actions/checkout@v4` é uma Action oficial mantida pelo GitHub que faz o download (clone) do código-fonte do seu repositório para a máquina virtual (runner) onde a pipeline do GitHub Actions está sendo executada.

1. Ele aloca um servidor limpo e zerado na nuvem (o `ubuntu-latest`).
2. Essa máquina vem totalmente vazia — ela não possui o código do seu projeto por padrão.
3. A etapa `actions/checkout@v4` roda os comandos do Git em segundo plano (como `git init`, `git remote` add e `git fetch` / `git checkout <commit_sha>`) para trazer os arquivos da branch e do commit exato que disparou o pipeline.

---

```YAML
      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
```

- `actions/setup-node@v4`: Prepara o ambiente instalando a versão do Node.js definida na matriz (20.x).
- `cache: "npm"`: Salva e restaura a pasta de cache do npm entre as execuções, acelerando o tempo de instalação das dependências.

---

```YAML
      - name: Instalar Dependências
        run: npm ci
```

- `npm ci`: Instala as dependências de forma limpa, estrita e determinística com base no arquivo package-lock.json (recomendado para ambientes de CI/CD).

### Por que `npm ci` em vez de `npm install`?

O `npm install` pode atualizar dependências secundárias (minor/patch) se o `package.json` permitir, o que gera inconsistência entre ambientes. O `npm ci` é estrito, ignora atualizações dinâmicas e instala exatamente as versões fixadas no `package-lock.json`.

---

```YAML
      - name: Gerar Prisma Client
        run: npx prisma generate
```

- `npx prisma generate`: Lê o arquivo `schema.prisma` e gera os tipos TypeScript e o cliente de banco de dados na pasta `node_modules/@prisma/client`. É fundamental para garantir que as verificações de tipo e o build funcionem sem erros.

---

```YAML
      - name: Executar Linter
        run: npm run lint
```

- `npm run lint`: Roda a análise estática do ESLint para validar boas práticas, falta de tipos e regras contra o uso de `any`. Se houver qualquer warning/error de linting, a pipeline falha.

---

```YAML
      - name: Executar Testes Unitários
        run: npm test
```

- `npm test`: Executa a suíte de testes unitários do Jest no NestJS para garantir o comportamento correto e acoplamento dos services/controllers.

---

```YAML
      - name: Testar Build da Aplicação
        run: npm run build
```

- `npm run build`: Compila o código TypeScript do NestJS (`nest build`), verificando se há erros de compilação antes que o código seja mesclado nas branches principais.

---
