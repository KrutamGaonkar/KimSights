import { useState } from 'react'
import type { Employee, Entry, EntryType } from '../types'
import { filterEntries, getEntryYears, ENTRY_TYPE_LABELS } from '../utils'
import { EntryCard } from './EntryCard'
import { ScrollText, ChevronDown } from 'lucide-react'

const TYPE_FILTERS: (EntryType | 'all')[] = ['all', 'win', 'overtime', 'comp_off', 'issue', 'note']
const QUARTERS = ['all', 'Q1', 'Q2', 'Q3', 'Q4'] as const

interface Props {
  employee: Employee
  onEdit: (entry: Entry) => void
  onDelete: (entryId: string) => void
}

export function ActivityTimeline({ employee, onEdit, onDelete }: Props) {
  const [typeFilter, setTypeFilter] = useState<EntryType | 'all'>('all')
  const [quarterFilter, setQuarterFilter] = useState<'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('all')
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all')

  const years = getEntryYears(employee.entries)
  const entries = filterEntries(employee.entries, typeFilter, quarterFilter, yearFilter)

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-5">
        {/* Type pills */}
        <div className="flex gap-1">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`flex-1 py-1.5 text-xs rounded-full font-medium transition-colors text-center ${
                typeFilter === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ENTRY_TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Year + Quarter dropdowns */}
        <div className="flex gap-2 justify-end">
          <div className="relative min-w-28">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full appearance-none text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="relative min-w-28">
            <select
              value={quarterFilter}
              onChange={(e) => setQuarterFilter(e.target.value as typeof quarterFilter)}
              className="w-full appearance-none text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              {QUARTERS.map((q) => (
                <option key={q} value={q}>{q === 'all' ? 'All Quarters' : q}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <ScrollText className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm font-medium">No entries yet</p>
          <p className="text-xs mt-1 text-slate-400">Use the buttons above to add entries.</p>
        </div>
      ) : (
        <div>
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={() => onEdit(entry)}
              onDelete={() => onDelete(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
