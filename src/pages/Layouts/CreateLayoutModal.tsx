import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import * as yup from 'yup'

import { Button } from '@siakit/button'
import { Footer } from '@siakit/footer'
import {
  Form,
  FormHandles,
  getValidationErrors,
  TextInput,
} from '@siakit/form-unform'
import { Flex } from '@siakit/layout'
import { Modal, ModalContent } from '@siakit/modal'
import { useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'

type CreateLayoutModalProps = {
  open: boolean
  onOpenChange: (value: boolean) => void
}

const createLayoutFormSchema = yup.object({
  label: yup.string().required(),
})

type HandleSubmitData = {
  label: string
}

export function CreateLayoutModal({
  open,
  onOpenChange,
}: CreateLayoutModalProps) {
  const navigate = useNavigate()

  const formRef = useRef<FormHandles>(null)

  const queryClient = useQueryClient()

  async function handleSubmit({ label }: HandleSubmitData): Promise<void> {
    try {
      formRef.current?.setErrors({})

      await createLayoutFormSchema.validate(
        { label },
        {
          abortEarly: false,
        },
      )

      const response = await api.post('/layouts', {
        label,
      })

      navigate(`/layouts/${response.data.id}`)

      queryClient.setQueryData(['layouts'], (prevState: any) => [
        ...prevState,
        response.data,
      ])

      onOpenChange(false)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors)
      }
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent title="Create layout" size="sm">
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Flex padding>
            <TextInput name="label" label="Label" placeholder="Label" />
          </Flex>
          <Footer>
            <Button type="submit">create</Button>
          </Footer>
        </Form>
      </ModalContent>
    </Modal>
  )
}
