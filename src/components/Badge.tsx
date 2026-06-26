import type { EntryType } from '../types'
import { ENTRY_TYPE_COLORS, ENTRY_TYPE_DISPLAY } from '../utils'

interface Props {
  type: EntryType
  className?: string
}

export function Badge({ type, className = '' }: Props) {
  const colors = ENTRY_TYPE_COLORS[type]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {ENTRY_TYPE_DISPLAY[type]}
    </span>
  )
}
