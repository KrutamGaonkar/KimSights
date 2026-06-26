import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { EmployeeDetail } from './components/EmployeeDetail'
import { EmptyState } from './components/EmptyState'
import { AddEmployeeModal } from './components/AddEmployeeModal'
import { ManagerNameModal } from './components/ManagerNameModal'
import { useStore } from './hooks/useStore'
import { useSettings } from './hooks/useSettings'
import type { Entry } from './types'

const MANAGER_COLOR = '#64748b'

export default function App() {
  const { employees, loading, error, addEmployee, addEntry, updateEntry, deleteEntry, deleteEmployee } = useStore()
  const { managerName, loading: settingsLoading, saveManagerName } = useSettings()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addEmpOpen, setAddEmpOpen] = useState(false)
  const [editManagerOpen, setEditManagerOpen] = useState(false)

  const selected = employees.find((e) => e.id === selectedId) ?? null
  const isLoading = loading || settingsLoading

  async function handleSaveEmployee(data: {
    name: string; role: string; team: string; manager: string; avatarColor: string
  }) {
    const id = await addEmployee(data)
    setSelectedId(id)
  }

  async function handleDeleteEmployee() {
    if (!selectedId) return
    const remaining = employees.filter((e) => e.id !== selectedId)
    setSelectedId(remaining.length > 0 ? remaining[0].id : null)
    await deleteEmployee(selectedId)
  }

  function handleAddEntry(data: Omit<Entry, 'id' | 'createdAt'>) {
    if (selectedId) addEntry(selectedId, data)
  }

  function handleUpdateEntry(entryId: string, data: Omit<Entry, 'id' | 'createdAt'>) {
    if (selectedId) updateEntry(selectedId, entryId, data)
  }

  function handleDeleteEntry(entryId: string) {
    if (selectedId) deleteEntry(selectedId, entryId)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center max-w-sm px-6">
          <p className="text-sm font-medium text-red-600 mb-1">Failed to connect to database</p>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      </div>
    )
  }

  const resolvedManagerName = managerName ?? ''

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        employees={employees}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddEmployee={() => setAddEmpOpen(true)}
        onEditManagerName={() => setEditManagerOpen(true)}
        managerName={resolvedManagerName}
        managerRole=""
        managerColor={MANAGER_COLOR}
      />

      {selected ? (
        <EmployeeDetail
          key={selected.id}
          employee={selected}
          onAddEntry={handleAddEntry}
          onUpdateEntry={handleUpdateEntry}
          onDeleteEntry={handleDeleteEntry}
          onDeleteEmployee={handleDeleteEmployee}
        />
      ) : (
        <EmptyState onAddEmployee={() => setAddEmpOpen(true)} />
      )}

      <AddEmployeeModal
        open={addEmpOpen}
        onClose={() => setAddEmpOpen(false)}
        onSave={handleSaveEmployee}
        defaultManager={resolvedManagerName}
      />

      {/* First-time setup — no close button, must enter a name */}
      <ManagerNameModal
        open={managerName === null}
        onSave={async (name) => { await saveManagerName(name) }}
      />

      {/* Edit manager name */}
      <ManagerNameModal
        open={editManagerOpen}
        current={resolvedManagerName}
        onSave={async (name) => { await saveManagerName(name); setEditManagerOpen(false) }}
        onClose={() => setEditManagerOpen(false)}
      />
    </div>
  )
}
