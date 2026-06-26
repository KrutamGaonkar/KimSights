import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface Settings {
  managerName: string
}

const SETTINGS_REF = doc(db, 'settings', 'app')

export function useSettings() {
  const [managerName, setManagerName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(SETTINGS_REF, (snap) => {
      if (snap.exists()) {
        setManagerName((snap.data() as Settings).managerName ?? '')
      } else {
        setManagerName(null) // null = not yet configured
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const saveManagerName = async (name: string) => {
    await setDoc(SETTINGS_REF, { managerName: name.trim() }, { merge: true })
  }

  return { managerName, loading, saveManagerName }
}
