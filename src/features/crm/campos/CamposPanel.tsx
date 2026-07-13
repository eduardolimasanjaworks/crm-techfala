/**
 * Sheet direito de Campos Personalizados (+ cadastros).
 * Redimensionável no desktop; full-bleed no mobile.
 */
import { useState } from 'react'
import { IconPlus, IconX } from '@/shared/icons'
import { useResizableWidth } from '@/shared/lib/useResizableWidth'
import { CadastrosEditor } from '../cadastros/CadastrosEditor'
import { CampoForm } from './CampoForm'
import { CamposLista } from './CamposLista'
import type { CamposView } from './types'

type Props = { onClose: () => void }

export function CamposPanel({ onClose }: Props) {
  const [view, setView] = useState<CamposView>('lista')
  const { cssWidth, startResize, canResize } = useResizableWidth({
    storageKey: 'techfala-campos-panel-w',
    minDesktop: 360,
    defaultRatio: 0.4,
  })

  const titulo =
    view === 'cadastros'
      ? 'Cadastros'
      : view === 'form'
        ? 'Novo Campo'
        : 'Campos Personalizados'

  return (
    <div className="campos-overlay" role="presentation" onClick={onClose}>
      <aside
        className="campos-sheet"
        role="dialog"
        aria-labelledby="custom-fields-modal-title"
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
          className="campos-close"
          aria-label="Fechar"
          onClick={onClose}
        >
          <IconX />
        </button>

        {view === 'lista' ? (
          <>
            <header className="campos-header">
              <h2 id="custom-fields-modal-title" className="campos-title">
                {titulo}
              </h2>
              <div className="campos-header-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setView('cadastros')}
                >
                  Cadastros
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setView('form')}
                >
                  <IconPlus />
                  Campo
                </button>
              </div>
            </header>
            <CamposLista />
          </>
        ) : null}

        {view === 'form' ? (
          <CampoForm onVoltar={() => setView('lista')} />
        ) : null}

        {view === 'cadastros' ? (
          <>
            <header className="campos-header">
              <h2 id="custom-fields-modal-title" className="campos-title">
                Cadastros
              </h2>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setView('lista')}
              >
                Voltar
              </button>
            </header>
            <div className="campos-lista-scroll">
              <CadastrosEditor />
            </div>
          </>
        ) : null}
      </aside>
    </div>
  )
}
