import { create } from 'zustand'
import { devtools, combine } from 'zustand/middleware'

const useStackerStore = devtools(create(
  combine({ bears: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bears: state.bears + by })),
  })),
))

export default useStackerStore