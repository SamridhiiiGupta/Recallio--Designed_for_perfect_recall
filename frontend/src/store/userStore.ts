import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  name: string | null
  setName: (name: string) => void
  clearName: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: null,
      setName: (name) => set({ name: name.trim() }),
      clearName: () => set({ name: null }),
    }),
    { name: 'recallio-user' }
  )
)
