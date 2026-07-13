/**
 * Store React do CRM: Kanban + painel do contato.
 * Persiste no Postgres via `/api/crm/*` (cookie do painel).
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
import { crmFetch, crmUploadArquivo } from '@/shared/lib/crmApi'
import type { Coluna, Contato, ContatoArquivo, CrmState } from '@/shared/types/crm'
import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from './defaultData'
import { normalizarContatos } from './normalizarContatos'

type CrmContextValue = CrmState & {
  carregando: boolean
  erro: string | null
  colunasOrdenadas: Coluna[]
  contatosFiltrados: Contato[]
  contatoAberto: Contato | null
  setBusca: (v: string) => void
  zoomIn: () => void
  zoomOut: () => void
  adicionarColuna: (titulo?: string) => void
  adicionarContato: (colunaId: string, nome: string) => void
  atualizarContato: (id: string, patch: Partial<Contato>) => void
  uploadArquivo: (contatoId: string, file: File) => void
  removerArquivo: (contatoId: string, arquivoId: string) => void
  abrirContato: (id: string) => void
  fecharContato: () => void
  removerContato: (id: string) => void
  moverContato: (contatoId: string, colunaDestinoId: string) => void
  reordenarColunas: (origemId: string, destinoId: string) => void
  renomearColuna: (id: string, titulo: string) => void
  removerColuna: (id: string) => void
}

const CrmContext = createContext<CrmContextValue | null>(null)

function upsertContato(lista: Contato[], contato: Contato): Contato[] {
  const i = lista.findIndex((c) => c.id === contato.id)
  if (i < 0) return [...lista, contato]
  const next = [...lista]
  next[i] = contato
  return next
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const [colunas, setColunas] = useState<Coluna[]>([])
  const [contatos, setContatos] = useState<Contato[]>([])
  const [busca, setBusca] = useState('')
  const [zoom, setZoom] = useState(1)
  const [contatoAbertoId, setContatoAbertoId] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    ;(async () => {
      try {
        const data = await crmFetch<{ colunas: Coluna[]; contatos: Contato[] }>(
          '/board',
        )
        if (cancelado) return
        setColunas(data.colunas)
        setContatos(normalizarContatos(data.contatos))
        setErro(null)
      } catch (e) {
        if (!cancelado) {
          setErro(e instanceof Error ? e.message : 'Falha ao carregar CRM')
        }
      } finally {
        if (!cancelado) setCarregando(false)
      }
    })()
    return () => {
      cancelado = true
    }
  }, [])

  const colunasOrdenadas = useMemo(
    () => [...colunas].sort((a, b) => a.ordem - b.ordem),
    [colunas],
  )

  const contatosFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return contatos
    return contatos.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.telefone?.includes(q),
    )
  }, [contatos, busca])

  const contatoAberto = useMemo(
    () => contatos.find((c) => c.id === contatoAbertoId) ?? null,
    [contatos, contatoAbertoId],
  )

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))
  }, [])

  const adicionarColuna = useCallback((titulo = 'Nova Coluna') => {
    void (async () => {
      try {
        const { coluna } = await crmFetch<{ coluna: Coluna }>('/colunas', {
          method: 'POST',
          body: JSON.stringify({ titulo }),
        })
        setColunas((prev) => [...prev, coluna])
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao criar coluna')
      }
    })()
  }, [])

  const adicionarContato = useCallback((colunaId: string, nome: string) => {
    const limpo = nome.trim()
    if (!limpo) return
    void (async () => {
      try {
        const { contato } = await crmFetch<{ contato: Contato }>('/contatos', {
          method: 'POST',
          body: JSON.stringify({ colunaId, nome: limpo }),
        })
        const normalizado = normalizarContatos([contato])[0]
        setContatos((prev) => [...prev, normalizado])
        setContatoAbertoId(normalizado.id)
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao criar contato')
      }
    })()
  }, [])

  const atualizarContato = useCallback((id: string, patch: Partial<Contato>) => {
    setContatos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    )
    void (async () => {
      try {
        const { contato } = await crmFetch<{ contato: Contato }>(
          `/contatos/${id}`,
          { method: 'PATCH', body: JSON.stringify(patch) },
        )
        const normalizado = normalizarContatos([contato])[0]
        setContatos((prev) => upsertContato(prev, normalizado))
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao atualizar contato')
      }
    })()
  }, [])

  const uploadArquivo = useCallback((contatoId: string, file: File) => {
    void (async () => {
      try {
        const { arquivo } = await crmUploadArquivo<{ arquivo: ContatoArquivo }>(
          contatoId,
          file,
        )
        setContatos((prev) =>
          prev.map((c) =>
            c.id === contatoId
              ? { ...c, arquivos: [arquivo, ...c.arquivos] }
              : c,
          ),
        )
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao enviar arquivo')
      }
    })()
  }, [])

  const removerArquivo = useCallback((contatoId: string, arquivoId: string) => {
    setContatos((prev) =>
      prev.map((c) =>
        c.id === contatoId
          ? { ...c, arquivos: c.arquivos.filter((a) => a.id !== arquivoId) }
          : c,
      ),
    )
    void (async () => {
      try {
        await crmFetch(
          `/contatos/${contatoId}/arquivos/${arquivoId}`,
          { method: 'DELETE' },
        )
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao excluir arquivo')
      }
    })()
  }, [])

  const abrirContato = useCallback((id: string) => setContatoAbertoId(id), [])
  const fecharContato = useCallback(() => setContatoAbertoId(null), [])

  const removerContato = useCallback((id: string) => {
    setContatos((prev) => prev.filter((c) => c.id !== id))
    setContatoAbertoId((aberto) => (aberto === id ? null : aberto))
    void (async () => {
      try {
        await crmFetch(`/contatos/${id}`, { method: 'DELETE' })
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao excluir contato')
      }
    })()
  }, [])

  const moverContato = useCallback(
    (contatoId: string, colunaDestinoId: string) => {
      setContatos((prev) =>
        prev.map((c) =>
          c.id === contatoId ? { ...c, colunaId: colunaDestinoId } : c,
        ),
      )
      void (async () => {
        try {
          const { contato } = await crmFetch<{ contato: Contato }>(
            `/contatos/${contatoId}/mover`,
            {
              method: 'POST',
              body: JSON.stringify({ colunaId: colunaDestinoId }),
            },
          )
          const normalizado = normalizarContatos([contato])[0]
          setContatos((prev) => upsertContato(prev, normalizado))
        } catch (e) {
          setErro(e instanceof Error ? e.message : 'Erro ao mover contato')
        }
      })()
    },
    [],
  )

  const reordenarColunas = useCallback(
    (origemId: string, destinoId: string) => {
      if (origemId === destinoId) return
      setColunas((prev) => {
        const sorted = [...prev].sort((a, b) => a.ordem - b.ordem)
        const from = sorted.findIndex((c) => c.id === origemId)
        const to = sorted.findIndex((c) => c.id === destinoId)
        if (from < 0 || to < 0) return prev
        const [item] = sorted.splice(from, 1)
        sorted.splice(to, 0, item)
        return sorted.map((c, i) => ({ ...c, ordem: i }))
      })
      void (async () => {
        try {
          const { colunas: next } = await crmFetch<{ colunas: Coluna[] }>(
            '/colunas/reordenar',
            {
              method: 'POST',
              body: JSON.stringify({ origemId, destinoId }),
            },
          )
          setColunas(next)
        } catch (e) {
          setErro(e instanceof Error ? e.message : 'Erro ao reordenar colunas')
        }
      })()
    },
    [],
  )

  const renomearColuna = useCallback((id: string, titulo: string) => {
    const limpo = titulo.trim()
    if (!limpo) return
    setColunas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, titulo: limpo } : c)),
    )
    void (async () => {
      try {
        const { coluna } = await crmFetch<{ coluna: Coluna }>(
          `/colunas/${id}`,
          { method: 'PATCH', body: JSON.stringify({ titulo: limpo }) },
        )
        setColunas((prev) => prev.map((c) => (c.id === id ? coluna : c)))
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao renomear coluna')
      }
    })()
  }, [])

  const removerColuna = useCallback((id: string) => {
    setColunas((prev) =>
      prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, ordem: i })),
    )
    setContatos((prev) => prev.filter((c) => c.colunaId !== id))
    void (async () => {
      try {
        await crmFetch(`/colunas/${id}`, { method: 'DELETE' })
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao excluir coluna')
      }
    })()
  }, [])

  const value: CrmContextValue = {
    colunas,
    contatos,
    busca,
    zoom,
    contatoAbertoId,
    carregando,
    erro,
    colunasOrdenadas,
    contatosFiltrados,
    contatoAberto,
    setBusca,
    zoomIn,
    zoomOut,
    adicionarColuna,
    adicionarContato,
    atualizarContato,
    uploadArquivo,
    removerArquivo,
    abrirContato,
    fecharContato,
    removerContato,
    moverContato,
    reordenarColunas,
    renomearColuna,
    removerColuna,
  }

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm() {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error('useCrm deve ser usado dentro de CrmProvider')
  return ctx
}
