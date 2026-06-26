import { Users } from 'lucide-react'

interface Props {
  onAddEmployee: () => void
}

export function EmptyState({ onAddEmployee }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-screen">
      <div className="text-center max-w-sm px-6">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Select an employee</h2>
        <p className="text-sm text-slate-400 mb-6">
          Choose an employee from the sidebar to view their activity timeline, or add a new one to get started.
        </p>
        <button
          onClick={onAddEmployee}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Add Employee
        </button>
      </div>
    </div>
  )
}
