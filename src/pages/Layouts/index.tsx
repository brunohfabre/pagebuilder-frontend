import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@siakit/button'
import { useDialog } from '@siakit/dialog'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { useLoading } from '@siakit/loading'
import { Spinner } from '@siakit/spinner'
import { Table } from '@siakit/table'
import { Text } from '@siakit/text'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { CreateLayoutModal } from './CreateLayoutModal'

type LayoutType = {
  id: string
  label: string
  renderer: string
}

export function Layouts() {
  const [createModalVisible, setCreateModalVisible] = useState(false)

  const navigate = useNavigate()

  const { setLoading } = useLoading()
  const { addDialog } = useDialog()

  const queryClient = useQueryClient()

  const { data, isLoading, isFetching } = useQuery(['layouts'], async () => {
    const response = await api.get<LayoutType[]>('/layouts')

    return response.data
  })

  console.log(data)

  async function handleDelete(id: string) {
    try {
      setLoading(true)

      await api.delete(`/layouts/${id}`)

      queryClient.setQueryData(['layouts'], (prevState: any) =>
        prevState.filter((item: LayoutType) => item.id !== id),
      )
    } finally {
      setLoading(false)
    }
  }

  if (!data && isLoading) {
    return (
      <Flex flex justify="center" align="center">
        <Spinner />
      </Flex>
    )
  }

  return (
    <>
      <CreateLayoutModal
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
      />

      <Flex flex padding direction="column" gap>
        <Flex justify="between" align="center">
          <Flex gap align="center">
            <Heading size="sm" weight="medium">
              Layouts
            </Heading>

            {isFetching && <Spinner />}
          </Flex>

          <Button type="button" onClick={() => setCreateModalVisible(true)}>
            new layout
          </Button>
        </Flex>

        {!data?.length && (
          <Flex flex justify="center" align="center" direction="column" gap>
            <Text>no layouts</Text>
            <Button type="button" onClick={() => setCreateModalVisible(true)}>
              new layout
            </Button>
          </Flex>
        )}

        {!!data?.length && (
          <Table
            headers={[
              {
                label: 'label',
                dataIndex: 'label',
              },
            ]}
            data={data}
            actions={[
              {
                label: 'edit',
                onClick: (item: any) => navigate(`/layouts/${item.id}`),
              },
              {
                label: 'delete',
                onClick: (item: any) =>
                  addDialog({
                    type: 'danger',
                    title: 'delete layout',
                    description:
                      'are you sure you really want to delete this layout?',
                    actionText: 'yes, delete',
                    onAction: () => handleDelete(item.id),
                  }),
                type: 'danger',
              },
            ]}
          />
        )}
      </Flex>
    </>
  )
}
