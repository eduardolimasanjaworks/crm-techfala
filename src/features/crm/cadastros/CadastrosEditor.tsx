/**
 * Editor do autor das notas (responsáveis vêm dos usuários do sistema).
 */
import { useEffect, useState } from 'react'
import { useCadastros } from './cadastrosStore'

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
