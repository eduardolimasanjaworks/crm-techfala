/**
 * Toolbar do CRM: busca, filtro real, views, zoom e ações.
 */
import { useEffect, useState } from 'react'
import {
  IconArrowUpDown,
  IconExpand,
  IconLayoutGrid,
  IconList,
  IconListChecks,
  IconPlus,
  IconRefresh,
  IconRows,
  IconSearch,
  IconSliders,
  IconZoomIn,
  IconZoomOut,
} from '@/shared/icons'
import type { ViewMode } from '@/shared/types/views'
import { useCrm } from '../store/crmStore'
import { FiltroPanel } from './FiltroPanel'

type Props = {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onAbrirTarefas: () => void
  onAbrirCampos: () => void
}

const VIEW_BTNS: { id: ViewMode; label: string; Icon: typeof IconLayoutGrid }[] =
  [
    { id: 'kanban', label: 'Kanban', Icon: IconLayoutGrid },
    { id: 'list', label: 'Lista', Icon: IconList },
    { id: 'rows', label: 'Linhas', Icon: IconRows },
    { id: 'funnel', label: 'Funil', Icon: IconArrowUpDown },
  ]

export function CrmToolbar({
  viewMode,
  onViewModeChange,
  onAbrirTarefas,
  onAbrirCampos,
}: Props) {
  const {
    busca,
    setBusca,
    zoomIn,
    zoomOut,
    adicionarColuna,
    sincronizarChatwoot,
    syncChatwootEmAndamento,
  } = useCrm()
  const [filtroAberto, setFiltroAberto] = useState(false)

  useEffect(() => {
    if (!filtroAberto) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setFiltroAberto(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [filtroAberto])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen()
    } else {
      void document.exitFullscreen()
    }
  }

  return (
    <div className="crm-toolbar">
      <div className="search-wrap">
        <IconSearch className="icon-search" />
        <input
          className="input pl-10"
          placeholder="Buscar contatos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <FiltroPanel
        aberto={filtroAberto}
        onToggle={() => setFiltroAberto((v) => !v)}
        onClose={() => setFiltroAberto(false)}
      />

      <div className="view-modes">
        <div className="view-modes-group" id="crm-view-mode-selector">
          {VIEW_BTNS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={`view-mode-btn${viewMode === id ? ' is-active' : ''}`}
              aria-label={label}
              aria-pressed={viewMode === id}
              onClick={() => onViewModeChange(id)}
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <>
          <button
            type="button"
            className="btn btn-icon"
            title="Diminuir zoom"
            onClick={zoomOut}
          >
            <IconZoomOut />
          </button>
          <button
            type="button"
            className="btn btn-icon"
            title="Aumentar zoom"
            onClick={zoomIn}
          >
            <IconZoomIn />
          </button>
        </>
      ) : null}

      <div className="toolbar-right">
        <button
          type="button"
          className="btn btn-icon sm"
          onClick={toggleFullscreen}
          aria-label="Tela cheia"
        >
          <IconExpand />
        </button>

        <button
          type="button"
          className="btn btn-primary"
          title="Nova Coluna"
          onClick={() => adicionarColuna()}
        >
          <IconPlus />
          <span className="btn-label">Nova Coluna</span>
        </button>

        <button
          type="button"
          className="btn btn-outline"
          disabled={syncChatwootEmAndamento}
          title="Sincronizar contatos do Chatwoot"
          onClick={() => void sincronizarChatwoot()}
        >
          <IconRefresh />
          <span className="btn-label">
            {syncChatwootEmAndamento ? 'Sincronizando…' : 'Chatwoot'}
          </span>
        </button>

        <button
          type="button"
          className="btn btn-outline"
          title="Tarefas"
          onClick={onAbrirTarefas}
        >
          <IconListChecks />
          <span className="btn-label">Tarefas</span>
        </button>

        <button
          type="button"
          className="btn btn-outline"
          title="Campos personalizados"
          onClick={onAbrirCampos}
        >
          <IconSliders />
          <span className="btn-label">Campos</span>
        </button>
      </div>
    </div>
  )
}
