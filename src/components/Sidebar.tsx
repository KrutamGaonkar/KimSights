import { useState } from 'react'
import { Search, Plus, ChevronRight, Pencil } from 'lucide-react'
import type { Employee } from '../types'
import { Avatar } from './Avatar'

interface Props {
  employees: Employee[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAddEmployee: () => void
  onEditManagerName: () => void
  managerName: string
  managerRole: string
  managerColor: string
}

export function Sidebar({
  employees,
  selectedId,
  onSelect,
  onAddEmployee,
  onEditManagerName,
  managerName,
  managerRole,
  managerColor,
}: Props) {
  const [search, setSearch] = useState('')

  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white rounded-sm" />
          </div>
          <span className="font-semibold text-slate-800 text-base">KimSights</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees…"
            className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 placeholder:text-slate-400"
          />
        </div>
      </div>

{/* Employee list */}
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        {filtered.length === 0 && (
          <p className="text-slate-400 text-xs text-center py-6">No employees found</p>
        )}
        {filtered.map((emp) => {
          const isSelected = emp.id === selectedId
          return (
            <button
              key={emp.id}
              onClick={() => onSelect(emp.id)}
              className={`w-full flex items-center gap-2.5 px-2 py-2.5 rounded-lg mb-0.5 text-left transition-colors ${
                isSelected
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Avatar name={emp.name} color={emp.avatarColor} size="sm" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>
                  {emp.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{emp.role}</p>
              </div>
              {isSelected && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
            </button>
          )
        })}
      </nav>

      {/* Add employee */}
      <div className="px-3 pb-3 border-t border-slate-100 pt-3">
        <button
          onClick={onAddEmployee}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-indigo-600 border border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Manager footer */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-50 group">
          <Avatar name={managerName} color={managerColor} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-800 truncate">{managerName}</p>
            {managerRole && <p className="text-xs text-slate-500 truncate">{managerRole}</p>}
          </div>
          <button
            onClick={onEditManagerName}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all shrink-0"
            title="Edit name"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  )
}
