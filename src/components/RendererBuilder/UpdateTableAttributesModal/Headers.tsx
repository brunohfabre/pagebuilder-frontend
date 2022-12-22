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

type HeaderType = {
  label: string
  dataIndex: string
}

type HeadersProps = {
  onUpdate: (node: NodeType) => void
  node: NodeType
}

export function Headers({ onUpdate, node }: HeadersProps) {
  const [headers, setHeaders] = useState<{ [key: string]: HeaderType }>({})

  const changeVisibility = useUpdateTableStore(
    (state) => state.changeVisibility,
  )

  useEffect(() => {
    if (node?.attributes?.headers?.length) {
      setHeaders(
        node.attributes?.headers.reduce(
          (acc: { [key: string]: HeaderType }, item: HeaderType) => {
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
        headers: Object.entries(headers).map(([_, item]) => item),
      } as any,
    }

    onUpdate(newNode)
  }

  return (
    <TabsContent value="headers">
      <Flex flex direction="column" gap>
        <Flex flex direction="column" padding>
          {Object.keys(headers).map((key) => (
            <Flex key={key} gap={8} align="end">
              <Flex flex direction="column">
                <Text size="sm">label</Text>
                <TextInput
                  value={headers[key].label}
                  onChange={(value) => {
                    setHeaders((prevState) =>
                      produce(prevState, (draft) => {
                        draft[key].label = value
                      }),
                    )
                  }}
                />
              </Flex>

              <Flex flex direction="column">
                <Text size="sm">data index</Text>
                <TextInput
                  value={headers[key].dataIndex}
                  onChange={(value) => {
                    setHeaders((prevState) =>
                      produce(prevState, (draft) => {
                        draft[key].dataIndex = value
                      }),
                    )
                  }}
                />
              </Flex>

              <IconButton
                type="button"
                colorScheme="red"
                onClick={() => {
                  setHeaders((prevState) =>
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
                setHeaders((prevState) => ({
                  ...prevState,
                  [uuid()]: {
                    label: '',
                    dataIndex: '',
                  },
                }))
              }
            >
              + header
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
