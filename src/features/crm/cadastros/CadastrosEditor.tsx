/**
 * Editor de responsáveis, calendários e autor das notas.
 */
import { useEffect, useState } from 'react'
import { useCadastros } from './cadastrosStore'

function ListaEditavel({
  label,
  itens,
  onChange,
}: {
  label: string
  itens: string[]
  onChange: (next: string[]) => void
}) {
  const [novo, setNovo] = useState('')

  return (
    <div className="field">
      <span>{label}</span>
      <ul className="kv-list">
        {itens.map((item, i) => (
          <li key={`${item}-${i}`}>
            <strong>{item}</strong>
            <button
              type="button"
              className="btn btn-ghost btn-icon sm danger-text"
              aria-label={`Remover ${item}`}
              onClick={() => onChange(itens.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="inline-add">
        <input
          className="input"
          placeholder="Novo item"
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            e.preventDefault()
            const t = novo.trim()
            if (!t || itens.includes(t)) return
            onChange([...itens, t])
            setNovo('')
          }}
        />
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            const t = novo.trim()
            if (!t || itens.includes(t)) return
            onChange([...itens, t])
            setNovo('')
          }}
        >
          Adicionar
        </button>
      </div>
    </div>
  )
}

export function CadastrosEditor() {
  const { cadastros, salvar, carregando } = useCadastros()
  const [autorNome, setAutorNome] = useState(cadastros.autorNotas.nome)
  const [autorEmail, setAutorEmail] = useState(cadastros.autorNotas.email)
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setAutorNome(cadastros.autorNotas.nome)
    setAutorEmail(cadastros.autorNotas.email)
  }, [cadastros.autorNotas.nome, cadastros.autorNotas.email])

  async function persistir(patch: Parameters<typeof salvar>[0]) {
    setSalvando(true)
    setMsg('')
    try {
      await salvar(patch)
      setMsg('Salvo')
    } catch {
      setMsg('Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="aba-form cadastros-editor">
      {carregando ? <p className="empty-hint">Carregando…</p> : null}

      <ListaEditavel
        label="Responsáveis"
        itens={cadastros.responsaveis}
        onChange={(responsaveis) => void persistir({ responsaveis })}
      />

      <ListaEditavel
        label="Calendários"
        itens={cadastros.calendarios}
        onChange={(calendarios) => void persistir({ calendarios })}
      />

      <label className="field">
        <span>Autor das notas (nome)</span>
        <input
          className="input"
          value={autorNome}
          onChange={(e) => setAutorNome(e.target.value)}
          onBlur={() => {
            if (autorNome.trim() === cadastros.autorNotas.nome) return
            void persistir({
              autorNotas: { nome: autorNome.trim() || 'Você', email: autorEmail },
            })
          }}
        />
      </label>

      <label className="field">
        <span>Autor das notas (e-mail)</span>
        <input
          className="input"
          type="email"
          value={autorEmail}
          onChange={(e) => setAutorEmail(e.target.value)}
          onBlur={() => {
            if (autorEmail.trim() === cadastros.autorNotas.email) return
            void persistir({
              autorNotas: {
                nome: autorNome.trim() || 'Você',
                email: autorEmail.trim(),
              },
            })
          }}
        />
      </label>

      {msg || salvando ? (
        <p className="empty-hint">{salvando ? 'Salvando…' : msg}</p>
      ) : null}
    </div>
  )
}
