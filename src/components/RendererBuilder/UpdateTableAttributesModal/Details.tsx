import { useRef } from 'react'

import * as yup from 'yup'

import { Button } from '@siakit/button'
import { Footer } from '@siakit/footer'
import {
  Form,
  FormHandles,
  getValidationErrors,
  Switch,
  TextInput,
} from '@siakit/form-unform'
import { Flex } from '@siakit/layout'
import { TabsContent } from '@siakit/tabs'
import { Text } from '@siakit/text'

import { NodeType } from '../../../pages/Routes/Route'
import { useUpdateTableStore } from '../stores/updateTableStore'

const tableDetailsFormSchema = yup.object({
  route: yup.string().required(),
})

type TableDetailsFormInputs = {
  route: string
}

type DetailsProps = {
  onUpdate: (node: NodeType) => void
  node: NodeType
}

export function Details({ onUpdate, node }: DetailsProps) {
  const formRef = useRef<FormHandles>(null)

  const changeVisibility = useUpdateTableStore(
    (state) => state.changeVisibility,
  )

  async function handleSubmit(data: TableDetailsFormInputs) {
    try {
      formRef.current?.setErrors({})

      await tableDetailsFormSchema.validate(data, {
        abortEarly: false,
      })

      console.log(node)

      const newNode = {
        ...node,
        attributes: {
          ...node.attributes,
          ...data,
        },
      }

      onUpdate(newNode)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err))
      }
    }
  }

  async function handleCopyReferenceId() {
    await navigator.clipboard.writeText(node.id)
  }

  return (
    <TabsContent value="details">
      <Flex flex direction="column">
        <Flex padding align="center" gap>
          <Text lowContrast>{node?.id}</Text>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopyReferenceId}
          >
            copy reference id
          </Button>
        </Flex>

        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          flex
          initialData={node?.attributes}
        >
          <Flex flex direction="column" gap>
            <Flex direction="column" gap={8} padding>
              <TextInput name="route" label="route" placeholder="route" />
              <Switch name="search" label="Search" />
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
              <Button type="submit">save</Button>
            </Footer>
          </Flex>
        </Form>
      </Flex>
    </TabsContent>
  )
}
