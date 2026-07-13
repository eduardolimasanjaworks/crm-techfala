/**
 * Sheet direito de Campos Personalizados.
 * Redimensionável no desktop; full-bleed no mobile.
 */
import { useState } from 'react'
import { IconPlus, IconX } from '@/shared/icons'
import { useResizableWidth } from '@/shared/lib/useResizableWidth'
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
                Campos Personalizados
              </h2>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setView('form')}
              >
                <IconPlus />
                Campo
              </button>
            </header>
            <CamposLista />
          </>
        ) : (
          <CampoForm onVoltar={() => setView('lista')} />
        )}
      </aside>
    </div>
  )
}
