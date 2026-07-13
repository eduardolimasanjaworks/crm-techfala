/**
 * Store das tarefas do painel lateral (toolbar → Tarefas).
 * CRUD via `/api/crm/tarefas`; estado de UI fica no CrmPage.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { crmFetch } from '@/shared/lib/crmApi'
import type { NovaTarefaInput, Tarefa } from './types'

type Ctx = {
  tarefas: Tarefa[]
  criar: (input: NovaTarefaInput) => void
  concluir: (id: string) => void
  remover: (id: string) => void
  atualizar: (id: string, patch: Partial<Tarefa>) => void
}

const TarefasContext = createContext<Ctx | null>(null)

export function TarefasProvider({ children }: { children: ReactNode }) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])

  useEffect(() => {
    let cancelado = false
    ;(async () => {
      try {
        const data = await crmFetch<{ tarefas: Tarefa[] }>('/tarefas')
        if (!cancelado) setTarefas(data.tarefas)
      } catch {
        /* board já mostra erro de auth; lista fica vazia */
      }
    })()
    return () => {
      cancelado = true
    }
  }, [])

  const criar = useCallback((input: NovaTarefaInput) => {
    void (async () => {
      try {
        const { tarefa } = await crmFetch<{ tarefa: Tarefa }>('/tarefas', {
          method: 'POST',
          body: JSON.stringify(input),
        })
        setTarefas((prev) => [tarefa, ...prev])
      } catch {
        /* noop */
      }
    })()
  }, [])

  const concluir = useCallback((id: string) => {
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'concluida' } : t)),
    )
    void (async () => {
      try {
        const { tarefa } = await crmFetch<{ tarefa: Tarefa }>(
          `/tarefas/${id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({ status: 'concluida' }),
          },
        )
        setTarefas((prev) => prev.map((t) => (t.id === id ? tarefa : t)))
      } catch {
        /* noop */
      }
    })()
  }, [])

  const remover = useCallback((id: string) => {
    setTarefas((prev) => prev.filter((t) => t.id !== id))
    void (async () => {
      try {
        await crmFetch(`/tarefas/${id}`, { method: 'DELETE' })
      } catch {
        /* noop */
      }
    })()
  }, [])

  const atualizar = useCallback((id: string, patch: Partial<Tarefa>) => {
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    )
    void (async () => {
      try {
        const { tarefa } = await crmFetch<{ tarefa: Tarefa }>(
          `/tarefas/${id}`,
          { method: 'PATCH', body: JSON.stringify(patch) },
        )
        setTarefas((prev) => prev.map((t) => (t.id === id ? tarefa : t)))
      } catch {
        /* noop */
      }
    })()
  }, [])

  const value = useMemo(
    () => ({ tarefas, criar, concluir, remover, atualizar }),
    [tarefas, criar, concluir, remover, atualizar],
  )

  return (
    <TarefasContext.Provider value={value}>{children}</TarefasContext.Provider>
  )
}

export function useTarefas() {
  const ctx = useContext(TarefasContext)
  if (!ctx) throw new Error('useTarefas deve estar dentro de TarefasProvider')
  return ctx
}
