import create from 'zustand'

export type Element = {
  id: string
  type: string
  children?: string[]
  parentId?: string
}

export type Elements = { [key: string]: Element }

type Store = {
  elements: Elements
  setElements: (elements: Elements) => void
}

export const useStore = create<Store>((set) => ({
  elements: {
    default: {
      id: 'default',
      type: 'flex',
      children: [],
    },
  },
  setElements: (elements: any) =>
    set(() => ({
      elements,
    })),
}))
