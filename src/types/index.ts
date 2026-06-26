export type EntryType = 'overtime' | 'comp_off' | 'win' | 'issue' | 'note'

export interface Entry {
  id: string
  type: EntryType
  date: string // ISO date string YYYY-MM-DD
  title: string
  description: string
  tags: string[]
  link?: string
  hours?: number
  compOffDays?: number
  compOffKind?: 'earned' | 'used'
  createdAt: string
}

export interface Employee {
  id: string
  name: string
  role: string
  team: string
  manager: string
  avatarColor: string
  compOffBalance: number
  entries: Entry[]
}

export type QuarterFilter = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'all'
export type EntryTypeFilter = EntryType | 'all'

export interface AppState {
  employees: Employee[]
  selectedEmployeeId: string | null
}
