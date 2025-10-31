## Gym Simulator Web (Next.js)

Aplicação web para gestão de academia: cadastro de alunos, cadastro de aulas, agendamentos com regras de negócio de plano e capacidade, e relatórios simples por aluno.

### Tecnologias

- Next.js 15 (App Router) + React
- Tailwind CSS (com tema customizado roxo)
- UI components (shadcn-like) em `src/components/ui`

---

## Como rodar

### Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+ (ou pnpm/yarn, se preferir)

### 1) Instalar dependências

```bash
npm install
```

### 2) Configurar variáveis de ambiente

### Caso use a porta padrão do projeto gym-simulator (back-end), pode desconsiderar e pular para o tópico 3.

Crie um arquivo `.env.local` na raiz com a URL da API .NET (ou outro backend compatível):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

- Ajuste a porta/host conforme o seu backend.
- O frontend usa apenas `NEXT_PUBLIC_API_URL` para consumir a API.

Aplicação ficará disponível em `http://localhost:3000`.

### 3) Build de produção

```bash
npm run build
npm start
```

---

## Estrutura de pastas (principal)

- `src/app/`
  - `layout.tsx`: layout global com sidebar responsiva e topbar mobile
  - `page.tsx`: página inicial (hub) com métricas e atalhos
  - `alunos/`: páginas de alunos (lista, novo, detalhes)
  - `aulas/`: páginas de aulas (lista/criação) e `aulas/agendar` para agendamentos
- `src/components/`
  - `dashboard/sidebar.tsx`: navegação lateral
  - `ui/`: componentes básicos (button, card, select, etc.)
- `src/lib/`
  - `api.ts`: cliente HTTP do backend (usa `NEXT_PUBLIC_API_URL`)
  - `utils.ts`: utilidades
- `src/types/`: tipos TypeScript compartilhados

---

## Funcionalidades

### Cadastro de Alunos

- Criar aluno com nome e plano (`Mensal`, `Trimestral`, `Anual`).
- Páginas:
  - `Alunos` (lista com resumo do mês por aluno)
  - `Alunos > Novo Aluno` (formulário)
  - `Alunos > Detalhes` (resumo do mês e preferências)

### Cadastro de Aulas

- Criar aula com:
  - Tipo (ex.: Cross, Funcional, Pilates)
  - Data/hora
  - Duração (min)
  - Capacidade máxima
- Página `Aulas` lista próximas aulas e permite criar novas.

### Agendamentos

- `Aulas > Agendar`: seleciona Aluno + Aula disponível.
- Regras de negócio aplicadas pelo backend:
  - Respeitar capacidade máxima da aula
  - Respeitar o limite de agendamentos por plano no mês:
    - Mensal: até 12 aulas
    - Trimestral: até 20 aulas
    - Anual: até 30 aulas

### Relatórios

- `Relatórios`: seleção de aluno e exibição de:
  - Total de aulas agendadas no mês
  - Limite do plano e aulas restantes
  - Tipos de aula mais frequentes

---

## Regras de Negócio (Resumo)

- Um aluno não pode agendar mais aulas do que o plano permite no mês.
- Uma aula não pode ultrapassar a capacidade máxima.
- Um aluno pode ser agendado em várias aulas no mês, desde que dentro do limite do plano.

---
