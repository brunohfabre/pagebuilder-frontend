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
import { CreateRouteModal } from './CreateRouteModal'

type RouteType = {
  id: string
  label: string
  route: string
  layoutId: string
}

export function Routes() {
  const [createModalVisible, setCreateModalVisible] = useState(false)

  const { setLoading } = useLoading()
  const { addDialog } = useDialog()

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { data, isLoading, isFetching } = useQuery(['routes'], async () => {
    const response = await api.get<RouteType[]>('/routes')

    return response.data
  })

  async function handleDelete(id: string) {
    try {
      setLoading(true)

      await api.delete(`/routes/${id}`)

      queryClient.setQueryData(['routes'], (prevState: any) =>
        prevState.filter((item: RouteType) => item.id !== id),
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
      <CreateRouteModal
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
      />

      <Flex flex padding direction="column" gap>
        <Flex justify="between" align="center">
          <Flex gap align="center">
            <Heading size="sm" weight="medium">
              Routes
            </Heading>

            {isFetching && <Spinner />}
          </Flex>

          <Button type="button" onClick={() => setCreateModalVisible(true)}>
            New route
          </Button>
        </Flex>

        {!data?.length && (
          <Flex flex justify="center" align="center" direction="column" gap>
            <Text>no routes</Text>
            <Button type="button" onClick={() => setCreateModalVisible(true)}>
              new route
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
              {
                label: 'route',
                dataIndex: 'route',
              },
              {
                label: 'layout',
                dataIndex: 'layout.label',
              },
            ]}
            data={data}
            actions={[
              {
                label: 'edit',
                onClick: (item: any) => navigate(`/routes/${item.id}`),
              },
              {
                label: 'delete',
                onClick: (item: any) =>
                  addDialog({
                    type: 'danger',
                    title: 'delete route',
                    description:
                      'are you sure you really want to delete this route?',
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
