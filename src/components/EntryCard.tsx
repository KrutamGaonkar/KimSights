import { MoreHorizontal, Pencil, Trash2, CalendarMinus, ExternalLink } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { Entry } from '../types'
import { Badge } from './Badge'
import { formatDate } from '../utils'

interface Props {
  entry: Entry
  onEdit: () => void
  onDelete: () => void
}

export function EntryCard({ entry, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex gap-4 group">
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mt-1.5 shrink-0 group-hover:bg-indigo-400 transition-colors" />
        <div className="flex-1 w-px bg-slate-100 mt-1" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-5">
        <div className="bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:shadow-sm transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <Badge type={entry.type} />
              {entry.type === 'overtime' && (
                <span className="inline-flex items-center gap-1 text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                  +1 day
                </span>
              )}
              {entry.type === 'comp_off' && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <CalendarMinus className="w-3 h-3" />
                  -1 day
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400">{formatDate(entry.date)}</span>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-7 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10 min-w-32">
                    <button
                      onClick={() => { setMenuOpen(false); onEdit() }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); onDelete() }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-slate-800 mt-2">{entry.title}</h4>

          {entry.description && (
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{entry.description}</p>
          )}

          {entry.link && (
            <a
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-xs">{entry.link}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
