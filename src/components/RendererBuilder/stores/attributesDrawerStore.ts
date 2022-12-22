import create from 'zustand'

import { NodeType } from '../../../pages/Routes/Route'

type Store = {
  visible: boolean
  changeVisibility: (node: NodeType | null) => void
  node: NodeType
}

export const useAttributesDrawerStore = create<Store>((set) => ({
  visible: false,
  changeVisibility: (node: NodeType | null) =>
    set(() => ({
      visible: !!node?.id,
      node: node || ({} as NodeType),
    })),
  node: {} as NodeType,
}))
