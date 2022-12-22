import { useRef } from 'react'

import { X } from 'phosphor-react'

import { Button } from '@siakit/button'
import { Card } from '@siakit/card'
import { Footer } from '@siakit/footer'
import {
  Form,
  Scope,
  Select,
  Switch,
  TextAreaInput,
  TextInput,
} from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { IconButton } from '@siakit/icon-button'
import { Flex } from '@siakit/layout'

import { NodeType } from '../../pages/Routes/Route'
import { useAttributesDrawerStore } from './stores/attributesDrawerStore'

type AttributesDrawerProps = {
  onUpdate: (node: NodeType) => void
}

export function AttributesDrawer({ onUpdate }: AttributesDrawerProps) {
  const formRef = useRef(null)

  const { changeVisibility, node } = useAttributesDrawerStore((state) => ({
    changeVisibility: state.changeVisibility,
    node: state.node,
  }))

  async function handleSubmit(data: any) {
    onUpdate({
      ...node,
      attributes: {
        ...node.attributes,
        ...data,
      },
    })
  }

  return (
    <Card width={320} direction="column" overflow>
      <Flex padding="8px 8px 8px 16px" justify="between" align="center">
        <Heading size="xs" weight="medium">
          Attributes
        </Heading>

        <IconButton
          type="button"
          variant="ghost"
          colorScheme="gray"
          onClick={() => changeVisibility(null)}
        >
          <X />
        </IconButton>
      </Flex>

      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        initialData={node.attributes}
        flex
        css={{ overflow: 'auto' }}
      >
        <Flex flex padding direction="column" overflow>
          {node.type === 'flex' && (
            <>
              <TextInput name="flex" label="flex" placeholder="flex" />

              <Select
                name="direction"
                label="direction"
                placeholder="direction"
                options={[
                  { value: 'row', label: 'row' },
                  { value: 'column', label: 'column' },
                ]}
              />

              <TextInput name="padding" label="padding" placeholder="padding" />

              <TextInput name="gap" label="gap" placeholder="gap" />

              <Select
                name="align"
                label="align"
                placeholder="align"
                options={[
                  { value: 'start', label: 'start' },
                  { value: 'center', label: 'center' },
                  { value: 'end', label: 'end' },
                ]}
              />
              <Select
                name="justify"
                label="justify"
                placeholder="justify"
                options={[
                  { value: 'start', label: 'start' },
                  { value: 'center', label: 'center' },
                  { value: 'end', label: 'end' },
                  { value: 'between', label: 'between' },
                ]}
              />

              <TextInput name="width" label="width" placeholder="width" />
              <TextInput
                name="minWidth"
                label="minWidth"
                placeholder="minWidth"
              />
              <TextInput
                name="maxWidth"
                label="maxWidth"
                placeholder="maxWidth"
              />

              <TextInput name="height" label="height" placeholder="height" />
              <TextInput
                name="minHeight"
                label="minHeight"
                placeholder="minHeight"
              />
              <TextInput
                name="maxHeight"
                label="maxHeight"
                placeholder="maxHeight"
              />
            </>
          )}

          {node.type === 'text' && (
            <TextAreaInput name="text" label="text" placeholder="text" />
          )}

          {node.type === 'heading' && (
            <TextInput name="text" label="text" placeholder="text" />
          )}

          {node.type === 'button' && (
            <>
              <TextInput name="label" label="label" placeholder="label" />

              <Select
                name="type"
                label="type"
                placeholder="type"
                options={[
                  { value: 'button', label: 'button' },
                  { value: 'submit', label: 'submit' },
                ]}
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

          {node.type === 'form' && (
            <>
              <Switch name="flex" label="Flex 1?" />

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

          {node.type === 'text-input' && (
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
        </Flex>

        <Footer>
          <Button type="submit">save</Button>
        </Footer>
      </Form>
    </Card>
  )
}
