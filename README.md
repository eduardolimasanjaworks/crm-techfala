# TechFala CRM (frontend)

Recriação React do CRM Kanban a partir do dump HTML — **sem dependências de UI externas**.

## Dependências

Só o necessário para React:

- `react` / `react-dom`
- Vite + TypeScript (build)

**Não usa:** Tailwind, Lucide, React Router, shadcn, clsx, etc.

## Como rodar

```bash
cd crm-techfala
npm install
npm run dev
```

## Estrutura

```
src/
  app/           → App e placeholders
  features/crm/  → Kanban (toolbar, colunas, store)
  features/shell → sidebar esquerda + layout
  shared/        → ícones SVG, tipos, storage
  styles/        → CSS puro (app.css)
```

## Fidelidade ao dump

- Sidebar esquerda com ícones (ativo `#F5008D`)
- Toolbar: busca, filtro, views, zoom, Nova Coluna, Tarefas, NeuralFlow, Campos
- Colunas: Novos Leads / Em Negociação / Fechamento + empty state
- DnD de cards e colunas + `localStorage`
