import { Trash } from 'phosphor-react'

import { IconButton } from '@siakit/icon-button'
import { Flex } from '@siakit/layout'

import { NodeType } from '../../../../pages/Routes/Route'
import { useAttributesDrawerStore } from '../../stores/attributesDrawerStore'
import { AddButton } from '../AddButton'

import { RenderComponent } from '..'

type CardComponentProps = {
  node: NodeType
  onDelete: (node: NodeType) => void
  items: { [key: string]: NodeType }
}

export function CardComponent({ node, onDelete, items }: CardComponentProps) {
  const changeVisibility = useAttributesDrawerStore(
    (state) => state.changeVisibility,
  )

  return (
    <Flex
      css={{ border: '2px dashed black' }}
      {...node.attributes}
      padding={8}
      onClick={(event) => {
        event.stopPropagation()
        changeVisibility(node)
      }}
    >
      <AddButton parentId={node.id} />

      {node.children?.map((nodeId) => (
        <>
          <RenderComponent
            key={nodeId}
            nodeId={nodeId}
            onDelete={onDelete}
            items={items}
          />
          <AddButton parentId={node.id} after={nodeId} />
        </>
      ))}

      {!node.children?.length && !!node.parentId && (
        <IconButton
          type="button"
          size="sm"
          colorScheme="red"
          onClick={(event) => {
            event.stopPropagation()
            onDelete(node)
          }}
        >
          <Trash weight="bold" />
        </IconButton>
      )}
    </Flex>
  )
}
