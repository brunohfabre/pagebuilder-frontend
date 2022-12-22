import { useEffect, useState } from 'react'

import produce from 'immer'
import { Trash } from 'phosphor-react'
import { v4 as uuid } from 'uuid'

import { Button } from '@siakit/button'
import { Footer } from '@siakit/footer'
import { TextInput } from '@siakit/form-components'
import { IconButton } from '@siakit/icon-button'
import { Flex } from '@siakit/layout'
import { TabsContent } from '@siakit/tabs'
import { Text } from '@siakit/text'

import { NodeType } from '../../../pages/Routes/Route'
import { useUpdateTableStore } from '../stores/updateTableStore'

type ActionType = {
  label: string
  action: string
  route: string
}

type ActionsProps = {
  onUpdate: (node: NodeType) => void
  node: NodeType
}

export function Actions({ onUpdate, node }: ActionsProps) {
  const [actions, setActions] = useState<{ [key: string]: ActionType }>({})

  const changeVisibility = useUpdateTableStore(
    (state) => state.changeVisibility,
  )

  useEffect(() => {
    if (node?.attributes?.actions?.length) {
      setActions(
        node.attributes?.actions.reduce(
          (acc: { [key: string]: ActionType }, item: ActionType) => {
            return {
              ...acc,
              [uuid()]: item,
            }
          },
          {},
        ),
      )
    }
  }, [node])

  async function handleSubmit() {
    const newNode = {
      ...node,
      attributes: {
        ...node.attributes,
        actions: Object.entries(actions).map(([_, item]) => item),
      } as any,
    }

    onUpdate(newNode)
  }

  return (
    <TabsContent value="actions">
      <Flex flex direction="column" gap>
        <Flex flex direction="column" padding>
          {Object.keys(actions).map((key) => (
            <Flex key={key} gap={8} align="end">
              <Flex flex direction="column">
                <Text size="sm">label</Text>
                <TextInput
                  value={actions[key].label}
                  onChange={(value) => {
                    setActions((prevState) =>
                      produce(prevState, (draft) => {
                        draft[key].label = value
                      }),
                    )
                  }}
                />
              </Flex>

              <Flex flex direction="column">
                <Text size="sm">action</Text>
                <TextInput
                  value={actions[key].action}
                  onChange={(value) => {
                    setActions((prevState) =>
                      produce(prevState, (draft) => {
                        draft[key].action = value
                      }),
                    )
                  }}
                />
              </Flex>

              <Flex flex direction="column">
                <Text size="sm">route</Text>
                <TextInput
                  value={actions[key].route}
                  onChange={(value) => {
                    setActions((prevState) =>
                      produce(prevState, (draft) => {
                        draft[key].route = value
                      }),
                    )
                  }}
                />
              </Flex>

              <IconButton
                type="button"
                colorScheme="red"
                onClick={() => {
                  setActions((prevState) =>
                    produce(prevState, (draft) => {
                      delete draft[key]
                    }),
                  )
                }}
              >
                <Trash />
              </IconButton>
            </Flex>
          ))}

          <Flex margin="16px 0 0 0" justify="end">
            <Button
              type="button"
              onClick={() =>
                setActions((prevState) => ({
                  ...prevState,
                  [uuid()]: {
                    label: '',
                    action: '',
                    route: '',
                  },
                }))
              }
            >
              + action
            </Button>
          </Flex>
        </Flex>

        <Footer>
          <Button
            type="button"
            variant="ghost"
            colorScheme="gray"
            onClick={() => changeVisibility(null)}
          >
            cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            save
          </Button>
        </Footer>
      </Flex>
    </TabsContent>
  )
}
