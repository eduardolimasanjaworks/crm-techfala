/**
 * Cadastros editáveis: responsáveis e autor das notas.
 * Persistidos em `/api/crm/cadastros`.
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

export type Cadastros = {
  responsaveis: string[]
  autorNotas: { nome: string; email: string }
}

const PADRAO: Cadastros = {
  responsaveis: ['Você'],
  autorNotas: { nome: 'Você', email: '' },
}

type Ctx = {
  cadastros: Cadastros
  carregando: boolean
  salvar: (patch: Partial<Cadastros>) => Promise<void>
}

const CadastrosContext = createContext<Ctx | null>(null)

export function CadastrosProvider({ children }: { children: ReactNode }) {
  const [cadastros, setCadastros] = useState<Cadastros>(PADRAO)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let cancelado = false
    ;(async () => {
      try {
        const data = await crmFetch<{ cadastros: Cadastros }>('/cadastros')
        if (!cancelado && data.cadastros) setCadastros(data.cadastros)
      } catch {
        /* fallback PADRAO */
      } finally {
        if (!cancelado) setCarregando(false)
      }
    })()
    return () => {
      cancelado = true
    }
  }, [])

  const salvar = useCallback(async (patch: Partial<Cadastros>) => {
    const { cadastros: next } = await crmFetch<{ cadastros: Cadastros }>(
      '/cadastros',
      { method: 'PUT', body: JSON.stringify(patch) },
    )
    setCadastros(next)
  }, [])

  const value = useMemo(
    () => ({ cadastros, carregando, salvar }),
    [cadastros, carregando, salvar],
  )

  return (
    <CadastrosContext.Provider value={value}>{children}</CadastrosContext.Provider>
  )
}

export function useCadastros() {
  const ctx = useContext(CadastrosContext)
  if (!ctx) throw new Error('useCadastros deve estar dentro de CadastrosProvider')
  return ctx
}
