import { Flex } from '@siakit/layout'

import { NodeType, RendererType } from '../../pages/Routes/Route'
import { AttributesDrawer } from './AttributesDrawer'
import { CreateNodeModal } from './CreateNodeModal'
import { RenderComponent } from './RenderComponent'
import { useAttributesDrawerStore } from './stores/attributesDrawerStore'
import { UpdateTableAttributesModal } from './UpdateTableAttributesModal'

type RendererBuilderProps = {
  renderer: RendererType
  onCreate: (node: NodeType, after: string) => void
  onUpdate: (node: NodeType) => void
  onDelete: (node: NodeType) => void
}

export function RendererBuilder({
  renderer,
  onCreate,
  onUpdate,
  onDelete,
}: RendererBuilderProps) {
  const visible = useAttributesDrawerStore((state) => state.visible)

  return (
    <>
      <CreateNodeModal onCreate={onCreate} />
      <UpdateTableAttributesModal onUpdate={onUpdate} items={renderer.items} />

      <Flex flex>
        <Flex flex padding>
          <RenderComponent
            nodeId={renderer.default}
            onDelete={onDelete}
            items={renderer.items}
          />
        </Flex>

        {visible && <AttributesDrawer onUpdate={onUpdate} />}
      </Flex>
    </>
  )
}
