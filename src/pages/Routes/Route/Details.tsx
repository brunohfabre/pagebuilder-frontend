import { useRef } from 'react'

import * as yup from 'yup'

import { Button } from '@siakit/button'
import { Card } from '@siakit/card'
import { Footer } from '@siakit/footer'
import {
  Form,
  FormHandles,
  getValidationErrors,
  TextInput,
} from '@siakit/form-unform'
import { Flex } from '@siakit/layout'
import { useLoading } from '@siakit/loading'
import { TabsContent } from '@siakit/tabs'
import { useQueryClient } from '@tanstack/react-query'

import { RouteType } from '.'
import { api } from '../../../lib/api'

const routeDetailsFormSchema = yup.object({
  label: yup.string().required(),
  route: yup.string().required(),
  loadDataRoute: yup.string(),
})

type RouteDetailsFormInputs = {
  label: string
  route: string
  loadDataRoute: string
}

type DetailsProps = {
  route: RouteType
}

export function Details({ route }: DetailsProps) {
  const formRef = useRef<FormHandles>(null)

  const { setLoading } = useLoading()

  const queryClient = useQueryClient()

  async function handleSubmit(data: RouteDetailsFormInputs) {
    try {
      formRef.current?.setErrors({})

      await routeDetailsFormSchema.validate(data, {
        abortEarly: false,
      })

      setLoading(true)

      await api.put(`/routes/${route.id}`, data)

      queryClient.setQueryData(['routes', route.id], (prevState: any) => ({
        ...prevState,
        ...data,
      }))
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <TabsContent value="details">
      <Flex direction="column" margin="0 auto">
        <Card margin direction="column">
          <Form ref={formRef} onSubmit={handleSubmit} initialData={route}>
            <Flex direction="column" gap={8} padding width={640}>
              <TextInput name="label" label="label" placeholder="label" />
              <TextInput name="route" label="route" placeholder="route" />
            </Flex>

            <Footer>
              <Button type="submit">save</Button>
            </Footer>
          </Form>
        </Card>
      </Flex>
    </TabsContent>
  )
}
