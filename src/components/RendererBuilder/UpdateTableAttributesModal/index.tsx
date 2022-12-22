import { Modal, ModalContent } from '@siakit/modal'
import { Tabs, TabsItem, TabsList } from '@siakit/tabs'

import { NodeType } from '../../../pages/Routes/Route'
import { useUpdateTableStore } from '../stores/updateTableStore'
import { Actions } from './Actions'
import { Buttons } from './Buttons'
import { Details } from './Details'
import { Headers } from './Headers'

type UpdateTableAttributesModalProps = {
  onUpdate: (node: NodeType) => void
  items: { [key: string]: NodeType }
}

export function UpdateTableAttributesModal({
  onUpdate,
  items,
}: UpdateTableAttributesModalProps) {
  const { visible, changeVisibility, nodeId } = useUpdateTableStore(
    (state) => ({
      visible: state.visible,
      changeVisibility: state.changeVisibility,
      nodeId: state.nodeId,
    }),
  )

  const node = items[nodeId ?? '']

  return (
    <Modal open={visible} onOpenChange={() => changeVisibility(null)}>
      <ModalContent title="update table" size="lg">
        <Tabs defaultValue="details">
          <TabsList>
            <TabsItem value="details">details</TabsItem>
            <TabsItem value="buttons">buttons</TabsItem>
            <TabsItem value="headers">headers</TabsItem>
            <TabsItem value="actions">actions</TabsItem>
          </TabsList>

          <Details onUpdate={onUpdate} node={node} />
          <Buttons onUpdate={onUpdate} node={node} />
          <Headers onUpdate={onUpdate} node={node} />
          <Actions onUpdate={onUpdate} node={node} />
        </Tabs>
      </ModalContent>
    </Modal>
  )
}
