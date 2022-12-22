import { useNavigate, useParams } from 'react-router-dom'

import { CaretLeft } from 'phosphor-react'

import { Heading } from '@siakit/heading'
import { IconButton } from '@siakit/icon-button'
import { Flex } from '@siakit/layout'
import { Spinner } from '@siakit/spinner'
import { Tabs, TabsList, TabsItem } from '@siakit/tabs'
import { Text } from '@siakit/text'
import { useQuery } from '@tanstack/react-query'

import { api } from '../../../lib/api'
import { DetailsTab } from './DetailsTab'
import { LayoutTab } from './LayoutTab'

export type NodeType = {
  id: string
  type: string
  attributes: { [key: string]: string | number | boolean }
  text?: string
  children?: string[]
  parentId?: string
}

export type RendererType = {
  id: string
  default: string
  items: { [key: string]: NodeType }
}

export type LayoutType = {
  id: string
  label: string
  renderer: RendererType
}

export function Layout() {
  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()

  const {
    data: layout,
    isLoading,
    isFetching,
  } = useQuery(
    ['layouts', id],
    async () => {
      const response = await api.get<LayoutType>(`/layouts/${id}`)

      return response.data
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  if (!layout && isLoading) {
    return (
      <Flex flex justify="center" align="center">
        <Text>Loading...</Text>
      </Flex>
    )
  }

  return (
    <Flex flex direction="column" overflow>
      <Flex align="center" justify="between" padding>
        <Flex align="center" gap>
          <IconButton
            type="button"
            variant="ghost"
            colorScheme="gray"
            onClick={() => navigate(-1)}
          >
            <CaretLeft weight="bold" />
          </IconButton>
          <Heading size="sm" weight="medium">
            {layout?.label}
          </Heading>
          {isFetching && <Spinner />}
        </Flex>
      </Flex>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsItem value="details">details</TabsItem>
          <TabsItem value="layout">layout</TabsItem>
        </TabsList>

        <DetailsTab layout={layout!} />
        <LayoutTab layout={layout!} />
      </Tabs>
    </Flex>
  )
}
