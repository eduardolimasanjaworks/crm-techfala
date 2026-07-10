/**
 * App raiz: navegação por estado (sem react-router).
 * Shell lateral + CRM ou placeholder.
 */
import { useState } from 'react'
import { ShellLayout } from '@/features/shell/ShellLayout'
import { NAV_ITEMS, type RotaId } from '@/features/shell/navItems'
import { CrmPage } from '@/features/crm/CrmPage'
import { PlaceholderPage } from './PlaceholderPage'

export function App() {
  const [rota, setRota] = useState<RotaId>('crm')

  const label =
    NAV_ITEMS.find((i) => i.id === rota)?.label ?? 'Módulo'

  return (
    <ShellLayout rota={rota} onNavigate={setRota}>
      {rota === 'crm' ? <CrmPage /> : <PlaceholderPage titulo={label} />}
    </ShellLayout>
  )
}
