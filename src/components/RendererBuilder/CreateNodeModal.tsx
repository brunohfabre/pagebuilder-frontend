import { useRef, useState } from 'react'

import { v4 as uuid } from 'uuid'
import * as yup from 'yup'

import { Button } from '@siakit/button'
import { Footer } from '@siakit/footer'
import {
  Form,
  FormHandles,
  getValidationErrors,
  Select,
  TextAreaInput,
  TextInput,
  Scope,
  Switch,
} from '@siakit/form-unform'
import { Flex } from '@siakit/layout'
import { Modal, ModalContent } from '@siakit/modal'

import { NodeType } from '../../pages/Routes/Route'
import { useCreateNodeStore } from './stores/createNodeStore'

const createNodeFormSchema = yup.object({
  type: yup.string().required(),
})

type CreateNodeFormInputs = {
  type: string
}

type CreateNodeModalProps = {
  onCreate: (node: NodeType, after: string) => void
}

export function CreateNodeModal({ onCreate }: CreateNodeModalProps) {
  const { visible, changeVisibility, parentId, after } = useCreateNodeStore(
    (state) => ({
      visible: state.visible,
      changeVisibility: state.changeVisibility,
      parentId: state.parentId,
      after: state.after,
    }),
  )

  const formRef = useRef<FormHandles>(null)

  const [typeSelected, setTypeSelected] = useState('')

  async function handleSubmit(data: CreateNodeFormInputs) {
    try {
      formRef.current?.setErrors({})

      await createNodeFormSchema.validate(data, {
        abortEarly: false,
      })

      const node = {
        ...data,
        id: uuid(),
        parentId,
      } as any

      if (data.type === 'flex' || data.type === 'form') {
        node.children = []
      }

      onCreate(node, after)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err))
      }
    }
  }

  function handleClose() {
    changeVisibility(null)
    setTypeSelected('')
  }

  return (
    <Modal open={visible} onOpenChange={handleClose}>
      <ModalContent title="create node">
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Flex padding gap={8} direction="column">
            <Select
              name="type"
              label="type"
              placeholder="type"
              options={[
                {
                  value: 'flex',
                  label: 'flex',
                },
                {
                  value: 'text',
                  label: 'text',
                },
                {
                  value: 'heading',
                  label: 'heading',
                },
                {
                  value: 'button',
                  label: 'button',
                },
                {
                  value: 'table',
                  label: 'table',
                },
                {
                  value: 'outlet',
                  label: 'outlet',
                },
                {
                  value: 'form',
                  label: 'form',
                },
                {
                  value: 'text-input',
                  label: 'text-input',
                },
              ]}
              onChange={(option) => setTypeSelected(option?.value as string)}
            />

            <Scope path="attributes">
              {typeSelected === 'text' && (
                <TextAreaInput name="text" label="text" placeholder="text" />
              )}

              {typeSelected === 'heading' && (
                <TextInput name="text" label="text" placeholder="text" />
              )}

              {typeSelected === 'table' && (
                <TextInput name="route" label="route" placeholder="route" />
              )}

              {typeSelected === 'form' && (
                <>
                  <TextInput
                    name="referenceId"
                    label="reference id"
                    placeholder="reference id"
                  />

                  <TextInput
                    name="createRoute"
                    label="create route"
                    placeholder="create route"
                  />
                  <TextInput
                    name="updateRoute"
                    label="update route"
                    placeholder="update route"
                  />
                  <TextInput
                    name="getRoute"
                    label="get route"
                    placeholder="get route"
                  />
                </>
              )}

              {typeSelected === 'button' && (
                <>
                  <Select
                    name="type"
                    label="type"
                    placeholder="type"
                    options={[
                      { value: 'button', label: 'button' },
                      { value: 'submit', label: 'submit' },
                    ]}
                  />

                  <TextInput name="label" label="label" placeholder="label" />
                  <TextInput
                    name="alternativeLabel"
                    label="alternative label"
                    placeholder="alternative label"
                  />

                  <Select
                    name="action"
                    label="action"
                    placeholder="action"
                    options={[{ value: 'navigate', label: 'navigate' }]}
                  />

                  <Scope path="to">
                    <TextInput name="route" label="route" placeholder="route" />
                    <Switch name="external" label="external route?" />
                  </Scope>
                </>
              )}

              {typeSelected === 'text-input' && (
                <>
                  <TextInput name="name" label="name" placeholder="name" />
                  <TextInput name="label" label="label" placeholder="label" />
                  <TextInput
                    name="placeholder"
                    label="placeholder"
                    placeholder="placeholder"
                  />
                </>
              )}
            </Scope>
          </Flex>

          <Footer>
            <Button
              type="button"
              variant="ghost"
              colorScheme="gray"
              onClick={handleClose}
            >
              cancel
            </Button>
            <Button>create</Button>
          </Footer>
        </Form>
      </ModalContent>
    </Modal>
  )
}
