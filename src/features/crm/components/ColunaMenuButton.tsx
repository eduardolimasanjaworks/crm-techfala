/**
 * Menu ⋯ da coluna/etapa: renomear e remover (sem botão morto).
 */
import { useEffect, useRef, useState } from 'react'
import { IconEllipsis } from '@/shared/icons'
import { useCrm } from '../store/crmStore'

type Props = {
  colunaId: string
  titulo: string
  className?: string
}

export function ColunaMenuButton({ colunaId, titulo, className }: Props) {
  const { renomearColuna, removerColuna } = useCrm()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className={`col-menu${className ? ` ${className}` : ''}`} ref={root}>
      <button
        type="button"
        className="btn btn-ghost btn-icon sm"
        aria-label="Menu da etapa"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <IconEllipsis />
      </button>
      {open ? (
        <div className="col-menu-panel">
          <button
            type="button"
            onClick={() => {
              const next = window.prompt('Novo nome', titulo)
              if (next?.trim()) renomearColuna(colunaId, next.trim())
              setOpen(false)
            }}
          >
            Renomear
          </button>
          <button
            type="button"
            className="danger"
            onClick={() => {
              if (
                window.confirm(
                  `Excluir a etapa "${titulo}" e os contatos nela?`,
                )
              ) {
                removerColuna(colunaId)
              }
              setOpen(false)
            }}
          >
            Remover
          </button>
        </div>
      ) : null}
    </div>
  )
}
