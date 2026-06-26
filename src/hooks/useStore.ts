import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Employee, Entry } from '../types'
import { generateId, calcCompOffBalance } from '../utils'

const EMPLOYEES_COL = 'employees'

function docToEmployee(id: string, data: Record<string, unknown>): Employee {
  const entries: Entry[] = (data.entries as Entry[]) ?? []
  return {
    id,
    name: data.name as string,
    role: (data.role as string) ?? '',
    team: (data.team as string) ?? '',
    manager: (data.manager as string) ?? '',
    avatarColor: data.avatarColor as string,
    entries,
    compOffBalance: calcCompOffBalance(entries),
  }
}

export function useStore() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, EMPLOYEES_COL),
      (snapshot) => {
        const emps = snapshot.docs.map((d) =>
          docToEmployee(d.id, d.data() as Record<string, unknown>)
        )
        // preserve add-order by sorting on a stable field
        emps.sort((a, b) => a.name.localeCompare(b.name))
        setEmployees(emps)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  const addEmployee = async (
    data: Omit<Employee, 'id' | 'entries' | 'compOffBalance'>
  ): Promise<string> => {
    const id = `emp-${generateId()}`
    await setDoc(doc(db, EMPLOYEES_COL, id), {
      name: data.name,
      role: data.role,
      team: data.team,
      manager: data.manager,
      avatarColor: data.avatarColor,
      entries: [],
    })
    return id
  }

  const addEntry = async (
    employeeId: string,
    data: Omit<Entry, 'id' | 'createdAt'>
  ) => {
    const emp = employees.find((e) => e.id === employeeId)
    if (!emp) return
    const newEntry: Entry = {
      ...data,
      id: `e-${generateId()}`,
      createdAt: new Date().toISOString(),
    }
    const entries = [...emp.entries, newEntry]
    await updateDoc(doc(db, EMPLOYEES_COL, employeeId), { entries })
  }

  const updateEntry = async (
    employeeId: string,
    entryId: string,
    data: Omit<Entry, 'id' | 'createdAt'>
  ) => {
    const emp = employees.find((e) => e.id === employeeId)
    if (!emp) return
    const entries = emp.entries.map((e) =>
      e.id === entryId ? { ...e, ...data } : e
    )
    await updateDoc(doc(db, EMPLOYEES_COL, employeeId), { entries })
  }

  const deleteEntry = async (employeeId: string, entryId: string) => {
    const emp = employees.find((e) => e.id === employeeId)
    if (!emp) return
    const entries = emp.entries.filter((e) => e.id !== entryId)
    await updateDoc(doc(db, EMPLOYEES_COL, employeeId), { entries })
  }

  const deleteEmployee = async (employeeId: string) => {
    await deleteDoc(doc(db, EMPLOYEES_COL, employeeId))
  }

  return {
    employees,
    loading,
    error,
    addEmployee,
    addEntry,
    updateEntry,
    deleteEntry,
    deleteEmployee,
  }
}
