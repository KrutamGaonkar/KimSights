import { useState, useEffect, useRef } from 'react'
import { X, Link } from 'lucide-react'
import type { Entry, EntryType } from '../types'
import { ENTRY_TYPE_DISPLAY } from '../utils'

type FormData = {
  type: EntryType
  date: string
  title: string
  description: string
  tags: string[]
  link: string
  hours: string
  compOffDays: string
  compOffKind: 'earned' | 'used'
}

const DEFAULT_FORM: FormData = {
  type: 'win',
  date: new Date().toISOString().slice(0, 10),
  title: '',
  description: '',
  tags: [],
  link: '',
  hours: '',
  compOffDays: '',
  compOffKind: 'earned',
}

interface Props {
  open: boolean
  initialType?: EntryType
  editEntry?: Entry | null
  onClose: () => void
  onSave: (data: Omit<Entry, 'id' | 'createdAt'>) => void
}

const ENTRY_TYPES: EntryType[] = ['win', 'overtime', 'comp_off', 'issue', 'note']

export function EntryModal({ open, initialType, editEntry, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    if (editEntry) {
      setForm({
        type: editEntry.type,
        date: editEntry.date,
        title: editEntry.title,
        description: editEntry.description,
        tags: [],
        link: editEntry.link ?? '',
        hours: editEntry.hours?.toString() ?? '',
        compOffDays: editEntry.compOffDays?.toString() ?? '',
        compOffKind: editEntry.compOffKind ?? 'earned',
      })
    } else {
      setForm({ ...DEFAULT_FORM, type: initialType ?? 'win', date: new Date().toISOString().slice(0, 10) })
    }
    setErrors({})
    setTimeout(() => titleRef.current?.focus(), 50)
  }, [open, initialType, editEntry])

  if (!open) return null

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const entry: Omit<Entry, 'id' | 'createdAt'> = {
      type: form.type,
      date: form.date,
      title: form.title.trim(),
      description: form.description.trim(),
      tags: [],
      ...(form.link.trim() ? { link: form.link.trim() } : {}),
      ...(form.type === 'comp_off' ? { compOffDays: 1, compOffKind: 'used' as const } : {}),
    }
    onSave(entry)
    onClose()
  }

  const label = editEntry ? 'Edit Entry' : 'Add Entry'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">{label}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Type selector */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Type</label>
            <div className="grid grid-cols-5 gap-1.5">
              {ENTRY_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('type', t)}
                  className={`py-1.5 px-1 text-xs rounded-lg border transition-colors font-medium ${
                    form.type === t
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {ENTRY_TYPE_DISPLAY[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Date row */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 ${
                errors.date ? 'border-red-400' : 'border-slate-200'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Overtime hint */}
          {form.type === 'overtime' && (
            <p className="text-xs text-violet-600 bg-violet-50 rounded-lg px-3 py-2">
              Each comp off entry adds 1 day to the balance.
            </p>
          )}

          {/* Comp-off used hint */}
          {form.type === 'comp_off' && (
            <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
              Each entry deducts 1 day from the comp off balance.
            </p>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
            <input
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Short title…"
              className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 ${
                errors.title ? 'border-red-400' : 'border-slate-200'
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Additional details…"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>


          {/* Link */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Link <span className="text-slate-400 font-normal">(optional)</span></label>
            <div className="relative">
              <Link className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="url"
                value={form.link}
                onChange={(e) => set('link', e.target.value)}
                placeholder="https://…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              {editEntry ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
