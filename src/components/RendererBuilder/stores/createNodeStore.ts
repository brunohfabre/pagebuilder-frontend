import create from 'zustand'

type Store = {
  visible: boolean
  changeVisibility: (data: { parentId: string; after?: string } | null) => void
  parentId: string
  after: string
}

export const useCreateNodeStore = create<Store>((set) => ({
  visible: false,
  changeVisibility: (data: { parentId: string; after?: string } | null) =>
    set(() => ({
      visible: !!data?.parentId,
      parentId: data?.parentId || '',
      after: data?.after || '',
    })),
  parentId: '',
  after: '',
}))
