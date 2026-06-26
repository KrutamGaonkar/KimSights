import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  current?: string
  onSave: (name: string) => void
  onClose?: () => void
}

export function ManagerNameModal({ open, current, onSave, onClose }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName(current ?? '')
      setError('')
      setTimeout(() => ref.current?.focus(), 50)
    }
  }, [open, current])

  if (!open) return null

  const isFirstTime = !current

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required'); return }
    onSave(name.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {isFirstTime ? 'Welcome to KimSights' : 'Edit Manager Name'}
          </h2>
          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {isFirstTime && (
            <p className="text-sm text-slate-500">
              Enter your name to get started. This will appear at the bottom of the sidebar.
            </p>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Your Name</label>
            <input
              ref={ref}
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="e.g. Kim Rodrigues"
              className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 ${error ? 'border-red-400' : 'border-slate-200'}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="flex gap-2 pt-1">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
            >
              {isFirstTime ? 'Get Started' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
