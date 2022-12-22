import produce from 'immer'

import { useLoading } from '@siakit/loading'
import { TabsContent } from '@siakit/tabs'
import { useQueryClient } from '@tanstack/react-query'

import { NodeType, LayoutType } from '.'
import { RendererBuilder } from '../../../components/RendererBuilder'
import { useCreateNodeStore } from '../../../components/RendererBuilder/stores/createNodeStore'
import { api } from '../../../lib/api'

type LayoutProps = {
  layout: LayoutType
}

export function LayoutTab({ layout }: LayoutProps) {
  const { setLoading } = useLoading()

  const queryClient = useQueryClient()

  const changeVisibility = useCreateNodeStore((state) => state.changeVisibility)

  async function createNode(node: NodeType, after: string) {
    try {
      setLoading(true)

      const newRenderer = produce(layout.renderer, (draft) => {
        draft.items[node.id] = node

        if (node.parentId) {
          if (after) {
            const parentIndex = draft.items[node.parentId].children?.findIndex(
              (item) => item === after,
            )

            if (typeof parentIndex === 'number') {
              draft.items[node.parentId].children?.splice(
                parentIndex + 1,
                0,
                node.id,
              )
            }
          } else {
            draft.items[node.parentId].children?.splice(0, 0, node.id)
          }
        }
      })

      await api.put(`/renderers/${layout.renderer.id}`, {
        items: newRenderer.items,
      })

      queryClient.setQueryData(['layouts', layout.id], (prevState: any) => ({
        ...prevState,
        renderer: newRenderer,
      }))

      changeVisibility(null)
    } finally {
      setLoading(false)
    }
  }

  async function updateNode(node: NodeType) {
    try {
      setLoading(true)

      const newRenderer = produce(layout.renderer, (draft) => {
        draft.items[node.id] = node
      })

      await api.put(`/renderers/${layout.renderer.id}`, {
        items: newRenderer.items,
      })

      queryClient.setQueryData(['layouts', layout.id], (prevState: any) => ({
        ...prevState,
        renderer: newRenderer,
      }))

      changeVisibility(null)
    } finally {
      setLoading(false)
    }
  }

  async function deleteNode(node: NodeType) {
    try {
      setLoading(true)

      const newRenderer = produce(layout.renderer, (draft) => {
        delete draft.items[node.id]

        if (node.parentId) {
          draft.items[node.parentId].children = draft.items[
            node.parentId
          ].children?.filter((item) => item !== node.id)
        }
      })

      await api.put(`/renderers/${layout.renderer.id}`, {
        items: newRenderer.items,
      })

      queryClient.setQueryData(['layouts', layout.id], (prevState: any) => ({
        ...prevState,
        renderer: newRenderer,
      }))

      changeVisibility(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <TabsContent value="layout">
      <RendererBuilder
        renderer={layout.renderer}
        onCreate={createNode}
        onUpdate={updateNode}
        onDelete={deleteNode}
      />
    </TabsContent>
  )
}
