/**
 * Helpers de calendário (mês / semana / dia) — Dom–Sáb.
 */

export type DiaCalendario = {
  key: string
  dia: number
  iso: string
  foraDoMes: boolean
  hoje: boolean
}

export function isoLocal(y: number, m0: number, d: number): string {
  const mm = String(m0 + 1).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

export function dataDeIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isoDeData(d: Date): string {
  return isoLocal(d.getFullYear(), d.getMonth(), d.getDate())
}

export function addDias(d: Date, n: number): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  x.setDate(x.getDate() + n)
  return x
}

/** Domingo da semana que contém `ref`. */
export function inicioSemana(ref: Date): Date {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate())
  d.setDate(d.getDate() - d.getDay())
  return d
}

export function montarMes(ano: number, mes0: number, hoje = new Date()): DiaCalendario[] {
  const primeiro = new Date(ano, mes0, 1)
  const inicio = primeiro.getDay()
  const diasNoMes = new Date(ano, mes0 + 1, 0).getDate()
  const diasMesAnt = new Date(ano, mes0, 0).getDate()
  const hojeIso = isoDeData(hoje)
  const cells: DiaCalendario[] = []

  for (let i = inicio - 1; i >= 0; i--) {
    const d = diasMesAnt - i
    const y = mes0 === 0 ? ano - 1 : ano
    const m = mes0 === 0 ? 11 : mes0 - 1
    const iso = isoLocal(y, m, d)
    cells.push({ key: iso, dia: d, iso, foraDoMes: true, hoje: iso === hojeIso })
  }

  for (let d = 1; d <= diasNoMes; d++) {
    const iso = isoLocal(ano, mes0, d)
    cells.push({ key: iso, dia: d, iso, foraDoMes: false, hoje: iso === hojeIso })
  }

  let d = 1
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const y = mes0 === 11 ? ano + 1 : ano
    const m = mes0 === 11 ? 0 : mes0 + 1
    const iso = isoLocal(y, m, d)
    cells.push({ key: iso, dia: d, iso, foraDoMes: true, hoje: iso === hojeIso })
    d++
    if (cells.length >= 42) break
  }

  return cells
}

export function montarSemana(ref: Date, hoje = new Date()): DiaCalendario[] {
  const ini = inicioSemana(ref)
  const hojeIso = isoDeData(hoje)
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDias(ini, i)
    const iso = isoDeData(d)
    return {
      key: iso,
      dia: d.getDate(),
      iso,
      foraDoMes: false,
      hoje: iso === hojeIso,
    }
  })
}

export function rotuloMesAno(ano: number, mes0: number): string {
  return new Date(ano, mes0, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
}

export function rotuloSemana(ref: Date): string {
  const ini = inicioSemana(ref)
  const fim = addDias(ini, 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  return `${fmt(ini)} – ${fmt(fim)} ${fim.getFullYear()}`
}

export function rotuloDia(ref: Date): string {
  return ref.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
