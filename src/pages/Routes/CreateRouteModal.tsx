import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import * as yup from 'yup'

import { Button } from '@siakit/button'
import { Footer } from '@siakit/footer'
import {
  Form,
  FormHandles,
  getValidationErrors,
  Select,
  TextInput,
} from '@siakit/form-unform'
import { Flex } from '@siakit/layout'
import { useLoading } from '@siakit/loading'
import { Modal, ModalContent } from '@siakit/modal'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { RouteType } from './Route'

type CreateRouteModalProps = {
  open: boolean
  onOpenChange: (value: boolean) => void
}

const createRouteFormSchema = yup.object({
  label: yup.string().required(),
  route: yup.string().required(),
  layoutId: yup.string().required(),
  rendererId: yup.string().nullable(),
})

type HandleSubmitData = {
  label: string
  route: string
  layoutId: string
  rendererId: string
}

type LayoutType = {
  id: string
  label: string
}

export function CreateRouteModal({
  open,
  onOpenChange,
}: CreateRouteModalProps) {
  const navigate = useNavigate()

  const formRef = useRef<FormHandles>(null)

  const { setLoading } = useLoading()

  const queryClient = useQueryClient()

  const { data: layouts, isLoading: isLayoutsLoading } = useQuery(
    ['layouts'],
    async () => {
      const response = await api.get<LayoutType[]>('/layouts')

      return response.data.map((layout) => ({
        value: layout.id,
        label: layout.label,
      }))
    },
  )

  const { data: routes, isLoading: isRoutesLoading } = useQuery(
    [
      'routes',
      {
        dropdown: true,
      },
    ],
    async () => {
      const response = await api.get<RouteType[]>('/routes')

      return response.data
        .filter((route) => !!route.renderer?.id)
        .map((route) => ({
          value: route.renderer.id,
          label: `${route.label} - ${route.route}`,
        }))
    },
  )

  async function handleSubmit(data: HandleSubmitData): Promise<void> {
    try {
      formRef.current?.setErrors({})

      await createRouteFormSchema.validate(data, {
        abortEarly: false,
      })

      setLoading(true)

      const { label, route, layoutId, rendererId } = data

      const response = await api.post('/routes', {
        label,
        route,
        layoutId,
        rendererId,
      })

      navigate(`/routes/${response.data.id}`)

      queryClient.invalidateQueries(['routes'])

      onOpenChange(false)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent title="Create route" size="sm">
        {(!layouts && isLayoutsLoading) || (!routes && isRoutesLoading) ? (
          <Flex padding={64}>is loading</Flex>
        ) : (
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={{ type: 'route' }}
          >
            <Flex padding direction="column" gap={8}>
              <Select
                name="layoutId"
                label="layout"
                placeholder="layout"
                options={layouts ?? []}
              />

              <TextInput name="label" label="Label" placeholder="Label" />

              <TextInput name="route" label="Route" placeholder="Route" />

              <Select
                name="rendererId"
                label="route"
                placeholder="route"
                options={routes ?? []}
              />
            </Flex>
            <Footer>
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                colorScheme="gray"
                variant="ghost"
              >
                cancel
              </Button>
              <Button type="submit">create</Button>
            </Footer>
          </Form>
        )}
      </ModalContent>
    </Modal>
  )
}
