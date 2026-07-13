/**
 * Sheet direito de Tarefas: overlay + lista | form | calendário.
 * Redimensionável no desktop; full-bleed no mobile.
 */
import { useState } from 'react'
import {
  IconArrowUpDown,
  IconCalendarDays,
  IconChevronDown,
  IconPlus,
  IconX,
} from '@/shared/icons'
import { useResizableWidth } from '@/shared/lib/useResizableWidth'
import { TarefaForm } from './TarefaForm'
import { TarefasCalendario } from './TarefasCalendario'
import { TarefasLista } from './TarefasLista'
import type { TarefaOrdenacao, TarefasView } from './types'

type Props = { onClose: () => void }

export function TarefasPanel({ onClose }: Props) {
  const [view, setView] = useState<TarefasView>('lista')
  const [ordenacao, setOrdenacao] = useState<TarefaOrdenacao>('vencimento')
  const largo = view === 'calendario'
  const { cssWidth, startResize, canResize } = useResizableWidth({
    storageKey: largo ? 'techfala-tarefas-cal-w' : 'techfala-tarefas-panel-w',
    minDesktop: largo ? 560 : 360,
    defaultRatio: largo ? 0.72 : 0.42,
  })

  return (
    <div className="tarefas-overlay" role="presentation" onClick={onClose}>
      <aside
        className={`tarefas-sheet${largo ? ' is-wide' : ''}`}
        role="dialog"
        aria-labelledby="task-panel-title"
        style={{ width: cssWidth, maxWidth: '100vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        {canResize ? (
          <div
            className="sheet-resize"
            role="separator"
            aria-orientation="vertical"
            aria-label="Redimensionar painel"
            title="Arraste para ajustar a largura"
            onPointerDown={startResize}
          />
        ) : null}
        <button
          type="button"
          className="tarefas-close"
          aria-label="Fechar"
          onClick={onClose}
        >
          <IconX />
        </button>

        {view === 'lista' ? (
          <>
            <header className="tarefas-header">
              <h2 id="task-panel-title" className="tarefas-title">
                Tarefas
              </h2>
              <div className="tarefas-header-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  title="Ver calendário"
                  onClick={() => setView('calendario')}
                >
                  <IconCalendarDays />
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setView('form')}
                >
                  <IconPlus />
                  Tarefa
                </button>
                <label className="tarefas-sort">
                  <IconArrowUpDown />
                  <select
                    value={ordenacao}
                    onChange={(e) =>
                      setOrdenacao(e.target.value as TarefaOrdenacao)
                    }
                    aria-label="Ordenar por"
                  >
                    <option value="vencimento">Vencimento</option>
                    <option value="titulo">Título</option>
                  </select>
                  <IconChevronDown />
                </label>
              </div>
            </header>
            <TarefasLista ordenacao={ordenacao} />
          </>
        ) : null}

        {view === 'form' ? (
          <TarefaForm onVoltar={() => setView('lista')} />
        ) : null}

        {view === 'calendario' ? (
          <TarefasCalendario onLista={() => setView('lista')} />
        ) : null}
      </aside>
    </div>
  )
}
