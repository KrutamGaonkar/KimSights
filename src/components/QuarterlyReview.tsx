import { useState } from 'react'
import type { Employee, Entry } from '../types'
import { filterEntries, getEntryYears, getQuarter, formatDate, ENTRY_TYPE_COLORS, calcOvertimeDays, calcCompOffBalance } from '../utils'
import { TrendingUp, AlertTriangle, Clock, CalendarDays, StickyNote, ChevronDown } from 'lucide-react'

interface Props {
  employee: Employee
}

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode
  title: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div className={`rounded-xl border ${color} p-4`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      </div>
      {children}
    </div>
  )
}

function EntryRow({ entry }: { entry: Entry }) {
  const colors = ENTRY_TYPE_COLORS[entry.type]
  return (
    <div className="py-2.5 border-b border-slate-100 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700 truncate">{entry.title}</p>
          {entry.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{entry.description}</p>
          )}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {entry.tags.map((t) => (
                <span key={t} className={`px-1.5 py-0.5 text-xs rounded-full ${colors.bg} ${colors.text}`}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs text-slate-400 shrink-0">{formatDate(entry.date)}</span>
      </div>
    </div>
  )
}

export function QuarterlyReview({ employee }: Props) {
  const currentQ = getQuarter(new Date().toISOString().slice(0, 10))
  const currentYear = new Date().getFullYear()
  const [selectedQ, setSelectedQ] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>(currentQ)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)

  const years = getEntryYears(employee.entries)
  const availableYears = years.length > 0 ? years : [currentYear]

  const wins = filterEntries(employee.entries, 'win', selectedQ, selectedYear)
  const issues = filterEntries(employee.entries, 'issue', selectedQ, selectedYear)
  const notes = filterEntries(employee.entries, 'note', selectedQ, selectedYear)
  const overtimeEntries = filterEntries(employee.entries, 'overtime', selectedQ, selectedYear)
  const compOffEntries = filterEntries(employee.entries, 'comp_off', selectedQ, selectedYear)

  const totalOTDays = calcOvertimeDays(overtimeEntries)
  const compOffUsed = compOffEntries.length

  const totalEntries = wins.length + issues.length + notes.length + overtimeEntries.length + compOffEntries.length

  return (
    <div>
      {/* Year + Quarter selector */}
      <div className="flex items-center gap-1 mb-5">
        <div className="relative flex-1">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full appearance-none text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-300 bg-white font-medium"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        {QUARTERS.map((q) => (
          <button
            key={q}
            onClick={() => setSelectedQ(q)}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors text-center ${
              selectedQ === q
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            >
              {q}
            </button>
          ))}
      </div>

      {totalEntries === 0 ? (
        <div className="flex flex-col items-center py-16 text-slate-400">
          <CalendarDays className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm font-medium">No entries for {selectedQ} {selectedYear}</p>
          <p className="text-xs mt-1">Add entries using the buttons above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* OT / Comp-off summary */}
          <Section
            icon={<Clock className="w-4 h-4 text-violet-600" />}
            title="Comp Off Summary"
            color="border-violet-100 bg-violet-50/40"
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 text-center border border-violet-100">
                <p className="text-2xl font-bold text-violet-700">{totalOTDays}</p>
                <p className="text-xs text-slate-500 mt-0.5">Days Earned</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-slate-100">
                <p className="text-2xl font-bold text-slate-500">{compOffUsed}</p>
                <p className="text-xs text-slate-500 mt-0.5">Days Used</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Current balance: <span className="font-semibold text-blue-600">{calcCompOffBalance(employee.entries)}d</span>
            </p>
          </Section>

          {/* Strengths */}
          {wins.length > 0 && (
            <Section
              icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
              title={`Strengths (${wins.length})`}
              color="border-emerald-100 bg-emerald-50/40"
            >
              {wins.map((e) => <EntryRow key={e.id} entry={e} />)}
            </Section>
          )}

          {/* Concerns */}
          {issues.length > 0 && (
            <Section
              icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
              title={`Concerns / Improvements (${issues.length})`}
              color="border-amber-100 bg-amber-50/40"
            >
              {issues.map((e) => <EntryRow key={e.id} entry={e} />)}
            </Section>
          )}

          {/* Notes */}
          {notes.length > 0 && (
            <Section
              icon={<StickyNote className="w-4 h-4 text-slate-500" />}
              title={`Manager Notes (${notes.length})`}
              color="border-slate-200 bg-slate-50/40"
            >
              {notes.map((e) => <EntryRow key={e.id} entry={e} />)}
            </Section>
          )}
        </div>
      )}
    </div>
  )
}
