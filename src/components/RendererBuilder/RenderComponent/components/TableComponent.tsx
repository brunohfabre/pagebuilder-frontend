import { Trash } from 'phosphor-react'

import { IconButton } from '@siakit/icon-button'
import { Flex } from '@siakit/layout'
import { Text } from '@siakit/text'

import { NodeType } from '../../../../pages/Routes/Route'
import { useUpdateTableStore } from '../../stores/updateTableStore'

type TableComponentProps = {
  node: NodeType
  onDelete: (node: NodeType) => void
}

export function TableComponent({ node, onDelete }: TableComponentProps) {
  const changeVisibility = useUpdateTableStore(
    (state) => state.changeVisibility,
  )

  return (
    <Flex
      flex
      padding={8}
      gap={8}
      css={{ border: '2px dashed orange' }}
      onClick={(event) => {
        event.stopPropagation()

        changeVisibility(node.id)
      }}
    >
      <Text>table</Text>

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
