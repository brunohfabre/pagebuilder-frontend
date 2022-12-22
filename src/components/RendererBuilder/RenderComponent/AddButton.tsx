import { Plus } from 'phosphor-react'

import { IconButton } from '@siakit/icon-button'
import { Flex } from '@siakit/layout'

import { useCreateNodeStore } from '../stores/createNodeStore'

type AddButtonProps = {
  parentId: string
  after?: string
}

export function AddButton({ parentId, after }: AddButtonProps) {
  const changeVisibility = useCreateNodeStore((state) => state.changeVisibility)

  return (
    <Flex justify="center" align="center" padding={4}>
      <IconButton
        type="button"
        variant="secondary"
        size="sm"
        onClick={(event) => {
          event.stopPropagation()

          changeVisibility({ parentId, after })
        }}
      >
        <Plus weight="bold" />
      </IconButton>
    </Flex>
  )
}
