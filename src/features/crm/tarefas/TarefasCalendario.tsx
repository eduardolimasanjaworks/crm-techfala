/**
 * Vista calendário do painel — mês, semana e dia.
 */
import { useMemo, useState } from 'react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconList,
} from '@/shared/icons'
import {
  DIAS_SEMANA,
  addDias,
  dataDeIso,
  isoDeData,
  montarMes,
  montarSemana,
  rotuloDia,
  rotuloMesAno,
  rotuloSemana,
} from './calendarioMes'
import { useTarefas } from './tarefasStore'
import type { CalendarioModo, Tarefa } from './types'

type Props = { onLista: () => void }

function ChipTarefa({ t }: { t: Tarefa }) {
  const hora = t.hora ? ` · ${t.hora}` : ''
  return (
    <div
      className={`cal-chip${t.status === 'concluida' ? ' is-done' : ''}`}
      title={`${t.titulo}${hora}`}
    >
      {t.hora ? <span className="cal-chip-hora">{t.hora}</span> : null}
      <span className="cal-chip-titulo">{t.titulo}</span>
    </div>
  )
}

export function TarefasCalendario({ onLista }: Props) {
  const { tarefas } = useTarefas()
  const [cursor, setCursor] = useState(() => new Date())
  const [modo, setModo] = useState<CalendarioModo>('mes')

  const ano = cursor.getFullYear()
  const mes0 = cursor.getMonth()
  const diaIso = isoDeData(cursor)

  const cellsMes = useMemo(
    () => montarMes(ano, mes0, new Date()),
    [ano, mes0],
  )
  const cellsSemana = useMemo(
    () => montarSemana(cursor, new Date()),
    [cursor],
  )

  const porDia = useMemo(() => {
    const map = new Map<string, Tarefa[]>()
    for (const t of tarefas) {
      if (!t.vencimento) continue
      const list = map.get(t.vencimento) ?? []
      list.push(t)
      map.set(t.vencimento, list)
    }
    for (const [, list] of map) {
      list.sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
    }
    return map
  }, [tarefas])

  const tarefasDoDia = porDia.get(diaIso) ?? []

  function irHoje() {
    setCursor(new Date())
  }

  function prev() {
    if (modo === 'mes') setCursor(new Date(ano, mes0 - 1, 1))
    else if (modo === 'semana') setCursor(addDias(cursor, -7))
    else setCursor(addDias(cursor, -1))
  }

  function next() {
    if (modo === 'mes') setCursor(new Date(ano, mes0 + 1, 1))
    else if (modo === 'semana') setCursor(addDias(cursor, 7))
    else setCursor(addDias(cursor, 1))
  }

  function abrirDia(iso: string) {
    setCursor(dataDeIso(iso))
    setModo('dia')
  }

  const label =
    modo === 'mes'
      ? rotuloMesAno(ano, mes0)
      : modo === 'semana'
        ? rotuloSemana(cursor)
        : rotuloDia(cursor)

  return (
    <div className="tarefas-cal">
      <div className="tarefas-cal-toolbar">
        <div className="tarefas-cal-nav">
          <button type="button" className="btn btn-outline btn-sm" onClick={onLista}>
            <IconList />
            Lista
          </button>
          <span className="tarefas-cal-sep" />
          <button type="button" className="btn btn-outline btn-sm" onClick={irHoje}>
            Hoje
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-icon-sm"
            onClick={prev}
            aria-label="Anterior"
          >
            <IconChevronLeft />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-icon-sm"
            onClick={next}
            aria-label="Próximo"
          >
            <IconChevronRight />
          </button>
          <span className="tarefas-cal-label">{label}</span>
        </div>

        <div className="tarefas-cal-modos">
          {(['mes', 'semana', 'dia'] as CalendarioModo[]).map((m) => (
            <button
              key={m}
              type="button"
              className={modo === m ? 'is-active' : ''}
              onClick={() => setModo(m)}
            >
              {m === 'mes' ? 'Mês' : m === 'semana' ? 'Semana' : 'Dia'}
            </button>
          ))}
        </div>
      </div>

      {modo === 'mes' ? (
        <div className="tarefas-cal-grid-wrap">
          <div className="tarefas-cal-weekdays">
            {DIAS_SEMANA.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="tarefas-cal-grid">
            {cellsMes.map((c) => {
              const items = porDia.get(c.iso) ?? []
              return (
                <button
                  type="button"
                  key={c.key}
                  className={`tarefas-cal-cell${c.foraDoMes ? ' is-out' : ''}${c.hoje ? ' is-hoje' : ''}`}
                  onClick={() => abrirDia(c.iso)}
                >
                  <span className={c.hoje ? 'dia-hoje' : 'dia'}>{c.dia}</span>
                  <div className="cal-cell-items">
                    {items.slice(0, 3).map((t) => (
                      <ChipTarefa key={t.id} t={t} />
                    ))}
                    {items.length > 3 ? (
                      <span className="cal-more">+{items.length - 3}</span>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {modo === 'semana' ? (
        <div className="tarefas-cal-grid-wrap">
          <div className="tarefas-cal-weekdays">
            {DIAS_SEMANA.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="tarefas-cal-grid is-semana">
            {cellsSemana.map((c) => {
              const items = porDia.get(c.iso) ?? []
              return (
                <button
                  type="button"
                  key={c.key}
                  className={`tarefas-cal-cell is-semana-cell${c.hoje ? ' is-hoje' : ''}`}
                  onClick={() => abrirDia(c.iso)}
                >
                  <span className={c.hoje ? 'dia-hoje' : 'dia'}>{c.dia}</span>
                  <div className="cal-cell-items">
                    {items.length === 0 ? (
                      <span className="cal-empty">Sem tarefas</span>
                    ) : (
                      items.map((t) => <ChipTarefa key={t.id} t={t} />)
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {modo === 'dia' ? (
        <div className="tarefas-cal-dia">
          {tarefasDoDia.length === 0 ? (
            <p className="tarefas-vazio">Nenhuma tarefa neste dia.</p>
          ) : (
            <ul className="tarefas-cal-dia-lista">
              {tarefasDoDia.map((t) => (
                <li key={t.id} className={t.status === 'concluida' ? 'is-done' : ''}>
                  <span className="cal-dia-hora">{t.hora || '—'}</span>
                  <div>
                    <strong>{t.titulo}</strong>
                    {t.descricao ? <p>{t.descricao}</p> : null}
                    {t.responsavel ? (
                      <span className="cal-dia-meta">{t.responsavel}</span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
