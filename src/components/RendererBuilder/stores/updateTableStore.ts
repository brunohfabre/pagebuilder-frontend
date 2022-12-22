import create from 'zustand'

type Store = {
  visible: boolean
  changeVisibility: (nodeId: string | null) => void
  nodeId: string | null
}

export const useUpdateTableStore = create<Store>((set) => ({
  visible: false,
  changeVisibility: (nodeId: string | null) =>
    set(() => ({
      visible: !!nodeId,
      nodeId,
    })),
  nodeId: null,
}))
