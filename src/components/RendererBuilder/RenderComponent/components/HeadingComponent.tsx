import { Trash } from 'phosphor-react'

import { IconButton } from '@siakit/icon-button'
import { Flex } from '@siakit/layout'
import { Text } from '@siakit/text'

import { NodeType } from '../../../../pages/Routes/Route'
import { useAttributesDrawerStore } from '../../stores/attributesDrawerStore'

type HeadingComponentProps = {
  node: NodeType
  onDelete: (node: NodeType) => void
}

export function HeadingComponent({ node, onDelete }: HeadingComponentProps) {
  const changeVisibility = useAttributesDrawerStore(
    (state) => state.changeVisibility,
  )

  return (
    <Flex
      padding={8}
      gap={8}
      align="center"
      css={{ border: '2px dashed green' }}
      onClick={(event) => {
        event.stopPropagation()
        changeVisibility(node)
      }}
    >
      <Text>heading</Text>
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
    </Flex>
  )
}
