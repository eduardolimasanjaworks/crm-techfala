/**
 * Cliente HTTP do CRM → `/api/crm/*` (mesmo origin do painel, cookie de sessão).
 */

export class CrmApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function crmFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers)
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(`/api/crm${path}`, {
    ...init,
    credentials: 'include',
    headers,
  })
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean
    erro?: string
  } & T
  if (!res.ok || data.ok === false) {
    throw new CrmApiError(res.status, data.erro || `HTTP ${res.status}`)
  }
  return data
}
