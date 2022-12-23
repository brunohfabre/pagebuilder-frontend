import { useEffect, useState } from 'react'

import produce from 'immer'
import { Trash } from 'phosphor-react'
import { v4 as uuid } from 'uuid'

import { Button } from '@siakit/button'
import { Footer } from '@siakit/footer'
import { TextInput, Select, OptionType } from '@siakit/form-components'
import { IconButton } from '@siakit/icon-button'
import { Flex } from '@siakit/layout'
import { TabsContent } from '@siakit/tabs'
import { Text } from '@siakit/text'

import { NodeType } from '../../../pages/Routes/Route'
import { useUpdateTableStore } from '../stores/updateTableStore'

type ButtonType = {
  label: string
  variant: OptionType | null
  route: string
}

type ButtonsProps = {
  onUpdate: (node: NodeType) => void
  node: NodeType
}

const variants = [
  {
    value: 'primary',
    label: 'Primary',
  },
  {
    value: 'secondary',
    label: 'Secondary',
  },
  {
    value: 'ghost',
    label: 'Ghost',
  },
]

export function Buttons({ onUpdate, node }: ButtonsProps) {
  const [buttons, setButtons] = useState<{ [key: string]: ButtonType }>({})

  const changeVisibility = useUpdateTableStore(
    (state) => state.changeVisibility,
  )

  useEffect(() => {
    if (node?.attributes?.buttons?.length) {
      setButtons(
        node.attributes?.buttons.reduce(
          (acc: { [key: string]: ButtonType }, item: any) => {
            const findVariant = variants.find(
              (variant) => variant.value === item.variant,
            )

            if (findVariant) {
              return {
                ...acc,
                [uuid()]: { ...item, variant: findVariant },
              }
            }

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
        buttons: Object.entries(buttons).map(([_, item]) => ({
          ...item,
          variant: item.variant?.value,
        })),
      } as any,
    }

    onUpdate(newNode)
  }

  return (
    <TabsContent value="buttons">
      <Flex flex direction="column" gap>
        <Flex flex direction="column" padding>
          {Object.keys(buttons).map((key) => (
            <Flex key={key} gap={8} align="end">
              <Flex flex direction="column">
                <Text size="sm">label</Text>
                <TextInput
                  value={buttons[key].label}
                  onChange={(value) => {
                    setButtons((prevState) =>
                      produce(prevState, (draft) => {
                        draft[key].label = value
                      }),
                    )
                  }}
                />
              </Flex>

              <Flex flex direction="column">
                <Text size="sm">variant</Text>
                <Select
                  value={buttons[key].variant}
                  onChange={(value) => {
                    setButtons((prevState) =>
                      produce(prevState, (draft) => {
                        draft[key].variant = value
                      }),
                    )
                  }}
                  options={variants}
                />
              </Flex>

              <Flex flex direction="column">
                <Text size="sm">route</Text>
                <TextInput
                  value={buttons[key].route}
                  onChange={(value) => {
                    setButtons((prevState) =>
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
                  setButtons((prevState) =>
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
                setButtons((prevState) => ({
                  ...prevState,
                  [uuid()]: {
                    label: '',
                    variant: null,
                    route: '',
                  },
                }))
              }
            >
              + button
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
