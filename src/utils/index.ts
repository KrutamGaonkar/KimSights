import type { Entry, EntryType, QuarterFilter } from '../types'

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getQuarter(dateStr: string): 'Q1' | 'Q2' | 'Q3' | 'Q4' {
  const month = new Date(dateStr + 'T00:00:00').getMonth() + 1
  if (month >= 4 && month <= 6) return 'Q1'  // Apr–Jun
  if (month >= 7 && month <= 9) return 'Q2'  // Jul–Sep
  if (month >= 10) return 'Q3'               // Oct–Dec
  return 'Q4'                                // Jan–Mar
}

export function filterEntries(
  entries: Entry[],
  typeFilter: EntryType | 'all',
  quarterFilter: QuarterFilter,
  yearFilter: number | 'all' = 'all'
): Entry[] {
  return entries
    .filter((e) => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false
      if (quarterFilter !== 'all' && getQuarter(e.date) !== quarterFilter) return false
      if (yearFilter !== 'all' && new Date(e.date + 'T00:00:00').getFullYear() !== yearFilter) return false
      return true
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getEntryYears(entries: Entry[]): number[] {
  const years = Array.from(new Set(entries.map((e) => new Date(e.date + 'T00:00:00').getFullYear())))
  return years.sort((a, b) => b - a) // newest first
}

export function calcCompOffBalance(entries: Entry[]): number {
  return entries.reduce((acc, e) => {
    if (e.type === 'overtime') return acc + 1
    if (e.type === 'comp_off') return acc - 1
    return acc
  }, 0)
}

export function calcOvertimeDays(entries: Entry[]): number {
  return entries.filter((e) => e.type === 'overtime').length
}

export const ENTRY_TYPE_LABELS: Record<EntryType | 'all', string> = {
  all: 'All',
  overtime: 'Comp Off',
  comp_off: 'Comp Off Used',
  win: 'Achievements',
  issue: 'Improvements',
  note: 'Notes',
}

export const ENTRY_TYPE_COLORS: Record<EntryType, { bg: string; text: string; dot: string }> = {
  win: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  comp_off: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  overtime: { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  issue: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  note: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
}

export const ENTRY_TYPE_DISPLAY: Record<EntryType, string> = {
  win: 'Achievement',
  comp_off: 'Comp Off Used',
  overtime: 'Comp Off',
  issue: 'Improvement',
  note: 'Note',
}
