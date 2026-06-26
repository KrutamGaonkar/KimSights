import { useState } from 'react'
import {
  Clock,
  CalendarMinus,
  Trophy,
  AlertCircle,
  StickyNote,
  Trash2,
} from 'lucide-react'
import type { Employee, Entry, EntryType } from '../types'
import { Avatar } from './Avatar'
import { ActivityTimeline } from './ActivityTimeline'
import { QuarterlyReview } from './QuarterlyReview'
import { EntryModal } from './EntryModal'
import { calcCompOffBalance } from '../utils'

interface Props {
  employee: Employee
  onAddEntry: (data: Omit<Entry, 'id' | 'createdAt'>) => void
  onUpdateEntry: (entryId: string, data: Omit<Entry, 'id' | 'createdAt'>) => void
  onDeleteEntry: (entryId: string) => void
  onDeleteEmployee: () => void
}

type Tab = 'timeline' | 'review'

interface ActionBtn {
  type: EntryType
  label: string
  icon: React.ReactNode
  bg: string
  text: string
  border: string
}

const ACTION_BUTTONS: ActionBtn[] = [
  {
    type: 'overtime',
    label: 'Add Comp Off',
    icon: <Clock className="w-5 h-5" />,
    bg: 'bg-violet-50 hover:bg-violet-100',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  {
    type: 'comp_off',
    label: 'Use Comp Off',
    icon: <CalendarMinus className="w-5 h-5" />,
    bg: 'bg-blue-50 hover:bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  {
    type: 'win',
    label: 'Add Achievement',
    icon: <Trophy className="w-5 h-5" />,
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  {
    type: 'issue',
    label: 'Add Improvement',
    icon: <AlertCircle className="w-5 h-5" />,
    bg: 'bg-amber-50 hover:bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  {
    type: 'note',
    label: 'Add Note',
    icon: <StickyNote className="w-5 h-5" />,
    bg: 'bg-slate-50 hover:bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
]

export function EmployeeDetail({
  employee,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onDeleteEmployee,
}: Props) {
  const [tab, setTab] = useState<Tab>('timeline')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<EntryType>('win')
  const [editEntry, setEditEntry] = useState<Entry | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const compOffBalance = calcCompOffBalance(employee.entries)
  const wins = employee.entries.filter((e) => e.type === 'win').length
  const issues = employee.entries.filter((e) => e.type === 'issue').length

  function openAdd(type: EntryType) {
    setEditEntry(null)
    setModalType(type)
    setModalOpen(true)
  }

  function openEdit(entry: Entry) {
    setEditEntry(entry)
    setModalType(entry.type)
    setModalOpen(true)
  }

  function handleSave(data: Omit<Entry, 'id' | 'createdAt'>) {
    if (editEntry) {
      onUpdateEntry(editEntry.id, data)
    } else {
      onAddEntry(data)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-5">
            <Avatar name={employee.name} color={employee.avatarColor} size="xl" />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{employee.name}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-slate-500">{employee.role}</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                      {employee.team}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Reports to {employee.manager}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove employee"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-3 mt-4">
                <StatChip
                  label="Comp-off Balance"
                  value={`${compOffBalance}d`}
                  color="bg-blue-50 text-blue-700 border-blue-200"
                />
                <StatChip
                  label="Wins"
                  value={`${wins}`}
                  color="bg-emerald-50 text-emerald-700 border-emerald-200"
                />
                <StatChip
                  label="Issues"
                  value={`${issues}`}
                  color="bg-amber-50 text-amber-700 border-amber-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {ACTION_BUTTONS.map((btn) => {
            const disabled = btn.type === 'comp_off' && compOffBalance <= 0
            return (
              <button
                key={btn.type}
                onClick={() => !disabled && openAdd(btn.type)}
                disabled={disabled}
                title={disabled ? 'No comp off balance available' : undefined}
                className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border transition-colors text-xs font-medium ${
                  disabled
                    ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                    : `${btn.bg} ${btn.text} ${btn.border} cursor-pointer`
                }`}
              >
                {btn.icon}
                <span className="text-center leading-tight">{btn.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5">
          <TabBtn active={tab === 'timeline'} onClick={() => setTab('timeline')}>
            Activity Timeline
          </TabBtn>
          <TabBtn active={tab === 'review'} onClick={() => setTab('review')}>
            Quarterly Review
          </TabBtn>
        </div>

        {/* Tab content */}
        {tab === 'timeline' ? (
          <ActivityTimeline
            employee={employee}
            onEdit={openEdit}
            onDelete={onDeleteEntry}
          />
        ) : (
          <QuarterlyReview employee={employee} />
        )}
      </div>

      {/* Entry modal */}
      <EntryModal
        open={modalOpen}
        initialType={modalType}
        editEntry={editEntry}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-2">Remove {employee.name}?</h3>
            <p className="text-sm text-slate-500 mb-5">
              All entries for this employee will be permanently deleted.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => { setConfirmDelete(false); onDeleteEmployee() }}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${color}`}>
      <span className="text-base font-bold">{value}</span>
      <span className="opacity-75">{label}</span>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
        active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  )
}
