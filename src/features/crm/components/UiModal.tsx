/**
 * Modal base do CRM — overlay + painel estilizado (nunca window.prompt).
 */
import type { ReactNode } from 'react'

type Props = {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export function UiModal({ title, onClose, children, wide }: Props) {
  return (
    <div
      className="ui-modal-overlay"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className={`ui-modal${wide ? ' is-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ui-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ui-modal-head">
          <h2 id="ui-modal-title">{title}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon sm"
            aria-label="Fechar"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="ui-modal-body">{children}</div>
      </div>
    </div>
  )
}
