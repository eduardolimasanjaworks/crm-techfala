/**
 * Aba Eventos — CRUD (criar/editar/excluir).
 * Data/hora e URL locais; sem calendário externo nem notificação.
 */
import { useState } from 'react'
import type { Contato, ContatoEvento } from '@/shared/types/crm'
import { useCrm } from '../store/crmStore'
import { AbaCabecalho } from './AbaCabecalho'

type Props = { contato: Contato }

const vazio = {
  titulo: '',
  descricao: '',
  url: '',
  inicioData: '',
  inicioHora: '',
  fimData: '',
  fimHora: '',
}

export function AbaEventos({ contato }: Props) {
  const { atualizarContato } = useCrm()
  const [aberto, setAberto] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(vazio)

  const valido = form.titulo.trim().length > 0

  function abrirNovo() {
    setEditId(null)
    setForm(vazio)
    setAberto(true)
  }

  function abrirEditar(e: ContatoEvento) {
    setEditId(e.id)
    setForm({
      titulo: e.titulo,
      descricao: e.descricao,
      url: e.url,
      inicioData: e.inicioData,
      inicioHora: e.inicioHora,
      fimData: e.fimData,
      fimHora: e.fimHora,
    })
    setAberto(true)
  }

  function salvar() {
    if (!valido) return
    const dados = {
      ...form,
      titulo: form.titulo.trim(),
      calendario: '',
      notificacao: false,
    }
    if (editId) {
      atualizarContato(contato.id, {
        eventos: contato.eventos.map((e) =>
          e.id === editId ? { ...e, ...dados } : e,
        ),
      })
    } else {
      const evento = {
        id: `ev-${crypto.randomUUID().slice(0, 8)}`,
        ...dados,
      }
      atualizarContato(contato.id, {
        eventos: [evento, ...contato.eventos],
        timeline: [
          {
            id: `tl-${crypto.randomUUID().slice(0, 8)}`,
            tipo: 'evento',
            titulo: 'Evento',
            detalhe: evento.titulo,
            em: new Date().toISOString(),
          },
          ...contato.timeline,
        ],
      })
    }
    setForm(vazio)
    setEditId(null)
    setAberto(false)
  }

  function excluir(id: string) {
    if (!window.confirm('Excluir este evento?')) return
    atualizarContato(contato.id, {
      eventos: contato.eventos.filter((e) => e.id !== id),
    })
  }

  const n = contato.eventos.length
  const contagem = n === 0 ? 'Nenhum evento' : n === 1 ? '1 evento' : `${n} eventos`

  return (
    <div className="aba-tab">
      <AbaCabecalho
        contagem={contagem}
        botaoLabel="Novo evento"
        onNovo={abrirNovo}
        desabilitado={aberto}
      />

      <div className="aba-scroll">
        {aberto ? (
          <div className="form-card">
            <label className="field-xs">
              <span>Título *</span>
              <input
                className="input h-9"
                placeholder="Título do evento"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </label>
            <label className="field-xs">
              <span>Descrição</span>
              <textarea
                className="input textarea"
                rows={2}
                placeholder="Descrição (opcional)"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </label>
            <div className="grid-2">
              <div className="field-xs">
                <span>Início</span>
                <input
                  className="input h-9"
                  type="date"
                  value={form.inicioData}
                  onChange={(e) => setForm({ ...form, inicioData: e.target.value })}
                />
                <input
                  className="input h-8"
                  type="time"
                  value={form.inicioHora}
                  onChange={(e) => setForm({ ...form, inicioHora: e.target.value })}
                />
              </div>
              <div className="field-xs">
                <span>Fim</span>
                <input
                  className="input h-9"
                  type="date"
                  value={form.fimData}
                  onChange={(e) => setForm({ ...form, fimData: e.target.value })}
                />
                <input
                  className="input h-8"
                  type="time"
                  value={form.fimHora}
                  onChange={(e) => setForm({ ...form, fimHora: e.target.value })}
                />
              </div>
            </div>
            <label className="field-xs">
              <span>URL da reunião</span>
              <input
                className="input h-9"
                placeholder="https://..."
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </label>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setAberto(false)
                  setEditId(null)
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!valido}
                onClick={salvar}
              >
                Salvar
              </button>
            </div>
          </div>
        ) : null}

        {contato.eventos.map((e) => (
          <div key={e.id} className="item-card">
            <div className="item-card-main">
              <strong>{e.titulo}</strong>
              <p>
                {e.inicioData} {e.inicioHora}
                {e.fimData ? ` → ${e.fimData} ${e.fimHora}` : ''}
              </p>
              {e.url ? <p className="meta-link">{e.url}</p> : null}
            </div>
            <div className="item-acoes">
              <button
                type="button"
                className="btn btn-ghost btn-icon sm"
                aria-label="Editar"
                onClick={() => abrirEditar(e)}
              >
                ✎
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-icon sm danger-text"
                aria-label="Excluir"
                onClick={() => excluir(e.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
